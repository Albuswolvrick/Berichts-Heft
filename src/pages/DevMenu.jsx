import React, { useState, useEffect } from 'react';
import './DevMenu.css';

// Inline component for managing a single user row
const UserRow = ({ user, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleUpdate = async () => {
    try {
      await onUpdate(user.id, { name, email, role });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user', error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <li>
      {isEditing ? (
        <div className="edit-user-form">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">User</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button onClick={handleUpdate} className="btn btn-ready">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn">Cancel</button>
        </div>
      ) : (
        <div className="user-details">
          <span>{user.name} ({user.email}) - {user.role}</span>
          <div>
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit</button>
            <button onClick={() => onDelete(user.id)} className="btn btn-logout">Delete</button>
          </div>
        </div>
      )}
    </li>
  );
};

const DevMenu = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const err = await response.json();
        setError(`Failed to load users: ${err.error}`);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/users', { // Changed to /api/users
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        setName('');
        setEmail('');
        setPassword('');
        setRole('USER');
        await fetchUsers();
      } else {
        const err = await response.json();
        setError(`Failed to create user: ${err.error}`);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };
  
  const handleUpdateUser = async (userId, userData) => {
    setError('');
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the user list
      } else {
        const err = await response.json();
        setError(`Failed to update user: ${err.error}`);
        throw new Error(err.error); // Throw error to be caught in UserRow
      }
    } catch (error) {
      setError('An unexpected error occurred while updating.');
      throw error; // Re-throw to be caught in UserRow
    }
  };

  const handleDeleteUser = async (userId) => {
    setError('');
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchUsers(); // Refresh the list
        } else {
          const err = await response.json();
          setError(`Failed to delete user: ${err.error}`);
        }
      } catch (error) {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="dev-menu">
      <h2>Dev Menu</h2>
      {error && <p className="error-message">{error}</p>}
      
      <div className="user-management">
        <h3>User Management</h3>
        
        <form onSubmit={handleCreateUser} className="create-user-form">
          <h4>Create New User</h4>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">User</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="btn btn-primary">Create User</button>
        </form>

        <h4>Existing Users</h4>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="user-list">
            {users.map((user) => (
              <UserRow key={user.id} user={user} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DevMenu;
