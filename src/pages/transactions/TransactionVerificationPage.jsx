import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import TransactionTable from './components/TransactionTable';
import VerifyPaymentModal from './components/VerifyPaymentModal';
import ChatPreviewModal from './components/ChatPreviewModal';
import RejectTransactionModal from './components/RejectTransactionModal';

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
  const [advancedViewTrx, setAdvancedViewTrx] = useState(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Pembayaran Masuk',
      desc: 'Siti A. melakukan pembayaran #TRX-8821',
      time: '5 mnt lalu',
      unread: true
    }
  ]);

  const [transactions, setTransactions] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

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
          const rawNominal = Number(
            t.total_harga || t.harga || t.service_price || t.total_price || t.amount || 0
          );
          const rawStatus = (t.status || '').toLowerCase();

          let mappedStatus = 'Pending';
          if (rawStatus === 'selesai' || rawStatus === 'completed' || rawStatus === 'approved') {
            mappedStatus = 'Selesai';
          } else if (
            rawStatus === 'ditolak' ||
            rawStatus === 'rejected' ||
            rawStatus === 'cancelled'
          ) {
            mappedStatus = 'Ditolak';
          }

          return {
            rawId: t.id,
            id: `#TRX-${t.id}`,
            fullId: `TRX-${t.id}-2026`,
            title: t.service_title || t.deskripsi_transaksi || 'Pesanan Jasa Mahasiswa',
            serviceName: t.service_title || 'Layanan Jasa',
            buyer: t.buyer_name || 'Mahasiswa',
            seller: t.seller_name || 'Provider',
            rawAmount: rawNominal,
            amount: `Rp ${rawNominal.toLocaleString('id-ID')}`,
            status: mappedStatus,
            bank: t.payment_method || t.metode_pembayaran || 'QRIS',
            proofUrl: t.bukti_transfer || t.payment_proof || null
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

  const syncTransactionStatusToApi = async (trx, dbStatus, reason = '', note = '') => {
    const token = localStorage.getItem('adminToken');
    const numericId = trx.rawId || String(trx.id).replace(/[^0-9]/g, '');
    if (!token || !numericId) return;

    try {
      await fetch(`http://localhost:3000/api/admin/transactions/${numericId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: dbStatus,
          reason,
          note
        })
      });
    } catch (error) {
      console.error('Gagal memperbarui status transaksi ke server:', error);
    }
  };

  const handleOpenVerifyModal = (trx) => {
    setSelectedTrx(trx);
    setActiveModal('VERIFY');
  };

  const handleOpenRejectModal = (trx) => {
    setSelectedTrx(trx);
    setActiveModal('REJECT');
  };

  const handleProceedToAdvanced = () => {
    if (!selectedTrx) return;
    setAdvancedViewTrx(selectedTrx);
    setActiveModal(null);
  };

  const handleApproveInAdvanced = async () => {
    if (!advancedViewTrx) return;
    await syncTransactionStatusToApi(advancedViewTrx, 'selesai');

    const updatedTrx = { ...advancedViewTrx, status: 'Selesai' };
    setTransactions((prev) =>
      prev.map((t) => (t.id === advancedViewTrx.id ? updatedTrx : t))
    );
    setAdvancedViewTrx(updatedTrx);
  };

  const handleConfirmReject = async (reason, note) => {
    if (!selectedTrx) return;
    await syncTransactionStatusToApi(selectedTrx, 'ditolak', reason, note);

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTrx.id
          ? { ...t, status: 'Ditolak', rejectReason: reason, rejectNote: note }
          : t
      )
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
      title={advancedViewTrx ? 'Verifikasi Lanjut' : 'Verifikasi Transaksi'}
      breadcrumbs={
        advancedViewTrx
          ? [
              { label: 'Verifikasi Transaksi', onClick: () => setAdvancedViewTrx(null) },
              { label: 'Verifikasi Lanjut' }
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
        setAdvancedViewTrx(null);
        setActiveTab('ALL');
        onNavigateTransactionVerification();
      }}
      onNavigateServiceModeration={onNavigateServiceModeration}
      onNavigateUserManagement={onNavigateUserManagement}
      onNavigateSettings={onNavigateSettings}
    >
      {advancedViewTrx ? (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <button
            type="button"
            onClick={() => setAdvancedViewTrx(null)}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Verifikasi Transaksi</span>
          </button>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-7 space-y-6">
            {advancedViewTrx.status === 'Selesai' ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#DCFCE7]/80 border border-emerald-200 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-emerald-900">
                    Pembayaran Berhasil Diverifikasi!
                  </h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Pembayaran {advancedViewTrx.amount} telah diverifikasi. Penjual telah diberi tahu
                    untuk segera memulai pengerjaan pesanan Anda.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Pembayaran Belum Diverifikasi!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pembayaran {advancedViewTrx.amount} belum diverifikasi. Penjual belum diberi tahu
                  untuk memulai pengerjaan pesanan Anda.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    PROGRESS PESANAN
                  </h4>

                  <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 space-y-5">
                    <div className="flex items-start gap-3.5">
                      {advancedViewTrx.status === 'Selesai' ? (
                        <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={`text-xs font-extrabold ${
                            advancedViewTrx.status === 'Selesai'
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          Pembayaran Diverifikasi
                        </p>
                        {advancedViewTrx.status === 'Selesai' && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Dikonfirmasi oleh Super Admin
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      {advancedViewTrx.status === 'Selesai' ? (
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-4 border-blue-600 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={`text-xs font-extrabold ${
                            advancedViewTrx.status === 'Selesai'
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          Pesanan Diproses Penjual
                        </p>
                        {advancedViewTrx.status === 'Selesai' && (
                          <p className="text-[11px] font-semibold text-blue-600 mt-0.5">
                            Menunggu pengerjaan dari {advancedViewTrx.seller}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0 mt-0.5" />
                      <p className="text-xs font-extrabold text-slate-400 mt-1">
                        Selesai &amp; Konfirmasi
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    LOG PERCAKAPAN (READ-ONLY)
                  </h4>

                  <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px] flex items-center justify-center border-2 border-white">
                          {advancedViewTrx.seller.substring(0, 2).toUpperCase()}
                        </span>
                        <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-extrabold text-[10px] flex items-center justify-center border-2 border-white">
                          {advancedViewTrx.buyer.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">
                          {advancedViewTrx.seller} (Penjual) &amp; {advancedViewTrx.buyer} (Pembeli)
                        </p>
                        <p className="text-[11px] text-slate-400">Ruang Obrolan Transaksi</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTrx(advancedViewTrx);
                        setActiveModal('CHAT');
                      }}
                      className="px-4 py-2 bg-[#1D63ED] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Lihat Log Chat</span>
                    </button>
                  </div>
                </div>

                {advancedViewTrx.status === 'Pending' ? (
                  <button
                    type="button"
                    onClick={handleApproveInAdvanced}
                    className="w-full py-3.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Setujui Verifikasi</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 bg-slate-200/80 text-slate-400 font-extrabold text-xs sm:text-sm rounded-2xl cursor-not-allowed"
                  >
                    Konfirmasi Pesanan Selesai (Menunggu Hasil)
                  </button>
                )}
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  RINGKASAN PESANAN
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] text-slate-400 block">ID Transaksi</span>
                    <span className="font-black text-slate-900 text-sm mt-0.5 block">
                      {advancedViewTrx.id}
                    </span>
                  </div>

                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] text-slate-400 block">Nama Jasa</span>
                    <span className="font-extrabold text-slate-900 mt-0.5 block">
                      {advancedViewTrx.serviceName}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Penjual: {advancedViewTrx.seller}
                    </span>
                  </div>

                  <div className="space-y-2 border-b border-slate-100 pb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Harga Jasa</span>
                      <span className="font-extrabold text-slate-900">
                        {advancedViewTrx.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status Pembayaran</span>
                      {advancedViewTrx.status === 'Selesai' ? (
                        <span className="font-extrabold text-[#16A34A]">Lunas (Rekber)</span>
                      ) : (
                        <span className="font-extrabold text-amber-600">Pending</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-extrabold text-slate-900 text-sm">Total Pembayaran</span>
                    <span className="font-black text-lg text-[#16A34A]">
                      {advancedViewTrx.amount}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>JasaMahasiswa Guarantee</span>
                    </div>
                    <p className="text-[11px] text-emerald-700/90 leading-relaxed">
                      Dana Anda aman di rekening bersama dan baru dirilis ke penjual setelah Anda
                      mengonfirmasi hasil pengerjaan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#FEF9C3]/80 border border-yellow-200 p-5 rounded-3xl shadow-xs flex justify-between items-start">
              <div>
                <span className="text-xs font-extrabold text-amber-900 block mb-1">
                  Menunggu Verifikasi
                </span>
                <div className="text-2xl md:text-3xl font-black text-amber-900">
                  {pendingCount} Pesanan
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-xl shrink-0">
                Butuh Aksi
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                Mahasiswa Terdaftar
              </span>
              <div className="text-2xl md:text-3xl font-black text-slate-900">{totalUsers} User</div>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs sm:col-span-2 lg:col-span-1">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                Total Omset Platform
              </span>
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
                { id: 'REJECTED', label: 'Ditolak' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 font-extrabold whitespace-nowrap transition-all cursor-pointer relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-400 hover:text-slate-600'
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
      )}

      {activeModal === 'VERIFY' && selectedTrx && (
        <VerifyPaymentModal
          selectedTrx={selectedTrx}
          setActiveModal={setActiveModal}
          handleProceedToAdvanced={handleProceedToAdvanced}
        />
      )}

      {activeModal === 'REJECT' && selectedTrx && (
        <RejectTransactionModal
          selectedTrx={selectedTrx}
          onClose={() => {
            setActiveModal(null);
            setSelectedTrx(null);
          }}
          onConfirmReject={handleConfirmReject}
        />
      )}

      {activeModal === 'CHAT' && selectedTrx && (
        <ChatPreviewModal selectedTrx={selectedTrx} setActiveModal={setActiveModal} />
      )}
    </AdminLayout>
  );
};

export default TransactionVerificationPage;