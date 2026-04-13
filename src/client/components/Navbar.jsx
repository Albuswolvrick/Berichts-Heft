import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../public/css/navbar.css';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSelector from './LanguageSelector';
import TextSizeSelector from './TextSizeSelector';

const Navbar = ({ items, user, onLogout }) => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleNavClick = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <>
      <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>
      
      {isMobileMenuOpen && <div className="nav-backdrop" onClick={closeMenu} />}

      <nav className={`vertical-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-header">
           <LanguageSelector />
           <button className="mobile-close" onClick={closeMenu}>✕</button>
        </div>

        {user ? (
          <div className="user-info">
            <span>{t('nav.welcome', { username: user.name })}</span>
            <button onClick={() => handleNavClick('/profile')} className="nav-button">{t('nav.profile')}</button>
            <button onClick={() => { onLogout(); closeMenu(); }} className="nav-button">{t('nav.logout')}</button>
          </div>
        ) : (
          <button
            className="nav-button"
            onClick={() => handleNavClick('/login')}
          >
            {t('nav.login')}
          </button>
        )}
        
        <div className="nav-items">
          {items.map((item) => (
            <button
              key={item.path}
              className="nav-button"
              onClick={() => handleNavClick(item.path)}
            >
              {t(item.label)}
            </button>
          ))}
        </div>
        
        <TextSizeSelector />

        <div className="theme-buttons">
          <button className="nav-button" onClick={() => { setTheme('light'); closeMenu(); }}>
            {t('nav.light_mode')}
          </button>
          <button className="nav-button" onClick={() => { setTheme('dark'); closeMenu(); }}>
            {t('nav.dark_mode')}
          </button>
          <button className="nav-button" onClick={() => { setTheme('doom'); closeMenu(); }}>
            {t('nav.doom_mode')}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
