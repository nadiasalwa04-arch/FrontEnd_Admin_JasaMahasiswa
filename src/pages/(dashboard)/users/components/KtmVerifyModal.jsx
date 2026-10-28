import React from 'react';
import { X, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

const KtmVerifyModal = ({ selectedUser, onClose, onApprove, onOpenSuspend }) => {
  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-[#2563EB] font-black text-sm">
              {selectedUser.initials || 'US'}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Verifikasi Kartu Tanda Mahasiswa (KTM)</h3>
              <p className="text-xs text-slate-400">Pemeriksaan keaslian identitas pendaftar</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DATA PROFIL & PREVIEW KTM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* FOTO KTM */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">Foto dokumen KTM</span>
            {/* Ubah min-h-[180px] menjadi min-h-45 */}
<div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-2 bg-slate-50 flex flex-col items-center justify-center min-h-45 group">
              <div className="w-full h-44 bg-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 space-y-1">
                <ShieldCheck className="w-8 h-8 text-slate-300" />
                <span className="text-[11px] font-bold">Dokumen KTM {selectedUser.name}</span>
                <span className="text-[9px] text-slate-400">(Format: JPG/PNG - 1.2 MB)</span>
              </div>
            </div>
          </div>

          {/* DETAIL DATA AKADEMIK */}
          <div className="space-y-4 text-xs">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">Informasi Pendaftar</span>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">Nama Lengkap</span>
                <h4 className="font-extrabold text-slate-900 text-sm">{selectedUser.name}</h4>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">Email Kampus</span>
                <p className="font-bold text-slate-800">{selectedUser.email}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">Perguruan Tinggi</span>
                <p className="font-bold text-slate-800">{selectedUser.univ}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">Program Studi / Jurusan</span>
                <p className="font-bold text-slate-800">{selectedUser.major}</p>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            onClick={onOpenSuspend}
            className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Tolak / Suspend</span>
          </button>

          <button 
            onClick={onApprove}
            className="px-6 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Setujui & Verifikasi Akun</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default KtmVerifyModal;