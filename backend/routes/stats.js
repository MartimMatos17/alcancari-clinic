const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin'
    let therapistFilter = ''
    let params = []

    if (!isAdmin) {
      const t = await db.query('SELECT id FROM therapists WHERE user_id=$1', [req.user.id])
      if (t.rows[0]) {
        therapistFilter = ' AND a.therapist_id = $1'
        params = [t.rows[0].id]
      }
    }

    // Consultas por mês (últimos 6 meses)
    const monthly = await db.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', start_time), 'Mon') as mes,
        DATE_TRUNC('month', start_time) as date,
        COUNT(*) as total
      FROM appointments a
      WHERE start_time > NOW() - interval '6 months'
      AND status != 'cancelled'
      ${therapistFilter}
      GROUP BY DATE_TRUNC('month', start_time)
      ORDER BY DATE_TRUNC('month', start_time)
    `, params)

    // Consultas por serviço
    const byService = await db.query(`
      SELECT s.name as service, COUNT(*) as total
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.status != 'cancelled'
      ${therapistFilter}
      GROUP BY s.name
      ORDER BY total DESC
      LIMIT 6
    `, params)

    // Consultas por unidade
    const byUnit = await db.query(`
      SELECT unit, COUNT(*) as total
      FROM appointments a
      WHERE status != 'cancelled'
      ${therapistFilter}
      GROUP BY unit
    `, params)

    // Totais gerais
    const totals = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE DATE(start_time) = CURRENT_DATE) as today,
        COUNT(*) FILTER (WHERE DATE_TRUNC('week', start_time) = DATE_TRUNC('week', NOW())) as this_week,
        COUNT(*) FILTER (WHERE DATE_TRUNC('month', start_time) = DATE_TRUNC('month', NOW())) as this_month,
        COUNT(*) FILTER (WHERE start_time > NOW() AND status = 'confirmed') as upcoming
      FROM appointments a
      WHERE status != 'cancelled'
      ${therapistFilter}
    `, params)

    // Total pacientes
    const patients = await db.query(`
      SELECT COUNT(DISTINCT patient_id) as total FROM appointments a
      WHERE 1=1 ${therapistFilter}
    `, params)

    // Sumários pendentes
    const pending = await db.query(`
      SELECT COUNT(*) as total FROM appointments a
      LEFT JOIN session_notes sn ON sn.appointment_id = a.id
      WHERE a.start_time < NOW() AND a.status = 'confirmed'
      AND (sn.id IS NULL OR sn.content IS NULL OR sn.content = '')
      ${therapistFilter}
    `, params)

    res.json({
      monthly: monthly.rows,
      byService: byService.rows,
      byUnit: byUnit.rows,
      totals: totals.rows[0],
      totalPatients: patients.rows[0].total,
      pendingNotes: pending.rows[0].total,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
