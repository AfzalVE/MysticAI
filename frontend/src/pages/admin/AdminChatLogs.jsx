import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Loader2, X, MessageCircle } from 'lucide-react';

const AdminChatLogs = () => {
  const { token } = useAuthStore();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/chat-logs`, {
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
                <tr key={c.id} onClick={() => setSelectedChat(c)} className="hover:bg-white/5 transition-colors cursor-pointer">
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

      {/* Chat Log Modal Overlay */}
      {selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-3xl w-full h-[85vh] flex flex-col relative glass-panel shadow-2xl text-left">
            <button onClick={() => setSelectedChat(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-black/40 rounded-full p-2 border border-white/10 z-10">
              <X size={20} />
            </button>
            <div className="p-6 border-b border-white/10 shrink-0">
              <h2 className="text-2xl font-serif text-yellow-400 mb-1 flex items-center gap-2"><MessageCircle size={24}/> {selectedChat.title || 'Mystic Guidance'}</h2>
              <p className="text-sm text-slate-400">User: {selectedChat.user_name} | Updated: {new Date(selectedChat.updated_at).toLocaleString()}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans bg-black/20">
              {selectedChat.messages?.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-4 ${msg.role === 'user' ? 'bg-purple-600/80 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-purple-500/30 rounded-tl-none'}`}>
                    <span className="block text-xs opacity-50 mb-1 uppercase tracking-widest">{msg.role}</span>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {(!selectedChat.messages || selectedChat.messages.length === 0) && (
                <p className="text-center text-slate-500 italic">No messages recorded in this session.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatLogs;
