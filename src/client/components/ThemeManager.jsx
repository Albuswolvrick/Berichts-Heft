import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeManager = () => {
    const { setTheme } = useTheme();

    return (
        <div className="theme-manager">
            <h3>Select a Theme</h3>
            <div className="theme-buttons">
                <button onClick={() => setTheme('light')} className="nav-button">Light</button>
                <button onClick={() => setTheme('dark')} className="nav-button">Dark</button>
                <button onClick={() => setTheme('doom')} className="nav-button">Doom</button>
            </div>
        </div>
    );
};

export default ThemeManager;
