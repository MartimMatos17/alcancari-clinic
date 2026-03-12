const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')
const bcrypt = require('bcrypt')

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, specialty, unit, created_at FROM users ORDER BY name ASC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.put('/me/password', auth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body
    const result = await db.query('SELECT * FROM users WHERE id=$1', [req.user.id])
    const user = result.rows[0]
    const valid = await bcrypt.compare(current_password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Palavra-passe atual incorreta' })
    const hash = await bcrypt.hash(new_password, 10)
    await db.query('UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2', [hash, req.user.id])
    res.json({ message: 'Palavra-passe atualizada' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
