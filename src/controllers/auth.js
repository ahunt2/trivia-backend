const User = require('../models/User')

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body

    let user

    user = await User.findOne({ username })

    if (user) {
      return res.status(400).json({ error: true, message: 'Username taken' })
    }
  
    // Create user
    user = await User.create({
      username,
      password
    })
  
    sendTokenResponse(user, 200, res)
  } catch (error) {
    console.error(error.message)
    return res.status(400).json({ error: true, message: 'Error creating user' })
  }
}

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    
    // Validate username and password
    if (!password && !username) {
      return res.status(400).json({
        error: true,
        message: 'Please provide a username and password'
      })
    } else if (!username) {
      return res.status(400).json({
        error: true,
        message: 'Please provide a username'
      })
    } else if (!password) {
      return res.status(400).json({
        error: true,
        message: 'Please provide a username'
      })
    }
    
    // Check for user
    const user = await User.findOne({ username }).select('+password')
    
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Invalid Credentials'
      })
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password)
    
    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: 'Invalid Credentials'
      })
    }
    
    sendTokenResponse(user, 200, res)
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Login Error'})
  }
}

/**
 * @desc    Get current logged in user
 * @route   POST /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json(user)
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

/**
 * Check to determine if user is authenticated
 */
exports.isAuthenticated = async (req, res) => {
  try {
    await User.findById(req.user._id)
    res.status(200).send(true)
  } catch(error) {
    res.status(401).send(false)
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    })
  
    res.status(200).json({
      error: false
    })
  } catch (error) {
    res.status(400).json({ error: true, message: 'Error updating password' })
  }
}

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json(token)
}