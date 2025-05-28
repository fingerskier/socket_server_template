import 'dotenv/config'

/**
 * Entry point for the Express and Socket.IO server.
 */

import http from 'http'
import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import os from 'os'

import apiRouter from './route/index.js'
import socketEvents from './io/eventor.js'
import socketRPC from './io/rpc.js'
import cookieParser from 'cookie-parser'

const app = express()
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173']
allowedOrigins.push(os.hostname())
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
})

io.use((socket, next) => {
  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error('Authentication error: Token missing'))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'))
    }

    socket.user = decoded // Save decoded user info in socket instance
    next()
  })
})


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))

app.use('/api', apiRouter)

socketRPC(io)
socketEvents(io)

server.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port', process.env.PORT || 3000)
})
