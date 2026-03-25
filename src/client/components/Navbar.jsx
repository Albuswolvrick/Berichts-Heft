import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../public/css/navbar.css';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSelector from './LanguageSelector';

const Navbar = ({ items, user, onLogout }) => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <nav className="vertical-nav">
        <LanguageSelector />
        {user ? (
            <div className="user-info">
                <span>{t('nav.welcome', { username: user.username })}</span>
                <button onClick={() => navigate('/profile')} className="nav-button">{t('nav.profile')}</button>
                <button onClick={onLogout} className="nav-button">{t('nav.logout')}</button>
            </div>
        ) : (
            <button
                className="nav-button"
                onClick={() => navigate('/login')}
            >
                {t('nav.login')}
            </button>
        )}
      {items.map((item) => (
        <button
          key={item.path}
          className="nav-button"
          onClick={() => navigate(item.path)}
        >
          {t(item.label)}
        </button>
      ))}
      <div className="theme-buttons">
        <button className="nav-button" onClick={() => setTheme('light')}>
          {t('nav.light_mode')}
        </button>
        <button className="nav-button" onClick={() => setTheme('dark')}>
          {t('nav.dark_mode')}
        </button>
        <button className="nav-button" onClick={() => setTheme('doom')}>
          {t('nav.doom_mode')}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
