require('dotenv').config({ path: '../.env' })
const connectDB = require('./src/connection/config')
const cors = require('cors')
const morgan = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const router = require('./src/routes/router')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:3000']
  }
})
const { registerEvents } = require('./src/socket/index')

registerEvents(io)

// Connect Database
connectDB()

// Request logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} 

app.use(express.json())
app.use(cors())
app.use(mongoSanitize())
app.use(helmet())
app.use(xss())

// api router
app.use('/api', router)

// const { registerEvents } = require('./src/socket/index')
// registerEvents(io)

http.listen(process.env.PORT, () => {
  console.debug(`Server listening on port ${process.env.PORT}`.blue)
})