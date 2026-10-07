import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import TransactionVerificationPage from './pages/TransactionVerificationPage';
import ServiceModerationPage from './pages/ServiceModerationPage';
import UserManagementPage from './pages/UserManagementPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <div>
      {currentPage === 'landing' && (
        <LandingPage onNavigateToLogin={() => setCurrentPage('login')} />
      )}
      
      {currentPage === 'login' && (
        <LoginPage 
          onBack={() => setCurrentPage('landing')} 
          onLoginSuccess={() => setCurrentPage('dashboard')} 
        />
      )}

      {currentPage === 'dashboard' && (
        <DashboardPage 
          onNavigateUserManagement={() => setCurrentPage('user-management')} 
          onNavigateSettings={() => setCurrentPage('settings')}
          onNavigateTransactionVerification={() => setCurrentPage('transaction-verification')}
          onNavigateServiceModeration={() => setCurrentPage('service-moderation')}
        />
      )}

      {currentPage === 'settings' && (
        <SettingsPage 
          onNavigateDashboard={() => setCurrentPage('dashboard')}
          onNavigateUserManagement={() => setCurrentPage('user-management')}
          onNavigateTransactionVerification={() => setCurrentPage('transaction-verification')}
          onNavigateServiceModeration={() => setCurrentPage('service-moderation')}
        />
      )}

      {currentPage === 'transaction-verification' && (
        <TransactionVerificationPage 
          onNavigateDashboard={() => setCurrentPage('dashboard')}
          onNavigateUserManagement={() => setCurrentPage('user-management')}
          onNavigateSettings={() => setCurrentPage('settings')}
          onNavigateServiceModeration={() => setCurrentPage('service-moderation')}
        />
      )}

      {currentPage === 'service-moderation' && (
        <ServiceModerationPage 
          onNavigateDashboard={() => setCurrentPage('dashboard')}
          onNavigateUserManagement={() => setCurrentPage('user-management')}
          onNavigateSettings={() => setCurrentPage('settings')}
          onNavigateTransactionVerification={() => setCurrentPage('transaction-verification')}
        />
      )}

      {currentPage === 'user-management' && (
        <UserManagementPage 
          onNavigateDashboard={() => setCurrentPage('dashboard')}
          onNavigateUserManagement={() => setCurrentPage('user-management')}
          onNavigateSettings={() => setCurrentPage('settings')}
          onNavigateTransactionVerification={() => setCurrentPage('transaction-verification')}
          onNavigateServiceModeration={() => setCurrentPage('service-moderation')}
        />
      )}
    </div>
  );
}

export default App;