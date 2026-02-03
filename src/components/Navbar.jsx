import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../public/css/navbar.css';

const Navbar = ({ items }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="vertical-nav">
      {items.map((item) => (
        <button
          key={item.path}
          className="nav-button"
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </button>
      ))}
      <button className="nav-button" onClick={() => navigate('/new-report')}>
        New Report
      </button>
      <button className="nav-button theme-switcher" onClick={toggleTheme}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </nav>
  );
};

export default Navbar;
