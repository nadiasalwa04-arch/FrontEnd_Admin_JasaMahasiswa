import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

const Header = ({
  title,
  searchQuery,
  setSearchQuery,
  showNotifications,
  setShowNotifications,
  notifications = [],
  setNotifications,
  notificationRef,
  setIsSidebarOpen
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-md px-4 md:px-8 py-3.5 flex items-center justify-between border-b border-slate-200/60 gap-3">
      {/* KIRI: TOMBOL GARIS 3 (MOBILE) & JUDUL HALAMAN */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl md:hidden shrink-0 cursor-pointer transition-all"
          title="Buka Menu Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-base md:text-xl font-black text-slate-900 truncate tracking-tight">{title}</h2>
      </div>

      {/* KANAN: SEARCH BAR (PRESISI CENTER) & NOTIFIKASI */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* SEARCH BAR DENGAN POSISI IKON KACA PEMBESAR PAS DI TENGAH */}
        <div className="relative hidden sm:flex items-center w-48 md:w-64">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none shrink-0" />
          <input
            type="text"
            placeholder="Cari transaksi, pengguna, jasa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition-all leading-normal"
          />
        </div>

        {/* NOTIFIKASI */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl relative transition-all shadow-xs cursor-pointer flex items-center justify-center"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900">Notifikasi Terbaru</h4>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 bg-slate-50 rounded-2xl text-xs space-y-0.5">
                    <p className="font-bold text-slate-800">{n.title}</p>
                    <p className="text-[11px] text-slate-500">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SYSTEM STATUS BADGE */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          System Active
        </div>
      </div>
    </header>
  );
};

export default Header;