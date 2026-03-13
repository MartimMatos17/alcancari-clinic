require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

// Segurança básica
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://alcancari.pt', 'https://www.alcancari.pt', /\.vercel\.app$/]
    : '*',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rotas públicas
app.use('/api/auth',        require('./routes/auth'))
app.use('/api/services',    require('./routes/services'))
app.use('/api/blog',        require('./routes/blog'))
app.use('/api/contact',     require('./routes/contact'))
app.use('/api/therapists',  require('./routes/therapists'))

// Rotas privadas (precisam de login)
app.use('/api/patients',      require('./routes/patients'))
app.use('/api/appointments',  require('./routes/appointments'))
app.use('/api/calendar',      require('./routes/calendar'))
app.use('/api/session-notes', require('./routes/sessionNotes'))
app.use('/api/users',         require('./routes/users'))
app.use('/api/media',         require('./routes/media'))

// Health check
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
  env: process.env.NODE_ENV
}))

// 404
app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }))

// Erro global
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`✅ Servidor Alcançari a correr na porta ${PORT}`))
