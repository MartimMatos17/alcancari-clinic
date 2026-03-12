// ============================================================
// ALCANÇARI CLINIC - Backend API
// Node.js + Express + PostgreSQL
// ============================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/users',        require('./routes/users'));
app.use('/api/therapists',   require('./routes/therapists'));
app.use('/api/patients',     require('./routes/patients'));
app.use('/api/services',     require('./routes/services'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/calendar',     require('./routes/calendar'));
app.use('/api/session-notes',require('./routes/sessionNotes'));
app.use('/api/blog',         require('./routes/blog'));
app.use('/api/media',        require('./routes/media'));
app.use('/api/contact',      require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Alcançari API running on port ${PORT}`));

module.exports = app;
