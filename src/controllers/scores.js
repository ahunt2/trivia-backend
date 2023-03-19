const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.updateScore = async (req, res) => {
  try {
    const { score, questionsAnswered, correctAnswers } = req.body

    const user = await User.findByIdAndUpdate(req.user._id, {
      $inc: { score, questionsAnswered, correctAnswers }
    })

    res.status(200).json(user)
  } catch (error) {
    console.error(error.message)
    res.status(400).json({ error: true })
  }
}

exports.updateScores = async (data, token, socket) => {
  try {
    if (!token) {
      console.error('Not authorized')
      return
    }
  
    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
  
    if (!decoded || !decoded.id) {
      console.error('Not authorized')
      return
    }
  
    // get user from decoded token
    const user = await User.findByIdAndUpdate(decoded.id, { $inc: data }, { new: true })
  
    socket.emit('update-user', user)
    return await getLeaders(socket)
  } catch (error) {
    console.error('Error updating scores')
    return []
  }
}

const getLeaders = async () => {
  try {
    const users = await User.find({})
  
    const data = users.map((user) => {
      return {
        username: user.username,
        score: user.score
      }
    })
  
    data.sort((a, b) => b.score - a.score)
    return data
  } catch (error) {
    console.log('Error getting leaders')
    return []
  }
}

exports.getLeaders = getLeaders