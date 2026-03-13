require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json({ limit: '10mb' }))

// Publicas
app.use('/api/auth',       require('./routes/auth'))
app.use('/api/services',   require('./routes/services'))
app.use('/api/blog',       require('./routes/blog'))
app.use('/api/contact',    require('./routes/contact'))
app.use('/api/therapists', require('./routes/therapists'))

// Privadas
app.use('/api/patients',      require('./routes/patients'))
app.use('/api/appointments',  require('./routes/appointments'))
app.use('/api/calendar',      require('./routes/calendar'))
app.use('/api/session-notes', require('./routes/sessionNotes'))
app.use('/api/users',         require('./routes/users'))
app.use('/api/media',         require('./routes/media'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))
app.use((req, res) => res.status(404).json({ error: 'Rota nao encontrada' }))
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Erro interno' }) })

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`))
