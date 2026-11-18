import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';

import DashboardPage from './pages/dashboard/Page';
import ServiceModerationPage from './pages/services/ServiceModerationPage';
import TransactionVerificationPage from './pages/transactions/TransactionVerificationPage';
import UserManagementPage from './pages/users/UserManagementPage';
import SettingsPage from './pages/settings/SettingsPage';

function AppContent() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pendingServiceCount, setPendingServiceCount] = useState(0);

  // Ambil jumlah jasa yang menunggu moderasi secara global dari database
  const fetchPendingServiceCount = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch('http://localhost:3000/api/admin/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        const count = result.data.filter(s => {
          const st = (s.status || '').toLowerCase();
          return st === 'ditinjau' || st === 'pending';
        }).length;
        setPendingServiceCount(count);
      }
    } catch (error) {
      console.error('Gagal mengambil jumlah jasa pending:', error);
    }
  };

  useEffect(() => {
    fetchPendingServiceCount();

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const commonProps = {
    isSidebarOpen,
    setIsSidebarOpen,
    pendingServiceCount
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigateToLogin={() => navigate('/login')} />} />
      <Route
        path="/login"
        element={
          <LoginPage
            onBack={() => navigate('/')}
            onLoginSuccess={() => {
              fetchPendingServiceCount();
              navigate('/dashboard');
            }}
          />
        }
      />

      <Route
        path="/dashboard"
        element={
          <DashboardPage
            {...commonProps}
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
            onNavigateSettings={() => navigate('/pengaturan')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
          />
        }
      />

      <Route
        path="/moderasi-jasa"
        element={
          <ServiceModerationPage
            {...commonProps}
            setPendingServiceCount={setPendingServiceCount}
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
            onNavigateSettings={() => navigate('/pengaturan')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
          />
        }
      />

      <Route
        path="/verifikasi-transaksi"
        element={
          <TransactionVerificationPage
            {...commonProps}
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
            onNavigateSettings={() => navigate('/pengaturan')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
          />
        }
      />

      <Route
        path="/manajemen-user"
        element={
          <UserManagementPage
            {...commonProps}
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
            onNavigateSettings={() => navigate('/pengaturan')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
          />
        }
      />

      <Route
        path="/pengaturan"
        element={
          <SettingsPage
            {...commonProps}
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
            onNavigateSettings={() => navigate('/pengaturan')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}