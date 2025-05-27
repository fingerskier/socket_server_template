import { useState } from 'react'
import { useLocalStore } from 'react-confection'
import { apiFetch } from '@api/api'

type User = { email?: string, [key: string]: any }
type StoreType = { user?: User, token?: string | null }


export default function Login() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [log, setLog] = useState<string[]>([])
  const Store = useLocalStore<StoreType>()

  const appendLog = (msg: string) => setLog(l => [...l, msg])

  const sendOtp = async () => {
    await apiFetch('api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    appendLog('OTP sent')
  }

  const login = async () => {
    const res = await apiFetch('api/otp/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    })
    .then((r: any) => r.json())
    .catch(console.error)

    if (res.token) {
      Store.token = res.token
      if (res.user) Store.user = res.user
      appendLog('Login successful')
      window.location.href = '#areas'
    } else {
      appendLog('Login failed')
    }
  }

  const logout = () => {
    Store.token = null
    Store.user = undefined
    appendLog('Logged out')
  }

  return <div>
    <h2>Login</h2>
    {Store.token? <>
      <p>Logged in as {Store.user?.email || JSON.stringify(Store.user, null, 2)}</p>
      <button onClick={logout}>Logout</button>
    </> : <>
      <div>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={sendOtp}>Send OTP</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>

      <pre>{log.join('\n')}</pre>
    </>}
  </div>
}