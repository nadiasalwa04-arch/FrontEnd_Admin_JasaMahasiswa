import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import UserTable from './components/UserTable';
import KtmVerifyModal from './components/KtmVerifyModal';

const UserManagementPage = ({
  isSidebarOpen,
  setIsSidebarOpen,
  pendingServiceCount = 0,
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  // STATE DATA PENGGUNA DARI DATABASE
  const [users, setUsers] = useState([]);

  const mapKtmStatusToUi = (ktmStatus, role) => {
    if (role === 'umum' || role === 'klien_umum') return 'Aktif';
    const st = (ktmStatus || '').toLowerCase();
    if (st === 'disetujui' || st === 'terverifikasi') return 'Terverifikasi';
    if (st === 'ditolak') return 'Ditolak';
    if (st === 'unggah_ulang' || st === 'unggah ulang') return 'Unggah Ulang';
    return 'Pending';
  };

  const mapRoleToUi = (role) => {
    const r = (role || '').toLowerCase();
    if (r === 'penyedia_jasa' || r === 'seller') return 'Penyedia Jasa';
    if (r === 'umum' || r === 'klien_umum') return 'Klien Umum';
    if (r === 'klien' || r === 'buyer') return 'Klien';
    return 'Penyedia Jasa';
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const mappedUsers = result.data
          .filter((u) => (u.role || '').toLowerCase() !== 'admin')
          .map((u) => {
            const uiRole = mapRoleToUi(u.role);
            const uiStatus = mapKtmStatusToUi(u.ktm_status, u.role);
            const nama = u.nama || 'Mahasiswa';
            const initials = nama
              .split(' ')
              .slice(0, 2)
              .map((n) => n[0])
              .join('')
              .toUpperCase();

            return {
              id: u.id,
              initials: initials || 'US',
              name: nama,
              email: u.email || '-',
              institution: u.jurusan || u.universitas || u.institution || 'Universitas Brawijaya',
              campusHeader: (u.universitas || 'UNIVERSITAS BRAWIJAYA').toUpperCase(),
              nim: u.nim || '-',
              faculty: u.fakultas || 'Fakultas Vokasi',
              major: u.jurusan || 'Teknologi Informasi',
              phone: u.no_hp || u.phone || '-',
              role: uiRole,
              status: uiStatus,
              ktmUrl: u.ktm_url ? `http://localhost:3000${u.ktm_url}` : null,
              uploadedAt: u.created_at
                ? new Date(u.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })
                : '-',
              note: u.ktm_note || ''
            };
          });
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Gagal mengambil data pengguna:', error);
    }
  };

  useEffect(() => {
    fetchUsers();

    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setSelectedUser(updatedUser);
  };

  // STATISTIK REAL-TIME DARI DATABASE
  const totalUsersCount = users.length;
  const totalVerifiedDisplay = users.filter((u) => u.status === 'Terverifikasi').length;
  const totalPendingDisplay = users.filter(
    (u) => u.status === 'Pending' || u.status === 'Unggah Ulang'
  ).length;

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(query) ||
      user.institution.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="user-management"
      pendingServiceCount={pendingServiceCount}
      title={selectedUser ? 'Cek Dokumen/KTM' : 'Manajemen User'}
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
      onNavigateUserManagement={() => {
        setSelectedUser(null);
        onNavigateUserManagement();
      }}
      onNavigateSettings={onNavigateSettings}
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        {selectedUser ? (
          <KtmVerifyModal
            selectedUser={selectedUser}
            onBack={() => setSelectedUser(null)}
            onUpdateUser={handleUpdateUser}
          />
        ) : (
          <>
            {/* BARIS PENCARIAN & FILTER ROLE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Manajemen User
              </h1>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex items-center w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari nama, universitas, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#2563EB] shadow-2xs transition-all"
                  />
                </div>

                <div className="relative">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#2563EB] shadow-2xs cursor-pointer"
                  >
                    <option value="ALL">Mahasiswa/Klien</option>
                    <option value="Penyedia Jasa">Penyedia Jasa</option>
                    <option value="Klien">Klien</option>
                    <option value="Klien Umum">Klien Umum</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 3 KARTU STATISTIK REAL-TIME */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-2">Total Pengguna</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalUsersCount} User</div>
              </div>

              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-2">Mahasiswa Terverifikasi</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalVerifiedDisplay} Orang</div>
              </div>

              <div className="bg-[#FEF3C7]/80 border border-amber-200/90 p-6 rounded-2xl shadow-xs relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900">Menunggu Verifikasi KTM</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-950">{totalPendingDisplay} Orang</div>
              </div>
            </div>

            {/* TABEL PENGGUNA */}
            <UserTable
              users={filteredUsers}
              onSelectUser={(user) => setSelectedUser(user)}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;