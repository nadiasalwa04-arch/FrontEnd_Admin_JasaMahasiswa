import React from 'react';
import { GraduationCap, LayoutDashboard, FileCheck2, ShieldCheck, Users } from 'lucide-react';

const Sidebar = ({
  activeMenu = 'dashboard',
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, action: onNavigateDashboard },
    { key: 'verifikasi', label: 'Verifikasi Transaksi', icon: FileCheck2, action: onNavigateTransactionVerification },
    { key: 'moderasi', label: 'Moderasi Jasa', icon: ShieldCheck, badge: 1, action: onNavigateServiceModeration },
    { key: 'user-management', label: 'Manajemen User', icon: Users, action: onNavigateUserManagement },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-5 z-20 shrink-0">
      <div>
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col leading-tight font-bold text-base">
            <span className="text-slate-900">Jasa</span>
            <span className="text-[#2563EB]">Mahasiswa</span>
          </div>
        </div>
        <nav className="space-y-1.5">
          {menuItems.map(({ key, label, icon: Icon, badge, action }) => (
            <button
              key={key}
              onClick={action}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeMenu === key ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
              {badge && (
                <span className="w-5 h-5 bg-amber-200 text-amber-800 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
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
  );
};

export default Sidebar;