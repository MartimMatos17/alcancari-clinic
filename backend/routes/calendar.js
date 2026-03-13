const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/calendar?month=2026-03&therapist_id=1&unit=leca
router.get('/', auth, async (req, res) => {
  try {
    const { month, therapist_id, unit } = req.query
    let query = `
      SELECT 
        a.id, a.scheduled_at, a.service, a.unit, a.status, a.duration_minutes,
        p.name as patient_name, p.date_of_birth,
        u.name as therapist_name,
        sn.id as note_id, sn.status as note_status
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.therapist_id = u.id
      LEFT JOIN session_notes sn ON sn.appointment_id = a.id
      WHERE a.status != 'cancelled'
    `
    const params = []
    if (month) {
      params.push(month + '-01')
      params.push(month + '-31')
      query += ` AND a.scheduled_at BETWEEN $${params.length - 1} AND $${params.length}`
    }
    if (therapist_id) {
      params.push(therapist_id)
      query += ` AND a.therapist_id = $${params.length}`
    }
    if (unit) {
      params.push(unit)
      query += ` AND a.unit = $${params.length}`
    }
    query += ' ORDER BY a.scheduled_at ASC'
    const result = await db.query(query, params)
    res.json(result.rows)
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
        a.id, a.scheduled_at, a.service, a.unit, a.status, a.duration_minutes, a.notes,
        p.id as patient_id, p.name as patient_name, p.date_of_birth, p.phone,
        u.id as therapist_id, u.name as therapist_name,
        sn.id as note_id, sn.status as note_status, sn.evolution
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.therapist_id = u.id
      LEFT JOIN session_notes sn ON sn.appointment_id = a.id
      WHERE DATE(a.scheduled_at) = $1 AND a.status != 'cancelled'
    `
    const params = [date]
    if (therapist_id) { params.push(therapist_id); query += ` AND a.therapist_id = $${params.length}` }
    if (unit) { params.push(unit); query += ` AND a.unit = $${params.length}` }
    query += ' ORDER BY a.scheduled_at ASC'
    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/calendar/availability?date=2026-03-13&therapist_id=1
router.get('/availability', auth, async (req, res) => {
  try {
    const { date, therapist_id } = req.query
    const result = await db.query(`
      SELECT TO_CHAR(scheduled_at, 'HH24:MI') as time
      FROM appointments
      WHERE DATE(scheduled_at) = $1 AND therapist_id = $2 AND status != 'cancelled'
    `, [date, therapist_id])
    const occupied = result.rows.map(r => r.time)
    const allSlots = ['09:00','09:30','10:00','10:30','11:00','11:30',
                      '14:00','14:30','15:00','15:30','16:00','16:30',
                      '17:00','17:30','18:00','18:30','19:00','19:30']
    const available = allSlots.filter(s => !occupied.includes(s))
    res.json({ occupied, available })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
