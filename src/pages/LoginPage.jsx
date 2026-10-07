import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

const LoginPage = ({ onBack, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="w-screen h-screen relative flex flex-col justify-between p-6 overflow-hidden bg-linear-to-br from-[#EAF3FA] via-[#E2EDF8] to-[#D5E5F6] select-none">
      
      {/* Background Glow Deco */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar: Button Kembali */}
      <div className="relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Main Content (Split Screen Grid) */}
      <div className="relative z-10 flex-1 flex items-center justify-center max-w-6xl w-full mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Column: Hero Text & Card Mockup */}
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              HUBUNGKAN <br />
              <span className="text-blue-600">LAYANAN ANDA</span> <br />
              SEKARANG
            </h1>

            {/* UI Mockup Card */}
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/60 relative">
              {/* Top Skeleton Bars */}
              <div className="w-1/3 h-3 bg-blue-600 rounded-full mb-3"></div>
              <div className="w-2/3 h-2 bg-slate-200 rounded-full mb-2"></div>
              <div className="w-1/2 h-2 bg-slate-200 rounded-full mb-6"></div>

              {/* Grid 3 Small Skeleton Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full shrink-0"></div>
                  <div className="w-full space-y-1">
                    <div className="h-1.5 bg-blue-300 rounded-full w-full"></div>
                    <div className="h-1.5 bg-blue-200 rounded-full w-2/3"></div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex items-center gap-1.5">
                  <div className="w-full space-y-1.5">
                    <div className="h-2 bg-blue-600 rounded-full w-3/4"></div>
                    <div className="h-1.5 bg-slate-200 rounded-full w-1/2"></div>
                  </div>
                </div>

                <div className="bg-emerald-50/80 border border-emerald-100 p-2.5 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="h-1.5 bg-emerald-500 rounded-full w-full"></div>
                </div>
              </div>

              {/* Floating Cube Deco */}
              <div className="absolute -top-3 -right-3 w-7 h-7 bg-blue-600 rounded-lg transform rotate-12 shadow-md"></div>
              <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-400 rounded-md transform -rotate-12"></div>
            </div>
          </div>

          {/* Right Column: Form Login Card */}
          <div className="flex justify-center md:justify-end">
            <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white">
              <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
                Login
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Masukkan Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-xs md:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-800 placeholder:text-slate-400"
                  />
                </div>

            {/* Password Input dengan Toggle Eye Icon */}
            <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative flex items-center">
                <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 text-xs md:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-800 placeholder:text-slate-400"
                />
                
                {/* Toggle Icon Mata (Centered Presisi) */}
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer p-1"
                >
                {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                ) : (
                    <Eye className="w-5 h-5" />
                )}
                </button>
            </div>
            </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] text-sm cursor-pointer mt-4"
                >
                  Login
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Text */}
      <div className="relative z-10 text-center text-[11px] text-slate-400 font-medium">
        © 2026 Admin Portal System • Desktop Vector Mockup (1280x800)
      </div>

    </div>
  );
};

export default LoginPage;