import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'VERIFIED' | 'PENDING' | 'SUSPENDED'

  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'KTM' | 'SUSPEND' | null

  // Header Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Verifikasi KTM Baru', desc: 'Rian H. mengunggah KTM untuk verifikasi.', time: '15 mnt lalu', unread: true },
  ]);

  // Data Dummy User Mahasiswa
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Andi Pratama',
      initials: 'AP',
      email: 'andi.p@student.ui.ac.id',
      univ: 'Universitas Indonesia',
      major: 'Informatika',
      joinedAt: '12 Jan 2026',
      status: 'VERIFIED'
    },
    {
      id: 2,
      name: 'Rian Hidayat',
      initials: 'RH',
      email: 'rian.h@student.ub.ac.id',
      univ: 'Universitas Brawijaya',
      major: 'Teknik Mesin',
      joinedAt: 'Kemarin, 14:20 WIB',
      status: 'PENDING'
    },
    {
      id: 3,
      name: 'Arief Setiawan',
      initials: 'AS',
      email: 'arief.s@student.unesa.ac.id',
      univ: 'Universitas Negeri Semarang',
      major: 'DKV',
      joinedAt: '05 Mar 2026',
      status: 'VERIFIED'
    },
    {
      id: 4,
      name: 'Budi Setiawan',
      initials: 'BS',
      email: 'budi.s@student.ui.ac.id',
      univ: 'Universitas Indonesia',
      major: 'Sistem Informasi',
      joinedAt: '10 Feb 2026',
      status: 'SUSPENDED'
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

  const handleOpenKtmModal = (user) => {
    setSelectedUser(user);
    setModalType('KTM');
  };

  const handleOpenSuspendModal = (user) => {
    setSelectedUser(user);
    setModalType('SUSPEND');
  };

  const handleApproveKTM = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: 'VERIFIED' } : u));
    setModalType(null);
    setSelectedUser(null);
  };

  const handleConfirmSuspend = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => {
      if (u.id === selectedUser.id) {
        const nextStatus = u.status === 'SUSPENDED' ? 'VERIFIED' : 'SUSPENDED';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    setModalType(null);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'ALL' || user.status === activeTab;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.univ.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingVerificationCount = users.filter(u => u.status === 'PENDING').length;

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="user-management"
      pendingServiceCount={pendingServiceCount}
      title="Manajemen User Mahasiswa"
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
        {/* STATS HEADER CARDS RESPONSIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#FEF9C3]/80 border border-yellow-200 p-5 rounded-3xl shadow-xs flex justify-between items-start">
            <div>
              <span className="text-xs font-extrabold text-amber-900 block mb-1">Perlu Verifikasi KTM</span>
              <div className="text-2xl md:text-3xl font-black text-amber-900">{pendingVerificationCount} Mahasiswa</div>
            </div>
            <span className="px-2.5 py-1 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-xl shrink-0">Butuh Aksi</span>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
            <span className="text-xs font-bold text-slate-400 block mb-1">Total Mahasiswa Aktif</span>
            <div className="text-2xl md:text-3xl font-black text-slate-900">
              {users.filter(u => u.status === 'VERIFIED').length} User
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-slate-400 block mb-1">Akun Ditangguhkan</span>
            <div className="text-2xl md:text-3xl font-black text-red-600">
              {users.filter(u => u.status === 'SUSPENDED').length} User
            </div>
          </div>
        </div>

        {/* CONTAINER UTAMA TABEL */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-6">
          
          {/* TAB FILTER (SCROLLABLE ON MOBILE) */}
          <div className="flex border-b border-slate-100 gap-4 sm:gap-8 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'Semua User' },
              { id: 'VERIFIED', label: 'Terverifikasi' },
              { id: 'PENDING', label: `Perlu Verifikasi (${pendingVerificationCount})` },
              { id: 'SUSPENDED', label: 'Ditangguhkan' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-extrabold whitespace-nowrap transition-all cursor-pointer relative ${
                  activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SUB-KOMPONEN USERTABLE */}
          {filteredUsers.length > 0 ? (
            <UserTable 
              users={filteredUsers}
              handleOpenKtmModal={handleOpenKtmModal}
              handleOpenSuspendModal={handleOpenSuspendModal}
            />
          ) : (
            <div className="py-12 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Tidak ada user ditemukan</h4>
            </div>
          )}
        </div>
      </div>

      {/* SUB-KOMPONEN MODAL VERIFIKASI KTM */}
      {modalType === 'KTM' && selectedUser && (
        <KtmVerifyModal
          selectedUser={selectedUser}
          onClose={() => {
            setModalType(null);
            setSelectedUser(null);
          }}
          onApprove={handleApproveKTM}
          onOpenSuspend={() => setModalType('SUSPEND')}
        />
      )}

      {/* MODAL SUSPEND / AKTIFKAN AKUN */}
      {modalType === 'SUSPEND' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                selectedUser.status === 'SUSPENDED' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}>
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {selectedUser.status === 'SUSPENDED' ? 'Aktifkan Kembali Akun?' : 'Tangguhkan Akun User?'}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedUser.status === 'SUSPENDED'
                  ? `Akun ${selectedUser.name} akan diaktifkan kembali dan dapat bertransaksi.`
                  : `User ${selectedUser.name} tidak akan dapat login atau menawarkan jasa sampai penangguhan dicabut.`}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalType(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSuspend}
                className={`flex-1 py-2.5 text-white font-bold text-xs rounded-xl cursor-pointer transition-all ${
                  selectedUser.status === 'SUSPENDED' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20' 
                    : 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20'
                }`}
              >
                {selectedUser.status === 'SUSPENDED' ? 'Ya, Aktifkan' : 'Ya, Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagementPage;