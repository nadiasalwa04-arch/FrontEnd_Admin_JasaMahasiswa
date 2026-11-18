import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = ({ onLoginSuccess = () => {}, onNavigateLanding = () => {} }) => {
  const [email, setEmail] = useState('admin@jasa.id');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
        
        {/* HEADER LOGO */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div 
            onClick={onNavigateLanding}
            className="w-12 h-12 bg-[#2563EB] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25 cursor-pointer hover:scale-105 transition-transform"
          >
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1">
              <h1 className="font-black text-slate-900 text-lg tracking-tight">Jasa</h1>
              <span className="font-extrabold text-[#2563EB] text-lg">Mahasiswa</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Masuk ke Panel Administrator Sistem
            </p>
          </div>
        </div>

        {/* PESAN ERROR */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl text-center">
            {errorMsg}
          </div>
        )}

        {/* FORM LOGIN */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Alamat Email Admin</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jasa.id"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs text-slate-800 font-medium outline-none focus:border-[#2563EB] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">Password</label>
              <button
                type="button"
                className="text-[11px] font-bold text-[#2563EB] hover:text-blue-700 cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs text-slate-800 font-medium outline-none focus:border-[#2563EB] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-600">Ingat sesi login</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-md shadow-slate-900/15 flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* FOOTER KEAMANAN */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Dilindungi Enkripsi Keamanan Admin</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;