import React, { useRef } from 'react';
import { Upload, Lock } from 'lucide-react';

const ProfileForm = ({ profile, setProfile }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, avatarUrl: imageUrl });
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Data Profil Admin</h3>
        <p className="text-xs text-slate-400">Perbarui foto profil dan informasi data diri akun Anda.</p>
      </div>

      <div className="flex items-center gap-4 py-2 border-b border-slate-100 pb-5">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
            AD
          </div>
        )}

        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-[#F1F5F9] hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Foto</span>
          </button>
          <span className="text-[10px] text-slate-400 mt-1 block">JPG/PNG, Max 2MB</span>
        </div>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Telepon / WhatsApp</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Peran System</label>
          <div className="relative">
            <input
              type="text"
              value={profile.role}
              disabled
              className="w-full px-4 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-xl text-xs text-slate-500 font-medium outline-none cursor-not-allowed pr-10"
            />
            <Lock className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
          </div>
        </div>
      </div>

      <button className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer mt-2">
        Simpan Profil
      </button>
    </div>
  );
};

export default ProfileForm;