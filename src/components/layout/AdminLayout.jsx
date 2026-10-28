import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({
  children,
  isSidebarOpen,
  setIsSidebarOpen,
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
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden w-full">
      {/* SIDEBAR GEMINI COLLAPSIBLE */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        onNavigateDashboard={onNavigateDashboard}
        onNavigateTransactionVerification={onNavigateTransactionVerification}
        onNavigateServiceModeration={onNavigateServiceModeration}
        onNavigateUserManagement={onNavigateUserManagement}
        onNavigateSettings={onNavigateSettings}
      />

      {/* AREA UTAMA KONTEN (IKUT MELEBAR & MENYEPIK SECARA SMOOTH) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
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

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;