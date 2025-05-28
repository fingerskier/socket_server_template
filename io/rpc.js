import users from '../db/users.js'

/**
 * Register RPC handlers on a Socket.IO server.
 *
 * @param {import('socket.io').Server} io
 */
export default function initialize(io) {
  io.on('connection', socket=>{
    console.log('socket conx:', socket.id, socket.user)

    socket.on('message', (data) => {
      console.log(`Message from ${socket.user.id}:`, data);
      io.emit('message', { user: socket.user.id, data });
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    })


    // User endpoints
    socket.on('user:create', async(payload, ack)=>{
      try {
        const result = await users.create(payload)
        ack(result)
      } catch(error) {
        throw error
      }
    })

    socket.on('user:list', async(payload, ack)=>{
      try {
        const result = await users.list()
        ack(result)
      } catch(error) {
        throw error
      }
    })

    socket.on('user:read', async(id, ack)=>{
      try {
        const result = await users.read(id)
        ack(result)
      } catch(error) {
        throw error
      }
    })

    socket.on('user:update', async(payload, ack)=>{
      try {
        const { id, ...fields } = payload
        const result = await users.update(id, fields)
        ack(result)
      } catch(error) {
        throw error
      }
    })

    socket.on('user:delete', async(payload, ack)=>{
      try {
        const id = typeof payload === 'object' ? payload.id : payload
        await users.del(id)
        ack({ status: 'ok' })
      } catch(error) {
        throw error
      }
    })
  })
}
