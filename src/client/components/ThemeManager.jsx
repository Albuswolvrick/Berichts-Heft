import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';

const ThemeManager = () => {
    const { setTheme } = useTheme();
    const { t } = useLanguage();

    return (
        <div className="theme-manager">
            <h3>{t('theme.title')}</h3>
            <div className="theme-buttons">
                <button onClick={() => setTheme('light')} className="nav-button">{t('theme.light')}</button>
                <button onClick={() => setTheme('dark')} className="nav-button">{t('theme.dark')}</button>
                <button onClick={() => setTheme('doom')} className="nav-button">{t('theme.doom')}</button>
            </div>
        </div>
    );
};

export default ThemeManager;
