import React, { useEffect, useState } from 'react';
import { X, Lock, FileText, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

const ChatPreviewModal = ({ selectedTrx, setActiveModal }) => {
  const [messages, setMessages] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedTrx) return;

    const rawIdentifier =
      selectedTrx.rawId ?? selectedTrx.orderId ?? selectedTrx.order_id ?? selectedTrx.id ?? '';
    const numericId = String(rawIdentifier).replace(/\D/g, '');

    if (!numericId) {
      setError('ID transaksi tidak ditemukan.');
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError('');

    const token = localStorage.getItem('adminToken');

    fetch(`${API_BASE_URL}/api/admin/transactions/${numericId}/chat-logs`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Gagal memuat riwayat chat');
        }
        if (!isCancelled) {
          setOrderInfo(json.order || null);
          setMessages(Array.isArray(json.data) ? json.data : []);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.message || 'Gagal terhubung ke server');
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedTrx]);

  if (!selectedTrx) return null;

  const buyerName = orderInfo?.buyer_name || selectedTrx.buyer || 'Pembeli';
  const sellerName = orderInfo?.seller_name || selectedTrx.seller || 'Penjual';
  const buyerInitials = buyerName.substring(0, 2).toUpperCase();
  const sellerInitials = sellerName.substring(0, 2).toUpperCase();

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* HEADER CHAT */}
        <div className="bg-[#2563EB] p-4 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-80 block">
              BUKTI VERIFIKASI • LOG CHAT
            </span>
            <h4 className="font-extrabold text-sm">
              {buyerName} (Pembeli) &amp; {sellerName} (Penjual)
            </h4>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 hover:bg-white/20 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CHAT BODY */}
        <div className="p-5 space-y-4 max-h-80 overflow-y-auto bg-slate-50/50 text-xs">
          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="font-semibold">Memuat riwayat percakapan...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500 font-semibold">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="py-8 text-center text-slate-400 font-semibold">
              Belum ada riwayat percakapan antara pembeli dan penjual pada transaksi ini.
            </div>
          ) : (
            messages.map((msg) => {
              const isBuyer = orderInfo?.buyer_id
                ? Number(msg.sender_id) === Number(orderInfo.buyer_id)
                : msg.sender_name === buyerName;

              if (isBuyer) {
                return (
                  <div key={msg.id} className="flex gap-2 items-start justify-end">
                    <div className="space-y-1 text-right max-w-[78%]">
                      <span className="text-[10px] text-blue-600 font-bold block">
                        {msg.sender_name || buyerName} (Pembeli) • {formatTime(msg.created_at)}
                      </span>
                      <div className="bg-[#EFF6FF] p-3 rounded-2xl border border-blue-100 text-slate-800 leading-relaxed text-left break-words">
                        {msg.message && <p>{msg.message}</p>}
                        {msg.file_url && (
                          <a
                            href={`${API_BASE_URL}${msg.file_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1.5 text-blue-600 font-bold underline"
                          >
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span>{msg.file_name || 'Lampiran File'}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0">
                      {buyerInitials}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex gap-2 items-start">
                  <div className="w-7 h-7 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    {sellerInitials}
                  </div>
                  <div className="space-y-1 max-w-[78%]">
                    <span className="text-[10px] text-slate-400 font-bold block">
                      {msg.sender_name || sellerName} (Penjual) • {formatTime(msg.created_at)}
                    </span>
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-slate-800 leading-relaxed break-words">
                      {msg.message && <p>{msg.message}</p>}
                      {msg.file_url && (
                        <a
                          href={`${API_BASE_URL}${msg.file_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1.5 text-blue-600 font-bold underline"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span>{msg.file_name || 'Lampiran File'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER CHAT */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center gap-3 text-slate-500 text-xs font-semibold">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-700 block text-[11px]">
              Mode Pantau (Read-Only) • Verifikasi Bukti Transaksi
            </span>
            <span className="text-[10px] text-slate-400">
              Admin hanya memantau. Mediasi/sengketa langsung diarahkan ke WhatsApp CS.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatPreviewModal;
