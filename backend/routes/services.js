// routes/services.js
const router = require('express').Router();
const { query } = require('../db');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { rows } = await query('SELECT * FROM services WHERE is_active=true ORDER BY name');
  res.json(rows);
});

router.post('/', auth, requireRole('admin'), async (req, res) => {
  const { name, slug, description, duration_minutes, price, icon } = req.body;
  const { rows } = await query(
    'INSERT INTO services (name,slug,description,duration_minutes,price,icon) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [name, slug, description, duration_minutes, price, icon]
  );
  res.status(201).json(rows[0]);
});

module.exports = router;
