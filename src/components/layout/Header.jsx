import React from 'react';
import { Search, Bell, ArrowLeft } from 'lucide-react';
import NotificationDropdown from '../common/NotificationDropdown';

const Header = ({
  title = 'Dashboard Overview',
  searchQuery = '',
  setSearchQuery = null,
  showNotifications = false,
  setShowNotifications = () => {},
  notifications = [],
  setNotifications = () => {},
  notificationRef = null,
  showBackButton = false,
  onBack = () => {}
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-slate-200/60">
      <div>
        {showBackButton && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-semibold mb-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Pengaturan</span>
          </button>
        )}
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar (Tampil jika props setSearchQuery dikirim) */}
        {setSearchQuery && (
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari transaksi, pengguna, jasa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#EEF2F6] border border-transparent rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
            />
          </div>
        )}

        {/* Notifikasi Dropdown */}
        <div className="relative shrink-0" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer shadow-xs flex items-center justify-center"
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown
              notifications={notifications}
              onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
            />
          )}
        </div>

        {/* Status System */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-[#DCFCE7] border border-[#BBF7D0] rounded-full text-[#15803D] text-xs font-bold shrink-0">
          <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
          <span>System Active</span>
        </div>
      </div>
    </header>
  );
};

export default Header;