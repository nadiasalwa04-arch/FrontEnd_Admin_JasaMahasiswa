import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, LayoutDashboard, FileCheck2, ShieldCheck, 
  Users, Search, ChevronDown, CheckCircle2, Trash2, Bell, Clock, X, Eye 
} from 'lucide-react';

const ServiceModerationPage = ({
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const [activeMenu, setActiveMenu] = useState('moderasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Programming');

  // Notification State & Ref
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Pengajuan Baru', desc: 'Arief S. mengajukan "Jasa Desain Poster & PPT".', time: '10 mnt lalu', unread: true },
    { id: 2, title: 'Jasa Perlu Moderasi', desc: 'Budi S. memperbarui deskripsi jasanya.', time: '1 jam lalu', unread: true },
  ]);

  // Modal State ('REVIEW' | 'REJECT_FORM' | 'DELETE_CONFIRM' | 'DETAIL' | null)
  const [selectedService, setSelectedService] = useState(null);
  const [modalStep, setModalStep] = useState(null);
  const [rejectReason, setRejectReason] = useState('Melanggar Kebijakan (Joki Ujian/Plagiarisme)');
  const [rejectNote, setRejectNote] = useState('Jasa pengerjaan ujian online tidak diperbolehkan sesuai S&K Bab 3. Silakan ajukan jasa bimbingan atau tutoring belajar saja.');

  // State Services
  const [services, setServices] = useState([
    {
      id: 1,
      category: 'Desain Grafis',
      title: 'Jasa Desain Poster & PPT',
      author: 'Arief S. - DKV Unesp',
      price: 'Mulai dari Rp 50.000',
      estimate: '2 Hari',
      status: 'PENDING', // 'PENDING' | 'DITERIMA' | 'DITOLAK'
      rejectReasonText: 'Contoh portofolio melanggar hak cipta.',
      approvedInfo: 'Diterima pada 1 Okt 2026 oleh Admin',
      description: 'Layanan pengerjaan desain poster kreatif dan presentasi PowerPoint interaktif untuk kebutuhan akademik maupun bisnis.'
    },
    {
      id: 2,
      category: 'Programming',
      title: 'Jasa Pembuatan Web React & Tailwind',
      author: 'Budi Setiawan (Informatika UI)',
      price: 'Mulai dari Rp 100.000',
      estimate: '3 Hari',
      status: 'PENDING',
      rejectReasonText: 'Layanan Joki Ujian/Kuis Dilarang (S&K Bab 3).',
      approvedInfo: 'Diterima pada 30 Sep 2026 oleh Admin',
      description: 'Pembuatan landing page, dashboard admin, dan website portofolio profesional menggunakan React.js dan Tailwind CSS.'
    },
    {
      id: 3,
      category: 'Penerjemah',
      title: 'Jasa Translate Jurnal Inggris',
      author: 'Siti A. - Sastra ITS',
      price: 'Mulai dari Rp 25.000',
      estimate: '1 Hari',
      status: 'PENDING',
      rejectReasonText: 'Kategori aktivitas terlarang/illegal hacking.',
      approvedInfo: 'Diterima pada 28 Sep 2026 oleh Admin',
      description: 'Penerjemahan dokumen akademik, jurnal ilmiah, dan esai dari Bahasa Indonesia ke Bahasa Inggris atau sebaliknya.'
    }
  ]);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Modal Actions
  const handleOpenModal = (service, step) => { setSelectedService(service); setModalStep(step); };
  const closeModal = () => { setModalStep(null); setSelectedService(null); };

  const handleApproveService = () => {
    if (!selectedService) return;
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    setServices(prev => prev.map(s => s.id === selectedService.id ? {
      ...s, status: 'DITERIMA', approvedInfo: `Diterima pada ${formattedDate} oleh Admin`
    } : s));
    closeModal();
  };

  const handleConfirmReject = () => {
    if (!selectedService) return;
    setServices(prev => prev.map(s => s.id === selectedService.id ? {
      ...s, status: 'DITOLAK', rejectReasonText: rejectNote || rejectReason
    } : s));
    closeModal();
  };

  const handleConfirmDelete = () => {
    if (!selectedService) return;
    setServices(prev => prev.filter(s => s.id !== selectedService.id));
    closeModal();
  };

  // Conditionals
  const hasApproved = services.some(s => s.status === 'DITERIMA');
  const hasRejected = services.some(s => s.status === 'DITOLAK');

  const activeCount = services.filter(s => s.status === 'DITERIMA').length + 327;
  const rejectedCount = services.filter(s => s.status === 'DITOLAK').length + 15;

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'verifikasi', label: 'Verifikasi Transaksi', icon: FileCheck2 },
    { key: 'moderasi', label: 'Moderasi Jasa', icon: ShieldCheck, badge: 1 },
    { key: 'user-management', label: 'Manajemen User', icon: Users },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden font-sans select-none relative">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-5 z-20 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight font-bold text-base">
              <span className="text-slate-900">Jasa</span>
              <span className="text-[#2563EB]">Mahasiswa</span>
            </div>
          </div>
          <nav className="space-y-1.5">
            {menuItems.map(({ key, label, icon: Icon, badge }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveMenu(key);
                  if (key === 'dashboard') onNavigateDashboard();
                  else if (key === 'verifikasi') onNavigateTransactionVerification();
                  else if (key === 'user-management') onNavigateUserManagement();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeMenu === key ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3"><Icon className="w-4 h-4" /><span>{label}</span></div>
                {badge && <span className="w-5 h-5 bg-amber-200 text-amber-800 font-bold text-[10px] rounded-full flex items-center justify-center">{badge}</span>}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={onNavigateSettings} className="pt-4 border-t border-slate-100 flex items-center gap-3 px-2 w-full text-left bg-slate-50 p-2 rounded-xl transition-all cursor-pointer hover:bg-slate-100">
          <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">AD</div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-slate-800 truncate">Super Admin</span>
            <span className="text-[11px] text-slate-400 truncate">admin@jasa.id</span>
          </div>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC]">
        
        {/* HEADER TOP BAR */}
        <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-slate-200/60">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Moderasi Jasa</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari nama jasa / mahasiswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 pr-8 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="Programming">Programming •</option>
                <option value="Desain Grafis">Desain Grafis •</option>
                <option value="Penerjemah">Penerjemah •</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* TOGGLE NOTIFIKASI */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer shadow-xs"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* POP-UP NOTIFIKASI DROPDOWN */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <h4 className="text-xs font-bold text-slate-800">Notifikasi Moderasi</h4>
                    <span onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))} className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">
                      Tandai dibaca
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2.5 rounded-xl text-xs border ${n.unread ? 'bg-blue-50/60 border-blue-100/50' : 'bg-slate-50 border-slate-100'}`}>
                        <span className="font-extrabold text-slate-800 block text-[11px] mb-0.5">{n.title}</span>
                        <p className="text-slate-600 font-medium leading-snug">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1.5"><Clock className="w-3 h-3" /> {n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* BODY CONTENT */}
        <div className="p-8 space-y-8">
          
          {/* STATS OVERVIEW HEADER CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className={`p-6 rounded-2xl border transition-all ${
              hasApproved ? 'bg-[#F0FDF4] border-2 border-[#22C55E]' : 'bg-white border-slate-200/80'
            }`}>
              <span className={`text-xs font-bold block mb-2 ${hasApproved ? 'text-[#15803D]' : 'text-slate-500'}`}>
                {hasApproved ? 'Jasa Diterima' : 'Total Jasa Aktif'}
              </span>
              <div className={`text-3xl font-black ${hasApproved ? 'text-[#15803D]' : 'text-slate-900'}`}>
                {activeCount} Jasa
              </div>
            </div>

            <div className={`p-6 rounded-2xl border transition-all ${
              hasRejected ? 'bg-[#FEF2F2] border-2 border-red-300' : 'bg-white border-slate-200/80'
            }`}>
              <span className={`text-xs font-bold block mb-2 ${hasRejected ? 'text-red-600' : 'text-slate-500'}`}>
                {hasRejected ? 'Jasa Ditolak' : 'Jasa Ditolak/Revisi'}
              </span>
              <div className={`text-3xl font-black ${hasRejected ? 'text-red-600' : 'text-slate-900'}`}>
                {rejectedCount} Jasa
              </div>
            </div>
          </div>

          <h2 className="text-base font-bold text-slate-800">
            {hasApproved ? 'Daftar Pengajuan Jasa yang Diterima' :
             hasRejected ? 'Daftar Pengajuan Jasa Ditolak' : 'Persetujuan Jasa'}
          </h2>

          {/* GRID CARD DAFTAR PENGAJUAN JASA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const isRejected = service.status === 'DITOLAK';
              const isApproved = service.status === 'DITERIMA';

              return (
                <div 
                  key={service.id} 
                  className={`bg-white rounded-3xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                    isApproved ? 'border-[#86EFAC] ring-2 ring-[#86EFAC]/40' :
                    isRejected ? 'border-red-300 ring-2 ring-red-200' : 'border-slate-200/80'
                  }`}
                >
                  <div>
                    {/* BADGE STATUS */}
                    <div className="mb-2">
                      {isApproved && (
                        <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] font-extrabold text-[10px] rounded-md tracking-wider inline-block">
                          DITERIMA
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-3 py-1 bg-red-100 text-red-600 font-extrabold text-[10px] rounded-md tracking-wider inline-block">
                          DITOLAK
                        </span>
                      )}
                      {!isApproved && !isRejected && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md inline-block">
                          {service.category}
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight mb-1">{service.title}</h3>
                    <p className="text-[11px] text-slate-400 mb-3">{service.author}</p>

                    <div className="flex justify-between items-baseline text-xs mb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Mulai</span>
                        <span className="font-extrabold text-slate-900">{service.price}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Estimasi</span>
                        <span className="font-bold text-slate-700">{service.estimate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="h-14 bg-slate-200/80 rounded-xl" />
                      <div className="h-14 bg-slate-300/80 rounded-xl" />
                    </div>

                    {/* KOTAK INFO SETELAH DIPROSES */}
                    {isApproved && (
                      <div className="bg-[#F0FDF4] p-3 rounded-2xl mb-4 border border-[#DCFCE7]">
                        <span className="text-[10px] font-bold text-[#166534] block mb-0.5">Status Persetujuan:</span>
                        <p className="text-[11px] text-[#15803D] leading-snug">{service.approvedInfo}</p>
                      </div>
                    )}

                    {isRejected && (
                      <div className="bg-red-50 p-3 rounded-2xl mb-4 border border-red-100">
                        <span className="text-[10px] font-bold text-red-600 block mb-0.5">Alasan Penolakan:</span>
                        <p className="text-[11px] text-red-500 leading-snug">{service.rejectReasonText}</p>
                      </div>
                    )}
                  </div>

                  {/* TOMBOL AKSI BERDASARKAN STATUS */}
                  <div className="space-y-2 pt-2">
                    {service.status === 'PENDING' && (
                      <button onClick={() => handleOpenModal(service, 'REVIEW')} className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer">
                        Tinjau Jasa
                      </button>
                    )}

                    {isApproved && (
                      <>
                        <button onClick={() => handleOpenModal(service, 'DETAIL')} className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer">
                          Lihat Detail Jasa
                        </button>
                        <button onClick={() => handleOpenModal(service, 'REVIEW')} className="w-full py-2 bg-[#F1F5F9] hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                          Ubah Status
                        </button>
                      </>
                    )}

                    {isRejected && (
                      <>
                        <button onClick={() => handleOpenModal(service, 'REVIEW')} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                          Tinjau Ulang
                        </button>
                        <button onClick={() => handleOpenModal(service, 'DELETE_CONFIRM')} className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl cursor-pointer transition-all">
                          Hapus Pengajuan
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* --- POP-UP MODALS --- */}

      {/* 1. MODAL DETAIL JASA (SETELAH DIPERIKSA / DISETUJUI) */}
      {modalStep === 'DETAIL' && selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 relative">
            <button 
              onClick={closeModal} 
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] font-extrabold text-[10px] rounded-md tracking-wider">
                DITERIMA
              </span>
              <span className="text-xs font-bold text-slate-400">{selectedService.category}</span>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">{selectedService.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedService.author}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Harga Layanan</span>
                <span className="font-extrabold text-slate-900">{selectedService.price}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Estimasi Pengerjaan</span>
                <span className="font-extrabold text-slate-900">{selectedService.estimate}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800 block">Deskripsi Layanan:</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                {selectedService.description || 'Tidak ada deskripsi tambahan.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800 block">Lampiran / Portofolio:</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-16 bg-slate-200/80 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400">Sampel 1</div>
                <div className="h-16 bg-slate-200/80 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400">Sampel 2</div>
                <div className="h-16 bg-slate-300/80 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400">Sampel 3</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={closeModal} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL TINJAU & SETUJUI / TOLAK (IMAGE_6EC964.PNG) */}
      {modalStep === 'REVIEW' && selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto text-white shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Setujui Pengajuan Jasa?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed px-2">
                Jasa ini akan langsung diterbitkan dan dapat dilihat serta dipesan oleh seluruh pengguna di katalog.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-2xl text-left">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">{selectedService.category}</span>
              <h4 className="font-extrabold text-slate-900 text-xs">{selectedService.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Oleh: {selectedService.author}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setModalStep('REJECT_FORM')} className="flex-1 py-3 bg-[#FFE4E6] hover:bg-red-200 text-[#E11D48] font-bold text-xs rounded-2xl transition-all cursor-pointer">
                Tolak Pengajuan
              </button>
              <button onClick={handleApproveService} className="flex-1 py-3 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-md shadow-emerald-600/20">
                Ya, Setujui & Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL FORM PENOLAKAN JASA (IMAGE_6EC902.PNG) */}
      {modalStep === 'REJECT_FORM' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Tolak Pengajuan Jasa</h3>
              <p className="text-xs text-slate-400 mt-0.5">Berikan alasan penolakan agar penjual dapat memperbaiki jasanya.</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 block">Pilih Alasan Utama Penolakan:</label>
              
              {[
                'Melanggar Kebijakan (Joki Ujian/Plagiarisme)',
                'Deskripsi / Informasi Jasa Kurang Jelas',
                'Gambar / Portfolio Tidak Sesuai Kriteria'
              ].map((reason, idx) => (
                <label key={idx} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Catatan Tambahan untuk Mahasiswa:</label>
              <textarea
                rows={3}
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModalStep('REVIEW')} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all">
                Batal
              </button>
              <button onClick={handleConfirmReject} className="px-6 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md shadow-red-500/20">
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL HAPUS PENGAJUAN (IMAGE_6EC9D9.PNG) */}
      {modalStep === 'DELETE_CONFIRM' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">Hapus Pengajuan Jasa?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Apakah Anda yakin ingin menghapus pengajuan ini ? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all">
                Batal
              </button>
              <button onClick={handleConfirmDelete} className="flex-1 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md shadow-red-500/20">
                Hapus Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceModerationPage;