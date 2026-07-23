import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, WandSparkles, MessageSquare, Plus, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AIChat = () => {
  const { token, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Welcome, seeker. What guidance do you seek today from the stars and spirits?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchSessions();
    }
  }, [isAuthenticated, token]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  const loadSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    setIsSidebarOpen(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/session/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load session", err);
    }
  };

  const startNewSession = () => {
    setCurrentSessionId(null);
    setMessages([{ role: 'assistant', content: 'Welcome, seeker. What guidance do you seek today from the stars and spirits?' }]);
    setIsSidebarOpen(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const payload = { messages: [...messages, userMsg] };
      if (currentSessionId) payload.session_id = currentSessionId;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

      if (data.session_id && data.session_id !== currentSessionId) {
        setCurrentSessionId(data.session_id);
        fetchSessions(); // Refresh sidebar
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'The connection to the ethereal plane was lost. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[85vh] flex flex-col md:flex-row gap-6 relative">

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden absolute top-4 left-4 z-50 text-white bg-purple-900/50 p-2 rounded-full border border-purple-500/30"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 absolute md:static z-40 top-0 left-0 h-full w-72 md:w-1/4 bg-black/95 md:bg-black/40 glass-panel border border-purple-500/30 flex flex-col`}>
        <button
          onClick={startNewSession}
          className="w-full flex items-center justify-center gap-2 p-3 mb-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors border border-purple-400"
        >
          <Plus size={20} /> New Consultation
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {sessions.length === 0 ? (
            <p className="text-slate-400 text-sm italic text-center mt-10">Your ethereal archives are empty.</p>
          ) : (
            sessions.map(s => (
              <button
                key={s.id}
                onClick={() => loadSession(s.id)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${currentSessionId === s.id ? 'bg-purple-900/60 border border-purple-500 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-transparent'}`}
              >
                <MessageSquare size={16} className={currentSessionId === s.id ? 'text-yellow-400' : 'text-slate-500'} />
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-bold">{s.title}</p>
                  <p className="text-xs text-slate-500">{new Date(s.updated_at).toLocaleDateString()}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-black/40 glass-panel border border-purple-500/30 overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-white/10 text-center shrink-0">
          <h1 className="text-2xl font-bold text-yellow-400 flex justify-center items-center gap-2 font-serif">
            <WandSparkles className="w-5 h-5" /> {currentSessionId ? sessions.find(s => s.id === currentSessionId)?.title || 'Spiritual Guide' : 'Spiritual Guide'}
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white' : 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <WandSparkles size={20} />}
                </div>
                <div className={`p-4 rounded-2xl font-sans text-sm md:text-base leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-purple-900/40 border border-purple-500/30 rounded-tr-none text-purple-100' : 'bg-black/60 border border-white/10 rounded-tl-none text-slate-200'}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-black flex items-center justify-center shrink-0 shadow-lg">
                  <WandSparkles size={20} />
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 rounded-tl-none flex items-center gap-3 text-slate-400 shadow-lg">
                  <Loader2 className="animate-spin w-5 h-5 text-purple-400" /> <span className="italic">Consulting the ether...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-black/60 shrink-0">
          <div className="relative max-w-4xl mx-auto flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the spirits a question..."
              className="w-full bg-black/50 border border-purple-500/30 rounded-full pl-6 pr-14 py-4 text-white font-sans focus:outline-none focus:border-purple-400 shadow-inner"
            />
            <button type="submit" disabled={loading} className="absolute right-2 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-colors shadow-lg disabled:opacity-50">
              <Send size={18} className="text-white ml-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
