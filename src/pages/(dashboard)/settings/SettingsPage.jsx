import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import ProfileForm from './components/ProfileForm';
import SecurityForm from './components/SecurityForm';

const SettingsPage = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onNavigateDashboard = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
 
  const [profile, setProfile] = useState({
    name: 'Super Admin',
    email: 'admin@jasa.id',
    phone: '+62 812-3456-7890',
    role: 'Super Administrator (Full Access)',
    avatarUrl: null
  });

  const [platformFee, setPlatformFee] = useState('10%');
  const [minWithdraw, setMinWithdraw] = useState('Rp 50.000');

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Sistem', desc: 'Pengaturan platform berhasil diperbarui.', time: '10 mnt lalu', unread: true },
    { id: 2, title: 'Keamanan', desc: 'Sesi login admin baru dideteksi.', time: '1 jam lalu', unread: true },
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="settings"
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
      <div className="p-8">
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
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="relative mb-4">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-slate-50" />
                ) : (
                  <div className="w-28 h-28 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                    AD
                  </div>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{profile.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{profile.email}</p>
              <p className="text-xs font-medium text-slate-500 mt-1">{profile.role}</p>

              <button
                onClick={() => setActiveTab('edit-profile')}
                className="mt-6 w-full py-3 bg-[#F1F5F9] hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition-all cursor-pointer"
              >
                Edit Profil & Ubah Password
              </button>
            </div>

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

                <button className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer mt-2">
                  Simpan
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Log Aktivitas Admin Terakhir
                </h3>

                <div className="space-y-4 border-l-2 border-slate-100 ml-2 pl-4">
                  <div className="relative">
                    <span className="w-2.5 h-2.5 bg-slate-300 rounded-full absolute -left-5 top-1"></span>
                    <p className="text-xs font-semibold text-slate-500">Hari ini, 10:45</p>
                    <p className="text-xs text-slate-700 mt-0.5">Menyetujui pencairan dana #TRX-8820.</p>
                  </div>

                  <div className="relative">
                    <span className="w-2.5 h-2.5 bg-slate-300 rounded-full absolute -left-5 top-1"></span>
                    <p className="text-xs font-semibold text-slate-500">Hari ini, 08:12</p>
                    <p className="text-xs text-slate-700 mt-0.5">Memverifikasi akun Rian Hidayat (Teknik UB).</p>
                  </div>

                  <div className="relative">
                    <span className="w-2.5 h-2.5 bg-slate-300 rounded-full absolute -left-5 top-1"></span>
                    <p className="text-xs font-semibold text-slate-500">Kemarin, 15:30</p>
                    <p className="text-xs text-slate-700 mt-0.5">Menyetujui "Jasa Olah Data SPSS".</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edit-profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <ProfileForm profile={profile} setProfile={setProfile} />
            <SecurityForm passwords={passwords} setPasswords={setPasswords} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;