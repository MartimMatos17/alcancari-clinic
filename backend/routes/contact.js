const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, unit } = req.body
    if (!name || !email || !message)
      return res.status(400).json({ error: 'Nome, email e mensagem obrigatórios' })
    await db.query(`
      INSERT INTO contact_messages (name, email, phone, subject, message, unit)
      VALUES ($1,$2,$3,$4,$5,$6)
    `, [name, email, phone, subject, message, unit])
    res.status(201).json({ message: 'Mensagem enviada com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.put('/:id/read', auth, async (req, res) => {
  try {
    await db.query('UPDATE contact_messages SET status=$1 WHERE id=$2', ['read', req.params.id])
    res.json({ message: 'Marcado como lido' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
