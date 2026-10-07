import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, LayoutDashboard, FileCheck2, ShieldCheck, Users, Bell, Search, ArrowLeft, Check, X, AlertTriangle, ChevronDown, Clock } from 'lucide-react';

const UserManagementPage = ({
  onNavigateDashboard = () => {},
  onNavigateTransactionVerification = () => {},
  onNavigateServiceModeration = () => {},
  onNavigateUserManagement = () => {},
  onNavigateSettings = () => {}
}) => {
  const [activeMenu, setActiveMenu] = useState('user-management');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');

  const [currentView, setCurrentView] = useState('LIST'); // 'LIST' | 'CHECK_KTM' | 'EDIT_DETAIL'
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', campus: '', phone: '', role: '', status: '' });
  const [vtNote, setVtNote] = useState('');

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Verifikasi KTM Baru', desc: 'Budi Setiawan mengunggah dokumen KTM.', time: '10 mnt lalu', unread: true },
    { id: 2, title: 'Pendaftaran User', desc: 'Rina Wijaya mendaftar sebagai Klien Umum.', time: '1 jam lalu', unread: true },
  ]);

  const [users, setUsers] = useState([
    { id: 1, initials: 'AP', name: 'Andi Pratama', email: 'andi@ui.ac.id', campus: 'Informatika UI', role: 'Penyedia Jasa', status: 'Ditolak', phone: '+62 812-3456-7890', nim: '22060129301', faculty: 'Fakultas Ilmu Komputer', major: 'S1 Informatika', uploadDate: '06 Okt 2026, 09:15 WIB' },
    { id: 2, initials: 'BS', name: 'Budi Setiawan', email: 'budi@ub.ac.id', campus: 'Desain Grafis UB', role: 'Klien', status: 'Pending', phone: '+62 813-9876-5432', nim: '215150200111', faculty: 'Fakultas Ilmu Komputer', major: 'S1 Desain Grafis', uploadDate: '07 Okt 2026, 14:20 WIB' },
    { id: 3, initials: 'R', name: 'Rina Wijaya', email: 'rina@gmail.com', campus: 'Umum / Non-Mahasiswa', role: 'Klien Umum', status: 'Aktif', phone: '+62 857-1122-3344', nim: '-', faculty: '-', major: '-', uploadDate: '-' },
    { id: 4, initials: 'JG', name: 'Jillsya Ginta', email: 'jillsyaginta@ub.ac.id', campus: 'Teknologi Informasi UB', role: 'Penyedia Jasa', status: 'Terverifikasi', phone: '+62 821-4455-6677', nim: '205150700111', faculty: 'Fakultas Ilmu Komputer', major: 'S1 Teknologi Informasi', uploadDate: '05 Okt 2026, 11:00 WIB' }
  ]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (key) => {
    setActiveMenu(key);
    setCurrentView('LIST');
    if (key === 'dashboard') onNavigateDashboard();
    else if (key === 'verifikasi') onNavigateTransactionVerification();
    else if (key === 'moderasi') onNavigateServiceModeration();
  };

  const handleOpenCheckKTM = (user) => { setSelectedUser(user); setVtNote(''); setCurrentView('CHECK_KTM'); };
  const handleOpenEditDetail = (user) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, campus: user.campus, phone: user.phone, role: user.role, status: user.status === 'Pending' ? 'Cek KTM (Menunggu Dokumen)' : user.status });
    setCurrentView('EDIT_DETAIL');
  };

  const handleApproveKTM = () => { if (selectedUser) setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: 'Terverifikasi' } : u)); setCurrentView('LIST'); };
  const handleRejectKTM = () => { if (selectedUser) setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: 'Ditolak' } : u)); setCurrentView('LIST'); };
  const handleSaveEdit = () => {
    if (!selectedUser) return;
    const updatedStatus = editForm.status === 'Cek KTM (Menunggu Dokumen)' ? 'Pending' : editForm.status;
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, name: editForm.name, email: editForm.email, campus: editForm.campus, phone: editForm.phone, role: editForm.role, status: updatedStatus } : u));
    setCurrentView('LIST');
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.campus.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'Semua' || u.role.includes(roleFilter);
    return matchSearch && matchRole;
  });

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'verifikasi', label: 'Verifikasi Transaksi', icon: FileCheck2 },
    { key: 'moderasi', label: 'Moderasi Jasa', icon: ShieldCheck, badge: 1 },
    { key: 'user-management', label: 'Manajemen User', icon: Users },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden font-sans select-none relative">
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-5 z-20 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20"><GraduationCap className="w-6 h-6 text-white" /></div>
            <div className="flex flex-col leading-tight font-bold text-base"><span className="text-slate-900">Jasa</span><span className="text-[#2563EB]">Mahasiswa</span></div>
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

      <main className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC]">
        <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md px-8 py-5 border-b border-slate-200/60">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Manajemen User</h1>
            <div className="flex items-center gap-4">
              {currentView === 'LIST' && (
                <>
                  <div className="relative w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input type="text" placeholder="Cari nama, universitas, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="relative">
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs font-semibold text-slate-700 pr-8 appearance-none focus:outline-none cursor-pointer">
                      <option value="Semua">Mahasiswa/Klien</option><option value="Penyedia Jasa">Penyedia Jasa</option><option value="Klien">Klien</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </>
              )}
              <div className="relative" ref={notificationRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer">
                  <Bell className="w-4 h-4" />
                  {notifications.some(n => n.unread) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                      <h4 className="text-xs font-bold text-slate-800">Notifikasi User</h4>
                      <span onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))} className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">Tandai dibaca</span>
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
            </div>
          </div>
          {currentView !== 'LIST' && (
            <div className="flex gap-8 mt-4 -mb-5 border-b border-slate-200/80 text-xs font-bold">
              <button onClick={() => setCurrentView('CHECK_KTM')} className={`pb-3 border-b-2 transition-all cursor-pointer ${currentView === 'CHECK_KTM' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Cek Dokumen/KTM</button>
              <button onClick={() => setCurrentView('EDIT_DETAIL')} className={`pb-3 border-b-2 transition-all cursor-pointer ${currentView === 'EDIT_DETAIL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Edit & Detail</button>
            </div>
          )}
        </header>

        <div className="p-8 space-y-6">
          {currentView === 'LIST' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs"><span className="text-xs font-bold text-slate-400 block mb-2">Total Pengguna</span><div className="text-2xl font-black text-slate-900">142 User</div></div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs"><span className="text-xs font-bold text-slate-400 block mb-2">Mahasiswa Terverifikasi</span><div className="text-2xl font-black text-slate-900">{users.filter(u => u.status === 'Terverifikasi').length + 83} Orang</div></div>
                <div className="bg-[#FEF9C3] p-6 rounded-2xl border border-yellow-200/70 shadow-xs flex justify-between items-start">
                  <div><span className="text-xs font-extrabold text-amber-900 block mb-2">Menunggu Verifikasi KTM</span><div className="text-2xl font-black text-amber-950">{users.filter(u => u.status === 'Pending').length + 10} Orang</div></div>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Profil</th><th className="py-4 px-6">Institusi / Kampus</th><th className="py-4 px-6">Peran</th><th className="py-4 px-6">Status</th><th className="py-4 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0">{u.initials}</div>
                            <div><div className="font-extrabold text-slate-900">{u.name}</div><div className="text-[11px] text-slate-400">{u.email}</div></div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800">{u.campus}</td>
                        <td className="py-4 px-6 text-slate-500 font-medium">{u.role}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 font-bold text-[11px] rounded-full inline-block ${u.status === 'Ditolak' ? 'bg-red-100 text-red-600' : u.status === 'Pending' ? 'bg-amber-100 text-amber-800' : u.status === 'Terverifikasi' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-600'}`}>{u.status}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {u.status === 'Terverifikasi' || u.status === 'Aktif' || u.role === 'Klien Umum' ? (
                            <button onClick={() => handleOpenEditDetail(u)} className="px-4 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-[11px] rounded-xl transition-all cursor-pointer">Edit / Detail</button>
                          ) : (
                            <button onClick={() => handleOpenCheckKTM(u)} className="px-4 py-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold text-[11px] rounded-xl transition-all cursor-pointer">Cek Dokumen</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {currentView === 'CHECK_KTM' && selectedUser && (
            <div className="space-y-6">
              <button onClick={() => setCurrentView('LIST')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-bold cursor-pointer"><ArrowLeft className="w-4 h-4" /><span>Kembali ke Manajemen User</span></button>
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div><h2 className="text-lg font-bold text-slate-900">Verifikasi Dokumen Kartu Tanda Mahasiswa (KTM)</h2><p className="text-xs text-slate-400 mt-0.5">Periksa kesesuaian dokumen yang diunggah dengan data pengguna di sistem</p></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">Lampiran Kartu Tanda Mahasiswa (KTM)</span>
                    <div className="bg-[#1E293B] p-6 rounded-3xl text-white space-y-4 shadow-md">
                      <div className="bg-[#2563EB] -mx-6 -mt-6 p-4 rounded-t-3xl font-extrabold text-xs tracking-wider border-b border-blue-400">UNIVERSITAS INDONESIA</div>
                      <div className="flex gap-4 items-center pt-2">
                        <div className="w-16 h-20 bg-slate-300 rounded-xl flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">FOTO</div>
                        <div className="space-y-1 text-xs"><h4 className="font-black text-sm tracking-wide uppercase">{selectedUser.name}</h4><p className="text-[11px] text-slate-300">NIM: {selectedUser.nim}</p><p className="text-[11px] text-slate-300">{selectedUser.faculty}</p><p className="text-[11px] text-slate-300">{selectedUser.major}</p></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-3 text-xs">
                      <div><span className="text-[11px] text-slate-400 block mb-0.5">Nama Pengguna</span><div className="font-black text-slate-900 text-sm">{selectedUser.name}</div></div>
                      <div><span className="text-[11px] text-slate-400 block mb-0.5">Institusi / Universitas</span><div className="font-extrabold text-slate-800">{selectedUser.campus}</div></div>
                      <div><span className="text-[11px] text-slate-400 block mb-0.5">Peran yang Diajukan</span><div className="font-bold text-blue-600">{selectedUser.role} (Mahasiswa Verified)</div></div>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button onClick={handleRejectKTM} className="flex-1 py-3 bg-[#EF4444] hover:bg-red-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"><X className="w-4 h-4" /><span>Tolak Dokumen</span></button>
                      <button onClick={handleApproveKTM} className="flex-1 py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"><Check className="w-4 h-4" /><span>Setujui KTM</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'EDIT_DETAIL' && selectedUser && (
            <div className="space-y-6">
              <button onClick={() => setCurrentView('LIST')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-bold cursor-pointer"><ArrowLeft className="w-4 h-4" /><span>Kembali ke Manajemen User</span></button>
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div><h2 className="text-lg font-bold text-slate-900">Edit & Detail Pengguna</h2><p className="text-xs text-slate-400 mt-0.5">Perbarui informasi profil, peran, dan status akun pengguna</p></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="flex flex-col items-center text-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="w-24 h-24 bg-[#DCE7FE] text-[#2563EB] rounded-full flex items-center justify-center text-2xl font-black mb-3">{selectedUser.initials}</div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{editForm.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{editForm.email}</p>
                    <span className="mt-3 px-4 py-1 bg-blue-100 text-blue-600 font-extrabold text-[10px] rounded-full">{editForm.role}</span>
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500" /></div>
                      <div><label className="text-xs font-bold text-slate-700 block mb-1">Alamat Email</label><input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 outline-none" /></div>
                      <div><label className="text-xs font-bold text-slate-700 block mb-1">Institusi / Kampus</label><input type="text" value={editForm.campus} onChange={(e) => setEditForm({ ...editForm, campus: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500" /></div>
                      <div><label className="text-xs font-bold text-slate-700 block mb-1">Nomor WhatsApp / Telepon</label><input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500" /></div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Peran (Role)</label>
                        <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none cursor-pointer">
                          <option value="Klien Umum">Klien Umum</option><option value="Klien">Klien</option><option value="Penyedia Jasa">Penyedia Jasa</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Status Akun</label>
                        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none cursor-pointer">
                          <option value="Terverifikasi">Terverifikasi</option><option value="Aktif">Aktif</option><option value="Cek KTM (Menunggu Dokumen)">Cek KTM (Menunggu Dokumen)</option><option value="Ditolak">Ditolak</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6">
                      <button type="button" onClick={() => setCurrentView('LIST')} className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">Batal</button>
                      <button type="button" onClick={handleSaveEdit} className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer">Simpan</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserManagementPage;