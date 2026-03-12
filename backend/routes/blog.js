const router = require('express').Router();
const { query } = require('../db');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/blog (public)
router.get('/', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT bp.id, bp.title, bp.slug, bp.excerpt, bp.cover_image_url, bp.published_at, bp.tags, bp.views,
              u.full_name as author_name, u.avatar_url as author_avatar
       FROM blog_posts bp
       LEFT JOIN users u ON bp.author_id = u.id
       WHERE bp.published = true
       ORDER BY bp.published_at DESC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/blog/:slug (public)
router.get('/:slug', async (req, res) => {
  try {
    await query('UPDATE blog_posts SET views = views + 1 WHERE slug=$1', [req.params.slug]);
    const { rows } = await query(
      `SELECT bp.*, u.full_name as author_name, u.avatar_url as author_avatar
       FROM blog_posts bp LEFT JOIN users u ON bp.author_id = u.id
       WHERE bp.slug=$1 AND bp.published=true`,
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/blog (admin)
router.post('/', auth, requireRole('admin'), async (req, res) => {
  const { title, slug, excerpt, content, cover_image_url, tags, published } = req.body;
  try {
    const { rows } = await query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image_url, tags, published, author_id, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $7 ? NOW() : NULL) RETURNING *`,
      [title, slug, excerpt, content, cover_image_url, tags || [], published, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/blog/:id (admin)
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  const { title, slug, excerpt, content, cover_image_url, tags, published } = req.body;
  try {
    const { rows } = await query(
      `UPDATE blog_posts SET title=$1,slug=$2,excerpt=$3,content=$4,cover_image_url=$5,tags=$6,published=$7,
       published_at=CASE WHEN $7 AND published_at IS NULL THEN NOW() ELSE published_at END, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [title, slug, excerpt, content, cover_image_url, tags, published, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/blog/:id (admin)
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  await query('DELETE FROM blog_posts WHERE id=$1', [req.params.id]);
  res.status(204).send();
});

module.exports = router;
