import React from 'react';
import { GraduationCap } from 'lucide-react';

const LandingPage = ({ onNavigateToLogin }) => {
  const handleLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <div className="w-screen h-screen relative flex flex-col items-center justify-between py-6 px-4 overflow-hidden bg-linear-to-br from-[#EAF3FA] via-[#E2EDF8] to-[#D5E5F6] select-none">
      
      {/* Background Geometric Polygon Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-white/30 backdrop-blur-3xl transform -skew-x-12 -translate-x-20"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/30 backdrop-blur-3xl transform skew-x-12 translate-x-20"></div>
        
        {/* Floating 3D Cube Deco */}
        <div className="absolute top-1/4 left-16 w-10 h-10 bg-blue-400/80 transform rotate-45 rounded-sm shadow-md"></div>
        <div className="absolute top-1/3 left-1/4 w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-b-20 border-b-blue-400"></div>
        <div className="absolute top-1/3 right-16 w-12 h-12 bg-blue-500/80 transform rotate-12 rounded-lg shadow-md"></div>
        <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-blue-300/80 transform rotate-45 rounded-sm"></div>
      </div>

      {/* Top Header: Logo & Title */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mt-2">
        
        {/* Logo Icon + Teks Berdampingan Pas */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col items-start leading-none justify-center">
            <span className="font-bold text-lg text-slate-900 tracking-tight">Jasa</span>
            <span className="font-bold text-lg text-[#2563EB] tracking-tight">Mahasiswa</span>
          </div>
        </div>

        {/* Subtitle / Deskripsi */}
        <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed max-w-md">
          Platform kelola layanan konsultasi atau jual beli produk dengan mudah, cepat, dan aman di satu tempat khusus admin.
        </p>
      </div>

      {/* Hero Illustration Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full my-2">
        <div className="relative w-full max-w-70 h-80 flex items-center justify-center aspect-4/5">
          
          {/* Main Mobile Frame */}
          <div className="w-48 h-80 bg-white rounded-4xl border-[5px] border-slate-900 shadow-2xl relative flex flex-col items-center pt-3 p-2.5 overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="w-14 h-2.5 bg-slate-900 rounded-full mb-4"></div>
            
            {/* UI Mockup Inside Phone */}
            <div className="w-full bg-[#3B82F6] h-7 rounded-lg mb-2"></div>
            <div className="w-full flex gap-2 mb-2">
              <div className="w-1/2 h-14 bg-[#2563EB] rounded-lg"></div>
              <div className="w-1/2 h-14 bg-slate-100 rounded-lg border border-slate-200"></div>
            </div>
            <div className="w-full h-7 bg-[#2563EB] rounded-lg mt-auto mb-2"></div>
          </div>

          {/* Floating UI Card Overlay */}
          <div className="absolute bottom-8 -left-8 -right-8 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-slate-200 rounded-full w-3/4 mb-1.5"></div>
              <div className="h-1.5 bg-slate-100 rounded-full w-1/2"></div>
            </div>
            <div className="w-10 h-5 bg-[#3B82F6] rounded"></div>
          </div>

          {/* Person Characters (Left & Right) */}
          <div className="absolute left-1 bottom-2 flex flex-col items-center">
            <div className="w-5 h-5 bg-slate-900 rounded-full mb-0.5"></div>
            <div className="w-6 h-10 bg-[#3B82F6] rounded-t-md"></div>
            <div className="w-5 h-8 bg-slate-800 rounded-b-sm"></div>
          </div>

          <div className="absolute right-1 bottom-2 flex flex-col items-center">
            <div className="w-5 h-5 bg-slate-900 rounded-full mb-0.5"></div>
            <div className="w-6 h-10 bg-[#2563EB] rounded-t-md"></div>
            <div className="w-5 h-8 bg-slate-800 rounded-b-sm"></div>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="relative z-10 w-full max-w-xs mb-2">
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-[#111827] hover:bg-slate-800 text-white font-semibold rounded-full shadow-md transition-all transform active:scale-95 text-xs tracking-wider uppercase cursor-pointer"
        >
          MASUK
        </button>
      </div>

    </div>
  );
};

export default LandingPage;