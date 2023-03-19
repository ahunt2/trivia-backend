const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { updateScore, getLeaders } = require('../controllers/scores')

router.put('/', protect, updateScore)
router.get('/leaders', protect, getLeaders)

module.exports = router