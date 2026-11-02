import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from './components/StatCard';
import RecentActivity from './components/RecentActivity';
import TransactionTable from './components/TransactionTable';
import PendingServiceList from './components/PendingServiceList';

const DashboardPage = ({
  isSidebarOpen,
  setIsSidebarOpen,
  pendingServiceCount = 0,
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateDashboard = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Verifikasi Transaksi', desc: 'Pesanan #TRX-8821 membutuhkan verifikasi manual.', time: '5 mnt lalu', unread: true },
    { id: 2, title: 'Moderasi Jasa', desc: 'Arief S. mengajukan jasa "Desain Poster & PPT".', time: '15 mnt lalu', unread: true },
    { id: 3, title: 'Registrasi User', desc: 'Rian Hidayat mendaftar sebagai Mahasiswa UB.', time: '1 jam lalu', unread: false },
  ]);

  const transactions = [
    { id: '#TRX-8821', desc: 'Jasa Web React & Tailwind (E-Wallet)', amount: 'Rp 77.000', status: 'Pending', actionable: true },
    { id: '#TRX-8820', desc: 'Pencairan Saldo Bank BCA (a.n Andi)', amount: 'Rp 150.000', status: 'Ditolak', type: 'out', actionNote: 'Telah ditolak' },
    { id: '#TRX-8819', desc: 'Jasa Desain Poster (QRIS)', amount: 'Rp 35.000', status: 'Selesai', actionNote: 'Terverifikasi Auto' }
  ];

  const pendingServices = [
    { id: 1, title: 'Jasa Desain Poster & PPT', author: 'Oleh: Arief S. (DKV Unesp)', colorBg: 'bg-amber-400' },
    { id: 2, title: 'Jasa Olah Data SPSS', author: 'Oleh: Maya R. (Statistika UB)', colorBg: 'bg-blue-500' }
  ];

  const recentUsers = [
    { id: 1, initials: 'AP', name: 'Andi Pratama', info: 'Informatika UI • 12 Jasa Terjual', status: 'Terverifikasi', verified: true },
    { id: 2, initials: 'RH', name: 'Rian Hidayat', info: 'Teknik UB • Pendaftaran Baru', status: 'Cek KTM / IPK', verified: false }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="dashboard"
      pendingServiceCount={pendingServiceCount}
      title="Dashboard Overview"
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      notifications={notifications}
      setNotifications={setNotifications}
      notificationRef={notificationRef}
      onNavigateDashboard={onNavigateDashboard}
      onNavigateTransactionVerification={onNavigateTransactionVerification}
      onNavigateServiceModeration={onNavigateServiceModeration}
      onNavigateUserManagement={onNavigateUserManagement}
      onNavigateSettings={onNavigateSettings}
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        {/* STAT CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Omset Platform" value="Rp 12.450.000" badgeText="↑ +12.5%" />
          <StatCard 
            title="Perlu Verifikasi Transaksi" 
            value="8 Pesanan" 
            badgeText="Butuh Aksi" 
            badgeBg="bg-[#EAB308] text-white" 
            cardBg="bg-[#FEF9C3]" 
            borderColor="border-yellow-200/80" 
            titleColor="text-amber-800" 
            valueColor="text-amber-950" 
          />
          <StatCard title="Mahasiswa Terdaftar" value="142 User" badgeText="+5 Minggu ini" badgeBg="bg-blue-100 text-blue-600" />
        </div>

        {/* UTAMA: TABEL TRANSAKSI & PERSETUJUAN JASA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TransactionTable 
            transactions={transactions} 
            onNavigateTransactionVerification={onNavigateTransactionVerification} 
          />
          <PendingServiceList 
            pendingServices={pendingServices} 
            onNavigateServiceModeration={onNavigateServiceModeration} 
          />
        </div>

        {/* RECENT ACTIVITY */}
        <RecentActivity recentUsers={recentUsers} onNavigateUserManagement={onNavigateUserManagement} />
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;