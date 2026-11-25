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

  // STATE TRANSAKSI & TOTAL USER DARI DATABASE
  const [transactions, setTransactions] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // FUNGSI FETCH TRANSAKSI & STATISTIK USER DARI BACKEND
  const fetchTransactions = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const [trxRes, statsRes] = await Promise.all([
        fetch('http://localhost:3000/api/admin/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:3000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const result = await trxRes.json();
      const statsResult = await statsRes.json();

      if (statsResult.success && statsResult.data) {
        setTotalUsers(statsResult.data.totalUsers || 0);
      }

      if (result.success) {
        const mappedTrx = result.data.map((t) => {
          const rawNominal = Number(t.total_harga || t.harga || t.service_price || t.total_price || t.amount || 0);
          const rawStatus = (t.status || '').toLowerCase();

          let mappedStatus = 'Pending';
          if (rawStatus === 'selesai' || rawStatus === 'completed' || rawStatus === 'approved') {
            mappedStatus = 'Selesai';
          } else if (rawStatus === 'ditolak' || rawStatus === 'rejected' || rawStatus === 'cancelled') {
            mappedStatus = 'Ditolak';
          }

          return {
            id: `#TRX-${t.id}`,
            fullId: `TRX-${t.id}-2026`,
            title: t.service_title || t.deskripsi_transaksi || 'Pesanan Jasa Mahasiswa',
            serviceName: t.service_title || 'Layanan Jasa',
            buyer: t.buyer_name || 'Mahasiswa',
            seller: t.seller_name || 'Provider',
            rawAmount: rawNominal,
            amount: `Rp ${rawNominal.toLocaleString('id-ID')}`,
            status: mappedStatus,
            bank: t.payment_method || t.metode_pembayaran || 'QRIS'
          };
        });
        setTransactions(mappedTrx);
      }
    } catch (error) {
      console.error('Gagal mengambil data transaksi:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();

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
    setTransactions((prev) =>
      prev.map((t) => (t.id === selectedTrx.id ? { ...t, status: 'Selesai' } : t))
    );
    setActiveModal(null);
    setSelectedTrx(null);
  };

  const filteredTrx = transactions.filter((t) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'PENDING' && t.status === 'Pending') ||
      (activeTab === 'APPROVED' && t.status === 'Selesai') ||
      (activeTab === 'REJECTED' && t.status === 'Ditolak');
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.buyer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = transactions.filter((t) => t.status === 'Pending').length;
  const totalOmset = transactions.reduce((sum, t) => sum + (t.rawAmount || 0), 0);

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="verifikasi"
      pendingServiceCount={pendingServiceCount}
      title="Verifikasi Transaksi"
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
            <div className="text-2xl md:text-3xl font-black text-slate-900">{totalUsers} User</div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-slate-400 block mb-1">Total Omset Platform</span>
            <div className="text-2xl md:text-3xl font-black text-emerald-600">
              Rp {totalOmset.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-6">
          <div className="flex border-b border-slate-100 gap-4 sm:gap-8 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'Semua Transaksi' },
              { id: 'PENDING', label: `Pending (${pendingCount})` },
              { id: 'APPROVED', label: 'Terverifikasi' },
              { id: 'REJECTED', label: 'Ditolak' },
            ].map((tab) => (
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