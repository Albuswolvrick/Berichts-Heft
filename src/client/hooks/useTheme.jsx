import React, { useState, createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

const defaultThemes = {
    light: {
        primary: '#28a745',
        secondary: '#6c757d',
        background: '#ffffff',
        text: '#212529'
    },
    dark: {
        primary: '#28a745',
        secondary: '#6c757d',
        background: '#343a40',
        text: '#ffffff'
    },
    doom: {
        primary: '#e06c75',
        secondary: '#c678dd',
        background: '#1f1f1f',
        text: '#abb2bf'
    }
}

export const ThemeProvider = ({ children }) => {
  const [theme, _setTheme] = useState('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme && defaultThemes[storedTheme]) {
        _setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
      if (theme && defaultThemes[theme]) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
  }, [theme]);

  const setTheme = (themeName) => {
      if(defaultThemes[themeName]) {
          _setTheme(themeName)
      }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
