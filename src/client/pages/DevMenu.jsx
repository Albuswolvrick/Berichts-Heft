import React, { useState, useEffect } from 'react';
import { useToast } from './../hooks/useToast';
import '../../../public/css/DevMenu.css';
import { useLanguage } from '../hooks/useLanguage';

// Inline component for managing a single user row
const UserRow = ({ user, onUpdate, onDelete, onUpdatePassword }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdate = async () => {
    try {
      await onUpdate(user.id, { name, email, role });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user', error);
      // Optionally, show an error message to the user
    }
  };

  const handlePasswordChange = async () => {
    try {
      await onUpdatePassword(user.id, { password });
      setIsChangingPassword(false);
      setPassword('');
    } catch (error) {
      console.error('Failed to update password', error);
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
            {/* BUGFIX: Removed 'EMPLOYEE' role and added 'TEST' to align with the 'UserRole' enum in the Prisma schema. */}
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
            <option value="TEST">Test</option>
          </select>
          <button onClick={handleUpdate} className="btn btn-ready">{t('dev.action_save')}</button>
          <button onClick={() => setIsEditing(false)} className="btn">{t('dev.action_cancel')}</button>
        </div>
      ) : (
        <div className="user-details">
          <span>{user.name} ({user.email}) - {user.role}</span>
          <div>
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">{t('dev.action_edit')}</button>
            <button onClick={() => setIsChangingPassword(!isChangingPassword)} className="btn btn-primary">{t('dev.action_change_password')}</button>
            <button onClick={() => onDelete(user.id)} className="btn btn-logout">{t('dev.action_delete')}</button>
          </div>
        </div>
      )}
      {isChangingPassword && (
        <div className="edit-user-form">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" />
          <button onClick={handlePasswordChange} className="btn btn-ready">{t('dev.action_save_password')}</button>
          <button onClick={() => setIsChangingPassword(false)} className="btn">{t('dev.action_cancel')}</button>
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
  const [creationStatus, setCreationStatus] = useState('idle');
  const showToast = useToast();
  const { t } = useLanguage();

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
    setCreationStatus('idle');
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
        showToast('User created successfully!', { type: 'success' });
      } else {
        const err = await response.json();
        setError(`Failed to create user: ${err.error}`);
        setCreationStatus('error');
        setTimeout(() => setCreationStatus('idle'), 1500); // Reset after animation
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      setCreationStatus('error');
      setTimeout(() => setCreationStatus('idle'), 1500); // Reset after animation
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

  const handleUpdateUserPassword = async (userId, passwordData) => {
    setError('');
    try {
      const response = await fetch(`/api/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the user list
        showToast('Password updated successfully!', { type: 'success' });
      } else {
        const err = await response.json();
        setError(`Failed to update password: ${err.error}`);
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
          showToast('User deleted successfully!', { type: 'success' });
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
      <h2>{t('dev.title')}</h2>
      {error && <p className="error-message">{error}</p>}
      
      <div className="user-management">
        <h3>{t('dev.user_management')}</h3>
        
        <form onSubmit={handleCreateUser} className="create-user-form">
          <h4>{t('dev.create_user')}</h4>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {/* BUGFIX: Removed 'EMPLOYEE' role and added 'TEST' to align with the 'UserRole' enum in the Prisma schema. */}
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
            <option value="TEST">Test</option>
          </select>
          <button type="submit" className={`btn btn-primary ${creationStatus === 'error' ? 'flash-error' : ''}`}>
            {t('dev.create_user')}
          </button>
        </form>

        <h4>{t('dev.existing_users')}</h4>
        {users.length === 0 ? (
          <p>{t('dev.no_users')}</p>
        ) : (
          <ul className="user-list">
            {users.map((user) => (
              <UserRow key={user.id} user={user} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} onUpdatePassword={handleUpdateUserPassword} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DevMenu;
