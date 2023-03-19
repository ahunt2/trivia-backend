const express = require('express')
const auth = require('./auth')
const score = require('./scores')
const router = express.Router()

router.use('/auth', auth)
router.use('/scores', score)

module.exports = router