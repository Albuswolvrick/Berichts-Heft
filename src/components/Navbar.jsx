import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../public/css/navbar.css';
import { useTheme } from '../hooks/useTheme';

const Navbar = ({ items, user, onLogout }) => {
  const navigate = useNavigate();
  const { setCustomTheme } = useTheme();

  return (
    <nav className="vertical-nav">
        {user ? (
            <div className="user-info">
                <span>Welcome, {user.username}</span>
                <button onClick={() => navigate('/profile')} className="nav-button">Profile</button>
                <button onClick={onLogout} className="nav-button">Logout</button>
            </div>
        ) : (
            <button
                className="nav-button"
                onClick={() => navigate('/login')}
            >
                Login
            </button>
        )}
      {items.map((item) => (
        <button
          key={item.path}
          className="nav-button"
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </button>
      ))}
      <button className="nav-button" onClick={() => navigate('/reports/new')}>
        New Report
      </button>
      <div className="theme-buttons">
        <button className="nav-button" onClick={() => setCustomTheme('light')}>
          Light Mode
        </button>
        <button className="nav-button" onClick={() => setCustomTheme('dark')}>
          Dark Mode
        </button>
        <button className="nav-button" onClick={() => setCustomTheme('doom')}>
          Doom Mode
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
