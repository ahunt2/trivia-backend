const express = require('express')
const router = express.Router()
const { 
  register, 
  login, 
  getMe,  
  updateUser,
  isAuthenticated } = require('../controllers/auth')
const { protect } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/update', protect, updateUser)
router.get('/authenticated', protect, isAuthenticated)

module.exports = router