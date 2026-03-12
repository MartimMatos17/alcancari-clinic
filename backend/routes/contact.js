const router = require('express').Router();
const { query } = require('../db');

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });
  const { rows } = await query(
    'INSERT INTO contact_messages (name,email,phone,subject,message) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name, email, phone, subject, message]
  );
  res.status(201).json({ success: true, id: rows[0].id });
});

module.exports = router;
