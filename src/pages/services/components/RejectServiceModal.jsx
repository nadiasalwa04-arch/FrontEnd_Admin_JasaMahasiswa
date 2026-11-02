import React, { useState } from 'react';

const RejectServiceModal = ({ service, onClose, onConfirmReject }) => {
  const [rejectReason, setRejectReason] = useState('Melanggar Kebijakan (Joki Ujian/Plagiarisme)');
  const [rejectNote, setRejectNote] = useState('');

  const handleSubmit = () => {
    onConfirmReject(rejectReason, rejectNote);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Tolak Pengajuan Jasa</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Jasa: <span className="font-semibold text-slate-700">{service?.title}</span>
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-800 block">Pilih Alasan Utama Penolakan:</label>
          
          {[
            'Melanggar Kebijakan (Joki Ujian/Plagiarisme)',
            'Deskripsi / Informasi Jasa Kurang Jelas',
            'Gambar / Portfolio Tidak Sesuai Kriteria',
            'Harga Tidak Sesuai Standar Layanan'
          ].map((reason, idx) => (
            <label key={idx} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50">
              <input
                type="radio"
                name="rejectReason"
                checked={rejectReason === reason}
                onChange={() => setRejectReason(reason)}
                className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <span>{reason}</span>
            </label>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">Catatan Tambahan untuk Mahasiswa:</label>
          <textarea
            rows={3}
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Tuliskan saran perbaikan..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-red-500 transition-all resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all"
          >
            Batal
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-6 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md shadow-red-500/20"
          >
            Kirim Penolakan
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectServiceModal;