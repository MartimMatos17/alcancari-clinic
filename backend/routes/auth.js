const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email e palavra-passe obrigatórios' })

    const result = await db.query(`
      SELECT u.*, t.id as therapist_id
      FROM users u
      LEFT JOIN therapists t ON t.user_id = u.id
      WHERE u.email = $1 AND u.is_active = true
    `, [email])

    const user = result.rows[0]
    if (!user)
      return res.status(401).json({ error: 'Credenciais inválidas' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid)
      return res.status(401).json({ error: 'Credenciais inválidas' })

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        therapist_id: user.therapist_id || null
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u.full_name, u.email, u.role, t.id as therapist_id
      FROM users u
      LEFT JOIN therapists t ON t.user_id = u.id
      WHERE u.id = $1
    `, [req.user.id])
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
