import {useEffect, useState} from 'react'
import { user } from '@api/rpc'
import { on } from '@api/io'

type User = {
  id: string
  email: string
  roles: string[]
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])

  
  useEffect(() => {
    user.list()
    .then(setUsers)
    .catch(console.error)

    on('users', (change: User) => {
      setUsers(prev => {
        const I = prev.findIndex(u => u.id === change.id)
        console.log('users', change, change.id, I)
        if (I !== -1) {
          // create a new array with the updated user
          const updated = [...prev]
          updated[I] = change
          return updated
        } else {
          return [...prev, change]
        }
      })
    })
  }, [])
  

  return <div>
    Users
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.email}
          &nbsp;
          ({user.roles})
        </li>
      ))}
    </ul>
  </div>
}