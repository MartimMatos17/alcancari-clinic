const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// Sem upload real por agora — placeholder para futuro
router.get('/', auth, (req, res) => {
  res.json({ message: 'Media endpoint - em desenvolvimento' })
})

module.exports = router
