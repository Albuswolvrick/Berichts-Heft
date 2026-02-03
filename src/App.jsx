import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
  { label: 'Login', path: '/login' },
  { label: 'Tagesbericht', path: '/tagesbericht' },
  { label: 'Wochenbericht', path: '/wochenbericht' },
  { label: 'Monatsbericht', path: '/monatsbericht' },
  { label: 'Dev Menu', path: '/dev' },
];

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Navbar items={navItems} />

      <main style={{ padding: '20px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tagesbericht" element={<h1>Tagesbericht</h1>} />
          <Route path="/wochenbericht" element={<h1>Wochenbericht</h1>} />
          <Route path="/monatsbericht" element={<h1>Monatsbericht</h1>} />
          <Route path="/dev" element={<DevMenu />} />
          <Route path="/new-report" element={<NewReport />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
