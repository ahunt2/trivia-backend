const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { updateScore } = require('../controllers/scores')

router.put('/', protect, updateScore)

module.exports = router