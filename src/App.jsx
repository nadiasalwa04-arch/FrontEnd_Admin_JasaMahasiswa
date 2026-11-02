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

  // Shared Data Services untuk menghitung pending count secara global
  const [services, setServices] = useState([
    { id: 1, title: 'Jasa Desain Poster & PPT Interaktif', status: 'PENDING' },
    { id: 2, title: 'Jasa Olah Data SPSS & Analisis Statistik', status: 'PENDING' },
    { id: 3, title: 'Jasa Koding Landing Page React & Tailwind', status: 'APPROVED' }
  ]);

  // Hitung berapa banyak pengajuan yang PENDING
  const pendingServiceCount = services.filter(s => s.status === 'PENDING').length;

  useEffect(() => {
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
    pendingServiceCount // <-- Badgenya sekarang selalu dikirim ke semua halaman!
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigateToLogin={() => navigate('/login')} />} />
      <Route path="/login" element={<LoginPage onBack={() => navigate('/')} onLoginSuccess={() => navigate('/dashboard')} />} />

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
            services={services}
            setServices={setServices}
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