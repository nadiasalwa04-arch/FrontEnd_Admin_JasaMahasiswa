import React from 'react';
import { Clock } from 'lucide-react';

const NotificationDropdown = ({ notifications, onMarkAllRead }) => {
  return (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
        <h4 className="text-xs font-bold text-slate-800">Notifikasi Aktivitas</h4>
        <span 
          onClick={onMarkAllRead} 
          className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline"
        >
          Tandai dibaca
        </span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`p-2.5 rounded-xl text-xs border transition-colors ${
              n.unread ? 'bg-blue-50/60 border-blue-100/50' : 'bg-slate-50 border-slate-100'
            }`}
          >
            {n.title && <span className="font-extrabold text-slate-800 block text-[11px] mb-0.5">{n.title}</span>}
            <p className="text-slate-600 font-medium leading-snug">{n.desc}</p>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1.5">
              <Clock className="w-3 h-3" /> {n.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;