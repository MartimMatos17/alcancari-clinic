const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/calendar?year=2026&month=3
router.get('/', auth, async (req, res) => {
  try {
    const { year, month, therapist_id, unit } = req.query
    const start = `${year}-${String(month).padStart(2,'0')}-01`
    const end = new Date(year, month, 0).toISOString().split('T')[0]

    let query = `
      SELECT 
        a.id, a.start_time, a.end_time, a.status, a.unit,
        p.full_name as patient_name,
        u.full_name as therapist_name,
        t.color as therapist_color,
        s.name as service_name,
        sn.id as note_id
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.therapist_id = u.id
      LEFT JOIN therapists t ON t.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN session_notes sn ON sn.appointment_id = a.id
      WHERE a.start_time BETWEEN $1 AND $2 AND a.status != 'cancelled'
    `
    const params = [start + ' 00:00:00', end + ' 23:59:59']
    if (therapist_id) { params.push(therapist_id); query += ` AND a.therapist_id = $${params.length}` }
    if (unit) { params.push(unit); query += ` AND a.unit = $${params.length}` }
    query += ' ORDER BY a.start_time ASC'

    const appts = await db.query(query, params)

    // Agrupar por dia
    const grouped = {}
    appts.rows.forEach(a => {
      const day = a.start_time.toISOString().split('T')[0]
      if (!grouped[day]) grouped[day] = []
      grouped[day].push(a)
    })

    res.json({ appointments: appts.rows, grouped })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/calendar/day?date=2026-03-13
router.get('/day', auth, async (req, res) => {
  try {
    const { date, therapist_id, unit } = req.query
    let query = `
      SELECT 
        a.id, a.start_time, a.end_time, a.status, a.unit, a.notes,
        p.id as patient_id, p.full_name as patient_name, p.date_of_birth,
        u.id as therapist_id, u.full_name as therapist_name,
        t.color as therapist_color,
        s.name as service_name,
        sn.id as note_id, sn.content as note_content
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.therapist_id = u.id
      LEFT JOIN therapists t ON t.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN session_notes sn ON sn.appointment_id = a.id
      WHERE DATE(a.start_time) = $1 AND a.status != 'cancelled'
    `
    const params = [date]
    if (therapist_id) { params.push(therapist_id); query += ` AND a.therapist_id = $${params.length}` }
    if (unit) { params.push(unit); query += ` AND a.unit = $${params.length}` }
    query += ' ORDER BY a.start_time ASC'
    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/calendar/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const [todayCount, weekCount, pendingNotes, patientCount] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM appointments WHERE DATE(start_time) = $1 AND status != 'cancelled'`, [today]),
      db.query(`SELECT COUNT(*) FROM appointments WHERE start_time >= date_trunc('week', NOW()) AND start_time < date_trunc('week', NOW()) + interval '7 days' AND status != 'cancelled'`),
      db.query(`SELECT COUNT(*) FROM appointments a LEFT JOIN session_notes sn ON sn.appointment_id = a.id WHERE a.end_time < NOW() AND sn.id IS NULL AND a.status = 'confirmed'`),
      db.query(`SELECT COUNT(*) FROM patients`),
    ])
    res.json({
      today: parseInt(todayCount.rows[0].count),
      week: parseInt(weekCount.rows[0].count),
      pending_notes: parseInt(pendingNotes.rows[0].count),
      total_patients: parseInt(patientCount.rows[0].count),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
