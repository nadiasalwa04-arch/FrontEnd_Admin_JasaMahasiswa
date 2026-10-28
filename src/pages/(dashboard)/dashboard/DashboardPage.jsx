import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import StatCard from './components/StatCard';
import RecentActivity from './components/RecentActivity';

const DashboardPage = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateDashboard = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Verifikasi Transaksi', desc: 'Pesanan #TRX-8821 membutuhkan verifikasi manual.', time: '5 mnt lalu', unread: true },
    { id: 2, title: 'Moderasi Jasa', desc: 'Arief S. mengajukan jasa "Desain Poster & PPT".', time: '15 mnt lalu', unread: true },
    { id: 3, title: 'Registrasi User', desc: 'Rian Hidayat mendaftar sebagai Mahasiswa UB.', time: '1 jam lalu', unread: false },
  ]);

  const transactions = [
    { id: '#TRX-8821', desc: 'Jasa Web React & Tailwind (E-Wallet)', amount: 'Rp 77.000', status: 'Pending', actionable: true },
    { id: '#TRX-8820', desc: 'Pencairan Saldo Bank BCA (a.n Andi)', amount: 'Rp 150.000', status: 'Ditolak', type: 'out', actionNote: 'Telah ditolak' },
    { id: '#TRX-8819', desc: 'Jasa Desain Poster (QRIS)', amount: 'Rp 35.000', status: 'Selesai', actionNote: 'Terverifikasi Auto' }
  ];

  const pendingServices = [
    { id: 1, title: 'Jasa Desain Poster & PPT', author: 'Oleh: Arief S. (DKV Unesp)', colorBg: 'bg-amber-400' },
    { id: 2, title: 'Jasa Olah Data SPSS', author: 'Oleh: Maya R. (Statistika UB)', colorBg: 'bg-blue-500' }
  ];

  const recentUsers = [
    { id: 1, initials: 'AP', name: 'Andi Pratama', info: 'Informatika UI • 12 Jasa Terjual', status: 'Terverifikasi', verified: true },
    { id: 2, initials: 'RH', name: 'Rian Hidayat', info: 'Teknik UB • Pendaftaran Baru', status: 'Cek KTM / IPK', verified: false }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <AdminLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      activeMenu="dashboard"
      title="Dashboard Overview"
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
        {/* STAT CARD KOMPONEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Omset Platform" value="Rp 12.450.000" badgeText="↑ +12.5%" />
          <StatCard 
            title="Perlu Verifikasi Transaksi" 
            value="8 Pesanan" 
            badgeText="Butuh Aksi" 
            badgeBg="bg-[#EAB308] text-white" 
            cardBg="bg-[#FEF9C3]" 
            borderColor="border-yellow-200/80" 
            titleColor="text-amber-800" 
            valueColor="text-amber-950" 
          />
          <StatCard title="Mahasiswa Terdaftar" value="142 User" badgeText="+5 Minggu ini" badgeBg="bg-blue-100 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TABEL VERIFIKASI TRANSAKSI */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-5">VERIFIKASI TRANSAKSI KELUAR / MASUK</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-3">
                    <th className="pb-3 font-semibold">ID & RINCIAN TRANSAKSI</th>
                    <th className="pb-3 font-semibold">NOMINAL</th>
                    <th className="pb-3 font-semibold">STATUS</th>
                    <th className="pb-3 font-semibold">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {transactions.map((trx) => (
                    <tr key={trx.id}>
                      <td className="py-4">
                        <div className="font-extrabold text-slate-900">{trx.id}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{trx.desc}</div>
                      </td>
                      <td className={`py-4 font-bold ${trx.type === 'out' ? 'text-red-500' : 'text-blue-600'}`}>{trx.amount}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 font-bold text-[10px] rounded-md ${trx.status === 'Pending' ? 'bg-amber-100 text-amber-800' : trx.status === 'Ditolak' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                          {trx.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {trx.actionable ? (
                          <div className="flex gap-2">
                            <button onClick={onNavigateTransactionVerification} className="px-3 py-1 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-all">Verifikasi</button>
                            <button onClick={onNavigateTransactionVerification} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg cursor-pointer transition-all">Tolak</button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">{trx.actionNote}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pt-6 text-center border-t border-slate-100 mt-4">
              <button onClick={onNavigateTransactionVerification} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2563EB] hover:text-blue-700 cursor-pointer transition-colors">
                <span>Lihat Semua Transaksi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* PERSETUJUAN JASA BARU */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-5">PERSETUJUAN JASA BARU</h3>
              <div className="space-y-4">
                {pendingServices.map((svc) => (
                  <div key={svc.id} className="p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${svc.colorBg} shrink-0`} />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs">{svc.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{svc.author}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={onNavigateServiceModeration} className="flex-1 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer">
                        Tinjau & Setujui
                      </button>
                      <button onClick={onNavigateServiceModeration} className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] rounded-xl transition-all cursor-pointer">
                        Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY KOMPONEN */}
        <RecentActivity recentUsers={recentUsers} onNavigateUserManagement={onNavigateUserManagement} />
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;