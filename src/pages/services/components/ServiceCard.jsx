import React from 'react';

const ServiceCard = ({ service, onReview }) => {
  const isRejected = service.status === 'REJECTED' || service.status === 'DITOLAK';
  const isApproved = service.status === 'APPROVED' || service.status === 'DITERIMA';

  return (
    <div 
      className={`bg-white rounded-3xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
        isApproved ? 'border-[#86EFAC] ring-2 ring-[#86EFAC]/40' :
        isRejected ? 'border-red-300 ring-2 ring-red-200' : 'border-slate-200/80'
      }`}
    >
      <div>
        {/* BADGE STATUS */}
        <div className="mb-2">
          {isApproved && (
            <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] font-extrabold text-[10px] rounded-md tracking-wider inline-block">
              DISERUJUI / AKTIF
            </span>
          )}
          {isRejected && (
            <span className="px-3 py-1 bg-red-100 text-red-600 font-extrabold text-[10px] rounded-md tracking-wider inline-block">
              DITOLAK
            </span>
          )}
          {!isApproved && !isRejected && (
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md inline-block">
              {service.category}
            </span>
          )}
        </div>

        <h3 className="font-extrabold text-slate-900 text-sm leading-tight mb-1">{service.title}</h3>
        <p className="text-[11px] text-slate-400 mb-3">{service.author}</p>

        <div className="flex justify-between items-baseline text-xs mb-3">
          <div>
            <span className="text-[10px] text-slate-400 block">Mulai</span>
            <span className="font-extrabold text-slate-900">{service.price}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Estimasi</span>
            <span className="font-bold text-slate-700">{service.estimate}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="h-14 bg-slate-200/80 rounded-xl" />
          <div className="h-14 bg-slate-300/80 rounded-xl" />
        </div>

        {/* INFO PENOLAKAN JIKA DITOLAK */}
        {isRejected && service.rejectReason && (
          <div className="bg-red-50 p-3 rounded-2xl mb-4 border border-red-100">
            <span className="text-[10px] font-bold text-red-600 block mb-0.5">Alasan Penolakan:</span>
            <p className="text-[11px] text-red-500 leading-snug">{service.rejectReason}</p>
          </div>
        )}
      </div>

      {/* TOMBOL UTAMA TINJAU JASA */}
      <div className="pt-2">
        <button 
          onClick={onReview} 
          className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          {isApproved ? 'Ubah Status / Tinjau' : isRejected ? 'Tinjau Ulang' : 'Tinjau Jasa'}
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;