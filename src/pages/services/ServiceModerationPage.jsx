import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import ServiceCard from './components/ServiceCard';
import RejectServiceModal from './components/RejectServiceModal';
import ServiceDetailModal from './components/ServiceDetailModal';

const ServiceModerationPage = ({
  isSidebarOpen,
  setIsSidebarOpen,
  pendingServiceCount,
  services = [],       // Menerima dari App.jsx
  setServices,        // Menerima dari App.jsx
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
    if (!selectedService || !setServices) return;
    setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, status: 'APPROVED' } : s));
    setModalStep(null);
    setSelectedService(null);
  };

  const handleRejectService = (reason, note) => {
    if (!selectedService || !setServices) return;
    setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, status: 'REJECTED', rejectReason: reason, rejectNote: note } : s));
    setModalStep(null);
    setSelectedService(null);
  };

  const filteredServices = services.filter(service => {
    const matchesTab = service.status === activeTab;
    const matchesSearch = (service.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (service.author || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = services.filter(s => s.status === 'PENDING').length;

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="moderasi"
      pendingServiceCount={pendingServiceCount}
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
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
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
            <div className="text-3xl font-black text-slate-900">
              {services.filter(s => s.status === 'APPROVED').length} Jasa
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
            <span className="text-xs font-bold text-slate-400 block mb-2">Jasa Ditolak</span>
            <div className="text-3xl font-black text-slate-900">
              {services.filter(s => s.status === 'REJECTED').length} Jasa
            </div>
          </div>
        </div>

        {/* TAB FILTER & CONTAINER LIST */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex border-b border-slate-100 gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`pb-3 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap relative ${
                activeTab === 'PENDING' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Menunggu Tinjauan ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('APPROVED')}
              className={`pb-3 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap relative ${
                activeTab === 'APPROVED' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Disetujui / Aktif
            </button>
            <button
              onClick={() => setActiveTab('REJECTED')}
              className={`pb-3 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap relative ${
                activeTab === 'REJECTED' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Ditolak
            </button>
          </div>

          {/* LIST JASA DENGAN SERVICE CARD */}
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

      {/* SUB-KOMPONEN MODAL DETAIL & REJECT */}
      {modalStep === 'REVIEW' && selectedService && (
        <ServiceDetailModal
          selectedService={selectedService}
          closeModal={() => {
            setModalStep(null);
            setSelectedService(null);
          }}
          onApprove={handleApproveService}
          onReject={() => setModalStep('REJECT_FORM')}
        />
      )}

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