import React from 'react';

const PendingServiceList = ({ pendingServices, onNavigateServiceModeration }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-5">
          PERSETUJUAN JASA BARU
        </h3>
        <div className="space-y-4">
          {pendingServices.map((svc) => (
            <div key={svc.id} className="p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${svc.colorBg} shrink-0`} />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">{svc.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{svc.author}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={onNavigateServiceModeration} 
                  className="flex-1 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer"
                >
                  Tinjau & Setujui
                </button>
                <button 
                  onClick={onNavigateServiceModeration} 
                  className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] rounded-xl transition-all cursor-pointer"
                >
                  Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingServiceList;