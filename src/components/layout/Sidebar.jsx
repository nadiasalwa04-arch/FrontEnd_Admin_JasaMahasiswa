import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  ShieldCheck, 
  Users, 
  PanelLeftClose,
  X
} from 'lucide-react';

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeMenu,
  pendingServiceCount = 0,
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const [adminProfile, setAdminProfile] = useState({
    nama: 'Super Admin',
    email: 'admin@jasa.id',
    avatar_url: null
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    fetch('http://localhost:3000/api/admin/settings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.admin) {
          setAdminProfile({
            nama: res.data.admin.nama || 'Super Admin',
            email: res.data.admin.email || 'admin@jasa.id',
            avatar_url: res.data.admin.avatar_url || null
          });
        }
      })
      .catch((err) => console.error('Gagal memuat profil admin di sidebar:', err));
  }, [activeMenu]);

  const adminInitials = (adminProfile.nama || 'AD')
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const avatarSrc = adminProfile.avatar_url
    ? adminProfile.avatar_url.startsWith('http')
      ? adminProfile.avatar_url
      : `http://localhost:3000${adminProfile.avatar_url}`
    : null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, onClick: onNavigateDashboard },
    { id: 'verifikasi', label: 'Verifikasi Transaksi', icon: FileCheck2, onClick: onNavigateTransactionVerification },
    { 
      id: 'moderasi', 
      label: 'Moderasi Jasa', 
      icon: ShieldCheck, 
      onClick: onNavigateServiceModeration, 
      badge: pendingServiceCount > 0 ? pendingServiceCount : null 
    },
    { id: 'user-management', label: 'Manajemen User', icon: Users, onClick: onNavigateUserManagement },
  ];

  return (
    <>
      {/* BACKDROP GELAP MOBILE SAAT SIDEBAR TERBUKA */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR UTAMA */}
      <aside 
        className={`bg-white border-r border-slate-100 flex flex-col justify-between p-4 transition-all duration-300 ease-in-out shrink-0 select-none overflow-hidden
          fixed md:relative inset-y-0 left-0 z-50 h-full
          ${
            isSidebarOpen 
              ? 'translate-x-0 w-64 shadow-2xl md:shadow-none' 
              : '-translate-x-full md:translate-x-0 md:w-20'
          }`}
      >
        <div className="space-y-6">
          {/* HEADER LOGO & TOGGLE */}
          <div className="flex items-center justify-between pb-2 h-10">
            <div 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="flex items-center gap-3 cursor-pointer group"
              title={!isSidebarOpen ? 'Buka Sidebar' : ''}
            >
              <div className="w-10 h-10 bg-[#2563EB] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
                </svg>
              </div>

              {isSidebarOpen && (
                <div className="overflow-hidden whitespace-nowrap transition-opacity duration-300">
                  <h1 className="font-black text-slate-900 text-sm tracking-tight leading-none">Jasa</h1>
                  <span className="font-extrabold text-[#2563EB] text-xs">Mahasiswa</span>
                </div>
              )}
            </div>

            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
                title="Sembunyikan Sidebar"
              >
                <PanelLeftClose className="w-5 h-5 hidden md:block" />
                <X className="w-5 h-5 md:hidden" />
              </button>
            )}
          </div>

          {/* NAVIGASI MENU */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-[#EFF6FF] text-[#2563EB]' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  } ${!isSidebarOpen ? 'md:justify-center md:px-0 relative' : ''}`}
                  title={!isSidebarOpen ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                  
                  {isSidebarOpen && (
                    <span className="truncate flex-1 text-left transition-opacity duration-300">{item.label}</span>
                  )}

                  {item.badge && (
                    isSidebarOpen ? (
                      <span className="px-2 py-0.5 bg-amber-400 text-amber-950 font-black text-[10px] rounded-full shrink-0">
                        {item.badge}
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
                    )
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* PROFIL ADMIN SINKRON */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              onNavigateSettings();
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
              activeMenu === 'settings' 
                ? 'bg-[#EFF6FF] border-blue-200 text-[#2563EB]' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700'
            } ${!isSidebarOpen ? 'md:justify-center md:px-0 md:border-transparent md:bg-transparent' : ''}`}
            title="Pengaturan Profil"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={adminProfile.nama}
                className="w-9 h-9 rounded-full object-cover shrink-0 shadow-xs border border-slate-200"
              />
            ) : (
              <div className="w-9 h-9 bg-[#0F172A] rounded-full flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-xs">
                {adminInitials}
              </div>
            )}

            {isSidebarOpen && (
              <div className="overflow-hidden whitespace-nowrap text-left flex-1 transition-opacity duration-300">
                <h4 className="font-extrabold text-xs text-slate-900 truncate">{adminProfile.nama}</h4>
                <span className="text-[10px] text-slate-400 truncate block">{adminProfile.email}</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;