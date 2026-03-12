const router = require('express').Router();
const { query } = require('../db');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/appointments - list (filtered by role)
router.get('/', auth, async (req, res) => {
  try {
    const { date, therapist_id, patient_id, status, unit } = req.query;
    let sql = `
      SELECT a.*, 
        p.full_name as patient_name, 
        u.full_name as therapist_name,
        s.name as service_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN therapists t ON a.therapist_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let i = 1;

    if (req.user.role === 'therapist') {
      sql += ` AND t.user_id = $${i++}`; params.push(req.user.id);
    }
    if (date) { sql += ` AND DATE(a.start_time) = $${i++}`; params.push(date); }
    if (therapist_id) { sql += ` AND a.therapist_id = $${i++}`; params.push(therapist_id); }
    if (patient_id) { sql += ` AND a.patient_id = $${i++}`; params.push(patient_id); }
    if (status) { sql += ` AND a.status = $${i++}`; params.push(status); }
    if (unit) { sql += ` AND a.unit = $${i++}`; params.push(unit); }

    sql += ' ORDER BY a.start_time ASC';
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/appointments
router.post('/', auth, async (req, res) => {
  const { patient_id, therapist_id, service_id, start_time, end_time, notes, unit } = req.body;
  try {
    const { rows } = await query(
      `INSERT INTO appointments (patient_id, therapist_id, service_id, start_time, end_time, notes, unit)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [patient_id, therapist_id, service_id, start_time, end_time, notes, unit]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/appointments/:id/status
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  try {
    const { rows } = await query(
      'UPDATE appointments SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/appointments/:id
router.delete('/:id', auth, requireRole('admin', 'receptionist'), async (req, res) => {
  await query('DELETE FROM appointments WHERE id=$1', [req.params.id]);
  res.status(204).send();
});

module.exports = router;
