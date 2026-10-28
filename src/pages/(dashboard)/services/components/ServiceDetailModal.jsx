import React from 'react';
import { X } from 'lucide-react';

const ServiceDetailModal = ({ selectedService, closeModal }) => {
  if (!selectedService) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 relative">
        <button 
          onClick={closeModal} 
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] font-extrabold text-[10px] rounded-md tracking-wider">
            DITERIMA
          </span>
          <span className="text-xs font-bold text-slate-400">{selectedService.category}</span>
        </div>

        <div>
          <h3 className="text-base font-black text-slate-900">{selectedService.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{selectedService.author}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Harga Layanan</span>
            <span className="font-extrabold text-slate-900">{selectedService.price}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Estimasi Pengerjaan</span>
            <span className="font-extrabold text-slate-900">{selectedService.estimate}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-800 block">Deskripsi Layanan:</span>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
            {selectedService.description || 'Tidak ada deskripsi tambahan.'}
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-800 block">Lampiran / Portofolio:</span>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-slate-200/80 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400">Sampel 1</div>
            <div className="h-16 bg-slate-200/80 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400">Sampel 2</div>
            <div className="h-16 bg-slate-300/80 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400">Sampel 3</div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button onClick={closeModal} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;