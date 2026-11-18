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

  const [apiStats, setApiStats] = useState({ totalUsers: 0, totalTransactions: 0, pendingKtm: 0 });
  const [dashTransactions, setDashTransactions] = useState([]);
  const [dashServices, setDashServices] = useState([]);
  const [dashUsers, setDashUsers] = useState([]);
  const [realPendingServiceCount, setRealPendingServiceCount] = useState(pendingServiceCount);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        // 1. Ambil Statistik Atas
        fetch('http://localhost:3000/api/admin/stats', { headers })
          .then(res => res.json())
          .then(res => res.success && setApiStats(res.data))
          .catch(err => console.error(err));

        // 2. Ambil Transaksi Terbaru dari tabel orders
        fetch('http://localhost:3000/api/admin/transactions', { headers })
          .then(res => res.json())
          .then(res => {
            if (res.success) {
              const mappedTrx = res.data.slice(0, 5).map(t => {
                const rawStatus = (t.status || '').toLowerCase();
                let mappedStatus = 'Pending';
                if (rawStatus === 'selesai' || rawStatus === 'completed' || rawStatus === 'approved') {
                  mappedStatus = 'Selesai';
                } else if (rawStatus === 'ditolak' || rawStatus === 'rejected' || rawStatus === 'cancelled') {
                  mappedStatus = 'Ditolak';
                }

                const nominal = Number(t.total_harga || t.harga || t.service_price || t.total_price || t.amount || 0);

                return {
                  id: `#TRX-${t.id}`,
                  desc: t.service_title || t.deskripsi_transaksi || 'Pesanan Jasa Mahasiswa',
                  amount: `Rp ${nominal.toLocaleString('id-ID')}`,
                  status: mappedStatus,
                  actionable: mappedStatus === 'Pending',
                  actionNote: mappedStatus === 'Selesai' ? 'Terverifikasi Auto' : (mappedStatus === 'Ditolak' ? 'Telah ditolak' : '')
                };
              });
              setDashTransactions(mappedTrx);
            }
          })
          .catch(err => console.error(err));

        // 3. Ambil Jasa Pending (status 'ditinjau' atau 'pending')
        fetch('http://localhost:3000/api/admin/services', { headers })
          .then(res => res.json())
          .then(res => {
            if (res.success) {
              const pendingOnly = res.data.filter(s => {
                const st = (s.status || '').toLowerCase();
                return st === 'ditinjau' || st === 'pending';
              });
              setRealPendingServiceCount(pendingOnly.length);

              const mappedSvc = pendingOnly.slice(0, 3).map((s, index) => ({
                id: s.id,
                title: s.judul || s.title || 'Layanan Jasa',
                author: `Oleh: ${s.seller_name || 'Mahasiswa'}`,
                colorBg: index % 2 === 0 ? 'bg-amber-400' : 'bg-blue-500'
              }));
              setDashServices(mappedSvc);
            }
          })
          .catch(err => console.error(err));

        // 4. Ambil User Terbaru
        fetch('http://localhost:3000/api/admin/users', { headers })
          .then(res => res.json())
          .then(res => {
            if (res.success) {
              const mappedUsers = res.data.slice(-5).reverse().map(u => ({
                id: u.id,
                initials: (u.nama || 'US').substring(0, 2).toUpperCase(),
                name: u.nama,
                info: u.email,
                status: u.ktm_status === 'disetujui' ? 'Terverifikasi' : 'Cek KTM / IPK',
                verified: u.ktm_status === 'disetujui'
              }));
              setDashUsers(mappedUsers);
            }
          })
          .catch(err => console.error(err));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchAllDashboardData();

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
      pendingServiceCount={realPendingServiceCount}
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
          <StatCard
            title="Total Transaksi"
            value={apiStats.totalTransactions}
            badgeText="Real-time Data"
          />
          <StatCard
            title="Menunggu Verifikasi KTM"
            value={`${apiStats.pendingKtm} Mahasiswa`}
            badgeText="Butuh Aksi"
            badgeBg="bg-[#EAB308] text-white"
            cardBg="bg-[#FEF9C3]"
            borderColor="border-yellow-200/80"
            titleColor="text-amber-800"
            valueColor="text-amber-950"
          />
          <StatCard
            title="Mahasiswa Terdaftar"
            value={`${apiStats.totalUsers} User`}
            badgeText="Diperbarui"
            badgeBg="bg-blue-100 text-blue-600"
          />
        </div>

        {/* UTAMA: TABEL TRANSAKSI & PERSETUJUAN JASA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TransactionTable
            transactions={dashTransactions}
            onNavigateTransactionVerification={onNavigateTransactionVerification}
          />
          <PendingServiceList
            pendingServices={dashServices}
            onNavigateServiceModeration={onNavigateServiceModeration}
          />
        </div>

        {/* RECENT ACTIVITY (Manajemen User Terbaru) */}
        <RecentActivity
          recentUsers={dashUsers}
          totalUsers={apiStats.totalUsers}
          onNavigateUserManagement={onNavigateUserManagement}
        />
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;