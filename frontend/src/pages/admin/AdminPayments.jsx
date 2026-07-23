import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Loader2, DollarSign, CheckCircle, RefreshCcw } from 'lucide-react';

const AdminPayments = () => {
  const { token } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

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

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status_update: newStatus })
      });
      if (res.ok) {
        // Refresh bookings
        await fetchBookings();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 md:p-10 animate-fadeIn">
      <h1 className="text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
        <DollarSign className="text-green-400" size={32} /> Payments Management
      </h1>
      
      {loading ? (
        <div className="text-center text-slate-400"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>
      ) : (
        <div className="bg-black/40 rounded-xl border border-purple-500/30 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 font-sans">
            <thead className="bg-purple-900/30 text-purple-300 uppercase text-xs font-bold border-b border-purple-500/30">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{b.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{b.user_name}</td>
                  <td className="px-6 py-4 capitalize">{b.consultation_type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${b.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : b.status === 'paid' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                      {b.status || 'Confirmed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {b.status === 'paid' && (
                        <button 
                          onClick={() => updateStatus(b.id, 'confirmed')}
                          disabled={updating === b.id}
                          className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded flex items-center gap-1 disabled:opacity-50 transition-colors"
                        >
                          {updating === b.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Confirm
                        </button>
                      )}
                      {b.status === 'pending' && (
                        <button 
                          onClick={() => updateStatus(b.id, 'paid')}
                          disabled={updating === b.id}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-1 disabled:opacity-50 transition-colors"
                        >
                          {updating === b.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />} Mark Paid
                        </button>
                      )}
                    </div>
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

export default AdminPayments;
