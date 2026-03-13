const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/appointments
router.get('/', auth, async (req, res) => {
  try {
    const { date, therapist_id, patient_id, unit, status } = req.query
    let query = `
      SELECT 
        a.*,
        p.full_name as patient_name, p.date_of_birth,
        u.full_name as therapist_name,
        s.name as service_name, s.color as service_color,
        sn.id as note_id
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.therapist_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN session_notes sn ON sn.appointment_id = a.id
      WHERE 1=1
    `
    const params = []
    if (date) { params.push(date); query += ` AND DATE(a.start_time) = $${params.length}` }
    if (therapist_id) { params.push(therapist_id); query += ` AND a.therapist_id = $${params.length}` }
    if (patient_id) { params.push(patient_id); query += ` AND a.patient_id = $${params.length}` }
    if (unit) { params.push(unit); query += ` AND a.unit = $${params.length}` }
    if (status) { params.push(status); query += ` AND a.status = $${params.length}` }
    query += ' ORDER BY a.start_time ASC'
    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/appointments/month?year=2026&month=3
router.get('/month', auth, async (req, res) => {
  try {
    const { year, month, therapist_id, unit } = req.query
    const start = `${year}-${String(month).padStart(2,'0')}-01`
    const end = new Date(year, month, 0).toISOString().split('T')[0]
    let query = `
      SELECT 
        a.id, a.start_time, a.end_time, a.status, a.unit,
        p.full_name as patient_name,
        u.full_name as therapist_name,
        s.name as service_name, s.color as service_color,
        sn.id as note_id
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.therapist_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN session_notes sn ON sn.appointment_id = a.id
      WHERE a.start_time BETWEEN $1 AND $2 AND a.status != 'cancelled'
    `
    const params = [start, end + ' 23:59:59']
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

// GET /api/appointments/availability?date=2026-03-13&therapist_id=xxx
router.get('/availability', auth, async (req, res) => {
  try {
    const { date, therapist_id } = req.query
    const result = await db.query(`
      SELECT 
        TO_CHAR(start_time, 'HH24:MI') as time,
        TO_CHAR(end_time, 'HH24:MI') as end_time
      FROM appointments
      WHERE DATE(start_time) = $1 AND therapist_id = $2 AND status != 'cancelled'
    `, [date, therapist_id])
    const occupied = result.rows.map(r => r.time)
    const allSlots = [
      '09:00','09:30','10:00','10:30','11:00','11:30',
      '14:00','14:30','15:00','15:30','16:00','16:30',
      '17:00','17:30','18:00','18:30','19:00','19:30'
    ]
    res.json({ occupied, available: allSlots.filter(s => !occupied.includes(s)) })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/appointments/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, p.full_name as patient_name, u.full_name as therapist_name, s.name as service_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.therapist_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.id = $1
    `, [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Consulta nao encontrada' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// POST /api/appointments
router.post('/', auth, async (req, res) => {
  try {
    const { patient_id, therapist_id, service_id, start_time, end_time, unit, notes } = req.body
    if (!patient_id || !start_time || !end_time)
      return res.status(400).json({ error: 'Campos obrigatorios em falta' })

    // Verificar conflito de horario
    const conflict = await db.query(`
      SELECT id FROM appointments
      WHERE therapist_id = $1 AND status != 'cancelled'
      AND (start_time, end_time) OVERLAPS ($2::timestamp, $3::timestamp)
    `, [therapist_id, start_time, end_time])
    if (conflict.rows.length > 0)
      return res.status(409).json({ error: 'Conflito de horario para este terapeuta' })

    const result = await db.query(`
      INSERT INTO appointments (patient_id, therapist_id, service_id, start_time, end_time, unit, notes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'pending') RETURNING *
    `, [patient_id, therapist_id, service_id, start_time, end_time, unit, notes])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// PUT /api/appointments/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { start_time, end_time, unit, notes, status } = req.body
    const result = await db.query(`
      UPDATE appointments SET start_time=$1, end_time=$2, unit=$3, notes=$4, status=$5, updated_at=NOW()
      WHERE id=$6 RETURNING *
    `, [start_time, end_time, unit, notes, status, req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Consulta nao encontrada' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// DELETE /api/appointments/:id (cancela)
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query(`UPDATE appointments SET status='cancelled', updated_at=NOW() WHERE id=$1`, [req.params.id])
    res.json({ message: 'Consulta cancelada' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
