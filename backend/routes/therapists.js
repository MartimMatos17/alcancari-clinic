const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/therapists — público
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        t.id, t.specialty, t.unit, t.color, t.bio,
        u.full_name, u.email, u.avatar_url
      FROM therapists t
      JOIN users u ON t.user_id = u.id
      WHERE u.is_active = true
      ORDER BY t.specialty, u.full_name
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/therapists/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        t.id, t.specialty, t.unit, t.color, t.bio,
        u.full_name, u.email, u.avatar_url
      FROM therapists t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
    `, [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Terapeuta não encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
