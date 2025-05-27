import {localStore} from 'react-confection'

const Store = localStore()


export function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token: string = Store.token
  
  const headers = new Headers(options.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const finalURL = import.meta.env.VITE_API_URL + url
  Store.ioLoading = true
  return fetch(finalURL, { ...options, headers }).finally(() => {
    Store.ioLoading = false
  })
}
