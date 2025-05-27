import socket from './io.js'
import { localStore } from 'react-confection'

const Store = localStore()

function rpc(event: string, payload: any): Promise<any> {
  return new Promise((resolve) => {
    Store.ioLoading = true
    socket.emit(event, payload, (res: any) => {
      Store.ioLoading = false
      resolve(res)
    })
  })
}


export const user = {
  create: (payload: any) => rpc('user:create', payload),
  read: (payload: any) => rpc('user:read', payload),
  list: (payload: any) => rpc('user:list', payload),
  update: (payload: any) => rpc('user:update', payload),
  delete: (payload: any) => rpc('user:delete', payload),
}