// routes/users.js
const router = require('express').Router();
const { query } = require('../db');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', auth, requireRole('admin'), async (req, res) => {
  const { rows } = await query('SELECT id,email,full_name,role,phone,is_active,created_at FROM users ORDER BY full_name');
  res.json(rows);
});
router.patch('/:id', auth, requireRole('admin'), async (req, res) => {
  const { is_active } = req.body;
  const { rows } = await query('UPDATE users SET is_active=$1,updated_at=NOW() WHERE id=$2 RETURNING id,email,full_name,role,is_active', [is_active, req.params.id]);
  res.json(rows[0]);
});

module.exports = router;
