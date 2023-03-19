const jwt = require('jsonwebtoken')
const User = require('../models/User')


/**
 * Protect routes
 */
exports.protect = async (req, res, next) => {
  try {
    let token
    
    if (req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')) {
      // Get the token from the header
      [,token] = req.headers.authorization.split(' ')
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = user
    return next()
  } catch (err) {
    return next()
  }
}