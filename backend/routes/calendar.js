// routes/calendar.js
const router = require('express').Router();
const { query } = require('../db');
const { auth } = require('../middleware/auth');

// GET /api/calendar?start=&end=&therapist_id=
router.get('/', auth, async (req, res) => {
  const { start, end, therapist_id } = req.query;
  try {
    const { rows } = await query(
      `SELECT ce.*, u.full_name as therapist_name, t.color
       FROM calendar_events ce
       JOIN therapists t ON ce.therapist_id = t.id
       JOIN users u ON t.user_id = u.id
       WHERE ($1::timestamp IS NULL OR ce.start_time >= $1)
         AND ($2::timestamp IS NULL OR ce.end_time <= $2)
         AND ($3::uuid IS NULL OR ce.therapist_id = $3)
       ORDER BY ce.start_time`,
      [start || null, end || null, therapist_id || null]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { therapist_id, title, description, start_time, end_time, event_type, color } = req.body;
  try {
    const { rows } = await query(
      `INSERT INTO calendar_events (therapist_id,title,description,start_time,end_time,event_type,color)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [therapist_id, title, description, start_time, end_time, event_type || 'appointment', color]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  await query('DELETE FROM calendar_events WHERE id=$1', [req.params.id]);
  res.status(204).send();
});

module.exports = router;
