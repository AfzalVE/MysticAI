import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Loader2, X } from 'lucide-react';

const AdminBookings = () => {
  const { token } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setBookings(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  return (
    <div className="p-6 md:p-10 animate-fadeIn">
      <h1 className="text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4">All Bookings</h1>
      
      {loading ? (
        <div className="text-center text-slate-400"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>
      ) : (
        <div className="bg-black/40 rounded-xl border border-purple-500/30 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 font-sans">
            <thead className="bg-purple-900/30 text-purple-300 uppercase text-xs font-bold border-b border-purple-500/30">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map(b => (
                <tr key={b.id} onClick={() => setSelectedBooking(b)} className="hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-bold text-white">{b.user_name}</td>
                  <td className="px-6 py-4">{b.details?.name || '-'}</td>
                  <td className="px-6 py-4 capitalize text-purple-300 font-bold">{b.consultation_type}</td>
                  <td className="px-6 py-4">{b.date} at {b.time}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold uppercase">{b.status || 'Confirmed'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Modal Overlay */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative glass-panel shadow-2xl text-left">
            <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-black/40 rounded-full p-2 border border-white/10">
              <X size={20} />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-serif text-yellow-400 mb-2 capitalize">Booking Details</h2>
              <p className="text-sm text-slate-400 mb-6 border-b border-white/10 pb-4">ID: {selectedBooking.id}</p>
              
              <div className="space-y-4 text-slate-200 font-sans">
                <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                  <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">User Account</p>
                  <p className="font-bold text-white">{selectedBooking.user_name}</p>
                </div>
                
                <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                  <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">Client Details</p>
                  <p><strong>Name:</strong> {selectedBooking.details?.name}</p>
                  <p><strong>Email:</strong> {selectedBooking.details?.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">Type</p>
                    <p className="font-bold capitalize text-yellow-400">{selectedBooking.consultation_type}</p>
                  </div>
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">Status</p>
                    <p className="font-bold uppercase text-green-400">{selectedBooking.status || 'Confirmed'}</p>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                  <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">Schedule</p>
                  <p className="text-lg font-bold">{selectedBooking.date} @ {selectedBooking.time}</p>
                </div>

                {selectedBooking.details?.notes && (
                  <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                    <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">Client Notes</p>
                    <p className="text-sm italic text-slate-300">"{selectedBooking.details.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
