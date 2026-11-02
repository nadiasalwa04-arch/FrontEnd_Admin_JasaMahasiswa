import React from 'react';
import { ArrowRight } from 'lucide-react';

const TransactionTable = ({ transactions, onNavigateTransactionVerification }) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-5">
          VERIFIKASI TRANSAKSI KELUAR / MASUK
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-3">
                <th className="pb-3 font-semibold">ID & RINCIAN TRANSAKSI</th>
                <th className="pb-3 font-semibold">NOMINAL</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {transactions.map((trx) => (
                <tr key={trx.id}>
                  <td className="py-4">
                    <div className="font-extrabold text-slate-900">{trx.id}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{trx.desc}</div>
                  </td>
                  <td className={`py-4 font-bold ${trx.type === 'out' ? 'text-red-500' : 'text-blue-600'}`}>
                    {trx.amount}
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 font-bold text-[10px] rounded-md ${
                      trx.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                      trx.status === 'Ditolak' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {trx.actionable ? (
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={onNavigateTransactionVerification} 
                          className="px-3 py-1 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-all"
                        >
                          Verifikasi
                        </button>
                        <button 
                          onClick={onNavigateTransactionVerification} 
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg cursor-pointer transition-all"
                        >
                          Tolak
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">{trx.actionNote}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pt-6 text-center border-t border-slate-100 mt-4">
        <button 
          onClick={onNavigateTransactionVerification} 
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2563EB] hover:text-blue-700 cursor-pointer transition-colors"
        >
          <span>Lihat Semua Transaksi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;