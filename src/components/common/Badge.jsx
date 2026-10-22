import React from 'react';

const Badge = ({ children, variant = 'pending' }) => {
  const variants = {
    pending: 'bg-amber-100 text-amber-800',
    success: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
    verified: 'bg-[#DCFCE7] text-[#166534]'
  };

  return (
    <span className={`px-2.5 py-1 font-bold text-[10px] rounded-md ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;