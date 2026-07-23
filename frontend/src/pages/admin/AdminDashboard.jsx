import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Users, WandSparkles, MessageSquare, Calendar, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setStats(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="p-8 text-center text-slate-400"><Loader2 className="animate-spin inline mr-2" /> Loading stats...</div>;
  if (!stats) return <div className="p-8 text-center text-red-400">Failed to load statistics.</div>;

  return (
    <div className="p-6 md:p-10 animate-fadeIn">
      <h1 className="text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4">Platform Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-900/40 to-black p-6 rounded-xl border border-purple-500/30 flex items-center gap-4">
          <div className="p-4 bg-purple-600/20 rounded-full text-purple-400"><Users size={28} /></div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Total Users</p>
            <p className="text-4xl font-bold text-white font-serif">{stats.total_users}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 to-black p-6 rounded-xl border border-blue-500/30 flex items-center gap-4">
          <div className="p-4 bg-blue-600/20 rounded-full text-blue-400"><WandSparkles size={28} /></div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Total Readings</p>
            <p className="text-4xl font-bold text-white font-serif">{stats.total_readings}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/40 to-black p-6 rounded-xl border border-green-500/30 flex items-center gap-4">
          <div className="p-4 bg-green-600/20 rounded-full text-green-400"><MessageSquare size={28} /></div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Chat Sessions</p>
            <p className="text-4xl font-bold text-white font-serif">{stats.total_chats}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/40 to-black p-6 rounded-xl border border-yellow-500/30 flex items-center gap-4">
          <div className="p-4 bg-yellow-600/20 rounded-full text-yellow-400"><Calendar size={28} /></div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Bookings</p>
            <p className="text-4xl font-bold text-white font-serif">{stats.total_bookings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
