import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Compass, Save, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const FortuneTelling = () => {
  const [formData, setFormData] = useState({ name: '', dob: '', time_of_birth: '', birth_place: '' });
  const [loading, setLoading] = useState(false);
  const [fortune, setFortune] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { isAuthenticated, token, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name || '',
          dob: data.dob || '',
          time_of_birth: data.time_of_birth || '',
          birth_place: data.birth_place || ''
        });
      })
      .catch(console.error);
    }
  }, [isAuthenticated, token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFortune(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/fortune/fortune`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to fetch fortune. The spirits are quiet.');
      const data = await res.json();
      setFortune(data);
      
      // Auto-save
      if (isAuthenticated && token) {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/save_reading`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ type: 'fortune', data: data })
        }).catch(e => console.error("Auto-save failed", e));
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 font-serif drop-shadow-md">
          Cosmic Fortune
        </h1>
        <p className="text-slate-300 text-center mb-12 font-sans text-lg md:text-xl max-w-2xl mx-auto">
          The alignment of the planets at your exact moment of birth shaped your destiny. Provide your details below to calculate your astrological chart and reveal what the stars have in store.
        </p>

        {!fortune ? (
          <form onSubmit={handleSubmit} className="glass-panel max-w-xl mx-auto animate-fadeIn bg-black/50 border-purple-500/30 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600 rounded-full blur-[80px] opacity-30 pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="mb-5">
                <label className="block text-purple-200 mb-2 font-semibold tracking-wide">Given Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="mystic-input bg-black/50" placeholder="e.g. Luna" />
              </div>
              <div className="mb-5">
                <label className="block text-purple-200 mb-2 font-semibold tracking-wide">Date of Origin *</label>
                <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="mystic-input bg-black/50" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold tracking-wide">Time (Optional)</label>
                  <input type="time" name="time_of_birth" value={formData.time_of_birth} onChange={handleChange} className="mystic-input bg-black/50 text-sm" />
                  <p className="text-xs text-slate-500 mt-1">Crucial for rising sign accuracy.</p>
                </div>
                <div>
                  <label className="block text-purple-200 mb-2 font-semibold tracking-wide">Place (Optional)</label>
                  <input type="text" name="birth_place" value={formData.birth_place} onChange={handleChange} className="mystic-input bg-black/50 text-sm" placeholder="e.g. London, UK" />
                  <p className="text-xs text-slate-500 mt-1">Required for exact planetary houses.</p>
                </div>
              </div>

              {error && <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 mb-4">{error}</div>}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                   <Compass className="w-16 h-16 text-yellow-400 animate-spin-slow mb-4" />
                   <p className="text-purple-300 font-serif animate-pulse">Calculating astrological transits...</p>
                </div>
              ) : (
                <button type="submit" className="btn-mystic w-full py-4 text-lg font-bold shadow-[0_0_20px_rgba(157,78,221,0.4)]">
                  Reveal My Destiny
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="glass-panel animate-fadeIn bg-black/40 border-purple-500/20">
            <h2 className="text-4xl font-bold text-center text-yellow-400 mb-10 font-serif tracking-wider">Your Cosmic Blueprint</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-purple-900/40 to-black p-8 rounded-2xl border border-purple-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-purple-300 mb-2 font-sans">Numerology Resonance</h3>
                  <p className="text-5xl font-serif text-white font-bold">{fortune.lucky_number}</p>
                </div>
                <Sparkles className="text-yellow-400 w-12 h-12 opacity-50" />
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-black p-8 rounded-2xl border border-purple-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-purple-300 mb-2 font-sans">Aura Color</h3>
                  <p className="text-4xl font-serif font-bold drop-shadow-md" style={{color: fortune.lucky_color}}>{fortune.lucky_color}</p>
                </div>
                <div className="w-12 h-12 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" style={{backgroundColor: fortune.lucky_color}}></div>
              </div>
            </div>
            
            <div className="space-y-8 text-slate-200 font-sans leading-relaxed text-lg">
              <div className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <h3 className="text-2xl text-yellow-400 mb-4 font-serif font-bold border-b border-yellow-400/20 pb-2 inline-block">The Stars Proclaim</h3>
                <p className="whitespace-pre-wrap relative z-10 leading-loose">{fortune.horoscope}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-black/30 p-6 rounded-2xl border-l-4 border-purple-500">
                    <h3 className="text-xl text-purple-300 mb-3 font-serif">Core Traits</h3>
                    <p className="text-slate-300">{fortune.personality_traits}</p>
                 </div>
                 <div className="bg-black/30 p-6 rounded-2xl border-l-4 border-pink-500">
                    <h3 className="text-xl text-pink-300 mb-3 font-serif">Love & Connections</h3>
                    <p className="text-slate-300">{fortune.love_compatibility}</p>
                 </div>
                 <div className="bg-black/30 p-6 rounded-2xl border-l-4 border-blue-500">
                    <h3 className="text-xl text-blue-300 mb-3 font-serif">Career & Wealth</h3>
                    <p className="text-slate-300">{fortune.career_guidance}</p>
                 </div>
                 <div className="bg-black/30 p-6 rounded-2xl border-l-4 border-yellow-500">
                    <h3 className="text-xl text-yellow-300 mb-3 font-serif">Today's Prediction</h3>
                    <p className="text-slate-300">{fortune.daily_prediction}</p>
                 </div>
              </div>
            </div>
            
            <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-6">
              <button onClick={() => setFortune(null)} className="btn-outline px-10 py-3 text-lg">Consult Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FortuneTelling;
