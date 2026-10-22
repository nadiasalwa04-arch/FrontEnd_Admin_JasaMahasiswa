import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({ 
  children, 
  activeMenu, 
  title, 
  searchQuery, 
  setSearchQuery, 
  showNotifications, 
  setShowNotifications, 
  notifications, 
  setNotifications, 
  notificationRef,
  onNavigateDashboard,
  onNavigateTransactionVerification,
  onNavigateServiceModeration,
  onNavigateUserManagement,
  onNavigateSettings
}) => {
  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden font-sans select-none relative">
      <Sidebar
        activeMenu={activeMenu}
        onNavigateDashboard={onNavigateDashboard}
        onNavigateTransactionVerification={onNavigateTransactionVerification}
        onNavigateServiceModeration={onNavigateServiceModeration}
        onNavigateUserManagement={onNavigateUserManagement}
        onNavigateSettings={onNavigateSettings}
      />
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC]">
        <Header
          title={title}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          notifications={notifications}
          setNotifications={setNotifications}
          notificationRef={notificationRef}
        />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;