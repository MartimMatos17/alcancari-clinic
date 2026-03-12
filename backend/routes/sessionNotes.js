const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/session-notes
router.get('/', auth, async (req, res) => {
  try {
    const { patient_id, therapist_id, status } = req.query
    let query = `
      SELECT s.*, 
        p.name as patient_name, p.date_of_birth,
        u.name as therapist_name,
        a.scheduled_at
      FROM session_notes s
      LEFT JOIN patients p ON s.patient_id = p.id
      LEFT JOIN users u ON s.therapist_id = u.id
      LEFT JOIN appointments a ON s.appointment_id = a.id
      WHERE 1=1
    `
    const params = []
    if (patient_id) { params.push(patient_id); query += ` AND s.patient_id = $${params.length}` }
    if (therapist_id) { params.push(therapist_id); query += ` AND s.therapist_id = $${params.length}` }
    if (status) { params.push(status); query += ` AND s.status = $${params.length}` }
    query += ' ORDER BY s.created_at DESC'

    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/session-notes/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.*, p.name as patient_name, u.name as therapist_name
      FROM session_notes s
      LEFT JOIN patients p ON s.patient_id = p.id
      LEFT JOIN users u ON s.therapist_id = u.id
      WHERE s.id = $1
    `, [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Sumário não encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// POST /api/session-notes
router.post('/', auth, async (req, res) => {
  try {
    const { patient_id, appointment_id, service, objectives, content, evolution, next_session, session_date, session_time } = req.body
    const result = await db.query(`
      INSERT INTO session_notes 
        (patient_id, therapist_id, appointment_id, service, objectives, content, evolution, next_session, session_date, session_time, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        CASE WHEN $6 IS NOT NULL AND $6 != '' THEN 'done' ELSE 'pending' END)
      RETURNING *
    `, [patient_id, req.user.id, appointment_id, service, objectives, content, evolution, next_session, session_date, session_time])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// PUT /api/session-notes/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { objectives, content, evolution, next_session } = req.body
    const result = await db.query(`
      UPDATE session_notes SET
        objectives=$1, content=$2, evolution=$3, next_session=$4,
        status=CASE WHEN $2 IS NOT NULL AND $2 != '' THEN 'done' ELSE 'pending' END,
        updated_at=NOW()
      WHERE id=$5 AND therapist_id=$6
      RETURNING *
    `, [objectives, content, evolution, next_session, req.params.id, req.user.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Sumário não encontrado ou sem permissão' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
