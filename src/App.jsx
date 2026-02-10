import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DevMenu from './pages/DevMenu';
import NewReport from './pages/NewReport';
import ReportPage from './pages/ReportPage';
import EditReport from './pages/EditReport';
import ProfilePage from './pages/ProfilePage';
import { ToastProvider } from './hooks/useToast';
import { ThemeProvider } from './hooks/useTheme';
import '../public/css/style.css';
import '../public/css/navbar.css';
import '../public/css/report.css';

const allNavItems = [
  { label: 'Home', path: '/' },
  { label: 'Tagesbericht', path: '/tagesbericht' },
  { label: 'Wochenbericht', path: '/wochenbericht' },
  { label: 'Monatsbericht', path: '/monatsbericht' },
  { label: 'Dev Menu', path: '/dev', roles: ['MANAGER', 'ADMIN'] },
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

const AdminRoute = ({ children, user }) => {
    if (!user || !['MODERATOR', 'ADMIN', 'MANAGER'].includes(user.role)) {
        return <Navigate to="/" />;
    }
    return children;
};

function App() {
    const [user, setUser] = useState(null);
    const [navItems, setNavItems] = useState(allNavItems);

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

    useEffect(() => {
        if (user) {
            const filteredNavItems = allNavItems.filter(item => {
                if (!item.roles) return true;
                return item.roles.includes(user.role);
            });
            setNavItems(filteredNavItems);
        } else {
            const filteredNavItems = allNavItems.filter(item => !item.roles);
            setNavItems(filteredNavItems);
        }
    }, [user]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        window.location.href = '/login';
    }

  return (
    <ThemeProvider>
      <ToastProvider>
        <div style={{ display: 'flex' }}>
          <Navbar items={navItems} user={user} onLogout={handleLogout} />

          <main style={{ padding: '20px', flex: 1 }}>
            <Routes>
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage onLogin={setUser} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/tagesbericht" element={<ProtectedRoute><h1>Tagesbericht</h1></ProtectedRoute>} />
              <Route path="/wochenbericht" element={<ProtectedRoute><h1>Wochenbericht</h1></ProtectedRoute>} />
              <Route path="/monatsbericht" element={<ProtectedRoute><h1>Monatsbericht</h1></ProtectedRoute>} />
              <Route path="/dev" element={<AdminRoute user={user}><DevMenu /></AdminRoute>} />
              <Route path="/new-report" element={<ProtectedRoute><NewReport /></ProtectedRoute>} />
              <Route path="/reports/:id" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
              <Route path="/reports/:id/edit" element={<ProtectedRoute><EditReport /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
