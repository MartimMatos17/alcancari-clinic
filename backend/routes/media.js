const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { auth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  const { rows } = await query(
    'INSERT INTO media (filename,original_name,url,mime_type,size_bytes,uploaded_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [req.file.filename, req.file.originalname, url, req.file.mimetype, req.file.size, req.user.id]
  );
  res.status(201).json(rows[0]);
});

router.get('/', auth, async (req, res) => {
  const { rows } = await query('SELECT * FROM media ORDER BY created_at DESC LIMIT 100');
  res.json(rows);
});

module.exports = router;
