import React from 'react';
import { X, Check } from 'lucide-react';

const ServiceDetailModal = ({ selectedService, closeModal, onApprove, onReject }) => {
  if (!selectedService) return null;

  // Menampung kemungkinan nama properti gambar sampul & media dari backend/state
  const rawCover =
    selectedService.bannerUrl ||
    selectedService.coverImage ||
    selectedService.banner_url ||
    selectedService.cover_url ||
    selectedService.thumbnail ||
    selectedService.images?.[0];

  const coverImage = rawCover
    ? rawCover.startsWith('http')
      ? rawCover
      : `http://localhost:3000${rawCover}`
    : null;

  const rawMedia =
    selectedService.mediaImage ||
    selectedService.media_url ||
    selectedService.images?.[1];

  const mediaImage = rawMedia
    ? rawMedia.startsWith('http')
      ? rawMedia
      : `http://localhost:3000${rawMedia}`
    : null;

  // Menangani format harga (baik sudah berbentuk "Rp 100.000" maupun angka)
  const formattedPrice = typeof selectedService.price === 'number'
    ? selectedService.price.toLocaleString('id-ID')
    : String(selectedService.price || '0').replace(/^Rp\s*/i, '');

  // Format Waktu Pengerjaan & Revisi dari kolom database (waktu_pengerjaan & jumlah_revisi)
  const rawEstimate = selectedService.estimate || selectedService.waktu_pengerjaan;
  const formattedEstimate = rawEstimate
    ? typeof rawEstimate === 'number'
      ? `${rawEstimate} Hari`
      : rawEstimate
    : '-';

  const rawRevision =
    selectedService.revisions ||
    selectedService.revision ||
    selectedService.jumlah_revisi;
  const formattedRevision = rawRevision !== undefined && rawRevision !== null && rawRevision !== ''
    ? typeof rawRevision === 'number'
      ? `${rawRevision} Kali`
      : rawRevision
    : '-';

  // Memecah deskripsi/keunggulan jika dipisahkan baris baru atau bullet
  const descriptionLines = selectedService.description
    ? selectedService.description.split('\n').map(line => line.trim()).filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        {/* Tombol Tutup (X) di pojok kanan atas */}
        <button
          onClick={closeModal}
          aria-label="Tutup modal"
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Ikon Centang & Judul Konfirmasi */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A] text-white">
              <Check className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">
            {selectedService.status === 'PENDING' ? 'Setujui Pengajuan Jasa?' : 'Detail Pengajuan Jasa'}
          </h2>
          <p className="mt-1 max-w-md text-xs text-slate-500 leading-relaxed">
            {selectedService.status === 'PENDING'
              ? 'Jasa ini akan langsung diterbitkan dan dapat dilihat serta dipesan oleh seluruh pengguna di katalog.'
              : `Status saat ini: ${selectedService.status}`}
          </p>
        </div>

        {/* Kotak Detail Utama (1 - 4) */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-5 space-y-5 text-left">
          
          {/* 1. JUDUL JASA */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              1. JUDUL JASA
            </p>
            <h3 className="mt-1 text-sm font-extrabold text-slate-900">
              {selectedService.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedService.author}
            </p>
          </div>

          {/* 2. Sampul & Media (2 Kotak Foto) */}
          <div>
            <p className="text-xs font-bold text-blue-600 mb-2">
              2. Sampul &amp; Media
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Kotak 1: Foto Sampul */}
              <div className="h-28 w-full overflow-hidden rounded-xl bg-[#CBD5E1]/70 flex items-center justify-center">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Foto Sampul"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-medium text-slate-500">Foto Sampul</span>
                )}
              </div>

              {/* Kotak 2: Media Tambahan */}
              <div className="h-28 w-full overflow-hidden rounded-xl bg-[#94A3B8]/70 flex items-center justify-center">
                {mediaImage ? (
                  <img
                    src={mediaImage}
                    alt="Media Jasa"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-medium text-slate-100">Media</span>
                )}
              </div>
            </div>
          </div>

          {/* 3. Detail Paket & Harga */}
          <div>
            <p className="text-xs font-bold text-blue-600">
              3. Detail Paket &amp; Harga
            </p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">
              {selectedService.packageName || selectedService.category || selectedService.title}
            </p>
            <div className="mt-1 space-y-0.5 text-xs text-slate-500">
              <p>
                Harga Jasa (RP):{' '}
                <span className="font-semibold text-slate-900">{formattedPrice}</span>
              </p>
              <p>
                Waktu Pengerjaan:{' '}
                <span className="font-semibold text-slate-900">
                  {formattedEstimate}
                </span>
              </p>
              <p>
                Revisi:{' '}
                <span className="font-semibold text-slate-900">
                  {formattedRevision}
                </span>
              </p>
            </div>
          </div>

          {/* 4. Deskripsi & Keunggulan */}
          <div>
            <p className="text-xs font-bold text-blue-600 mb-1">
              4. Deskripsi &amp; Keunggulan
            </p>
            {descriptionLines.length > 1 ? (
              <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-700 leading-relaxed">
                {descriptionLines.map((item, idx) => (
                  <li key={idx}>{item.replace(/^[•\-*]\s*/, '')}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedService.description || 'Tidak ada deskripsi tambahan.'}
              </p>
            )}
          </div>
        </div>

        {/* Garis Pemisah & Tombol Aksi */}
        <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
          {selectedService.status === 'PENDING' ? (
            <>
              <button
                onClick={onReject}
                className="px-5 py-2.5 bg-[#FFE4E6] hover:bg-red-200 text-[#E11D48] font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                Tolak Pengajuan
              </button>
              <button
                onClick={onApprove}
                className="px-5 py-2.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm"
              >
                Ya, Setujui &amp; Terbitkan
              </button>
            </>
          ) : (
            <button
              onClick={closeModal}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg cursor-pointer transition-all"
            >
              Tutup
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ServiceDetailModal;