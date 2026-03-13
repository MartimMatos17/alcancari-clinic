const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, full_name, email, role FROM users WHERE is_active = true ORDER BY full_name ASC`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
