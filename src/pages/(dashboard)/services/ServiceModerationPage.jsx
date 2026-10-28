import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import ServiceCard from './components/ServiceCard';
import RejectServiceModal from './components/RejectServiceModal';

const ServiceModerationPage = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED'

  // Modal State
  const [selectedService, setSelectedService] = useState(null);
  const [modalStep, setModalStep] = useState(null); // 'REVIEW' | 'REJECT_FORM' | null

  // Header Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Moderasi Jasa Baru', desc: 'Arief S. mengajukan jasa "Desain Poster & PPT".', time: '10 mnt lalu', unread: true },
    { id: 2, title: 'Pengajuan Jasa', desc: 'Maya R. mengajukan jasa "Olah Data SPSS".', time: '1 jam lalu', unread: true },
  ]);

  // Data Services Dummy
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Jasa Desain Poster & PPT Interaktif',
      author: 'Arief S. (DKV - Universitas Gajah Mada)',
      price: 'Mulai dari Rp 50.000',
      estimate: '2 Hari',
      category: 'Desain & Grafis',
      status: 'PENDING',
      submittedAt: 'Hari ini, 10:15 WIB',
      description: 'Melayani pembuatan desain poster event, pamflet seminar, dan slide presentasi PPT modern interaktif.'
    },
    {
      id: 2,
      title: 'Jasa Olah Data SPSS & Analisis Statistik',
      author: 'Maya R. (Statistika - UB)',
      price: 'Mulai dari Rp 120.000',
      estimate: '3 Hari',
      category: 'Akademik & Data',
      status: 'PENDING',
      submittedAt: 'Kemarin, 16:40 WIB',
      description: 'Bantuan olah data penelitian kuantitatif, uji validitas, reliabilitas, regresi linier, dan interpretasi output SPSS lengkap.'
    },
    {
      id: 3,
      title: 'Jasa Koding Landing Page React & Tailwind',
      author: 'Budi S. (Informatika - UI)',
      price: 'Mulai dari Rp 250.000',
      estimate: '4 Hari',
      category: 'Web & Pemrograman',
      status: 'APPROVED',
      submittedAt: '24 Sep 2026',
      description: 'Pembuatan landing page responsif, rapi, performa cepat menggunakan React JS dan Tailwind CSS.'
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenReviewModal = (service) => {
    setSelectedService(service);
    setModalStep('REVIEW');
  };

  const handleApproveService = () => {
    if (!selectedService) return;
    setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, status: 'APPROVED' } : s));
    setModalStep(null);
    setSelectedService(null);
  };

  const handleRejectService = (reason, note) => {
    if (!selectedService) return;
    setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, status: 'REJECTED', rejectReason: reason, rejectNote: note } : s));
    setModalStep(null);
    setSelectedService(null);
  };

  const filteredServices = services.filter(service => {
    const matchesTab = service.status === activeTab;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = services.filter(s => s.status === 'PENDING').length;

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="moderasi"
      title="Moderasi Jasa Mahasiswa"
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      notifications={notifications}
      setNotifications={setNotifications}
      notificationRef={notificationRef}
      onNavigateDashboard={onNavigateDashboard}
      onNavigateTransactionVerification={onNavigateTransactionVerification}
      onNavigateServiceModeration={onNavigateServiceModeration}
      onNavigateUserManagement={onNavigateUserManagement}
      onNavigateSettings={onNavigateSettings}
    >
      <div className="p-8 space-y-6">
        {/* STATS HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FEF9C3]/80 border border-yellow-200 p-6 rounded-2xl shadow-xs flex justify-between items-start">
            <div>
              <span className="text-xs font-extrabold text-amber-900 block mb-2">Menunggu Persetujuan</span>
              <div className="text-3xl font-black text-amber-900">{pendingCount} Pengajuan</div>
            </div>
            <span className="px-2.5 py-1 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-lg">Butuh Aksi</span>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
            <span className="text-xs font-bold text-slate-400 block mb-2">Total Jasa Disetujui</span>
            <div className="text-3xl font-black text-slate-900">89 Jasa</div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
            <span className="text-xs font-bold text-slate-400 block mb-2">Jasa Ditolak</span>
            <div className="text-3xl font-black text-slate-900">12 Jasa</div>
          </div>
        </div>

        {/* TAB FILTER & CONTAINER LIST */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex border-b border-slate-100 gap-8">
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`pb-3 text-xs font-extrabold transition-all cursor-pointer relative ${
                activeTab === 'PENDING' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Menunggu Tinjauan ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('APPROVED')}
              className={`pb-3 text-xs font-extrabold transition-all cursor-pointer relative ${
                activeTab === 'APPROVED' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Disetujui / Aktif
            </button>
            <button
              onClick={() => setActiveTab('REJECTED')}
              className={`pb-3 text-xs font-extrabold transition-all cursor-pointer relative ${
                activeTab === 'REJECTED' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Ditolak
            </button>
          </div>

          {/* LIST JASA */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onReview={() => handleOpenReviewModal(service)}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Tidak ada data jasa</h4>
              <p className="text-xs text-slate-400">Tidak ada pengajuan jasa pada kategori tab ini saat ini.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL TINJAU & SETUJUI / TOLAK (DESAIN RINCIAN DENGAN 4 POIN LENGKAP) */}
      {modalStep === 'REVIEW' && selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto text-white shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Setujui Pengajuan Jasa?</h3>
              <p className="text-xs text-slate-400 leading-relaxed px-4">
                Jasa ini akan langsung diterbitkan dan dapat dilihat serta dipesan oleh seluruh pengguna di katalog.
              </p>
            </div>

            {/* RINCIAN TAMPILAN 4 POIN */}
            <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">1. JUDUL JASA</span>
                <h4 className="font-extrabold text-slate-900 text-sm">{selectedService.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">Oleh: {selectedService.author}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">2. Sampul & Media</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-28 bg-slate-200/80 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400">
                    Media 1
                  </div>
                  <div className="h-28 bg-slate-300/80 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400">
                    Media 2
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">3. Detail Paket & Harga</span>
                <h5 className="font-extrabold text-slate-900">Paket {selectedService.title}</h5>
                <div className="text-slate-600 space-y-0.5 pt-0.5">
                  <p><span className="font-medium text-slate-400">Harga Jasa (RP):</span> <span className="font-black text-slate-900">{selectedService.price.replace('Mulai dari ', '')}</span></p>
                  <p><span className="font-medium text-slate-400">Waktu Pengerjaan:</span> <span className="font-bold text-slate-800">{selectedService.estimate} Kerja</span></p>
                  <p><span className="font-medium text-slate-400">Revisi:</span> <span className="font-bold text-slate-800">2x Revisi</span></p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">4. Deskripsi & Keunggulan</span>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1 font-medium">
                  <li>File resolusi tinggi (PNG, JPG, Vector SVG)</li>
                  <li>Bebas konsultasi konsep warna & font</li>
                  <li>Garansi pengerjaan tepat waktu</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setModalStep('REJECT_FORM')} 
                className="flex-1 py-3 bg-[#FFE4E6] hover:bg-red-200 text-[#E11D48] font-bold text-xs rounded-2xl transition-all cursor-pointer"
              >
                Tolak Pengajuan
              </button>
              <button 
                onClick={handleApproveService} 
                className="flex-1 py-3 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-md shadow-emerald-600/20"
              >
                Ya, Setujui & Terbitkan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL FORM ALASAN PENOLAKAN */}
      {modalStep === 'REJECT_FORM' && selectedService && (
        <RejectServiceModal
          service={selectedService}
          onClose={() => setModalStep(null)}
          onConfirmReject={handleRejectService}
        />
      )}
    </AdminLayout>
  );
};

export default ServiceModerationPage;