import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

const AdminBookings = () => {
  const { token } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/admin/bookings', {
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
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
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
    </div>
  );
};

export default AdminBookings;
