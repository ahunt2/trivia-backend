const { updateScores, getLeaders } = require('../controllers/scores')

exports.registerEvents = (io) => {
  io.on('connection', (socket) => {
    socket.on('update-user', async (data, token) => {
      const scores = await updateScores(data, token, socket)
      io.emit('update-leaderboard', scores)
    })
  
    socket.on('get-leaderboard', async () => {
      const scores = await getLeaders()
      io.emit('update-leaderboard', scores)
    })
  })
}