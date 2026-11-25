import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import TransactionTable from './components/TransactionTable';
import VerifyPaymentModal from './components/VerifyPaymentModal';
import ChatPreviewModal from './components/ChatPreviewModal';

const TransactionVerificationPage = ({
  isSidebarOpen,
  setIsSidebarOpen,
  pendingServiceCount = 0,
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const [selectedTrx, setSelectedTrx] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Pembayaran Masuk', desc: 'Siti A. melakukan pembayaran #TRX-8821', time: '5 mnt lalu', unread: true },
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: '#TRX-8821',
      fullId: 'TRX-8821-2026',
      title: 'Jasa Web React & Tailwind (E-Wallet)',
      serviceName: 'Jasa Web React & Tailwind',
      buyer: 'Siti A.',
      seller: 'Budi S.',
      amount: 'Rp 77.000',
      status: 'Pending',
      bank: 'GoPay / QRIS'
    },
    {
      id: '#TRX-8820',
      fullId: 'TRX-8820-2026',
      title: 'Pencairan Saldo Bank BCA (a.n Andi)',
      serviceName: 'Pencairan Saldo Bank BCA',
      buyer: 'Andi P.',
      seller: 'Platform',
      amount: 'Rp 150.000',
      status: 'Ditolak',
      bank: 'Transfer Bank BCA'
    },
    {
      id: '#TRX-8819',
      fullId: 'TRX-8819-2026',
      title: 'Jasa Desain Poster (QRIS)',
      serviceName: 'Jasa Desain Poster',
      buyer: 'Budi S.',
      seller: 'Arief S.',
      amount: 'Rp 35.000',
      status: 'Selesai',
      bank: 'QRIS Auto'
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

  const handleOpenVerifyModal = (trx) => {
    setSelectedTrx(trx);
    setActiveModal('VERIFY');
  };

  const handleOpenRejectModal = (trx) => {
    setSelectedTrx(trx);
    setActiveModal('REJECT');
  };

  const handleConfirmApprove = () => {
    if (!selectedTrx) return;
    setTransactions(prev => prev.map(t => t.id === selectedTrx.id ? { ...t, status: 'Selesai' } : t));
    setActiveModal(null);
    setSelectedTrx(null);
  };

  const filteredTrx = transactions.filter(t => {
    const matchesTab = activeTab === 'ALL' || 
                       (activeTab === 'PENDING' && t.status === 'Pending') ||
                       (activeTab === 'APPROVED' && t.status === 'Selesai') ||
                       (activeTab === 'REJECTED' && t.status === 'Ditolak');
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.buyer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = transactions.filter(t => t.status === 'Pending').length;

  const tabLabels = {
    PENDING: 'Pending',
    APPROVED: 'Terverifikasi',
    REJECTED: 'Ditolak',
  };

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="verifikasi"
      pendingServiceCount={pendingServiceCount}
      title="Verifikasi Transaksi"
      breadcrumbs={
        activeTab !== 'ALL'
          ? [
              { label: 'Verifikasi Transaksi', onClick: () => setActiveTab('ALL') },
              { label: tabLabels[activeTab] },
            ]
          : []
      }
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      notifications={notifications}
      setNotifications={setNotifications}
      notificationRef={notificationRef}
      onNavigateDashboard={onNavigateDashboard}
      onNavigateTransactionVerification={() => {
        setActiveTab('ALL');
        onNavigateTransactionVerification();
      }}
      onNavigateServiceModeration={onNavigateServiceModeration}
      onNavigateUserManagement={onNavigateUserManagement}
      onNavigateSettings={onNavigateSettings}
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#FEF9C3]/80 border border-yellow-200 p-5 rounded-3xl shadow-xs flex justify-between items-start">
            <div>
              <span className="text-xs font-extrabold text-amber-900 block mb-1">Menunggu Verifikasi</span>
              <div className="text-2xl md:text-3xl font-black text-amber-900">{pendingCount} Pesanan</div>
            </div>
            <span className="px-2.5 py-1 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-xl shrink-0">Butuh Aksi</span>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
            <span className="text-xs font-bold text-slate-400 block mb-1">Mahasiswa Terdaftar</span>
            <div className="text-2xl md:text-3xl font-black text-slate-900">142 User</div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-slate-400 block mb-1">Total Omset Platform</span>
            <div className="text-2xl md:text-3xl font-black text-emerald-600">Rp 12.450.000</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-6">
          <div className="flex border-b border-slate-100 gap-4 sm:gap-8 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'Semua Transaksi' },
              { id: 'PENDING', label: `Pending (${pendingCount})` },
              { id: 'APPROVED', label: 'Terverifikasi' },
              { id: 'REJECTED', label: 'Ditolak' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-extrabold whitespace-nowrap transition-all cursor-pointer relative ${
                  activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredTrx.length > 0 ? (
            <TransactionTable 
              filteredTrx={filteredTrx}
              handleOpenVerifyModal={handleOpenVerifyModal}
              handleOpenRejectModal={handleOpenRejectModal}
            />
          ) : (
            <div className="py-12 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Tidak ada transaksi ditemukan</h4>
            </div>
          )}
        </div>
      </div>

      {activeModal === 'VERIFY' && selectedTrx && (
        <VerifyPaymentModal
          selectedTrx={selectedTrx}
          setActiveModal={setActiveModal}
          handleProceedToAdvanced={handleConfirmApprove}
        />
      )}

      {activeModal === 'CHAT' && selectedTrx && (
        <ChatPreviewModal
          selectedTrx={selectedTrx}
          setActiveModal={setActiveModal}
        />
      )}
    </AdminLayout>
  );
};

export default TransactionVerificationPage;