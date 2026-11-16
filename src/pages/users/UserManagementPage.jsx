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
  const [activeTab, setActiveTab] = useState('ALL'); 

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); 

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  // 1. STATE KOSONG (Siap diisi data dari database)
  const [users, setUsers] = useState([]);

  // 2. FUNGSI MENARIK DATA USER DARI BACKEND
  const fetchUsers = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        // Memetakan data MySQL agar cocok dengan properti UI
        const mappedUsers = result.data.map(u => ({
          id: u.id,
          name: u.nama,
          initials: u.nama.substring(0, 2).toUpperCase(),
          email: u.email,
          univ: 'Universitas Brawijaya', // Placeholder
          major: 'Mahasiswa',
          joinedAt: new Date(u.created_at).toLocaleDateString('id-ID'),
          // Konversi status database ke status UI
          status: u.ktm_status === 'menunggu_verifikasi' ? 'PENDING' : 
                  u.ktm_status === 'disetujui' ? 'VERIFIED' : 'SUSPENDED'
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  // Muat data saat halaman dibuka
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

  const handleOpenKtmModal = (user) => {
    setSelectedUser(user);
    setModalType('KTM');
  };

  const handleOpenSuspendModal = (user) => {
    setSelectedUser(user);
    setModalType('SUSPEND');
  };

  // 3. FUNGSI MENYETUJUI KTM KE BACKEND
  const handleApproveKTM = async () => {
    if (!selectedUser) return;
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`http://localhost:3000/api/admin/verify-ktm/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'disetujui' })
      });
      
      const result = await response.json();
      if (result.success) {
        fetchUsers(); // Refresh tabel otomatis
        setModalType(null);
        setSelectedUser(null);
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (error) {
      console.error("Error verifikasi:", error);
    }
  };

  // 4. FUNGSI MENOLAK/MENANGGUHKAN KE BACKEND
  const handleConfirmSuspend = async () => {
    if (!selectedUser) return;
    const token = localStorage.getItem('adminToken');
    
    // Tentukan status berdasarkan posisi tombol saat ini
    const statusToSend = selectedUser.status === 'SUSPENDED' ? 'disetujui' : 'ditolak';
    const reason = statusToSend === 'ditolak' ? 'KTM tidak valid / Akun ditangguhkan admin' : null;

    try {
      const response = await fetch(`http://localhost:3000/api/admin/verify-ktm/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: statusToSend, reject_reason: reason })
      });
      
      const result = await response.json();
      if (result.success) {
        fetchUsers(); // Refresh tabel otomatis
        setModalType(null);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error suspend:", error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'ALL' || user.status === activeTab;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
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

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-6">
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
                {selectedUser.status === 'SUSPENDED' ? 'Ya, Aktifkan' : 'Ya, Tolak / Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagementPage;