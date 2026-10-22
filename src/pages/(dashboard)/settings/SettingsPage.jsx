import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap, LayoutDashboard, FileCheck2, ShieldCheck,
  Users, Bell, ArrowLeft, Upload, Lock, Info, Eye, EyeOff, Clock
} from 'lucide-react';

const SettingsPage = ({
  onNavigateDashboard = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('settings');
  const [activeMenu, setActiveMenu] = useState('settings');
 
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

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Sistem', desc: 'Pengaturan platform berhasil diperbarui.', time: '10 mnt lalu', unread: true },
    { id: 2, title: 'Keamanan', desc: 'Sesi login admin baru dideteksi.', time: '1 jam lalu', unread: true },
  ]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuKey) => {
    setActiveMenu(menuKey);
    if (menuKey === 'dashboard') onNavigateDashboard();
    else if (menuKey === 'verifikasi') onNavigateTransactionVerification();
    else if (menuKey === 'moderasi') onNavigateServiceModeration();
    else if (menuKey === 'user-management') onNavigateUserManagement();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, avatarUrl: imageUrl });
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'verifikasi', label: 'Verifikasi Transaksi', icon: FileCheck2 },
    { key: 'moderasi', label: 'Moderasi Jasa', icon: ShieldCheck, badge: 1 },
    { key: 'user-management', label: 'Manajemen User', icon: Users },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden font-sans select-none relative">
      {/* SIDEBAR TERTANAM */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-5 z-20 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-base text-slate-900 tracking-tight">Jasa</span>
              <span className="font-bold text-base text-[#2563EB] tracking-tight">Mahasiswa</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleMenuClick(key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeMenu === key ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={onNavigateSettings}
          className="pt-4 border-t border-slate-100 flex items-center gap-3 px-2 w-full text-left bg-slate-50 p-2 rounded-xl transition-all cursor-pointer hover:bg-slate-100"
        >
          <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            AD
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-slate-800 truncate">Super Admin</span>
            <span className="text-[11px] text-slate-400 truncate">admin@jasa.id</span>
          </div>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC]">
        <header className="sticky top-0 z-10 bg-[#F8FAFC]/90 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-slate-200/60">
          <div>
            {activeTab === 'edit-profile' && (
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-semibold mb-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Pengaturan</span>
              </button>
            )}
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'settings' ? 'Pengaturan Akun & Sistem' : 'Edit Profil & Ubah Password'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <h4 className="text-xs font-bold text-slate-800">Notifikasi Sistem</h4>
                    <span onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))} className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">
                      Tandai dibaca
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2.5 rounded-xl text-xs border ${n.unread ? 'bg-blue-50/60 border-blue-100/50' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-slate-700 font-medium leading-snug">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> {n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>System Active</span>
            </div>
          </div>
        </header>

        <div className="p-8">
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
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Data Profil Admin</h3>
                  <p className="text-xs text-slate-400">Perbarui foto profil dan informasi data diri akun Anda.</p>
                </div>

                <div className="flex items-center gap-4 py-2 border-b border-slate-100 pb-5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
                      AD
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-[#F1F5F9] hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Foto</span>
                    </button>
                    <span className="text-[10px] text-slate-400 mt-1 block">JPG/PNG, Max 2MB</span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Peran System</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="w-full px-4 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-xl text-xs text-slate-500 font-medium outline-none cursor-not-allowed pr-10"
                      />
                      <Lock className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                    </div>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer mt-2">
                  Simpan Profil
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Keamanan & Password</h3>
                  <p className="text-xs text-slate-400">Ganti kata sandi secara berkala untuk menjaga keamanan akun.</p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-2.5 text-blue-700">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold">Syarat Password Baru:</h4>
                    <p className="text-[11px] text-blue-600 mt-0.5">Minimal 8 karakter, kombinasi huruf kapital, huruf kecil, simbol & angka.</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Password Saat Ini</label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Password Baru</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        placeholder="Masukkan password baru"
                        value={passwords.newPass}
                        onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Konfirmasi Password Baru</label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        placeholder="Ulangi password baru"
                        value={passwords.confirmPass}
                        onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer mt-2">
                  Perbarui Password
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;