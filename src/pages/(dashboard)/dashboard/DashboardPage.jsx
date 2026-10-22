import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, LayoutDashboard, FileCheck2, ShieldCheck, 
  Users, Search, ArrowRight, Bell, Clock 
} from 'lucide-react';

const DashboardPage = ({
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {}
}) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
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

  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === 'verifikasi') onNavigateTransactionVerification();
    else if (key === 'moderasi') onNavigateServiceModeration();
    else if (key === 'user-management') onNavigateUserManagement();
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'verifikasi', label: 'Verifikasi Transaksi', icon: FileCheck2 },
    { key: 'moderasi', label: 'Moderasi Jasa', icon: ShieldCheck, badge: 1 },
    { key: 'user-management', label: 'Manajemen User', icon: Users },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden font-sans select-none relative">
      {/* SIDEBAR TERTANAM */}
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
              <button key={key} onClick={() => handleMenuClick(key)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${activeMenu === key ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                <div className="flex items-center gap-3"><Icon className="w-4 h-4" /><span>{label}</span></div>
                {badge && <span className="w-5 h-5 bg-amber-200 text-amber-800 font-bold text-[10px] rounded-full flex items-center justify-center">{badge}</span>}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={onNavigateSettings} className="pt-4 border-t border-slate-100 flex items-center gap-3 px-2 w-full text-left bg-slate-50 p-2 rounded-xl transition-all cursor-pointer hover:bg-slate-100">
          <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">AD</div>
          <div className="flex flex-col truncate"><span className="text-xs font-bold text-slate-800 truncate">Super Admin</span><span className="text-[11px] text-slate-400 truncate">admin@jasa.id</span></div>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC]">
        <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-slate-200/60">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input type="text" placeholder="Cari transaksi, pengguna, jasa..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#EEF2F6] border border-transparent rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 transition-all" />
            </div>
            <div className="relative shrink-0" ref={notificationRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer shadow-xs flex items-center justify-center">
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <h4 className="text-xs font-bold text-slate-800">Notifikasi Aktivitas</h4>
                    <span onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))} className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">Tandai dibaca</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2.5 rounded-xl text-xs border transition-colors ${n.unread ? 'bg-blue-50/60 border-blue-100/50' : 'bg-slate-50 border-slate-100'}`}>
                        <span className="font-extrabold text-slate-800 block text-[11px] mb-0.5">{n.title}</span>
                        <p className="text-slate-600 font-medium leading-snug">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1.5"><Clock className="w-3 h-3" /> {n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 bg-[#DCFCE7] border border-[#BBF7D0] rounded-full text-[#15803D] text-xs font-bold shrink-0">
              <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
              <span>System Active</span>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex justify-between items-start">
              <div><span className="text-xs font-bold text-slate-400 block mb-2">Total Omset Platform</span><div className="text-2xl font-black text-slate-900 tracking-tight">Rp 12.450.000</div></div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-extrabold text-[10px] rounded-full">↑ +12.5%</span>
            </div>
            <div className="bg-[#FEF9C3] p-6 rounded-3xl border border-yellow-200/80 shadow-xs flex justify-between items-start">
              <div><span className="text-xs font-bold text-amber-800 block mb-2">Perlu Verifikasi Transaksi</span><div className="text-2xl font-black text-amber-950 tracking-tight">8 Pesanan</div></div>
              <span className="px-3 py-1 bg-[#EAB308] text-white font-extrabold text-[10px] rounded-full shadow-xs">Butuh Aksi</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex justify-between items-start">
              <div><span className="text-xs font-bold text-slate-400 block mb-2">Mahasiswa Terdaftar</span><div className="text-2xl font-black text-slate-900 tracking-tight">142 User</div></div>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-600 font-extrabold text-[10px] rounded-full">+5 Minggu ini</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-5">VERIFIKASI TRANSAKSI KELUAR / MASUK</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-3">
                      <th className="pb-3 font-semibold">ID & RINCIAN TRANSAKSI</th><th className="pb-3 font-semibold">NOMINAL</th><th className="pb-3 font-semibold">STATUS</th><th className="pb-3 font-semibold">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {transactions.map((trx) => (
                      <tr key={trx.id}>
                        <td className="py-4"><div className="font-extrabold text-slate-900">{trx.id}</div><div className="text-[11px] text-slate-400 mt-0.5">{trx.desc}</div></td>
                        <td className={`py-4 font-bold ${trx.type === 'out' ? 'text-red-500' : 'text-blue-600'}`}>{trx.amount}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 font-bold text-[10px] rounded-md ${trx.status === 'Pending' ? 'bg-amber-100 text-amber-800' : trx.status === 'Ditolak' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>{trx.status}</span>
                        </td>
                        <td className="py-4">
                          {trx.actionable ? (
                            <div className="flex gap-2">
                              <button onClick={onNavigateTransactionVerification} className="px-3 py-1 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-all">Verifikasi</button>
                              <button onClick={onNavigateTransactionVerification} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg cursor-pointer transition-all">Tolak</button>
                            </div>
                          ) : <span className="text-[11px] text-slate-400 font-medium">{trx.actionNote}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pt-6 text-center border-t border-slate-100 mt-4">
                <button onClick={onNavigateTransactionVerification} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2563EB] hover:text-blue-700 cursor-pointer transition-colors">
                  <span>Lihat Semua Transaksi</span><ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-5">PERSETUJUAN JASA BARU</h3>
                <div className="space-y-4">
                  {pendingServices.map((svc) => (
                    <div key={svc.id} className="p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl ${svc.colorBg} shrink-0`} />
                        <div><h4 className="font-extrabold text-slate-900 text-xs">{svc.title}</h4><p className="text-[10px] text-slate-400 mt-0.5">{svc.author}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={onNavigateServiceModeration} className="flex-1 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer">Tinjau & Setujui</button>
                        <button onClick={onNavigateServiceModeration} className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] rounded-xl transition-all cursor-pointer">Tolak</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">MANAJEMEN MAHASISWA & USER TERBARU</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentUsers.map((u) => (
                <div key={u.id} className="p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-black text-xs flex items-center justify-center shrink-0">{u.initials}</div>
                    <div><h4 className="font-extrabold text-slate-900 text-xs">{u.name}</h4><p className="text-[11px] text-slate-400 mt-0.5">{u.info}</p></div>
                  </div>
                  {u.verified ? (
                    <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] font-extrabold text-[10px] rounded-full">{u.status}</span>
                  ) : (
                    <button onClick={onNavigateUserManagement} className="px-4 py-1.5 bg-[#F1F5F9] hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] rounded-xl cursor-pointer transition-all">{u.status}</button>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4 text-center border-t border-slate-100">
              <button onClick={onNavigateUserManagement} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2563EB] hover:text-blue-700 cursor-pointer transition-colors">
                <span>Kelola Semua Pengguna (142)</span><ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;