import React, { useState } from 'react';
import { Info, Eye, EyeOff } from 'lucide-react';

const SecurityForm = ({ passwords, setPasswords }) => {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Keamanan & Password</h3>
        <p className="text-xs text-slate-400">Ganti kata sandi secara berkala untuk menjaga keamanan akun.</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-2.5 text-blue-700">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold">Syarat Password Baru:</h4>
          <p className="text-[11px] text-blue-600 mt-0.5">Minimal 8 karakter, kombinasi huruf kapital, huruf kecil, simbol & angka.</p>
        </div>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Password Saat Ini</label>
          <div className="relative">
            <input
              type={showCurrentPass ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full px-4 py-2.5 pr-10 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
              className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Password Baru</label>
          <div className="relative">
            <input
              type={showNewPass ? 'text' : 'password'}
              placeholder="Masukkan password baru"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              className="w-full px-4 py-2.5 pr-10 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Konfirmasi Password Baru</label>
          <div className="relative">
            <input
              type={showConfirmPass ? 'text' : 'password'}
              placeholder="Ulangi password baru"
              value={passwords.confirmPass}
              onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
              className="w-full px-4 py-2.5 pr-10 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <button className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer mt-2">
        Perbarui Password
      </button>
    </div>
  );
};

export default SecurityForm;