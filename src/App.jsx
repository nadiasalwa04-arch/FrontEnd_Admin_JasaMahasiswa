import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Import sesuai folder Landing (L kapital) & auth
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';

// Import sesuai folder (dashboard)
import DashboardPage from './pages/(dashboard)/dashboard/DashboardPage';
import ServiceModerationPage from './pages/(dashboard)/services/ServiceModerationPage';
import TransactionVerificationPage from './pages/(dashboard)/transactions/TransactionVerificationPage';
import UserManagementPage from './pages/(dashboard)/users/UserManagementPage';
import SettingsPage from './pages/(dashboard)/settings/SettingsPage';

function AppContent() {
  const navigate = useNavigate();
  // State sidebar disimpan di paling atas agar tidak reset saat pindah halaman
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-collapse sidebar halus saat jendela browser di-inspect / digeser ke ukuran tablet & HP
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Jalankan sekali saat pertama load
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const commonProps = {
    isSidebarOpen,
    setIsSidebarOpen
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<LandingPage onNavigateToLogin={() => navigate('/login')} />} 
      />
      
      <Route 
        path="/login" 
        element={<LoginPage onBack={() => navigate('/')} onLoginSuccess={() => navigate('/dashboard')} />} 
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