// routes/therapists.js
const router = require('express').Router();
const { query } = require('../db');

router.get('/', async (req, res) => {
  const { rows } = await query(
    `SELECT t.*, u.full_name, u.email, u.avatar_url FROM therapists t JOIN users u ON t.user_id=u.id ORDER BY u.full_name`
  );
  res.json(rows);
});

module.exports = router;
