import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { addToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        addToast('Failed to fetch user data', { appearance: 'error' });
      }
    } catch (error) {
      addToast('Error: ' + error.message, { appearance: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        addToast('Profile updated successfully', { appearance: 'success' });
      } else {
        addToast('Failed to update profile', { appearance: 'error' });
      }
    } catch (error) {
      addToast('Error updating profile: ' + error.message, { appearance: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        addToast('Password updated successfully', { appearance: 'success' });
        setNewPassword('');
      } else {
        addToast('Failed to update password', { appearance: 'error' });
      }
    } catch (error) {
      addToast('Error updating password: ' + error.message, { appearance: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <p>{t('profile.error_load')}</p>;
  }

  return (
    <div>
      <h1>{t('profile.title')}</h1>
      <form onSubmit={handleUpdate}>
        <fieldset disabled={submitting}>
          <div className="form-group">
            <label htmlFor="name">{t('profile.name_label')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t('profile.email_label')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email || ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? t('profile.saving') : t('profile.update_button')}
          </button>
        </fieldset>
      </form>

      <hr />

      <h2>{t('profile.change_password')}</h2>
      <form onSubmit={handlePasswordUpdate}>
        <fieldset disabled={submitting}>
          <div className="form-group">
            <label htmlFor="newPassword">{t('profile.new_password_label')}</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('profile.new_password_placeholder')}
              required
            />
          </div>
          <button type="submit" disabled={submitting || !newPassword}>
            {submitting ? t('profile.updating') : t('profile.change_password_button')}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default ProfilePage;
