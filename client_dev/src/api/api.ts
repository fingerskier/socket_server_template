import {localStore} from 'react-confection'

const Store = localStore()


export function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {})
  if (Store.token) headers.set('Authorization', `Bearer ${Store.token}`)

  const finalURL = import.meta.env.VITE_API_URL + url
  Store.ioLoading = true
  return fetch(finalURL, { ...options, headers }).finally(() => {
    Store.ioLoading = false
  })
}