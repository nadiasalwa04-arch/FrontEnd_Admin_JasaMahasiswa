import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, LayoutDashboard, FileCheck2, ShieldCheck, 
  Users, Search, Bell, CheckCircle2, XCircle, ArrowLeft, MessageSquare, X, Lock, Clock 
} from 'lucide-react';

const TransactionVerificationPage = ({
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const [activeMenu, setActiveMenu] = useState('verifikasi');
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Toggle State
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
      status: 'Pending', // 'Pending' | 'Selesai' | 'Ditolak'
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

  // Click Outside to Close Notification Dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Action Handlers
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
                  else if (key === 'moderasi') onNavigateServiceModeration();
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
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Verifikasi Transaksi</h1>
            {currentView === 'ADVANCED' && (
              <span className="text-xs font-bold text-blue-600 border-l-2 border-slate-300 pl-4">Verifikasi Lanjut</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentView === 'LIST' && (
              <div className="relative w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari transaksi, pengguna, jasa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#EEF2F6] border border-transparent rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300"
                />
              </div>
            )}

            <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-700">System Active</span>
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
                    <h4 className="text-xs font-bold text-slate-800">Notifikasi Transaksi</h4>
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

        {/* VIEW 1: LIST VERIFIKASI TRANSAKSI (IMAGE_70933A.PNG) */}
        {currentView === 'LIST' && (
          <div className="p-8 space-y-6">
            
            {/* STAT CARDS OVERVIEW */}
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

            {/* TABEL DAFTAR TRANSAKSI */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="grid grid-cols-12 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-4 py-2 bg-slate-50/70 rounded-xl">
                <div className="col-span-5">ID & RINCIAN TRANSAKSI</div>
                <div className="col-span-2">NOMINAL</div>
                <div className="col-span-2">STATUS</div>
                <div className="col-span-3 text-center">AKSI</div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredTrx.map((trx) => (
                  <div key={trx.id} className="grid grid-cols-12 items-center px-4 py-5 text-xs hover:bg-slate-50/50 rounded-xl transition-colors">
                    <div className="col-span-5 space-y-0.5">
                      <div className="font-black text-slate-900">{trx.id}</div>
                      <div className="text-[11px] text-slate-400">{trx.title}</div>
                    </div>

                    <div className="col-span-2 font-black text-blue-600">
                      {trx.status === 'Ditolak' ? <span className="text-red-500">{trx.amount}</span> : trx.amount}
                    </div>

                    <div className="col-span-2">
                      {trx.status === 'Pending' && <span className="px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded-full">Pending</span>}
                      {trx.status === 'Ditolak' && <span className="px-3 py-1 bg-red-100 text-red-600 font-extrabold text-[10px] rounded-full">Ditolak</span>}
                      {trx.status === 'Selesai' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-extrabold text-[10px] rounded-full">Selesai</span>}
                    </div>

                    <div className="col-span-3 text-center">
                      {trx.status === 'Pending' ? (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenVerifyModal(trx)} className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-xs">
                            Verifikasi
                          </button>
                          <button onClick={() => handleOpenRejectModal(trx)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all">
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {trx.status === 'Ditolak' ? 'Telah ditolak' : 'Telah diverifikasi'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: VERIFIKASI LANJUT (IMAGE_709396.PNG / IMAGE_7096B9.PNG) */}
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
              
              {/* HEADER ALERT BANNER */}
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
                
                {/* LEFT CONTENT: PROGRESS & LOG PERCAKAPAN */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* PROGRESS PESANAN */}
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

                  {/* LOG PERCAKAPAN (READ-ONLY) */}
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

                  {/* SETUJUI VERIFIKASI BUTTON */}
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

                {/* RIGHT CONTENT: RINGKASAN PESANAN */}
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

      </main>

      {/* --- POP-UP MODALS --- */}

      {/* 1. MODAL VERIFIKASI PEMBAYARAN (IMAGE_709359.PNG) */}
      {activeModal === 'VERIFY_MODAL' && selectedTrx && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Verifikasi Pembayaran</h3>
                <span className="text-xs text-slate-400">ID Transaksi: {selectedTrx.fullId}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">RINCIAN TRANSAKSI</span>
                <h4 className="font-extrabold text-slate-900">{selectedTrx.serviceName}</h4>
                <p className="text-[10px] text-slate-400">Pembeli: {selectedTrx.buyer} | {selectedTrx.bank}</p>
              </div>
              <span className="font-black text-blue-600 text-sm">{selectedTrx.amount}</span>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800 block">Bukti Transfer Pembeli</span>
              <div className="h-32 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center p-4 space-y-1">
                <span className="text-xs font-bold text-slate-500">[ Preview Bukti Transfer ]</span>
                <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                  ✓ Sesuai {selectedTrx.amount}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-[11px] text-[#15803D]">
              Dengan mengonfirmasi, dana ditampung di rekber dan penjual diberitahu untuk bekerja.
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all">
                Batal
              </button>
              <button onClick={handleProceedToAdvanced} className="flex-1 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-500/20">
                Lanjut Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL TOLAK VERIFIKASI TRANSAKSI (IMAGE_709378.PNG) */}
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

      {/* 3. MODAL LOG CHAT PERCAKAPAN (IMAGE_7093F8.PNG) */}
      {activeModal === 'CHAT_MODAL' && selectedTrx && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            
            {/* HEADER CHAT */}
            <div className="bg-[#2563EB] p-4 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-80 block">BUKTI VERIKASI • LOG CHAT</span>
                <h4 className="font-extrabold text-sm">{selectedTrx.buyer} (Pembeli) & {selectedTrx.seller} (Penjual)</h4>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-white/20 rounded-full transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CHAT BODY */}
            <div className="p-5 space-y-4 max-h-80 overflow-y-auto bg-slate-50/50 text-xs">
              <div className="text-center"><span className="px-3 py-1 bg-slate-200/80 text-slate-500 text-[10px] font-bold rounded-full">Hari ini, 14:32</span></div>

              {/* SELLER BUBBLE */}
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0">BS</div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">{selectedTrx.seller} (Penjual)</span>
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-slate-800 leading-relaxed">
                    Halo mas Arif! Pembayaran sudah saya terima ya.
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-start pl-9">
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-slate-800 leading-relaxed">
                  Bisa tolong diinfokan modul C++ bab berapa saja yang perlu saya persiapkan untuk tutoring-nya?
                </div>
              </div>

              {/* BUYER BUBBLE */}
              <div className="flex gap-2 items-start justify-end pt-2">
                <div className="space-y-1 text-right">
                  <span className="text-[10px] text-blue-600 font-bold block">{selectedTrx.buyer} (Pembeli)</span>
                  <div className="bg-[#EFF6FF] p-3 rounded-2xl border border-blue-100 text-slate-800 leading-relaxed text-left">
                    Halo Mas Budi! Terutama di bab Pointer dan Array 2 Dimensi mas. Mohon bantuannya ya!
                  </div>
                </div>
                <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0">AR</div>
              </div>
            </div>

            {/* FOOTER CHAT */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center gap-3 text-slate-500 text-xs font-semibold">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-700 block text-[11px]">Mode Pantau (Read-Only) • Verifikasi Bukti Transaksi</span>
                <span className="text-[10px] text-slate-400">Admin hanya memantau. Mediasi/sengketa langsung diarahkan ke WhatsApp CS.</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TransactionVerificationPage;