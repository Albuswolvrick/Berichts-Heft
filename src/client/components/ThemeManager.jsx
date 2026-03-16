import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

const themes = ['light', 'dark', 'doom']; // Example themes

const ThemeManager = () => {
    const { theme, setTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(theme);

    const handleThemeChange = (e) => {
        setSelectedTheme(e.target.value);
    };

    const handleSaveTheme = () => {
        setTheme(selectedTheme);
    };

    useEffect(() => {
        setSelectedTheme(theme);
    }, [theme]);

    return (
        <div className="theme-manager">
            <div className="form-group">
                <label htmlFor="theme-select">Select Theme:</label>
                <select id="theme-select" value={selectedTheme} onChange={handleThemeChange}>
                    {themes.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleSaveTheme} className="btn">
                Save Theme
            </button>
        </div>
    );
};

export default ThemeManager;
