import React from 'react';
import { X, Lock } from 'lucide-react';

const ChatPreviewModal = ({ selectedTrx, setActiveModal }) => {
  if (!selectedTrx) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* HEADER CHAT */}
        <div className="bg-[#2563EB] p-4 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-80 block">BUKTI VERIKASI • LOG CHAT</span>
            <h4 className="font-extrabold text-sm">{selectedTrx.buyer} (Pembeli) & {selectedTrx.seller} (Penjual)</h4>
          </div>
          <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-white/20 rounded-full transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CHAT BODY */}
        <div className="p-5 space-y-4 max-h-80 overflow-y-auto bg-slate-50/50 text-xs">
          <div className="text-center"><span className="px-3 py-1 bg-slate-200/80 text-slate-500 text-[10px] font-bold rounded-full">Hari ini, 14:32</span></div>

          {/* SELLER BUBBLE */}
          <div className="flex gap-2 items-start">
            <div className="w-7 h-7 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0">BS</div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">{selectedTrx.seller} (Penjual)</span>
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-slate-800 leading-relaxed">
                Halo mas Arif! Pembayaran sudah saya terima ya.
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-start pl-9">
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-slate-800 leading-relaxed">
              Bisa tolong diinfokan modul C++ bab berapa saja yang perlu saya persiapkan untuk tutoring-nya?
            </div>
          </div>

          {/* BUYER BUBBLE */}
          <div className="flex gap-2 items-start justify-end pt-2">
            <div className="space-y-1 text-right">
              <span className="text-[10px] text-blue-600 font-bold block">{selectedTrx.buyer} (Pembeli)</span>
              <div className="bg-[#EFF6FF] p-3 rounded-2xl border border-blue-100 text-slate-800 leading-relaxed text-left">
                Halo Mas Budi! Terutama di bab Pointer dan Array 2 Dimensi mas. Mohon bantuannya ya!
              </div>
            </div>
            <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0">AR</div>
          </div>
        </div>

        {/* FOOTER CHAT */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center gap-3 text-slate-500 text-xs font-semibold">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-700 block text-[11px]">Mode Pantau (Read-Only) • Verifikasi Bukti Transaksi</span>
            <span className="text-[10px] text-slate-400">Admin hanya memantau. Mediasi/sengketa langsung diarahkan ke WhatsApp CS.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatPreviewModal;