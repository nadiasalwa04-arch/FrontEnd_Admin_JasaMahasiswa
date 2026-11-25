import React, { useState } from 'react';
import { ArrowLeft, Check, X, CheckCircle2, XCircle, RefreshCw, Save } from 'lucide-react';

const KtmVerifyModal = ({ selectedUser, onBack, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: selectedUser?.name || '',
    email: selectedUser?.email || '',
    institution: selectedUser?.institution || '',
    phone: selectedUser?.phone || '-',
    role: selectedUser?.role || 'Penyedia Jasa',
    status: selectedUser?.status || 'Pending',
  });

  const [verificationNote, setVerificationNote] = useState(selectedUser?.note || '');
  const [saveToast, setSaveToast] = useState('');

  if (!selectedUser) return null;

  const mapUiStatusToDb = (uiStatus) => {
    switch (uiStatus) {
      case 'Terverifikasi':
        return 'disetujui';
      case 'Ditolak':
        return 'ditolak';
      case 'Unggah Ulang':
        return 'unggah_ulang';
      default:
        return 'menunggu_verifikasi';
    }
  };

  const syncUserStatusToBackend = async (newUiStatus, noteText) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      await fetch(`http://localhost:3000/api/admin/users/${selectedUser.id}/verify-ktm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ktm_status: mapUiStatusToDb(newUiStatus),
          note: noteText,
        }),
      });
    } catch (error) {
      console.error('Gagal menyimpan status verifikasi KTM ke server:', error);
    }
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdateUser({
      ...selectedUser,
      ...updated,
      note: verificationNote,
    });
  };

  const handleRejectDocument = async () => {
    await syncUserStatusToBackend('Ditolak', verificationNote);
    const updatedData = {
      ...selectedUser,
      ...formData,
      status: 'Ditolak',
      note: verificationNote,
    };
    setFormData((prev) => ({ ...prev, status: 'Ditolak' }));
    onUpdateUser(updatedData);
  };

  const handleApproveDocument = async () => {
    await syncUserStatusToBackend('Terverifikasi', verificationNote);
    const updatedData = {
      ...selectedUser,
      ...formData,
      status: 'Terverifikasi',
      note: verificationNote,
    };
    setFormData((prev) => ({ ...prev, status: 'Terverifikasi' }));
    onUpdateUser(updatedData);
  };

  const handleRequestReupload = async () => {
    const defaultNote =
      verificationNote || 'Silakan unggah ulang foto KTM yang jelas dan tidak buram.';
    await syncUserStatusToBackend('Unggah Ulang', defaultNote);
    const updatedData = {
      ...selectedUser,
      ...formData,
      status: 'Unggah Ulang',
      note: defaultNote,
    };
    setFormData((prev) => ({ ...prev, status: 'Unggah Ulang' }));
    if (!verificationNote) {
      setVerificationNote(defaultNote);
    }
    onUpdateUser(updatedData);
  };

  const handleSaveProfile = async () => {
    await syncUserStatusToBackend(formData.status, verificationNote);
    onUpdateUser({
      ...selectedUser,
      ...formData,
      note: verificationNote,
    });
    setSaveToast('Perubahan data pengguna tersimpan!');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const isGeneralClient = formData.role === 'Klien Umum';

  return (
    <div className="space-y-5">
      {/* BARIS ATAS: TOMBOL KEMBALI & TOAST SIMPAN */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Manajemen User</span>
        </button>

        {saveToast && (
          <span className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-[#2563EB] font-bold text-xs rounded-xl">
            {saveToast}
          </span>
        )}
      </div>

      {/* CARD UTAMA EDIT & DETAIL PENGGUNA */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Edit &amp; Detail Pengguna</h2>
            <p className="text-xs text-slate-400 mt-0.5">Perbarui informasi profil, peran, dan status akun pengguna</p>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>

        {/* FORM PROFIL PENGGUNA */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* KOLOM KIRI: AVATAR & BADGE */}
          <div className="w-full lg:w-48 flex flex-col items-center text-center shrink-0 pt-2">
            <div className="w-24 h-24 rounded-full bg-[#DBEAFE] text-[#2563EB] font-black text-2xl flex items-center justify-center mb-3 shadow-inner">
              {selectedUser.initials}
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">{formData.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{formData.email}</p>
            <span className="mt-3 px-4 py-1 bg-[#EFF6FF] text-[#2563EB] font-extrabold text-[11px] rounded-full">
              {formData.role === 'Klien Umum' ? 'Klien' : formData.role}
            </span>
          </div>

          {/* KOLOM KANAN: GRID INPUT FORM */}
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 block">Nama Lengkap</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:border-[#2563EB] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 block">Alamat Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 block">Program Studi / Universitas</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:border-[#2563EB] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 block">Nomor WhatsApp / Telepon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:border-[#2563EB] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 block">Peran (Role)</label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:border-[#2563EB] transition-all cursor-pointer"
              >
                <option value="Penyedia Jasa">Penyedia Jasa</option>
                <option value="Klien">Klien</option>
                <option value="Klien Umum">Klien Umum</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 block">Status Akun</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:border-[#2563EB] transition-all cursor-pointer"
              >
                <option value="Pending">Cek KTM (Menunggu Dokumen)</option>
                <option value="Terverifikasi">Terverifikasi</option>
                <option value="Unggah Ulang">Perlu Unggah Ulang KTM</option>
                <option value="Aktif">Aktif</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        {/* BAGIAN VERIFIKASI DOKUMEN KTM */}
        {!isGeneralClient && (
          <div className="border-t border-slate-100 pt-7 space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Verifikasi Dokumen Kartu Tanda Mahasiswa (KTM)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Periksa kesesuaian dokumen yang diunggah dengan data pengguna di sistem</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* PREVIEW KARTU KTM (KIRI) */}
              <div className="lg:col-span-7 space-y-2">
                <span className="text-xs font-extrabold text-slate-700 block">Lampiran Kartu Tanda Mahasiswa (KTM)</span>

                <div className="bg-[#111827] p-6 sm:p-8 rounded-2xl flex items-center justify-center">
                  {selectedUser.ktmUrl ? (
                    <img
                      src={selectedUser.ktmUrl}
                      alt={`KTM ${formData.name}`}
                      className="max-h-64 rounded-xl object-contain shadow-lg"
                    />
                  ) : (
                    <div className="w-full max-w-md bg-[#1D4ED8] rounded-2xl overflow-hidden shadow-lg border border-blue-400/30">
                      <div className="bg-[#1E3A8A] px-5 py-3 text-white font-extrabold text-xs tracking-wider uppercase">
                        {selectedUser.campusHeader || 'UNIVERSITAS BRAWIJAYA'}
                      </div>
                      <div className="bg-white m-2.5 mt-0 rounded-b-xl p-4 flex items-center gap-4">
                        <div className="w-20 h-24 bg-slate-200 rounded-lg flex flex-col items-center justify-end overflow-hidden shrink-0 border border-slate-300/60">
                          <div className="w-9 h-9 bg-slate-400 rounded-full mb-1" />
                          <div className="w-14 h-8 bg-slate-400 rounded-t-full" />
                        </div>
                        <div className="space-y-1 text-left">
                          <h4 className="font-black text-slate-900 text-xs sm:text-sm uppercase">{formData.name}</h4>
                          <p className="text-[11px] font-semibold text-slate-500">NIM: {selectedUser.nim || '-'}</p>
                          <p className="text-[11px] text-slate-400">{selectedUser.faculty || 'Fakultas Vokasi'}</p>
                          <p className="text-[11px] text-slate-400">{selectedUser.major || 'Teknologi Informasi'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  Tanggal Unggah Dokumen <span className="font-extrabold text-slate-700 ml-1">{selectedUser.uploadedAt || '-'}</span>
                </p>
              </div>

              {/* STATUS & TOMBOL / KONFIRMASI DI AREA KTM (KANAN) */}
              <div className="lg:col-span-5 space-y-4 lg:pt-6">
                <div className={`p-3.5 rounded-xl text-center font-extrabold text-xs border transition-colors ${
                  formData.status === 'Terverifikasi'
                    ? 'bg-[#DCFCE7] border-emerald-200 text-[#16A34A]'
                    : formData.status === 'Ditolak'
                    ? 'bg-[#FEE2E2] border-red-200 text-[#DC2626]'
                    : formData.status === 'Unggah Ulang'
                    ? 'bg-[#FFEDD5] border-orange-200 text-[#EA580C]'
                    : 'bg-[#FEF3C7] border-amber-200 text-[#D97706]'
                }`}>
                  Status Dokumen: {
                    formData.status === 'Terverifikasi'
                      ? 'Terverifikasi Admin'
                      : formData.status === 'Ditolak'
                      ? 'Ditolak Admin'
                      : formData.status === 'Unggah Ulang'
                      ? 'Menunggu User Unggah Ulang KTM'
                      : 'Menunggu Verifikasi Admin'
                  }
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Catatan Verifikasi / Instruksi Unggah Ulang
                  </label>
                  <textarea
                    rows={4}
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                    disabled={formData.status === 'Terverifikasi'}
                    placeholder="Contoh: Foto KTM kurang jelas / buram, mohon unggah ulang..."
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 outline-none focus:border-[#2563EB] transition-all resize-none disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>

                {formData.status === 'Pending' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={handleRejectDocument}
                        className="flex-1 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <X className="w-4 h-4" />
                        <span>Tolak Dokumen</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleApproveDocument}
                        className="flex-1 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Setujui Dokumen</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleRequestReupload}
                      className="w-full py-2.5 bg-[#FFF7ED] hover:bg-orange-100 text-[#EA580C] border border-orange-200 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Minta Unggah Ulang KTM</span>
                    </button>
                  </div>
                )}

                {formData.status === 'Terverifikasi' && (
                  <div className="p-4 bg-[#DCFCE7] border border-emerald-200 rounded-2xl flex items-center justify-center gap-2 text-[#16A34A] font-extrabold text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Dokumen KTM berhasil disetujui!</span>
                  </div>
                )}

                {formData.status === 'Ditolak' && (
                  <div className="space-y-3">
                    <div className="p-4 bg-[#FEE2E2] border border-red-200 rounded-2xl flex items-center justify-center gap-2 text-[#DC2626] font-extrabold text-xs">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Dokumen KTM ditolak!</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRequestReupload}
                      className="w-full py-2.5 bg-[#FFF7ED] hover:bg-orange-100 text-[#EA580C] border border-orange-200 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Beri Kesempatan Unggah Ulang KTM</span>
                    </button>
                  </div>
                )}

                {formData.status === 'Unggah Ulang' && (
                  <div className="space-y-3">
                    <div className="p-4 bg-[#FFEDD5] border border-orange-200 rounded-2xl text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-[#EA580C] font-extrabold text-xs">
                        <RefreshCw className="w-4 h-4 shrink-0" />
                        <span>Kesempatan Unggah Ulang Diberikan!</span>
                      </div>
                      <p className="text-[11px] text-orange-700">
                        User telah diberitahu untuk mengunggah foto KTM baru sesuai kriteria.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleChange('status', 'Pending')}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition-all cursor-pointer"
                    >
                      Tinjau Ulang Dokumen Baru
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KtmVerifyModal;