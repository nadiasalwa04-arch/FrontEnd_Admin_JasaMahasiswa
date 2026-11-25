import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const UserTable = ({
  users = [],
  onSelectUser,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 5,
  onPageChange = () => {}
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ditolak':
        return (
          <span className="px-3.5 py-1 bg-[#FEE2E2] text-[#DC2626] font-extrabold text-[11px] rounded-full inline-block">
            Ditolak
          </span>
        );
      case 'Pending':
        return (
          <span className="px-3.5 py-1 bg-[#FEF3C7] text-[#D97706] font-extrabold text-[11px] rounded-full inline-block">
            Pending
          </span>
        );
      case 'Unggah Ulang':
        return (
          <span className="px-3.5 py-1 bg-[#FFEDD5] text-[#EA580C] font-extrabold text-[11px] rounded-full inline-block">
            Unggah Ulang
          </span>
        );
      case 'Aktif':
        return (
          <span className="px-3.5 py-1 bg-[#E0F2FE] text-[#0284C7] font-extrabold text-[11px] rounded-full inline-block">
            Aktif
          </span>
        );
      case 'Terverifikasi':
      default:
        return (
          <span className="px-3.5 py-1 bg-[#DCFCE7] text-[#16A34A] font-extrabold text-[11px] rounded-full inline-block">
            Terverifikasi
          </span>
        );
    }
  };

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-162.5">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6 rounded-tl-2xl">PROFIL</th>
              <th className="py-4 px-4">INSTITUSI / KAMPUS</th>
              <th className="py-4 px-4">PERAN</th>
              <th className="py-4 px-4 text-center">STATUS</th>
              <th className="py-4 px-6 text-center rounded-tr-2xl">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {users.length > 0 ? (
              users.map((user) => {
                const isGeneralClient = user.role === 'Klien Umum';
                const needsDocumentReview =
                  !isGeneralClient &&
                  (user.status === 'Pending' || user.status === 'Ditolak' || user.status === 'Unggah Ulang');

                return (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* PROFIL */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-full font-extrabold text-xs flex items-center justify-center shrink-0 ${
                            isGeneralClient ? 'bg-slate-100 text-slate-600' : 'bg-[#DBEAFE] text-[#2563EB]'
                          }`}
                        >
                          {user.initials}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* INSTITUSI / KAMPUS */}
                    <td className="py-4 px-4 font-extrabold text-slate-800">{user.institution}</td>

                    {/* PERAN */}
                    <td className="py-4 px-4 text-slate-600 font-medium">{user.role}</td>

                    {/* STATUS */}
                    <td className="py-4 px-4 text-center">{getStatusBadge(user.status)}</td>

                    {/* AKSI */}
                    <td className="py-4 px-6 text-center">
                      {needsDocumentReview ? (
                        <button
                          onClick={() => onSelectUser(user)}
                          className="px-4 py-1.5 bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] border border-blue-200/80 font-bold text-[11px] rounded-xl transition-all cursor-pointer"
                        >
                          Cek Dokumen
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectUser(user)}
                          className="px-4 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[11px] rounded-xl transition-all cursor-pointer shadow-2xs"
                        >
                          Edit / Detail
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 text-xs font-medium">
                  Tidak ada data pengguna yang sesuai dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION BAR (< 1, 2, 3 >) */}
      {totalItems > 0 && (
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
          <p className="text-xs text-slate-400 font-medium">
            Menampilkan <span className="font-bold text-slate-700">{startIndex}</span>–
            <span className="font-bold text-slate-700">{endIndex}</span> dari{' '}
            <span className="font-bold text-slate-700">{totalItems}</span> pengguna
          </p>

          <div className="flex items-center gap-1.5">
            {/* Tombol Previous (<) */}
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-600 transition-all cursor-pointer"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Nomor Halaman (1, 2, 3...) */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-xs shadow-blue-600/20'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Tombol Next (>) */}
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-600 transition-all cursor-pointer"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;