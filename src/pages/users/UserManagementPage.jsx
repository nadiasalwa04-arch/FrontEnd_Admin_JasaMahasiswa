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
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Verifikasi KTM Baru', desc: 'Budi Setiawan mengunggah KTM untuk verifikasi.', time: '15 mnt lalu', unread: true },
  ]);

  // Data Pengguna sesuai desain
  const [users, setUsers] = useState([
    {
      id: 1,
      initials: 'AP',
      name: 'Andi Pratama',
      email: 'andi@ui.ac.id',
      institution: 'Informatika UI',
      campusHeader: 'UNIVERSITAS INDONESIA',
      nim: '22060129301',
      faculty: 'Fakultas Ilmu Komputer',
      major: 'S1 Informatika',
      phone: '+62 812-3456-7890',
      role: 'Penyedia Jasa',
      status: 'Ditolak',
      uploadedAt: '06 Oktober 2026, 09:15 WIB',
      note: ''
    },
    {
      id: 2,
      initials: 'BS',
      name: 'Budi Setiawan',
      email: 'budi@ub.ac.id',
      institution: 'Desain Grafis UB',
      campusHeader: 'UNIVERSITAS BRAWIJAYA',
      nim: '215150400111023',
      faculty: 'Fakultas Ilmu Komputer',
      major: 'Desain Grafis',
      phone: '+62 813-9876-5432',
      role: 'Klien',
      status: 'Pending',
      uploadedAt: '08 Oktober 2026, 14:20 WIB',
      note: ''
    },
    {
      id: 3,
      initials: 'R',
      name: 'Rina Wijaya',
      email: 'rina@gmail.com',
      institution: 'Umum / Non-Mahasiswa',
      campusHeader: '-',
      nim: '-',
      faculty: '-',
      major: '-',
      phone: '+62 857-1122-3344',
      role: 'Klien Umum',
      status: 'Aktif',
      uploadedAt: '-',
      note: ''
    },
    {
      id: 4,
      initials: 'JG',
      name: 'Jillsya Ginta',
      email: 'jillsyaginta@ub.ac.id',
      institution: 'Teknologi Informasi UB',
      campusHeader: 'UNIVERSITAS BRAWIJAYA',
      nim: '225150707111045',
      faculty: 'Fakultas Ilmu Komputer',
      major: 'Teknologi Informasi',
      phone: '+62 821-4455-6677',
      role: 'Penyedia Jasa',
      status: 'Terverifikasi',
      uploadedAt: '05 Oktober 2026, 11:05 WIB',
      note: ''
    }
  ]);

  useEffect(() => {
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

  // Hitung perubahan dinamis untuk kartu statistik (basis awal: 85 terverifikasi, 12 pending)
  const verifiedDiff = users.filter((u) => u.status === 'Terverifikasi').length - 1;
  const pendingDiff = users.filter((u) => u.status === 'Pending').length - 1;

  const totalVerifiedDisplay = 85 + verifiedDiff;
  const totalPendingDisplay = 12 + pendingDiff;

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
          /* HALAMAN DETAIL / CEK DOKUMEN KTM */
          <KtmVerifyModal
            selectedUser={selectedUser}
            onBack={() => setSelectedUser(null)}
            onUpdateUser={handleUpdateUser}
          />
        ) : (
          /* HALAMAN UTAMA MANAJEMEN USER */
          <>
            {/* BARIS PENCARIAN & FILTER ROLE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Manajemen User
              </h1>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Input Search */}
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

                {/* Dropdown Filter Peran */}
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

            {/* 3 KARTU STATISTIK DINAMIS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-2">Total Pengguna</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">142 User</div>
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