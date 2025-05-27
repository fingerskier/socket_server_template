import { io } from 'socket.io-client'
import { localStore } from 'react-confection'

// Shared storage instance for use outside React components
const Store = localStore()

// initialize socket state values if missing
if (Store.ioConnected === undefined) Store.ioConnected = false
if (Store.ioLoading === undefined) Store.ioLoading = true
if (Store.ioError === undefined) Store.ioError = null

function getToken() {
  return Store.token
}

// Create the socket using the token from the Store
const socket = io(
  import.meta.env.VITE_API_URL,
  {
    auth: { token: getToken() },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  }
)

// mark initial connection attempt
Store.ioLoading = true

// Reconnect whenever the token changes so that authentication is updated
Store.on('token', (token) => {
  socket.auth = { token }
  if (socket.connected) {
    Store.ioLoading = true
    socket.disconnect()
  }
  socket.connect()
})


socket.on('connect', () => {
  console.log('connected to socket')
  Store.ioConnected = true
  Store.ioLoading = false
  Store.ioError = null
})

socket.on('connect_error', (err) => {
  console.error('socket connect error', err)
  Store.ioConnected = false
  Store.ioLoading = false
  Store.ioError = err?.message || String(err)
})

socket.on('disconnect', () => {
  console.log('disconnected from socket')
  Store.ioConnected = false
})

socket.on('error', (err) => {
  console.error('socket error', err)
  Store.ioError = err?.message || String(err)
})

socket.on('message', (message) => {
  console.log('message', message)
})

// socket.on('users', (event) => {
//   console.log('users', event)
// })

socket.on('server:start', (event) => {
  console.log('server:start', event)
})


export function on(event: string, callback: (event: any) => void) {
  return new Promise((resolve) => {
    socket.on(event, (event) => {
      callback(event)
      resolve(event)
    })
  })
}


export default socket