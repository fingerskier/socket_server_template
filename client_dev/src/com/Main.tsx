import {useEffect} from 'react'
import { useLocalStore } from 'react-confection'
import Users from '@com/Users'
import Login from '@com/Login'

import style from '@style/Main.module.css'


export default function Main() {
  const Store = useLocalStore()

  useEffect(() => {
    if (!Store.token) {
      window.location.href = '#Login'
    }
  }, [])

  return <main>
    <ul className={style.menu}>
      <li>
        <a href="#Login">Login</a>
      </li>
      <li>
        <a href="#Flarn">Flarn</a>
      </li>
      <li>
        <a href="#Ghibbet">Ghibbet</a>
      </li>
      <li>
        <a href="#Users">Users</a>
      </li>
    </ul>

    {Store.context === 'Login' && <Login />}
    {Store.context === 'Flarn' && <div>Flarn Mode</div>}
    {Store.context === 'Ghibbet' && <div>Ghibbet Mode</div>}
    {Store.context === 'Users' && <Users />}
  </main>
}