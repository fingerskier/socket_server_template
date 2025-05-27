import { listen } from '../db/conx.js'

const channel = 'users_changed'

const userListener = await listen(channel)


export default function initialize(IO) {
  userListener.on('event', (data) => {
    console.log(data)
    IO.emit('user', data)
  })
  
  userListener.on('error', err=>{
    console.error(err)
    IO.emit('error', err)
  })
  
  userListener.on('connect', console.log)
  
  userListener.on('reconnect', console.log)
  
  userListener.on('close', console.log)
}