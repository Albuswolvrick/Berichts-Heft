import React, { useState, useEffect } from 'react'

const DevMenu = () => {
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        console.error('Fehler beim Laden der Benutzer')
      }
    } catch (error) {
      console.error('Fehler:', error)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      })

      if (response.ok) {
        console.log('Benutzer erstellt')
        setEmail('')
        setPassword('')
        setRole('user')
        fetchUsers()
      } else {
        console.error('Fehler beim Erstellen')
      }
    } catch (error) {
      console.error('Fehler:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('Benutzer gelöscht')
        fetchUsers()
      } else {
        console.error('Fehler beim Löschen')
      }
    } catch (error) {
      console.error('Fehler:', error)
    }
  }

  return (
    <div>
      <h2>Dev Menu</h2>
      <div>
        <h3>Benutzerverwaltung</h3>
        <form onSubmit={handleCreateUser}>
          <h4>Neuen Benutzer erstellen</h4>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Passwort:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Rolle:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit">Benutzer erstellen</button>
        </form>

        <h4>Vorhandene Benutzer</h4>
        {users.length === 0 ? (
          <p>Keine Benutzer gefunden</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.email} ({user.role})
                <button onClick={() => handleDeleteUser(user.id)}>Löschen</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default DevMenu
