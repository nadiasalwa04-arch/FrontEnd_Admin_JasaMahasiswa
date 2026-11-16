import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import ProfileForm from './components/ProfileForm';
import SecurityForm from './components/SecurityForm';

const SettingsPage = ({
  isSidebarOpen,
  setIsSidebarOpen,
  pendingServiceCount = 0,
  onNavigateDashboard = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  
  const savedAdmin = JSON.parse(localStorage.getItem('adminData') || '{"nama":"Super Admin","email":"admin@jasa.id"}');

  const [profile, setProfile] = useState({
    name: savedAdmin.nama || 'Super Admin',
    email: savedAdmin.email || 'admin@jasa.id',
    phone: '+62 812-3456-7890',
    role: 'Super Administrator (Full Access)',
    avatarUrl: null
  });

  const [platformFee, setPlatformFee] = useState('10%');
  const [minWithdraw, setMinWithdraw] = useState('Rp 50.000');
  const [adminLogs, setAdminLogs] = useState([]);

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  // State Pop-up Notifikasi
  const [popupMessage, setPopupMessage] = useState('');

  const triggerPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(''), 3500);
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  // 1. Tarik Data Pengaturan & Log dari Database saat dibuka
  const fetchSettingsAndLogs = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        const settingsArr = result.data.settings || [];
        const feeObj = settingsArr.find(s => s.setting_key === 'platform_fee_percent');
const minObj = settingsArr.find(s => s.setting_key === 'min_withdrawal');

        if (feeObj) setPlatformFee(`${feeObj.setting_value}%`);
        if (minObj) setMinWithdraw(`Rp ${Number(minObj.setting_value).toLocaleString('id-ID')}`);
        if (result.data.logs) setAdminLogs(result.data.logs);
      }

      if (result.data.admin) {
  setProfile(prev => ({
    ...prev,
    name: result.data.admin.nama || prev.name,
    email: result.data.admin.email || prev.email,
    phone: result.data.admin.no_hp || prev.phone,
    avatarUrl: result.data.admin.avatar_url || prev.avatarUrl
  }));
}

    } catch (error) {
      console.error('Gagal mengambil pengaturan:', error);
    }
  };

  useEffect(() => {
    fetchSettingsAndLogs();

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. Simpan Pengaturan Platform (Fee & Min Pencairan)
  const handleSavePlatformSettings = async () => {
    const token = localStorage.getItem('adminToken');
    const cleanFee = String(platformFee).replace(/[^0-9]/g, '');
    const cleanMin = String(minWithdraw).replace(/[^0-9]/g, '');

    try {
      const response = await fetch('http://localhost:3000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform_fee: cleanFee,
          min_withdrawal: cleanMin
        })
      });
      const result = await response.json();
      if (result.success) {
        triggerPopup('Pengaturan platform berhasil disimpan ke database!');
        fetchSettingsAndLogs();
      } else {
        alert('Gagal menyimpan: ' + result.message);
      }
    } catch (error) {
      console.error('Error simpan pengaturan:', error);
    }
  };

  // 3. Simpan Profil & Password ke Backend
  const handleSaveProfileToApi = async (isPasswordUpdate = false) => {
    if (isPasswordUpdate) {
      if (!passwords.newPass || passwords.newPass !== passwords.confirmPass) {
        alert('Password baru dan konfirmasi password tidak sama!');
        return;
      }
    }

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://localhost:3000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
  nama: profile.name,
  email: profile.email,
  no_hp: profile.phone,
  avatar_url: profile.avatarUrl,
  new_password: isPasswordUpdate ? passwords.newPass : ''
})
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('adminData', JSON.stringify({ ...savedAdmin, nama: profile.name, email: profile.email }));
        if (isPasswordUpdate) {
          setPasswords({ current: '', newPass: '', confirmPass: '' });
          triggerPopup('Password Super Admin berhasil diperbarui!');
        } else {
          triggerPopup('Data profil admin berhasil disimpan!');
        }
        fetchSettingsAndLogs();
      }
    } catch (error) {
      console.error('Error simpan profil:', error);
    }
  };

  // 4. Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.href = '/login';
  };

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="settings"
      pendingServiceCount={pendingServiceCount}
      title={activeTab === 'settings' ? 'Pengaturan Akun & Sistem' : 'Edit Profil & Ubah Password'}
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
      {/* POP-UP NOTIFIKASI HIJAU */}
      {popupMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{popupMessage}</span>
        </div>
      )}

      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        {activeTab === 'edit-profile' && (
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-semibold mb-6 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Pengaturan</span>
          </button>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* KARTU PROFIL + TOMBOL EDIT & LOGOUT */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="relative mb-4">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-slate-50" />
                ) : (
                  <div className="w-28 h-28 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                    {profile.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{profile.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{profile.email}</p>
              <p className="text-xs font-medium text-slate-500 mt-1">{profile.role}</p>

              <div className="w-full mt-6 space-y-3">
                <button
                  onClick={() => setActiveTab('edit-profile')}
                  className="w-full py-3 bg-[#F1F5F9] hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Edit Profil & Ubah Password
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>

            {/* KANAN: PENGATURAN PLATFORM & LOG */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pengaturan Platform</h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Biaya Layanan (Platform Fee)</label>
                    <input
                      type="text"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Batas Minimal Pencairan</label>
                    <input
                      type="text"
                      value={minWithdraw}
                      onChange={(e) => setMinWithdraw(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSavePlatformSettings}
                  className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer mt-2"
                >
                  Simpan
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Log Aktivitas Admin Terakhir
                </h3>

                <div className="space-y-4 border-l-2 border-slate-100 ml-2 pl-4">
                  {adminLogs.length > 0 ? adminLogs.map((log, idx) => (
                    <div key={idx} className="relative">
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute -left-5 top-1"></span>
                      <p className="text-xs font-semibold text-slate-500">
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-slate-700 mt-0.5">{log.action || log.aktivitas}</p>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-400">Belum ada log aktivitas baru.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edit-profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <ProfileForm 
              profile={profile} 
              setProfile={setProfile} 
              onSave={() => handleSaveProfileToApi(false)} 
            />
            <SecurityForm 
              passwords={passwords} 
              setPasswords={setPasswords} 
              onSave={() => handleSaveProfileToApi(true)} 
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;