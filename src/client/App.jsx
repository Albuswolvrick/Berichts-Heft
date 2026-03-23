import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DevMenu from './pages/DevMenu';
import ReportPage from './pages/ReportPage';
import EditReportPage from './pages/EditReport';
import ProfilePage from './pages/ProfilePage';
import DailyReportPage from './pages/DailyReportPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import MonthlyReportPage from './pages/MonthlyReportPage';
import YearlyReportPage from './pages/YearlyReportPage';
import NewReportPage from './pages/NewReportPage';
import AdminPage from './pages/AdminPage';
import AdminReportsPage from './pages/AdminReportsPage';
import { ToastProvider } from './hooks/useToast';
import { ThemeProvider } from './hooks/useTheme';
import { authApi, userApi } from './services/api';
import '../../public/css/style.css';
import '../../public/css/navbar.css';
import '../../public/css/report.css';
import '../../public/css/doom.css';
import CookieConsent from './components/CookieConsent';

const allNavItems = [
    { label: 'Home', path: '/' },
    { label: 'New Report', path: '/reports/new' },
    { label: 'Admin Dashboard', path: '/admin', roles: ['ADMIN', 'MANAGER'] },
    { label: 'Admin Reports', path: '/admin/reports', roles: ['ADMIN', 'MANAGER'] },
    { label: 'Dev Menu', path: '/dev', roles: ['MANAGER', 'ADMIN'] },
];

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await userApi.getMe();
                setIsAuth(true);
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
    if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) {
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
                const data = await userApi.getMe();
                setUser(data.user);
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
        try {
            await authApi.logout();
            setUser(null);
            window.location.href = '/login';
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <ToastProvider>
                    <div style={{ display: 'flex' }}>
                        <Navbar items={navItems} user={user} onLogout={handleLogout} />
                        {/* Navbar must remain outside <main> to preserve the side-by-side flex layout */}
                        <main style={{ padding: '20px', flex: 1 }}>
                            <Routes>
                                <Route path="/" element={<ProtectedRoute><HomePage user={user} /></ProtectedRoute>} />
                                <Route path="/login" element={<LoginPage onLogin={setUser} />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/reports/new" element={<ProtectedRoute><NewReportPage /></ProtectedRoute>} />
                                <Route path="/reports/daily" element={<ProtectedRoute><DailyReportPage /></ProtectedRoute>} />
                                <Route path="/reports/weekly" element={<ProtectedRoute><WeeklyReportPage /></ProtectedRoute>} />
                                <Route path="/reports/monthly" element={<ProtectedRoute><MonthlyReportPage /></ProtectedRoute>} />
                                <Route path="/reports/yearly" element={<ProtectedRoute><YearlyReportPage /></ProtectedRoute>} />
                                <Route path="/admin" element={<AdminRoute user={user}><AdminPage /></AdminRoute>} />
                                <Route path="/admin/reports" element={<AdminRoute user={user}><AdminReportsPage /></AdminRoute>} />
                                <Route path="/dev" element={<AdminRoute user={user}><DevMenu /></AdminRoute>} />
                                <Route path="/reports/:id" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
                                <Route path="/reports/:reportType/:id/edit" element={<ProtectedRoute><EditReportPage /></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            </Routes>
                        </main>
                        <CookieConsent isAuthenticated={!!user} />
                    </div>
                </ToastProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
