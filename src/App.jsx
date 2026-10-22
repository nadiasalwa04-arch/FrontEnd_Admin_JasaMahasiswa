import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Import komponen berdasarkan lokasi folder slice yang baru
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/(dashboard)/dashboard/DashboardPage';
import ServiceModerationPage from './pages/(dashboard)/services/ServiceModerationPage';
import TransactionVerificationPage from './pages/(dashboard)/transactions/TransactionVerificationPage';
import UserManagementPage from './pages/(dashboard)/users/UserManagementPage';
import SettingsPage from './pages/(dashboard)/settings/SettingsPage';

function AppContent() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Landing Page */}
      <Route 
        path="/" 
        element={
          <LandingPage 
            onNavigateToLogin={() => navigate('/login')} 
          />
        } 
      />

      {/* Login Page */}
      <Route 
        path="/login" 
        element={
          <LoginPage 
            onBack={() => navigate('/')} 
            onLoginSuccess={() => navigate('/dashboard')} 
          />
        } 
      />

      {/* Dashboard Page */}
      <Route 
        path="/dashboard" 
        element={
          <DashboardPage 
            onNavigateUserManagement={() => navigate('/manajemen-user')} 
            onNavigateSettings={() => navigate('/pengaturan')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
          />
        } 
      />

      {/* Service Moderation Page */}
      <Route 
        path="/moderasi-jasa" 
        element={
          <ServiceModerationPage 
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
            onNavigateSettings={() => navigate('/pengaturan')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
          />
        } 
      />

      {/* Transaction Verification Page */}
      <Route 
        path="/verifikasi-transaksi" 
        element={
          <TransactionVerificationPage 
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
            onNavigateSettings={() => navigate('/pengaturan')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
          />
        } 
      />

      {/* User Management Page */}
      <Route 
        path="/manajemen-user" 
        element={
          <UserManagementPage 
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
            onNavigateSettings={() => navigate('/pengaturan')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
          />
        } 
      />

      {/* Settings Page */}
      <Route 
        path="/pengaturan" 
        element={
          <SettingsPage 
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
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