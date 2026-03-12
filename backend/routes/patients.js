const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/patients
router.get('/', auth, async (req, res) => {
  try {
    const { search, status, unit } = req.query
    let query = `
      SELECT p.*, 
        u.name as therapist_name,
        COUNT(DISTINCT s.id) as session_count
      FROM patients p
      LEFT JOIN users u ON p.therapist_id = u.id
      LEFT JOIN session_notes s ON s.patient_id = p.id
      WHERE 1=1
    `
    const params = []
    if (search) {
      params.push(`%${search}%`)
      query += ` AND (p.name ILIKE $${params.length} OR p.parent_name ILIKE $${params.length})`
    }
    if (status) {
      params.push(status)
      query += ` AND p.status = $${params.length}`
    }
    if (unit) {
      params.push(unit)
      query += ` AND p.unit = $${params.length}`
    }
    query += ' GROUP BY p.id, u.name ORDER BY p.name ASC'

    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/patients/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.name as therapist_name
      FROM patients p
      LEFT JOIN users u ON p.therapist_id = u.id
      WHERE p.id = $1
    `, [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Paciente não encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// POST /api/patients
router.post('/', auth, async (req, res) => {
  try {
    const { name, date_of_birth, parent_name, phone, email, services, therapist_id, unit, notes } = req.body
    const result = await db.query(`
      INSERT INTO patients (name, date_of_birth, parent_name, phone, email, services, therapist_id, unit, notes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active')
      RETURNING *
    `, [name, date_of_birth, parent_name, phone, email, services, therapist_id, unit, notes])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// PUT /api/patients/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, date_of_birth, parent_name, phone, email, services, therapist_id, unit, notes, status } = req.body
    const result = await db.query(`
      UPDATE patients SET
        name=$1, date_of_birth=$2, parent_name=$3, phone=$4, email=$5,
        services=$6, therapist_id=$7, unit=$8, notes=$9, status=$10,
        updated_at=NOW()
      WHERE id=$11 RETURNING *
    `, [name, date_of_birth, parent_name, phone, email, services, therapist_id, unit, notes, status, req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Paciente não encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// DELETE /api/patients/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('UPDATE patients SET status=$1 WHERE id=$2', ['inactive', req.params.id])
    res.json({ message: 'Paciente desativado' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
