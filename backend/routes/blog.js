const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

// GET /api/blog (público)
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 10, offset = 0 } = req.query
    let query = `SELECT * FROM blog_posts WHERE published = true`
    const params = []
    if (category) { params.push(category); query += ` AND category = $${params.length}` }
    if (search) { params.push('%' + search + '%'); query += ` AND (title ILIKE $${params.length} OR content ILIKE $${params.length})` }
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)
    const result = await db.query(query, params)
    const count = await db.query('SELECT COUNT(*) FROM blog_posts WHERE published = true')
    res.json({ posts: result.rows, total: parseInt(count.rows[0].count) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// GET /api/blog/:id (público)
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM blog_posts WHERE id = $1 AND published = true', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Post não encontrado' })
    await db.query('UPDATE blog_posts SET views = views + 1 WHERE id = $1', [req.params.id])
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// POST /api/blog (privado)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, image_url, published } = req.body
    const result = await db.query(`
      INSERT INTO blog_posts (title, content, category, image_url, published, author_id)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `, [title, content, category, image_url, published || false, req.user.id])
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// PUT /api/blog/:id (privado)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, category, image_url, published } = req.body
    const result = await db.query(`
      UPDATE blog_posts SET title=$1, content=$2, category=$3, image_url=$4, published=$5, updated_at=NOW()
      WHERE id=$6 RETURNING *
    `, [title, content, category, image_url, published, req.params.id])
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

// DELETE /api/blog/:id (privado)
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM blog_posts WHERE id = $1', [req.params.id])
    res.json({ message: 'Post eliminado' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
