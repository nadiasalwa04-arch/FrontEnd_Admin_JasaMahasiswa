import React from 'react';

const StatCard = ({ title, value, badgeText, badgeBg = 'bg-emerald-100 text-emerald-700', cardBg = 'bg-white', borderColor = 'border-slate-200/80', titleColor = 'text-slate-400', valueColor = 'text-slate-900' }) => {
  return (
    <div className={`${cardBg} p-6 rounded-3xl border ${borderColor} shadow-xs flex justify-between items-start`}>
      <div>
        <span className={`text-xs font-bold ${titleColor} block mb-2`}>{title}</span>
        <div className={`text-2xl font-black ${valueColor} tracking-tight`}>{value}</div>
      </div>
      <span className={`px-2.5 py-1 ${badgeBg} font-extrabold text-[10px] rounded-full shadow-xs`}>
        {badgeText}
      </span>
    </div>
  );
};

export default StatCard;