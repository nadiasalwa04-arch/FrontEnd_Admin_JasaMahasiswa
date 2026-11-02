import React from 'react';
import { ShieldCheck, ShieldAlert, FileText, Ban, CheckCircle2 } from 'lucide-react';

const UserTable = ({ 
  users = [], 
  filteredUsers = [], 
  handleOpenKtmModal = () => {}, 
  handleOpenSuspendModal = () => {} 
}) => {
  // Biar aman mau dikirim via prop 'users' atau 'filteredUsers'
  const dataList = users.length > 0 ? users : filteredUsers;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-3">
            <th className="pb-3 font-semibold">MAHASISWA</th>
            <th className="pb-3 font-semibold">UNIVERSITAS & JURUSAN</th>
            <th className="pb-3 font-semibold">TANGGAL DAFTAR</th>
            <th className="pb-3 font-semibold">STATUS AKUN</th>
            <th className="pb-3 font-semibold text-right">AKSI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {dataList.length > 0 ? (
            dataList.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                {/* PROFIL USER */}
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563EB] font-black text-xs flex items-center justify-center shrink-0">
                      {user.initials || 'US'}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* UNIV & JURUSAN */}
                <td className="py-4">
                  <div className="font-bold text-slate-800">{user.univ}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{user.major}</div>
                </td>

                {/* TANGGAL DAFTAR */}
                <td className="py-4 text-slate-500 font-medium">
                  {user.joinedAt}
                </td>

                {/* STATUS BADGE */}
                <td className="py-4">
                  {user.status === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-lg">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Terverifikasi</span>
                    </span>
                  )}

                  {user.status === 'PENDING' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-lg">
                      <FileText className="w-3 h-3" />
                      <span>Perlu Cek KTM</span>
                    </span>
                  )}

                  {user.status === 'SUSPENDED' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-600 font-bold text-[10px] rounded-lg">
                      <Ban className="w-3 h-3" />
                      <span>Ditangguhkan</span>
                    </span>
                  )}
                </td>

                {/* AKSI TOMBOL */}
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenKtmModal(user)}
                      className="px-3 py-1.5 bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] font-bold text-[11px] rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Verifikasi KTM</span>
                    </button>

                    {user.status !== 'SUSPENDED' && (
                      <button
                        onClick={() => handleOpenSuspendModal(user)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold text-[11px] rounded-xl transition-all cursor-pointer"
                        title="Tangguhkan Akun"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-400 text-xs font-medium">
                Tidak ada data mahasiswa ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;