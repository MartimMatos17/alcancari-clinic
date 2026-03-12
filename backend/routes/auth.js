const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email e palavra-passe obrigatórios' })

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]
    if (!user)
      return res.status(401).json({ error: 'Credenciais inválidas' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid)
      return res.status(401).json({ error: 'Credenciais inválidas' })

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id])

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Sessão terminada' })
})

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, created_at, last_login FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
