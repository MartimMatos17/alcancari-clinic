const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/parents/me — dados do pai + filhos
router.get('/me', auth, async (req, res) => {
  try {
    if (req.user.role !== 'parent') return res.status(403).json({ error: 'Sem permissão' })

    const children = await db.query(`
      SELECT p.id, p.full_name, p.date_of_birth, p.gender, p.notes,
        COUNT(DISTINCT a.id) as appointment_count,
        COUNT(DISTINCT sn.id) as note_count
      FROM patients p
      LEFT JOIN appointments a ON a.patient_id = p.id
      LEFT JOIN session_notes sn ON sn.patient_id = p.id
      WHERE p.parent_user_id = $1
      GROUP BY p.id
    `, [req.user.id])

    res.json({ children: children.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/parents/children/:id/appointments
router.get('/children/:id/appointments', auth, async (req, res) => {
  try {
    if (req.user.role !== 'parent') return res.status(403).json({ error: 'Sem permissão' })

    // Verificar que o paciente pertence a este pai
    const check = await db.query('SELECT id FROM patients WHERE id=$1 AND parent_user_id=$2', [req.params.id, req.user.id])
    if (!check.rows[0]) return res.status(403).json({ error: 'Sem permissão' })

    const result = await db.query(`
      SELECT a.id, a.start_time, a.end_time, a.status, a.unit,
        u.full_name as therapist_name,
        s.name as service_name,
        sn.id as note_id
      FROM appointments a
      LEFT JOIN users u ON a.therapist_id = u.id
      LEFT JOIN therapists t ON t.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN session_notes sn ON sn.appointment_id = a.id
      WHERE a.patient_id = $1
      ORDER BY a.start_time DESC
      LIMIT 20
    `, [req.params.id])

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/parents/children/:id/notes
router.get('/children/:id/notes', auth, async (req, res) => {
  try {
    if (req.user.role !== 'parent') return res.status(403).json({ error: 'Sem permissão' })

    const check = await db.query('SELECT id FROM patients WHERE id=$1 AND parent_user_id=$2', [req.params.id, req.user.id])
    if (!check.rows[0]) return res.status(403).json({ error: 'Sem permissão' })

    const result = await db.query(`
      SELECT sn.id, sn.content, sn.objectives, sn.evolution, sn.next_steps, sn.created_at,
        u.full_name as therapist_name,
        a.start_time
      FROM session_notes sn
      LEFT JOIN users u ON sn.therapist_id = u.id
      LEFT JOIN appointments a ON sn.appointment_id = a.id
      WHERE sn.patient_id = $1 AND sn.content IS NOT NULL AND sn.content != ''
      ORDER BY sn.created_at DESC
    `, [req.params.id])

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
