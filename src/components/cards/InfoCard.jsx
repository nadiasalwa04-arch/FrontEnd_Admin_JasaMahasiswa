import React from 'react';

const InfoCard = ({ title, description, badgeText, badgeBg = 'bg-[#DCFCE7]', badgeTextBg = 'text-[#166534]', cardBg = 'bg-[#F8FAFC]', children }) => {
  return (
    <div className={`p-4 ${cardBg} border border-slate-100 rounded-2xl flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        {children}
        <div>
          <h4 className="font-extrabold text-slate-900 text-xs">{title}</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      {badgeText && (
        <span className={`px-3 py-1 ${badgeBg} ${badgeTextBg} font-extrabold text-[10px] rounded-full`}>
          {badgeText}
        </span>
      )}
    </div>
  );
};

export default InfoCard;