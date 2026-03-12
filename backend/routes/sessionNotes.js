const router = require('express').Router();
const { query } = require('../db');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/session-notes?patient_id=
router.get('/', auth, async (req, res) => {
  const { patient_id } = req.query;
  try {
    const { rows } = await query(
      `SELECT sn.*, u.full_name as therapist_name, p.full_name as patient_name
       FROM session_notes sn
       LEFT JOIN therapists t ON sn.therapist_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN patients p ON sn.patient_id = p.id
       WHERE ($1::uuid IS NULL OR sn.patient_id = $1)
       ORDER BY sn.created_at DESC`,
      [patient_id || null]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/session-notes
router.post('/', auth, requireRole('therapist', 'admin'), async (req, res) => {
  const { appointment_id, patient_id, content, objectives, evolution, next_steps } = req.body;
  try {
    // Get therapist id from user
    const { rows: tRows } = await query('SELECT id FROM therapists WHERE user_id=$1', [req.user.id]);
    const therapist_id = tRows[0]?.id;

    const { rows } = await query(
      `INSERT INTO session_notes (appointment_id, therapist_id, patient_id, content, objectives, evolution, next_steps)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [appointment_id, therapist_id, patient_id, content, objectives, evolution, next_steps]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/session-notes/:id
router.put('/:id', auth, requireRole('therapist', 'admin'), async (req, res) => {
  const { content, objectives, evolution, next_steps } = req.body;
  try {
    const { rows } = await query(
      `UPDATE session_notes SET content=$1, objectives=$2, evolution=$3, next_steps=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [content, objectives, evolution, next_steps, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
