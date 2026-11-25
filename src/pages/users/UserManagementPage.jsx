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
    },
    {
      id: 5,
      initials: 'MR',
      name: 'Maya Rahmawati',
      email: 'maya.r@student.ub.ac.id',
      institution: 'Statistika UB',
      campusHeader: 'UNIVERSITAS BRAWIJAYA',
      nim: '225090500111012',
      faculty: 'Fakultas MIPA',
      major: 'S1 Statistika',
      phone: '+62 812-9988-7766',
      role: 'Penyedia Jasa',
      status: 'Pending',
      uploadedAt: '09 Oktober 2026, 10:30 WIB',
      note: ''
    },
    {
      id: 6,
      initials: 'DF',
      name: 'Dimas Febrian',
      email: 'dimas.f@student.itb.ac.id',
      institution: 'Teknik Elektro ITB',
      campusHeader: 'INSTITUT TEKNOLOGI BANDUNG',
      nim: '13221045',
      faculty: 'STEI',
      major: 'Teknik Elektro',
      phone: '+62 856-3322-1100',
      role: 'Penyedia Jasa',
      status: 'Terverifikasi',
      uploadedAt: '04 Oktober 2026, 16:45 WIB',
      note: ''
    },
    {
      id: 7,
      initials: 'SN',
      name: 'Siti Nurhaliza',
      email: 'siti.nur@yahoo.com',
      institution: 'Umum / Non-Mahasiswa',
      campusHeader: '-',
      nim: '-',
      faculty: '-',
      major: '-',
      phone: '+62 878-5544-3322',
      role: 'Klien Umum',
      status: 'Aktif',
      uploadedAt: '-',
      note: ''
    },
    {
      id: 8,
      initials: 'FA',
      name: 'Fajar Nugroho',
      email: 'fajar.n@student.ugm.ac.id',
      institution: 'Ilmu Komputer UGM',
      campusHeader: 'UNIVERSITAS GADJAH MADA',
      nim: '21/478910/PA/20789',
      faculty: 'FMIPA',
      major: 'Ilmu Komputer',
      phone: '+62 819-7766-5544',
      role: 'Klien',
      status: 'Ditolak',
      uploadedAt: '07 Oktober 2026, 08:50 WIB',
      note: 'Foto KTM terpotong pada bagian NIM.'
    }
  ]);

  useEffect(() => {
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
  const countPending = baseFilteredUsers.filter((u) => u.status === 'Pending' || u.status === 'Unggah Ulang').length;
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

  const verifiedDiff = users.filter((u) => u.status === 'Terverifikasi').length - 2;
  const pendingDiff = users.filter((u) => u.status === 'Pending').length - 2;
  const totalVerifiedDisplay = 85 + verifiedDiff;
  const totalPendingDisplay = 12 + pendingDiff;

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

            {/* 3 KARTU STATISTIK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block mb-2">Total Pengguna</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">120 User</div>
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