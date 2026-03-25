import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';

const LoginPage = ({ onLogin }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await authApi.login({ email: identifier, password });
            onLogin(data.user);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>{t('login.title')}</h2>
                <div className="input-group">
                    <label>{t('login.email_or_name')}</label>
                    <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="input-group">
                    <label>{t('login.password')}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? t('login.button_loading') : t('login.button')}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
