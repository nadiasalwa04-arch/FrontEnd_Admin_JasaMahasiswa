import React, { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const LoginPage = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email dan password wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      // Endpoint disesuaikan dengan route backend: /api/auth/admin/login
      const response = await fetch('http://localhost:3000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Cek apakah respons dari server berupa JSON sebelum di-parse
      const contentType = response.headers.get('content-type');
      let result = {};
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      }

      if (response.ok && (result.success || result.token)) {
        if (result.token) {
          localStorage.setItem('adminToken', result.token);
        }
        if (result.data || result.admin || result.user) {
          localStorage.setItem(
            'adminData',
            JSON.stringify(result.data || result.admin || result.user)
          );
        }

        if (onLoginSuccess) {
          onLoginSuccess(result);
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setErrorMessage(
          result.message || `Gagal login (Status: ${response.status}). Periksa kembali email dan password.`
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Tidak dapat terhubung ke server. Pastikan backend berjalan di port 3000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-[#F4F7FE] via-[#EEF3FD] to-[#E6EEFC] flex flex-col justify-between font-sans antialiased">
      {/* DEKORASI LINGKARAN LEMBUT DI LATAR BELAKANG */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-[#E2ECFD]/75" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 w-[440px] h-[440px] rounded-full bg-[#DCE7FC]/60" />

      {/* TOMBOL KEMBALI DI POJOK KIRI ATAS */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pt-7 sm:pt-9">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-[#1D63ED] hover:text-blue-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali</span>
        </button>
      </header>

      {/* KONTEN UTAMA: KIRI (HEADLINE + VEKTOR MOCKUP) & KANAN (KARTU LOGIN) */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-8 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* KOLOM KIRI: HEADLINE & ILUSTRASI KARTU UI */}
          <div className="lg:col-span-6 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#1E2532] leading-[1.18] tracking-tight uppercase">
              HUBUNGKAN
              <br />
              <span className="text-[#1D63ED]">LAYANAN ANDA</span>
              <br />
              SEKARANG
            </h1>

            {/* ILUSTRASI KARTU MOCKUP UI */}
            <div className="relative w-full max-w-[360px] pt-2">
              <div className="w-7 h-7 rounded-lg bg-[#1D63ED] shadow-md shadow-blue-600/25 absolute -top-1 right-4 rotate-12 z-20" />

              <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-5 shadow-[0_20px_50px_rgba(37,99,235,0.08)] border border-white space-y-5 relative z-10">
                <div className="space-y-2">
                  <div className="h-2.5 w-3/5 bg-[#2563EB] rounded-full" />
                  <div className="h-2 w-4/5 bg-slate-200 rounded-full" />
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl border border-blue-200/80 bg-[#F8FAFF] flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#1D63ED] shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-1.5 w-full bg-[#3B82F6] rounded-full" />
                      <div className="h-1.5 w-3/4 bg-slate-200 rounded-full" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex flex-col justify-center space-y-1.5">
                    <div className="h-1.5 w-full bg-[#2563EB] rounded-full" />
                    <div className="h-1.5 w-5/6 bg-slate-200 rounded-full" />
                    <div className="h-1.5 w-2/3 bg-slate-200 rounded-full" />
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-1.5 w-full bg-emerald-500 rounded-full" />
                      <div className="h-1.5 w-2/3 bg-slate-200 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-5 h-5 rounded-md bg-[#60A5FA] shadow-sm absolute -bottom-2.5 right-6 -rotate-12 z-20" />
            </div>
          </div>

          {/* KOLOM KANAN: FORM CARD LOGIN */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[430px] bg-white rounded-[28px] px-7 sm:px-10 py-10 sm:py-12 shadow-[0_24px_60px_rgba(15,23,42,0.06)] border border-white/80">
              <h2 className="text-2xl sm:text-[26px] font-black text-[#1E2532] text-center tracking-tight mb-8">
                Login
              </h2>

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Input Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-extrabold text-[#1E2532]"
                  >
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Masukkan Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 bg-[#EBF1FE]/75 focus:bg-white border border-slate-200/90 focus:border-[#1D63ED] focus:ring-2 focus:ring-blue-500/15 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>

                {/* Input Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-extrabold text-[#1E2532]"
                  >
                    Password
                  </label>
                  <div className="relative h-11">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Masukkan Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-full pl-4 pr-11 bg-[#EBF1FE]/75 focus:bg-white border border-slate-200/90 focus:border-[#1D63ED] focus:ring-2 focus:ring-blue-500/15 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                      className="absolute inset-y-0 right-2.5 my-auto w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Tombol Submit Login */}
                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-56 py-3 bg-[#1D63ED] hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER COPYRIGHT */}
      <footer className="relative z-10 w-full text-center pb-5 px-4">
        <p className="text-[11px] font-medium text-slate-400">
          © 2026 Admin Portal System • Jasa Mahasiswa
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;