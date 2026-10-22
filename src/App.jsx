import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Import komponen sesuai lokasi folder baru
import DashboardPage from './pages/dashboard/DashboardPage';
import ServiceModerationPage from './pages/services/ServiceModerationPage';
import TransactionVerificationPage from './pages/transactions/TransactionVerificationPage';
import UserManagementPage from './pages/users/UserManagementPage';
import SettingsPage from './pages/settings/SettingsPage';
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/Landing/LandingPage';

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigateLogin={() => navigate('/login')} />} />
      <Route path="/login" element={<LoginPage onNavigateDashboard={() => navigate('/dashboard')} />} />
      
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
      
      <Route 
        path="/moderasi-jasa" 
        element={
          <ServiceModerationPage 
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
            onNavigateSettings={() => navigate('/pengaturan')}
          />
        } 
      />
      
      <Route 
        path="/verifikasi-transaksi" 
        element={
          <TransactionVerificationPage 
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
            onNavigateSettings={() => navigate('/pengaturan')}
          />
        } 
      />
      
      <Route 
        path="/manajemen-user" 
        element={
          <UserManagementPage 
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
            onNavigateSettings={() => navigate('/pengaturan')}
          />
        } 
      />
      
      <Route 
        path="/pengaturan" 
        element={
          <SettingsPage 
            onNavigateDashboard={() => navigate('/dashboard')}
            onNavigateTransactionVerification={() => navigate('/verifikasi-transaksi')}
            onNavigateServiceModeration={() => navigate('/moderasi-jasa')}
            onNavigateUserManagement={() => navigate('/manajemen-user')}
          />
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}