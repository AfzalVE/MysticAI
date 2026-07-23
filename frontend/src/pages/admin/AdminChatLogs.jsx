import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

const AdminChatLogs = () => {
  const { token } = useAuthStore();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/admin/chat-logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setChats(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [token]);

  return (
    <div className="p-6 md:p-10 animate-fadeIn">
      <h1 className="text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4">AI Chat Logs</h1>
      
      {loading ? (
        <div className="text-center text-slate-400"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>
      ) : (
        <div className="bg-black/40 rounded-xl border border-purple-500/30 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 font-sans">
            <thead className="bg-purple-900/30 text-purple-300 uppercase text-xs font-bold border-b border-purple-500/30">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Session Title</th>
                <th className="px-6 py-4">Message Count</th>
                <th className="px-6 py-4">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {chats.map(c => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{c.user_name}</td>
                  <td className="px-6 py-4 text-purple-300">{c.title || 'Mystic Guidance'}</td>
                  <td className="px-6 py-4">{c.messages?.length || 0}</td>
                  <td className="px-6 py-4">{new Date(c.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminChatLogs;
