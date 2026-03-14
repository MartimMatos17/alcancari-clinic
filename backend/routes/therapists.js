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

// PUT /api/therapists/:id — atualizar
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Sem permissão' })
    const { full_name, email, specialty, unit, bio } = req.body
    await db.query(`UPDATE therapists SET specialty=$1, unit=$2, bio=$3 WHERE id=$4`, [specialty, unit, bio, req.params.id])
    if (full_name || email) {
      const t = await db.query('SELECT user_id FROM therapists WHERE id=$1', [req.params.id])
      if (t.rows[0]) {
        await db.query(`UPDATE users SET full_name=COALESCE($1,full_name), email=COALESCE($2,email) WHERE id=$3`,
          [full_name, email, t.rows[0].user_id])
      }
    }
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// DELETE /api/therapists/:id — remover
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Sem permissão' })
    const t = await db.query('SELECT user_id FROM therapists WHERE id=$1', [req.params.id])
    if (t.rows[0]) {
      await db.query('UPDATE users SET is_active=false WHERE id=$1', [t.rows[0].user_id])
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})
