import React from 'react';

const TransactionTable = ({ filteredTrx, handleOpenVerifyModal, handleOpenRejectModal }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
      <div className="grid grid-cols-12 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-4 py-2 bg-slate-50/70 rounded-xl">
        <div className="col-span-5">ID & RINCIAN TRANSAKSI</div>
        <div className="col-span-2">NOMINAL</div>
        <div className="col-span-2">STATUS</div>
        <div className="col-span-3 text-center">AKSI</div>
      </div>

      <div className="divide-y divide-slate-100">
        {filteredTrx.map((trx) => (
          <div key={trx.id} className="grid grid-cols-12 items-center px-4 py-5 text-xs hover:bg-slate-50/50 rounded-xl transition-colors">
            <div className="col-span-5 space-y-0.5">
              <div className="font-black text-slate-900">{trx.id}</div>
              <div className="text-[11px] text-slate-400">{trx.title}</div>
            </div>

            <div className="col-span-2 font-black text-blue-600">
              {trx.status === 'Ditolak' ? <span className="text-red-500">{trx.amount}</span> : trx.amount}
            </div>

            <div className="col-span-2">
              {trx.status === 'Pending' && <span className="px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded-full">Pending</span>}
              {trx.status === 'Ditolak' && <span className="px-3 py-1 bg-red-100 text-red-600 font-extrabold text-[10px] rounded-full">Ditolak</span>}
              {trx.status === 'Selesai' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-extrabold text-[10px] rounded-full">Selesai</span>}
            </div>

            <div className="col-span-3 text-center">
              {trx.status === 'Pending' ? (
                <div className="flex justify-center gap-2">
                  <button onClick={() => handleOpenVerifyModal(trx)} className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-xs">
                    Verifikasi
                  </button>
                  <button onClick={() => handleOpenRejectModal(trx)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all">
                    Tolak
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">
                  {trx.status === 'Ditolak' ? 'Telah ditolak' : 'Telah diverifikasi'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTable;