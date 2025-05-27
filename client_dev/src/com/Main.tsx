import React from 'react'
import { useLocalStore } from 'react-confection'


export default function Main() {
  const Store = useLocalStore()

  return <main>
    Main

    <ul>
      <li>
        <a href="#login">Login</a>
      </li>
      <li>
        <a href="#Flarn">Flarn</a>
      </li>
      <li>
        <a href="#Ghibbet">Ghibbet</a>
      </li>
    </ul>

    {Store.context === 'login' && <div>Login Mode</div>}
    {Store.context === 'Flarn' && <div>Flarn Mode</div>}
    {Store.context === 'Ghibbet' && <div>Ghibbet Mode</div>}
  </main>
}