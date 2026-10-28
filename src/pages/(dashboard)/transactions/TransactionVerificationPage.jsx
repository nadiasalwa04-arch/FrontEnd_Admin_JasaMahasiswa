import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import TransactionTable from './components/TransactionTable';
import VerifyPaymentModal from './components/VerifyPaymentModal';
import ChatPreviewModal from './components/ChatPreviewModal';

const TransactionVerificationPage = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Notification State & Ref
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Transaksi Baru', desc: 'Transaksi #TRX-8821 memerlukan verifikasi manual admin.', time: '5 mnt lalu', unread: true },
    { id: 2, title: 'Pembayaran Diterima', desc: 'Bukti transfer #JTRX-68021 telah diunggah pembeli.', time: '15 mnt lalu', unread: true },
  ]);

  // View States: 'LIST' | 'ADVANCED'
  const [currentView, setCurrentView] = useState('LIST');
  const [selectedTrx, setSelectedTrx] = useState(null);

  // Modal States: 'VERIFY_MODAL' | 'REJECT_MODAL' | 'CHAT_MODAL' | null
  const [activeModal, setActiveModal] = useState(null);
  
  // Reject Form State
  const [rejectReason, setRejectReason] = useState('Bukti transfer tidak terbaca / gambar buram');
  const [rejectNote, setRejectNote] = useState('Foto bukti transfer terpotong. Harap unggah ulang struk lengkap yang memperlihatkan tanggal dan nomor referensi transaksi.');

  // Data List Transaksi
  const [transactions, setTransactions] = useState([
    {
      id: '#TRX-8821',
      fullId: '#JTRX-68021',
      title: 'Jasa Web React & Tailwind (E-Wallet)',
      serviceName: 'Jasa Web Basic & Tutor C++ Interaktif',
      seller: 'Budi Setiawan',
      buyer: 'Andi Pratama',
      bank: 'Bank BCA',
      amount: 'Rp 77.000',
      status: 'Pending',
      isVerifiedAdvanced: false
    },
    {
      id: '#TRX-8820',
      fullId: '#JTRX-68020',
      title: 'Pencairan Saldo Bank BCA (a.n Andi)',
      serviceName: 'Pencairan Saldo',
      seller: 'Andi',
      buyer: 'Andi',
      bank: 'Bank BCA',
      amount: 'Rp 150.000',
      status: 'Ditolak',
      isVerifiedAdvanced: false
    },
    {
      id: '#TRX-8819',
      fullId: '#JTRX-68019',
      title: 'Jasa Desain Poster (QRIS)',
      serviceName: 'Jasa Desain Poster',
      seller: 'Siti Aminah',
      buyer: 'Rian K.',
      bank: 'QRIS Auto',
      amount: 'Rp 35.000',
      status: 'Selesai',
      isVerifiedAdvanced: true
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

  const handleOpenVerifyModal = (trx) => { setSelectedTrx(trx); setActiveModal('VERIFY_MODAL'); };
  const handleOpenRejectModal = (trx) => { setSelectedTrx(trx); setActiveModal('REJECT_MODAL'); };

  const handleProceedToAdvanced = () => {
    setActiveModal(null);
    setCurrentView('ADVANCED');
  };

  const handleConfirmReject = () => {
    if (!selectedTrx) return;
    setTransactions(prev => prev.map(t => t.id === selectedTrx.id ? { ...t, status: 'Ditolak' } : t));
    setActiveModal(null);
  };

  const handleApproveFinalVerification = () => {
    if (!selectedTrx) return;
    setTransactions(prev => prev.map(t => t.id === selectedTrx.id ? { ...t, status: 'Selesai', isVerifiedAdvanced: true } : t));
    setSelectedTrx(prev => ({ ...prev, status: 'Selesai', isVerifiedAdvanced: true }));
  };

  const filteredTrx = transactions.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="verifikasi"
      title="Verifikasi Transaksi"
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
      {/* VIEW 1: LIST VERIFIKASI TRANSAKSI */}
      {currentView === 'LIST' && (
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FEF9C3]/80 border border-yellow-200 p-6 rounded-2xl shadow-xs">
              <span className="text-xs font-extrabold text-amber-900 block mb-2">Menunggu Verifikasi (Masuk)</span>
              <div className="text-3xl font-black text-amber-900">8 Pesanan</div>
            </div>

            <div className="bg-[#EFF6FF]/80 border border-blue-200 p-6 rounded-2xl shadow-xs">
              <span className="text-xs font-extrabold text-blue-900 block mb-2">Mahasiswa Terdaftar</span>
              <div className="text-3xl font-black text-[#2563EB]">142 User</div>
            </div>

            <div className="bg-[#DCFCE7]/80 border border-emerald-200 p-6 rounded-2xl shadow-xs">
              <span className="text-xs font-extrabold text-emerald-900 block mb-2">Total Transaksi Selesai (Bulan Ini)</span>
              <div className="text-3xl font-black text-[#16A34A]">Rp 12.450.000</div>
            </div>
          </div>

          <TransactionTable 
            filteredTrx={filteredTrx}
            handleOpenVerifyModal={handleOpenVerifyModal}
            handleOpenRejectModal={handleOpenRejectModal}
          />
        </div>
      )}

      {/* VIEW 2: VERIFIKASI LANJUT */}
      {currentView === 'ADVANCED' && selectedTrx && (
        <div className="p-8 space-y-6">
          <button 
            onClick={() => setCurrentView('LIST')} 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Verifikasi Transaksi</span>
          </button>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-8">
            {selectedTrx.isVerifiedAdvanced ? (
              <div className="p-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 bg-[#16A34A] rounded-full flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#15803D]">Pembayaran Berhasil Diverifikasi!</h4>
                  <p className="text-[11px] text-[#166534]">Pembayaran {selectedTrx.amount} telah diverifikasi. Penjual telah diberi tahu untuk segera memulai pengerjaan pesanan Anda.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <h4 className="font-extrabold text-xs text-slate-900">Pembayaran Belum Diverifikasi!</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Pembayaran {selectedTrx.amount} belum diverifikasi. Penjual belum diberi tahu untuk memulai pengerjaan pesanan Anda.</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 bg-slate-50/60 border border-slate-100 rounded-2xl space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">PROGRESS PESANAN</h4>
                  
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${selectedTrx.isVerifiedAdvanced ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        {selectedTrx.isVerifiedAdvanced && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className={`font-bold block ${selectedTrx.isVerifiedAdvanced ? 'text-slate-900' : 'text-slate-400'}`}>Pembayaran Diverifikasi</span>
                        {selectedTrx.isVerifiedAdvanced && <span className="text-[10px] text-slate-400">28 Sep 2026, 09:45 WIB</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${selectedTrx.isVerifiedAdvanced ? 'bg-blue-600' : 'bg-slate-200'}`} />
                      <div>
                        <span className={`font-bold block ${selectedTrx.isVerifiedAdvanced ? 'text-blue-600' : 'text-slate-400'}`}>Pesanan Diproses Penjual</span>
                        {selectedTrx.isVerifiedAdvanced && <span className="text-[10px] text-blue-500">Estimasi selesai: 30 Sep 2026</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-slate-200" />
                      <span className="font-bold text-slate-400">Selesai & Konfirmasi</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">LOG PERCAKAPAN (READ-ONLY)</h4>
                  
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-extrabold text-[10px] flex items-center justify-center border-2 border-white">B</div>
                        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-extrabold text-[10px] flex items-center justify-center border-2 border-white">AR</div>
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-slate-900">{selectedTrx.seller} (Penjual) & {selectedTrx.buyer} (Pembeli)</h5>
                        <span className="text-[10px] text-slate-400">Ruang Obrolan Transaksi</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveModal('CHAT_MODAL')}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-xs"
                    >
                      Lihat Log Chat
                    </button>
                  </div>
                </div>

                {!selectedTrx.isVerifiedAdvanced ? (
                  <button 
                    onClick={handleApproveFinalVerification}
                    className="w-full py-3.5 bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl cursor-pointer transition-all shadow-md shadow-emerald-500/20"
                  >
                    Setujui Verifikasi
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full py-3 bg-slate-100 text-slate-400 font-bold text-xs rounded-2xl cursor-not-allowed"
                  >
                    Konfirmasi Pesanan Selesai (Menunggu Hasil)
                  </button>
                )}
              </div>

              <div className="p-6 bg-slate-50/80 border border-slate-100 rounded-2xl space-y-4">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">RINGKASAN PESANAN</h4>

                <div className="space-y-3 text-xs border-b border-slate-200/80 pb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">ID Transaksi</span>
                    <span className="font-black text-slate-900">{selectedTrx.fullId}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Nama Jasa</span>
                    <h5 className="font-extrabold text-slate-900">{selectedTrx.serviceName}</h5>
                    <span className="text-[10px] text-slate-400">Penjual: {selectedTrx.seller}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500">Harga Jasa</span>
                    <span className="font-black text-slate-900">{selectedTrx.amount}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Status Pembayaran</span>
                    <span className={`font-bold ${selectedTrx.isVerifiedAdvanced ? 'text-emerald-600' : 'text-amber-800'}`}>
                      {selectedTrx.isVerifiedAdvanced ? 'Lunas (Rekber)' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center font-black text-sm">
                  <span className="text-slate-900">Total Pembayaran</span>
                  <span className="text-emerald-600">{selectedTrx.amount}</span>
                </div>

                <div className="p-3.5 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[#16A34A] font-extrabold text-[11px]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>JasaMahasiswa Guarantee</span>
                  </div>
                  <p className="text-[10px] text-[#15803D] leading-relaxed">
                    Dana Anda aman di rekening bersama dan baru dirilis ke penjual setelah Anda mengonfirmasi hasil pengerjaan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP MODALS */}
      {activeModal === 'VERIFY_MODAL' && (
        <VerifyPaymentModal 
          selectedTrx={selectedTrx}
          setActiveModal={setActiveModal}
          handleProceedToAdvanced={handleProceedToAdvanced}
        />
      )}

      {activeModal === 'REJECT_MODAL' && selectedTrx && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Tolak Verifikasi Transaksi</h3>
                <span className="text-xs text-slate-400">ID Transaksi: {selectedTrx.fullId}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">RINCIAN PESANAN</span>
                <h4 className="font-extrabold text-slate-900">{selectedTrx.id}</h4>
              </div>
              <span className="font-black text-red-500 text-sm">{selectedTrx.amount}</span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 block">Pilih Alasan Penolakan <span className="text-red-500">*</span></label>
              
              {[
                'Bukti transfer tidak terbaca / gambar buram',
                'Nominal transfer tidak sesuai dengan harga jasa',
                'Terindikasi bukti pembayaran tidak valid / terduplikasi',
                'Lainnya (Tulis alasan khusus di bawah)'
              ].map((reason, idx) => (
                <label key={idx} className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  rejectReason === reason ? 'border-red-400 bg-red-50/50 text-red-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Catatan Tambahan untuk Pembeli</label>
              <textarea
                rows={3}
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-red-500 transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all">
                Batal
              </button>
              <button onClick={handleConfirmReject} className="px-6 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md shadow-red-500/20">
                Konfirmasi Penolakan
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'CHAT_MODAL' && (
        <ChatPreviewModal 
          selectedTrx={selectedTrx}
          setActiveModal={setActiveModal}
        />
      )}
    </AdminLayout>
  );
};

export default TransactionVerificationPage;