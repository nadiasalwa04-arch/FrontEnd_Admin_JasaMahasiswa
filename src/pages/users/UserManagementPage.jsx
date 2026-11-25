import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import UserTable from './components/UserTable';
import KtmVerifyModal from './components/KtmVerifyModal';

const ROLE_OPTIONS = [
  { value: 'ALL', label: 'Semua Peran (Mahasiswa/Klien)' },
  { value: 'Penyedia Jasa', label: 'Penyedia Jasa' },
  { value: 'Klien', label: 'Klien' },
  { value: 'Klien Umum', label: 'Klien Umum' },
];

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
  const [statusTab, setStatusTab] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedUser, setSelectedUser] = useState(null);

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Verifikasi KTM Baru', desc: 'Budi Setiawan mengunggah KTM untuk verifikasi.', time: '15 mnt lalu', unread: true },
  ]);

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
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusTab]);

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

  const baseFilteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(query) ||
      user.institution.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  const countAll = baseFilteredUsers.length;
  const countPending = baseFilteredUsers.filter(
    (u) => u.status === 'Pending' || u.status === 'Unggah Ulang'
  ).length;
  const countVerified = baseFilteredUsers.filter((u) => u.status === 'Terverifikasi').length;
  const countActive = baseFilteredUsers.filter((u) => u.status === 'Aktif').length;
  const countRejected = baseFilteredUsers.filter((u) => u.status === 'Ditolak').length;

  const finalFilteredUsers = baseFilteredUsers.filter((user) => {
    if (statusTab === 'ALL') return true;
    if (statusTab === 'Pending') return user.status === 'Pending' || user.status === 'Unggah Ulang';
    return user.status === statusTab;
  });

  const totalPages = Math.max(1, Math.ceil(finalFilteredUsers.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = finalFilteredUsers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const selectedRoleLabel =
    ROLE_OPTIONS.find((opt) => opt.value === roleFilter)?.label || 'Semua Peran';

  const detailTitle = selectedUser
    ? selectedUser.role === 'Klien Umum'
      ? 'Edit / Detail Pengguna'
      : 'Cek Dokumen KTM'
    : 'Manajemen User';

  const statusTabs = [
    { id: 'ALL', label: `Semua (${countAll})` },
    { id: 'Pending', label: `Pending (${countPending})` },
    { id: 'Terverifikasi', label: `Terverifikasi (${countVerified})` },
    { id: 'Aktif', label: `Aktif (${countActive})` },
    { id: 'Ditolak', label: `Ditolak (${countRejected})` },
  ];

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="user-management"
      pendingServiceCount={pendingServiceCount}
      title={detailTitle}
      breadcrumbs={
        selectedUser
          ? [
              { label: 'Manajemen User', onClick: () => setSelectedUser(null) },
              { label: detailTitle },
            ]
          : []
      }
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
        setStatusTab('ALL');
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
            {/* BARIS SUBJUDUL & SHADCN SELECT DROPDOWN (TANPA JUDUL GANDA) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs font-medium text-slate-500">
                Kelola akun penyedia jasa mahasiswa dan klien pengguna platform
              </p>

              {/* SHADCN-STYLE SELECT DROPDOWN */}
              <div className="relative w-full sm:w-64" ref={roleDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
                  aria-expanded={isRoleDropdownOpen}
                  className="w-full h-10 px-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 rounded-xl text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-2 outline-none"
                >
                  <span className="truncate">{selectedRoleLabel}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                      isRoleDropdownOpen ? 'rotate-180 text-[#2563EB]' : ''
                    }`}
                  />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-full bg-white border border-slate-200/90 rounded-xl shadow-lg shadow-slate-200/60 p-1 z-40">
                    {ROLE_OPTIONS.map((option) => {
                      const isSelected = roleFilter === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setRoleFilter(option.value);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-slate-100 text-slate-900 font-extrabold'
                              : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{option.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
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
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalVerifiedDisplay} User</div>
              </div>

              <div className="bg-[#FEF3C7]/80 border border-amber-200/90 p-6 rounded-2xl shadow-xs relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900">Menunggu Verifikasi KTM</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-950">{totalPendingDisplay} User</div>
              </div>
            </div>

            {/* KONTAINER TAB KATEGORI STATUS + TABEL + PAGINATION */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-5">
              <div className="flex border-b border-slate-100 gap-6 sm:gap-8 overflow-x-auto">
                {statusTabs.map((tab) => {
                  const isActive = statusTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStatusTab(tab.id)}
                      className={`pb-3 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap relative ${
                        isActive
                          ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <UserTable
                users={paginatedUsers}
                onSelectUser={(user) => setSelectedUser(user)}
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                totalItems={finalFilteredUsers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;