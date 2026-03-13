const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/therapists (público - para mostrar no site)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, name, specialty, unit, avatar_url
      FROM users WHERE role IN ('therapist', 'admin')
      ORDER BY specialty, name
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/therapists/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, name, email, specialty, unit, avatar_url, created_at
      FROM users WHERE id = $1
    `, [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Terapeuta não encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// PUT /api/therapists/:id (só admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, specialty, unit, avatar_url } = req.body
    const result = await db.query(`
      UPDATE users SET name=$1, specialty=$2, unit=$3, avatar_url=$4, updated_at=NOW()
      WHERE id=$5 RETURNING id, name, specialty, unit, avatar_url
    `, [name, specialty, unit, avatar_url, req.params.id])
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
