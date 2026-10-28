import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const VerifyPaymentModal = ({ selectedTrx, setActiveModal, handleProceedToAdvanced }) => {
  if (!selectedTrx) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Verifikasi Pembayaran</h3>
            <span className="text-xs text-slate-400">ID Transaksi: {selectedTrx.fullId}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">RINCIAN TRANSAKSI</span>
            <h4 className="font-extrabold text-slate-900">{selectedTrx.serviceName}</h4>
            <p className="text-[10px] text-slate-400">Pembeli: {selectedTrx.buyer} | {selectedTrx.bank}</p>
          </div>
          <span className="font-black text-blue-600 text-sm">{selectedTrx.amount}</span>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-800 block">Bukti Transfer Pembeli</span>
          <div className="h-32 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center p-4 space-y-1">
            <span className="text-xs font-bold text-slate-500">[ Preview Bukti Transfer ]</span>
            <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
              ✓ Sesuai {selectedTrx.amount}
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-[11px] text-[#15803D]">
          Dengan mengonfirmasi, dana ditampung di rekber dan penjual diberitahu untuk bekerja.
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all">
            Batal
          </button>
          <button onClick={handleProceedToAdvanced} className="flex-1 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-500/20">
            Lanjut Verifikasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPaymentModal;