import React from 'react';

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'font-bold rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-[#2563EB] hover:bg-blue-700 text-white',
    dark: 'bg-[#0F172A] hover:bg-slate-800 text-white',
    success: 'bg-[#10B981] hover:bg-emerald-600 text-white',
    secondary: 'bg-[#F1F5F9] hover:bg-slate-200 text-slate-700',
    outline: 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-4 py-2.5 text-xs',
    lg: 'py-3 text-xs w-full'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;