const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/session-notes — todas as consultas passadas com sumário (ou sem)
router.get('/', auth, async (req, res) => {
  try {
    const { patient_id, therapist_id } = req.query
    let query = `
      SELECT
        a.id as appointment_id,
        a.start_time, a.end_time, a.unit, a.status,
        p.id as patient_id, p.full_name as patient_name, p.date_of_birth,
        u.id as therapist_id, u.full_name as therapist_name,
        sn.id, sn.content, sn.objectives, sn.evolution, sn.next_steps,
        sn.created_at, sn.updated_at
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON a.therapist_id = u.id
      LEFT JOIN session_notes sn ON sn.appointment_id = a.id
      WHERE a.start_time < NOW() AND a.status != 'cancelled'
    `
    const params = []
    if (patient_id) { params.push(patient_id); query += ` AND a.patient_id = $${params.length}` }
    if (therapist_id) { params.push(therapist_id); query += ` AND a.therapist_id = $${params.length}` }
    query += ' ORDER BY a.start_time DESC'
    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// POST /api/session-notes
router.post('/', auth, async (req, res) => {
  try {
    const { appointment_id, patient_id, content, objectives, evolution, next_steps } = req.body
    if (!content) return res.status(400).json({ error: 'Conteudo obrigatorio' })

    // Upsert — se já existir atualiza
    const existing = await db.query('SELECT id FROM session_notes WHERE appointment_id = $1', [appointment_id])
    let result
    if (existing.rows[0]) {
      result = await db.query(`
        UPDATE session_notes SET content=$1, objectives=$2, evolution=$3, next_steps=$4, updated_at=NOW()
        WHERE appointment_id=$5 RETURNING *
      `, [content, objectives, evolution, next_steps, appointment_id])
    } else {
      result = await db.query(`
        INSERT INTO session_notes (appointment_id, patient_id, therapist_id, content, objectives, evolution, next_steps)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
      `, [appointment_id, patient_id, req.user.id, content, objectives, evolution, next_steps])
    }
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
      UPDATE session_notes SET content=$1, objectives=$2, evolution=$3, next_steps=$4, updated_at=NOW()
      WHERE id=$5 RETURNING *
    `, [content, objectives, evolution, next_steps, req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Nao encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router

// DELETE /api/session-notes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM session_notes WHERE id = $1', [req.params.id])
    res.json({ message: 'Sumário eliminado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})
