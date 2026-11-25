import React, { useState } from 'react';
import { X } from 'lucide-react';

const REJECT_REASONS = [
  'Bukti transfer tidak terbaca / gambar buram',
  'Nominal transfer tidak sesuai dengan harga jasa',
  'Terindikasi bukti pembayaran tidak valid / terduplikasi',
  'Lainnya (Tulis alasan khusus di bawah)',
];

const RejectTransactionModal = ({ selectedTrx, onClose, onConfirmReject }) => {
  const [selectedReason, setSelectedReason] = useState(REJECT_REASONS[0]);
  const [note, setNote] = useState('');

  if (!selectedTrx) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedReason === REJECT_REASONS[3] && !note.trim()) {
      alert('Silakan tulis alasan khusus pada kolom catatan tambahan di bawah.');
      return;
    }
    onConfirmReject(selectedReason, note);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-7 space-y-5 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <X className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Tolak Verifikasi Transaksi
              </h3>
              <p className="text-xs text-slate-400">
                ID Transaksi: {selectedTrx.fullId || selectedTrx.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Kotak Rincian Pesanan */}
          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                RINCIAN PESANAN
              </span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{selectedTrx.id}</p>
              <p className="text-xs text-slate-500 mt-0.5">{selectedTrx.title}</p>
            </div>
            <div className="text-sm sm:text-base font-black text-red-600 shrink-0">
              {selectedTrx.amount}
            </div>
          </div>

          {/* Pilihan Alasan Penolakan */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold text-slate-800 block">
              Pilih Alasan Penolakan <span className="text-red-500">*</span>
            </label>

            <div className="space-y-2">
              {REJECT_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <label
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-50/70 border-red-400 text-red-700 font-extrabold'
                        : 'bg-white border-slate-200 text-slate-700 font-medium hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-red-500" />}
                    </span>
                    <span>{reason}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Catatan Tambahan untuk Pembeli */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 block">
              Catatan Tambahan untuk Pembeli
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Foto bukti transfer terpotong. Harap unggah ulang struk lengkap yang memperlihatkan tanggal dan nomor referensi transaksi."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-red-400 transition-all resize-none"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/20 transition-colors cursor-pointer"
            >
              Konfirmasi Penolakan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectTransactionModal;