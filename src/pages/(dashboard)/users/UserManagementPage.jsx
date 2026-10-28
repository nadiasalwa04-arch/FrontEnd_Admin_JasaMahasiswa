import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import UserTable from './components/UserTable';
import KtmVerifyModal from './components/KtmVerifyModal';

const UserManagementPage = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'VERIFIED' | 'PENDING' | 'SUSPENDED'
  
  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'KTM_MODAL' | 'SUSPEND_MODAL' | null
  
  // Suspend Form State
  const [suspendReason, setSuspendReason] = useState('Laporan penipuan / hasil pekerjaan tidak selesai');
  const [suspendNote, setSuspendNote] = useState('Akun ditangguhkan sementara berdasarkan laporan pembeli mengenai pesanan #TRX-8820.');

  // Notification State & Ref
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Registrasi Baru', desc: 'Rian Hidayat mengunggah KTM untuk verifikasi.', time: '10 mnt lalu', unread: true },
    { id: 2, title: 'Akun Dilaporkan', desc: 'Laporan pengguna terhadap akun Budi Setiawan.', time: '1 jam lalu', unread: true },
  ]);

  // Data Dummy User Mahasiswa
  const [users, setUsers] = useState([
    {
      id: 'USR-101',
      name: 'Andi Pratama',
      initials: 'AP',
      email: 'andi.p@student.ui.ac.id',
      univ: 'Universitas Indonesia',
      major: 'Informatika',
      status: 'VERIFIED',
      joinedAt: '12 Jan 2026',
      totalServices: 12,
      ktmUrl: '/images/ktm-sample.jpg'
    },
    {
      id: 'USR-102',
      name: 'Rian Hidayat',
      initials: 'RH',
      email: 'rian.h@student.ub.ac.id',
      univ: 'Universitas Brawijaya',
      major: 'Teknik Mesin',
      status: 'PENDING',
      joinedAt: 'Kemarin, 14:20 WIB',
      totalServices: 0,
      ktmUrl: '/images/ktm-sample.jpg'
    },
    {
      id: 'USR-103',
      name: 'Arief Setiawan',
      initials: 'AS',
      email: 'arief.s@student.unesp.ac.id',
      univ: 'Universitas Negeri Semarang',
      major: 'DKV',
      status: 'VERIFIED',
      joinedAt: '05 Mar 2026',
      totalServices: 5,
      ktmUrl: '/images/ktm-sample.jpg'
    },
    {
      id: 'USR-104',
      name: 'Budi Setiawan',
      initials: 'BS',
      email: 'budi.s@student.ui.ac.id',
      univ: 'Universitas Indonesia',
      major: 'Sistem Informasi',
      status: 'SUSPENDED',
      joinedAt: '10 Feb 2026',
      totalServices: 8,
      ktmUrl: '/images/ktm-sample.jpg'
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
    setActiveModal('KTM_MODAL');
  };

  const handleOpenSuspendModal = (user) => {
    setSelectedUser(user);
    setActiveModal('SUSPEND_MODAL');
  };

  const handleApproveUser = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: 'VERIFIED' } : u));
    setActiveModal(null);
    setSelectedUser(null);
  };

  const handleConfirmSuspend = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: 'SUSPENDED' } : u));
    setActiveModal(null);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesTab = activeTab === 'ALL' || u.status === activeTab;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.univ.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="user-management"
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
      <div className="p-8 space-y-6">
        {/* HEADER STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#EFF6FF]/80 border border-blue-200 p-6 rounded-2xl shadow-xs">
            <span className="text-xs font-extrabold text-blue-900 block mb-2">Total Mahasiswa Terdaftar</span>
            <div className="text-3xl font-black text-[#2563EB]">142 User</div>
          </div>

          <div className="bg-[#FEF9C3]/80 border border-yellow-200 p-6 rounded-2xl shadow-xs">
            <span className="text-xs font-extrabold text-amber-900 block mb-2">Perlu Verifikasi KTM</span>
            <div className="text-3xl font-black text-amber-900">5 Mahasiswa</div>
          </div>

          <div className="bg-[#FFE4E6]/80 border border-red-200 p-6 rounded-2xl shadow-xs">
            <span className="text-xs font-extrabold text-red-900 block mb-2">Akun Ditangguhkan</span>
            <div className="text-3xl font-black text-red-600">2 User</div>
          </div>
        </div>

        {/* CONTAINER TABEL USER */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex border-b border-slate-100 gap-8">
            {[
              { key: 'ALL', label: 'Semua User' },
              { key: 'VERIFIED', label: 'Terverifikasi' },
              { key: 'PENDING', label: 'Perlu Verifikasi' },
              { key: 'SUSPENDED', label: 'Ditangguhkan' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-xs font-extrabold transition-all cursor-pointer relative ${
                  activeTab === tab.key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <UserTable
            users={filteredUsers}
            handleOpenKtmModal={handleOpenKtmModal}
            handleOpenSuspendModal={handleOpenSuspendModal}
          />
        </div>
      </div>

      {/* MODAL VERIFIKASI KTM */}
      {activeModal === 'KTM_MODAL' && selectedUser && (
        <KtmVerifyModal
          selectedUser={selectedUser}
          onClose={() => setActiveModal(null)}
          onApprove={handleApproveUser}
          onOpenSuspend={() => setActiveModal('SUSPEND_MODAL')}
        />
      )}

      {/* MODAL SUSPEND AKUN */}
      {activeModal === 'SUSPEND_MODAL' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Tangguhkan Akun Mahasiswa</h3>
                <span className="text-xs text-slate-400">User: {selectedUser.name} ({selectedUser.email})</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 block">Pilih Alasan Penangguhan <span className="text-red-500">*</span></label>
              {[
                'Laporan penipuan / hasil pekerjaan tidak selesai',
                'KTM / Identitas mahasiswa tidak valid',
                'Pelanggaran syarat & ketentuan layanan',
                'Lainnya'
              ].map((reason, idx) => (
                <label key={idx} className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  suspendReason === reason ? 'border-red-400 bg-red-50/50 text-red-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="suspendReason"
                    checked={suspendReason === reason}
                    onChange={() => setSuspendReason(reason)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Catatan Penangguhan</label>
              <textarea
                rows={3}
                value={suspendNote}
                onChange={(e) => setSuspendNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-red-500 transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all">
                Batal
              </button>
              <button onClick={handleConfirmSuspend} className="px-6 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md shadow-red-500/20">
                Tangguhkan Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagementPage;