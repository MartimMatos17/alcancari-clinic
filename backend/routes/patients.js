// routes/patients.js
const router = require('express').Router();
const { query } = require('../db');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { rows } = await query('SELECT * FROM patients ORDER BY full_name');
  res.json(rows);
});
router.get('/:id', auth, async (req, res) => {
  const { rows } = await query('SELECT * FROM patients WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});
router.post('/', auth, async (req, res) => {
  const { full_name, date_of_birth, gender, notes, parent_user_id } = req.body;
  const { rows } = await query(
    'INSERT INTO patients (full_name,date_of_birth,gender,notes,parent_user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [full_name, date_of_birth, gender, notes, parent_user_id]
  );
  res.status(201).json(rows[0]);
});
router.put('/:id', auth, async (req, res) => {
  const { full_name, date_of_birth, gender, notes } = req.body;
  const { rows } = await query(
    'UPDATE patients SET full_name=$1,date_of_birth=$2,gender=$3,notes=$4,updated_at=NOW() WHERE id=$5 RETURNING *',
    [full_name, date_of_birth, gender, notes, req.params.id]
  );
  res.json(rows[0]);
});

module.exports = router;
