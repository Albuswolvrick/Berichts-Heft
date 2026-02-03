import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DevMenu from './pages/DevMenu';
import NewReport from './pages/NewReport';
import '../public/css/style.css';
import '../public/css/navbar.css';
import '../public/css/report.css';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Tagesbericht', path: '/tagesbericht' },
  { label: 'Wochenbericht', path: '/wochenbericht' },
  { label: 'Monatsbericht', path: '/monatsbericht' },
  { label: 'Dev Menu', path: '/dev' },
];

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/users/me');
                setIsAuth(res.ok);
            } catch (error) {
                setIsAuth(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuth === null) {
        return <div>Loading...</div>;
    }

    return isAuth ? children : <Navigate to="/login" />;
};

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/users/me');
                if(res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        window.location.href = '/login';
    }

  return (
    <div style={{ display: 'flex' }}>
      <Navbar items={navItems} user={user} onLogout={handleLogout} />

      <main style={{ padding: '20px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/tagesbericht" element={<ProtectedRoute><h1>Tagesbericht</h1></ProtectedRoute>} />
          <Route path="/wochenbericht" element={<ProtectedRoute><h1>Wochenbericht</h1></ProtectedRoute>} />
          <Route path="/monatsbericht" element={<ProtectedRoute><h1>Monatsbericht</h1></ProtectedRoute>} />
          <Route path="/dev" element={<ProtectedRoute><DevMenu /></ProtectedRoute>} />
          <Route path="/new-report" element={<ProtectedRoute><NewReport /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
