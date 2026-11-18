import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({
  children,
  isSidebarOpen,
  setIsSidebarOpen,
  activeMenu,
  pendingServiceCount = 0,
  title,
  searchQuery,
  setSearchQuery,
  showNotifications,
  setShowNotifications,
  notifications = [],
  setNotifications = () => {},
  notificationRef,
  onNavigateDashboard,
  onNavigateTransactionVerification,
  onNavigateServiceModeration,
  onNavigateUserManagement,
  onNavigateSettings
}) => {
  const [globalNotifications, setGlobalNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('http://localhost:3000/api/admin/services', { headers }).then((r) => r.json()).catch(() => ({})),
      fetch('http://localhost:3000/api/admin/transactions', { headers }).then((r) => r.json()).catch(() => ({})),
      fetch('http://localhost:3000/api/admin/users', { headers }).then((r) => r.json()).catch(() => ({}))
    ]).then(([svcRes, trxRes, usrRes]) => {
      const items = [];

      if (svcRes?.success && Array.isArray(svcRes.data)) {
        svcRes.data
          .filter((s) => ['ditinjau', 'pending'].includes((s.status || '').toLowerCase()))
          .forEach((s) => {
            items.push({
              id: `svc-${s.id}`,
              title: 'Moderasi Jasa Baru',
              desc: `${s.judul || 'Layanan Jasa'} oleh ${s.seller_name || 'Mahasiswa'} menunggu persetujuan.`,
              time: 'Baru saja',
              unread: true
            });
          });
      }

      if (usrRes?.success && Array.isArray(usrRes.data)) {
        usrRes.data
          .filter((u) => ['menunggu_verifikasi', 'pending'].includes((u.ktm_status || '').toLowerCase()))
          .forEach((u) => {
            items.push({
              id: `ktm-${u.id}`,
              title: 'Verifikasi KTM Baru',
              desc: `${u.nama || 'Mahasiswa'} menunggu verifikasi dokumen KTM.`,
              time: 'Menunggu',
              unread: true
            });
          });
      }

      if (trxRes?.success && Array.isArray(trxRes.data)) {
        trxRes.data.slice(0, 4).forEach((t) => {
          items.push({
            id: `trx-${t.id}`,
            title: `Transaksi #TRX-${t.id}`,
            desc: `${t.service_title || 'Pesanan Jasa'} — Rp ${Number(t.total_harga || t.harga || t.service_price || t.total_price || t.amount || 0).toLocaleString('id-ID')}`,
            time: t.status || 'Terbaru',
            unread: (t.status || '').toLowerCase() === 'pending'
          });
        });
      }

      setGlobalNotifications(items);
    });
  }, []);

  const activeNotifications = notifications.length > 0 ? notifications : globalNotifications;
  const handleSetNotifications = (updater) => {
    setGlobalNotifications(updater);
    if (typeof setNotifications === 'function') {
      setNotifications(updater);
    }
  };

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
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          notifications={activeNotifications}
          setNotifications={handleSetNotifications}
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