const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, unit, preferred_date, preferred_time, age, notes } = req.body
    if (!name || !email || !phone || !service)
      return res.status(400).json({ error: 'Campos obrigatórios em falta' })
    const result = await db.query(`
      INSERT INTO appointment_requests (name, email, phone, service, unit, preferred_date, preferred_time, age, notes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending') RETURNING *
    `, [name, email, phone, service, unit, preferred_date, preferred_time, age, notes])
    res.status(201).json({ success: true, id: result.rows[0].id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Sem permissão' })
    const result = await db.query('SELECT * FROM appointment_requests ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Sem permissão' })
    const { status } = req.body
    const result = await db.query('UPDATE appointment_requests SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id])
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
