const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/session-notes
router.get('/', auth, async (req, res) => {
  try {
    const { patient_id, therapist_id, appointment_id } = req.query
    let query = `
      SELECT 
        sn.*,
        p.full_name as patient_name, p.date_of_birth,
        u.full_name as therapist_name,
        a.start_time as appointment_time, a.unit
      FROM session_notes sn
      LEFT JOIN patients p ON sn.patient_id = p.id
      LEFT JOIN users u ON sn.therapist_id = u.id
      LEFT JOIN appointments a ON sn.appointment_id = a.id
      WHERE 1=1
    `
    const params = []
    if (patient_id) { params.push(patient_id); query += ` AND sn.patient_id = $${params.length}` }
    if (therapist_id) { params.push(therapist_id); query += ` AND sn.therapist_id = $${params.length}` }
    if (appointment_id) { params.push(appointment_id); query += ` AND sn.appointment_id = $${params.length}` }
    query += ' ORDER BY sn.created_at DESC'
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
      SELECT sn.*, p.full_name as patient_name, u.full_name as therapist_name, a.start_time, a.unit
      FROM session_notes sn
      LEFT JOIN patients p ON sn.patient_id = p.id
      LEFT JOIN users u ON sn.therapist_id = u.id
      LEFT JOIN appointments a ON sn.appointment_id = a.id
      WHERE sn.id = $1
    `, [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Sumario nao encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// POST /api/session-notes
router.post('/', auth, async (req, res) => {
  try {
    const { appointment_id, patient_id, content, objectives, evolution, next_steps } = req.body
    if (!content) return res.status(400).json({ error: 'Conteudo obrigatorio' })
    const result = await db.query(`
      INSERT INTO session_notes (appointment_id, patient_id, therapist_id, content, objectives, evolution, next_steps)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
    `, [appointment_id, patient_id, req.user.id, content, objectives, evolution, next_steps])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// PUT /api/session-notes/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { content, objectives, evolution, next_steps } = req.body
    const result = await db.query(`
      UPDATE session_notes 
      SET content=$1, objectives=$2, evolution=$3, next_steps=$4, updated_at=NOW()
      WHERE id=$5 AND therapist_id=$6 RETURNING *
    `, [content, objectives, evolution, next_steps, req.params.id, req.user.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Sumario nao encontrado ou sem permissao' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// DELETE /api/session-notes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM session_notes WHERE id=$1 AND therapist_id=$2', [req.params.id, req.user.id])
    res.json({ message: 'Sumario eliminado' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
