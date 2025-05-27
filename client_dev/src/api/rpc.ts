import socket from './io.js'
import { localStore } from 'react-confection'

const Store = localStore()

function rpc(event, payload) {
  return new Promise((resolve, reject) => {
    Store.ioLoading = true
    socket.emit(event, payload, (res) => {
      Store.ioLoading = false
      resolve(res)
    })
  })
}


export const user = {
  create: (payload) => rpc('user:create', payload),
  read: (payload) => rpc('user:read', payload),
  list: (payload) => rpc('user:list', payload),
  update: (payload) => rpc('user:update', payload),
  delete: (payload) => rpc('user:delete', payload),
}