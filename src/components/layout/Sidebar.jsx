import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  ShieldCheck, 
  Users, 
  PanelLeftClose 
} from 'lucide-react';

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeMenu,
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, onClick: onNavigateDashboard },
    { id: 'verifikasi', label: 'Verifikasi Transaksi', icon: FileCheck2, onClick: onNavigateTransactionVerification },
    { id: 'moderasi', label: 'Moderasi Jasa', icon: ShieldCheck, onClick: onNavigateServiceModeration, badge: '1' },
    { id: 'user-management', label: 'Manajemen User', icon: Users, onClick: onNavigateUserManagement },
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-100 flex flex-col justify-between p-4 transition-all duration-300 ease-in-out shrink-0 select-none overflow-hidden ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="space-y-6">
        {/* HEADER LOGO & TOGGLE */}
        <div className="flex items-center justify-between pb-2 h-10">
          <div 
            onClick={() => !isSidebarOpen && setIsSidebarOpen(true)} 
            className={`flex items-center gap-3 transition-all ${
              !isSidebarOpen ? 'cursor-pointer hover:scale-105' : ''
            }`}
            title={!isSidebarOpen ? 'Buka Sidebar' : ''}
          >
            <div className="w-10 h-10 bg-[#2563EB] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
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
              <PanelLeftClose className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* LIST MENU NAVIGASI */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-[#EFF6FF] text-[#2563EB]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
                title={!isSidebarOpen ? item.label : ''}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                
                {isSidebarOpen && (
                  <span className="truncate flex-1 text-left transition-opacity duration-300">{item.label}</span>
                )}

                {isSidebarOpen && item.badge && (
                  <span className="px-2 py-0.5 bg-amber-400 text-amber-950 font-black text-[10px] rounded-full shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* FOOTER PROFIL ADMIN */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={onNavigateSettings}
          className={`w-full flex items-center gap-3 p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
            activeMenu === 'settings' 
              ? 'bg-[#EFF6FF] border-blue-200 text-[#2563EB]' 
              : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700'
          } ${!isSidebarOpen ? 'justify-center px-0 border-transparent bg-transparent' : ''}`}
          title="Pengaturan Profil"
        >
          <div className="w-9 h-9 bg-[#0F172A] rounded-full flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-xs">
            AD
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap text-left flex-1 transition-opacity duration-300">
              <h4 className="font-extrabold text-xs text-slate-900 truncate">Super Admin</h4>
              <span className="text-[10px] text-slate-400 truncate block">admin@jasa.id</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;