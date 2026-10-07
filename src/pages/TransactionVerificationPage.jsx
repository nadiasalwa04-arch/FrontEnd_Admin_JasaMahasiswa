import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap, LayoutDashboard, FileCheck2, ShieldCheck,
  Users, Bell, Search, Clock
} from 'lucide-react';


const TransactionVerificationPage = ({
  onNavigateDashboard = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {}
}) => {
  const [activeMenu, setActiveMenu] = useState('verifikasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);


  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Pembayaran Baru', desc: 'Transaksi #JTRX-68021 memerlukan verifikasi.', time: '5 mnt lalu', unread: true },
    { id: 2, title: 'Pencairan Saldo', desc: 'Permintaan pencairan dana dari Andi (#TRX-8820).', time: '1 jam lalu', unread: true },
  ]);


  const [transactions, setTransactions] = useState([
    { id: '#JTRX-68021', details: 'Jasa Web React & Tailwind (E-Wallet)', nominal: 'Rp 77.000', status: 'Pending' },
    { id: '#TRX-8820', details: 'Pencairan Saldo Bank BCA (a.n Andi)', nominal: 'Rp 150.000', status: 'Ditolak' },
    { id: '#TRX-8819', details: 'Jasa Desain Poster (QRIS)', nominal: 'Rp 35.000', status: 'Selesai' }
  ]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleMenuClick = (menuKey) => {
    setActiveMenu(menuKey);
    if (menuKey === 'dashboard') onNavigateDashboard();
    else if (menuKey === 'verifikasi') onNavigateTransactionVerification();
    else if (menuKey === 'moderasi') onNavigateServiceModeration();
    else if (menuKey === 'user-management') onNavigateUserManagement();
  };


  const handleVerify = (id) => {
    setTransactions(prev => prev.map(trx => trx.id === id ? { ...trx, status: 'Selesai' } : trx));
  };


  const handleReject = (id) => {
    setTransactions(prev => prev.map(trx => trx.id === id ? { ...trx, status: 'Ditolak' } : trx));
  };


  const unreadCount = notifications.filter(n => n.unread).length;
  const pendingCount = transactions.filter(t => t.status === 'Pending').length;


  const filteredTransactions = transactions.filter(trx =>
    trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trx.details.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'verifikasi', label: 'Verifikasi Transaksi', icon: FileCheck2 },
    { key: 'moderasi', label: 'Moderasi Jasa', icon: ShieldCheck },
    { key: 'user-management', label: 'Manajemen User', icon: Users },
  ];


  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden font-sans select-none relative">
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
            {menuItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleMenuClick(key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeMenu === key ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>


        <button
          onClick={onNavigateSettings}
          className="pt-4 border-t border-slate-100 flex items-center gap-3 px-2 w-full text-left bg-slate-50 p-2 rounded-xl transition-all cursor-pointer hover:bg-slate-100"
        >
          <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">AD</div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-slate-800 truncate">Super Admin</span>
            <span className="text-[11px] text-slate-400 truncate">admin@jasa.id</span>
          </div>
        </button>
      </aside>


      <main className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC]">
        <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-slate-200/60">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Verifikasi Transaksi</h1>


          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari transaksi, pengguna, jasa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition-all"
              />
            </div>


            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>


              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <h4 className="text-xs font-bold text-slate-800">Notifikasi Aktivitas</h4>
                    <span onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))} className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">
                      Tandai dibaca
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2.5 rounded-xl text-xs border ${n.unread ? 'bg-blue-50/60 border-blue-100/50' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-slate-700 font-medium leading-snug">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> {n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>


            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>System Active</span>
            </div>
          </div>
        </header>


        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FEF9C3] p-6 rounded-2xl border border-yellow-200/70 shadow-xs">
              <span className="text-xs font-extrabold text-amber-900 tracking-wide block mb-2">Menunggu Verifikasi (Masuk)</span>
              <div className="text-2xl font-black text-amber-950">{pendingCount} Pesanan</div>
            </div>


            <div className="bg-[#EFF6FF] p-6 rounded-2xl border border-blue-200/70 shadow-xs">
              <span className="text-xs font-extrabold text-blue-900 tracking-wide block mb-2">Mahasiswa Terdaftar</span>
              <div className="text-2xl font-black text-blue-950">142 User</div>
            </div>


            <div className="bg-[#DCFCE7] p-6 rounded-2xl border border-emerald-200/70 shadow-xs">
              <span className="text-xs font-extrabold text-emerald-900 tracking-wide block mb-2">Total Transaksi Selesai (Bulan Ini)</span>
              <div className="text-2xl font-black text-emerald-950">Rp 12.450.000</div>
            </div>
          </div>


          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">ID & Rincian Transaksi</th>
                    <th className="py-4 px-6">Nominal</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-slate-900">{trx.id}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{trx.details}</div>
                      </td>
                      <td className="py-4 px-6 font-bold text-blue-600">{trx.nominal}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 font-bold text-[11px] rounded-full inline-block ${
                          trx.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          trx.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {trx.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {trx.status === 'Pending' ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleVerify(trx.id)} className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl cursor-pointer">
                              Verifikasi
                            </button>
                            <button onClick={() => handleReject(trx.id)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer">
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="italic text-slate-400 font-medium">Telah {trx.status.toLowerCase()}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


export default TransactionVerificationPage;

