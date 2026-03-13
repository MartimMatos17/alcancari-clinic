const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const { search, gender } = req.query
    const isAdmin = req.user.role === 'admin'
    const params = []

    let baseQuery = `
      SELECT DISTINCT
        p.id, p.full_name, p.date_of_birth, p.gender, p.notes, p.created_at,
        u.full_name as parent_name, u.email as parent_email, u.phone as parent_phone,
        COUNT(DISTINCT a.id) as appointment_count,
        COUNT(DISTINCT sn.id) as note_count
      FROM patients p
      LEFT JOIN users u ON p.parent_user_id = u.id
      LEFT JOIN appointments a ON a.patient_id = p.id
      LEFT JOIN session_notes sn ON sn.patient_id = p.id
      WHERE 1=1
    `

    if (!isAdmin) {
      const tRes = await db.query('SELECT id FROM therapists WHERE user_id = $1', [req.user.id])
      if (tRes.rows[0]) {
        params.push(tRes.rows[0].id)
        baseQuery += ` AND a.therapist_id = $${params.length}`
      }
    }

    if (search) {
      params.push('%' + search + '%')
      baseQuery += ` AND (p.full_name ILIKE $${params.length} OR u.full_name ILIKE $${params.length})`
    }
    if (gender) {
      params.push(gender)
      baseQuery += ` AND p.gender = $${params.length}`
    }

    baseQuery += ' GROUP BY p.id, u.full_name, u.email, u.phone ORDER BY p.full_name ASC'
    const result = await db.query(baseQuery, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.full_name as parent_name, u.email as parent_email, u.phone as parent_phone
      FROM patients p
      LEFT JOIN users u ON p.parent_user_id = u.id
      WHERE p.id = $1
    `, [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Paciente não encontrado' })

    const appts = await db.query(`
      SELECT a.*, u.full_name as therapist_name, s.name as service_name
      FROM appointments a
      LEFT JOIN users u ON a.therapist_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.patient_id = $1
      ORDER BY a.start_time DESC LIMIT 10
    `, [req.params.id])

    const notes = await db.query(`
      SELECT sn.*, u.full_name as therapist_name
      FROM session_notes sn
      LEFT JOIN users u ON sn.therapist_id = u.id
      WHERE sn.patient_id = $1
      ORDER BY sn.created_at DESC LIMIT 10
    `, [req.params.id])

    res.json({ ...result.rows[0], appointments: appts.rows, session_notes: notes.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { full_name, date_of_birth, gender, notes, parent_user_id } = req.body
    if (!full_name) return res.status(400).json({ error: 'Nome obrigatório' })
    const result = await db.query(`
      INSERT INTO patients (full_name, date_of_birth, gender, notes, parent_user_id)
      VALUES ($1,$2,$3,$4,$5) RETURNING *
    `, [full_name, date_of_birth, gender, notes, parent_user_id])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { full_name, date_of_birth, gender, notes } = req.body
    const result = await db.query(`
      UPDATE patients SET full_name=$1, date_of_birth=$2, gender=$3, notes=$4, updated_at=NOW()
      WHERE id=$5 RETURNING *
    `, [full_name, date_of_birth, gender, notes, req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Paciente não encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Sem permissão' })
    await db.query('DELETE FROM patients WHERE id=$1', [req.params.id])
    res.json({ message: 'Paciente eliminado' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
