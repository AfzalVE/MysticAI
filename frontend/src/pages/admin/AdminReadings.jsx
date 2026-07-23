import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

const AdminReadings = () => {
  const { token } = useAuthStore();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/readings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setReadings(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReadings();
  }, [token]);

  return (
    <div className="p-6 md:p-10 animate-fadeIn">
      <h1 className="text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4">All Readings</h1>
      
      {loading ? (
        <div className="text-center text-slate-400"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>
      ) : (
        <div className="bg-black/40 rounded-xl border border-purple-500/30 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 font-sans">
            <thead className="bg-purple-900/30 text-purple-300 uppercase text-xs font-bold border-b border-purple-500/30">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {readings.map(r => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{r.user_name}</td>
                  <td className="px-6 py-4 capitalize">{r.type}</td>
                  <td className="px-6 py-4">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 truncate max-w-xs">
                    {r.type === 'tarot' ? r.data?.spread_name || 'Tarot Draw' : r.data?.reading || r.data?.horoscope || 'Fortune Data'}
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

export default AdminReadings;
