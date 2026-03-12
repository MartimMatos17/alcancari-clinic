require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/patients', require('./routes/patients'))
app.use('/api/session-notes', require('./routes/sessionNotes'))
app.use('/api/appointments', require('./routes/appointments'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/users', require('./routes/users'))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
