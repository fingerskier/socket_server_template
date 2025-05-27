import { listen } from '../db/conx.js'

const channel = 'users_changed'

const usersListener = await listen(channel)


export default function initialize(IO) {
  usersListener.on('event', (data) => {
    IO.emit('users', data)
  })

  
  usersListener.on('error', err=>{
    console.error(err)
    IO.emit('error', err)
  })
  
  usersListener.on('connect', console.log)
  
  usersListener.on('reconnect', console.log)
  
  usersListener.on('close', console.log)
  

  IO.emit('server:start', (new Date()).toISOString())
}