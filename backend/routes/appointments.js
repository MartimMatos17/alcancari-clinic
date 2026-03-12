const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const { date, therapist_id, patient_id, unit } = req.query
    let query = `
      SELECT a.*, 
        p.name as patient_name, p.date_of_birth,
        u.name as therapist_name,
        sn.id as note_id, sn.status as note_status
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.therapist_id = u.id
      LEFT JOIN session_notes sn ON sn.appointment_id = a.id
      WHERE 1=1
    `
    const params = []
    if (date) { params.push(date); query += ` AND DATE(a.scheduled_at) = $${params.length}` }
    if (therapist_id) { params.push(therapist_id); query += ` AND a.therapist_id = $${params.length}` }
    if (patient_id) { params.push(patient_id); query += ` AND a.patient_id = $${params.length}` }
    if (unit) { params.push(unit); query += ` AND a.unit = $${params.length}` }
    query += ' ORDER BY a.scheduled_at ASC'
    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, p.name as patient_name, u.name as therapist_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.therapist_id = u.id
      WHERE a.id = $1
    `, [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Consulta não encontrada' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { patient_id, therapist_id, service, unit, scheduled_at, duration_minutes, notes } = req.body
    const result = await db.query(`
      INSERT INTO appointments (patient_id, therapist_id, service, unit, scheduled_at, duration_minutes, notes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'scheduled') RETURNING *
    `, [patient_id, therapist_id, service, unit, scheduled_at, duration_minutes || 50, notes])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { service, unit, scheduled_at, duration_minutes, notes, status } = req.body
    const result = await db.query(`
      UPDATE appointments SET service=$1, unit=$2, scheduled_at=$3, duration_minutes=$4, notes=$5, status=$6, updated_at=NOW()
      WHERE id=$7 RETURNING *
    `, [service, unit, scheduled_at, duration_minutes, notes, status, req.params.id])
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('UPDATE appointments SET status=$1 WHERE id=$2', ['cancelled', req.params.id])
    res.json({ message: 'Consulta cancelada' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
