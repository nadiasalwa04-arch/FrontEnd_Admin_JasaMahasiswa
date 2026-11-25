import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({
  children,
  isSidebarOpen,
  setIsSidebarOpen,
  activeMenu,
  pendingServiceCount = 0,
  title,
  breadcrumbs = [],
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
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden w-full">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        pendingServiceCount={pendingServiceCount}
        onNavigateDashboard={onNavigateDashboard}
        onNavigateTransactionVerification={onNavigateTransactionVerification}
        onNavigateServiceModeration={onNavigateServiceModeration}
        onNavigateUserManagement={onNavigateUserManagement}
        onNavigateSettings={onNavigateSettings}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
        <Header
          title={title}
          breadcrumbs={breadcrumbs}
          onNavigateDashboard={onNavigateDashboard}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          notifications={notifications}
          setNotifications={setNotifications}
          notificationRef={notificationRef}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;