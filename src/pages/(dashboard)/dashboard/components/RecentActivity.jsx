import React from 'react';
import { ArrowRight } from 'lucide-react';

const RecentActivity = ({ recentUsers, onNavigateUserManagement }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
        MANAJEMEN MAHASISWA & USER TERBARU
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recentUsers.map((u) => (
          <div key={u.id} className="p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-black text-xs flex items-center justify-center shrink-0">
                {u.initials}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs">{u.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{u.info}</p>
              </div>
            </div>
            {u.verified ? (
              <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] font-extrabold text-[10px] rounded-full">
                {u.status}
              </span>
            ) : (
              <button
                onClick={onNavigateUserManagement}
                className="px-4 py-1.5 bg-[#F1F5F9] hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] rounded-xl cursor-pointer transition-all"
              >
                {u.status}
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="pt-4 text-center border-t border-slate-100">
        <button
          onClick={onNavigateUserManagement}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2563EB] hover:text-blue-700 cursor-pointer transition-colors"
        >
          <span>Kelola Semua Pengguna (142)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;