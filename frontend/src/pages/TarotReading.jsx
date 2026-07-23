import React, { useState } from 'react';
import { Moon, Loader2, Save, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const TarotReading = () => {
  const [spreadType, setSpreadType] = useState('1_card');
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(null);
  const [error, setError] = useState('');
  const [flippedCards, setFlippedCards] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { isAuthenticated, token } = useAuthStore();
  
  const drawCards = async () => {
    setLoading(true);
    setError('');
    setReading(null);
    setFlippedCards([]);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/tarot/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spread_type: spreadType })
      });
      if (!res.ok) throw new Error('Failed to draw cards. The deck is closed.');
      const data = await res.json();
      setReading(data);
      
      // Auto-save
      if (isAuthenticated && token) {
        fetch('http://127.0.0.1:8000/api/user/save_reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ type: 'tarot', data: data })
        }).catch(e => console.error("Auto-save failed", e));
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = (idx) => {
    if (!flippedCards.includes(idx)) {
      setFlippedCards(prev => [...prev, idx]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-purple-300 flex justify-center items-center gap-3">
          <Moon className="w-10 h-10" /> Tarot Reading <Moon className="w-10 h-10" />
        </h1>
        <p className="text-slate-300 text-center mb-12 font-sans text-lg max-w-2xl mx-auto">
          Select your spread and let the ancient archetypes reveal your path. Draw the cards, then click each one to reveal its hidden wisdom.
        </p>

        {!reading ? (
          <div className="glass-panel max-w-xl mx-auto text-center relative z-10">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 font-serif border-b border-white/10 pb-4">Choose Your Spread</h2>
            
            <div className="flex flex-col gap-4 mb-8">
              <label className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-4 ${spreadType === '1_card' ? 'border-purple-400 bg-purple-900/30 shadow-[0_0_15px_rgba(157,78,221,0.2)]' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}>
                <input type="radio" name="spread" value="1_card" checked={spreadType === '1_card'} onChange={(e) => setSpreadType(e.target.value)} className="hidden" />
                <div className="flex-1 text-left">
                  <h3 className="text-xl text-white font-serif mb-1">Single Card</h3>
                  <p className="text-sm text-slate-400 font-sans">A quick, focused insight or answer to a specific question.</p>
                </div>
              </label>
              
              <label className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-4 ${spreadType === '3_card' ? 'border-purple-400 bg-purple-900/30 shadow-[0_0_15px_rgba(157,78,221,0.2)]' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}>
                <input type="radio" name="spread" value="3_card" checked={spreadType === '3_card'} onChange={(e) => setSpreadType(e.target.value)} className="hidden" />
                <div className="flex-1 text-left">
                  <h3 className="text-xl text-white font-serif mb-1">Three Cards (Time Spread)</h3>
                  <p className="text-sm text-slate-400 font-sans">A broader view of your current situation's Past, Present, and Future.</p>
                </div>
              </label>
            </div>
            
            {error && <p className="text-red-400 mb-4">{error}</p>}
            
            <button onClick={drawCards} disabled={loading} className="btn-mystic w-full flex justify-center items-center gap-2 py-3 text-lg">
              {loading ? <><Loader2 className="animate-spin w-6 h-6" /> Shuffling Deck...</> : 'Draw Cards'}
            </button>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              {reading.cards.map((card, idx) => (
                <div key={idx} className="perspective-1000 w-64 h-96 group cursor-pointer" onClick={() => handleFlip(idx)}>
                  <div className={`relative w-full h-full transition-transform duration-1000 transform-style-preserve-3d ${flippedCards.includes(idx) ? 'rotate-y-180' : ''}`}>
                    
                    {/* Front of Card (The Back Design) */}
                    <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_20px_rgba(157,78,221,0.4)]">
                      <img src="/assets/tarot-back.png" alt="Tarot Card Back" className="w-full h-full object-cover" />
                      {!flippedCards.includes(idx) && (
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-serif tracking-widest text-sm bg-black/80 px-4 py-2 rounded-full border border-white/20">CLICK TO REVEAL</span>
                         </div>
                      )}
                    </div>
                    
                    {/* Back of Card (The Reveal) */}
                    <div className="absolute w-full h-full backface-hidden rounded-xl border-2 border-yellow-400/50 shadow-[0_0_25px_rgba(255,215,0,0.3)] bg-gradient-to-br from-slate-900 to-purple-950 rotate-y-180 flex flex-col items-center justify-center p-6 text-center">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-100 via-transparent to-transparent"></div>
                      
                      {card.position && (
                        <span className="text-yellow-400 text-xs font-sans mb-auto mt-2 uppercase tracking-[0.3em] font-bold">
                          {card.position}
                        </span>
                      )}
                      
                      <div className="my-auto w-full">
                        <h3 className="text-3xl font-bold text-white font-serif mb-4 drop-shadow-md border-y border-white/20 py-2">
                          {card.name}
                        </h3>
                        <p className="text-purple-200 font-sans italic text-sm leading-relaxed">
                          "{card.meaning}"
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            
            <div className={`glass-panel max-w-4xl mx-auto transition-all duration-1000 transform ${flippedCards.length === reading.cards.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
              <h2 className="text-3xl font-bold text-yellow-400 mb-6 border-b border-white/10 pb-4 font-serif text-center">The Oracle's Interpretation</h2>
              <div className="text-slate-200 font-sans leading-relaxed whitespace-pre-wrap text-lg px-4 md:px-8">
                {reading.interpretation}
              </div>
            </div>
            
            <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
              <button onClick={() => setReading(null)} className="btn-outline border-purple-500 text-purple-300 hover:bg-purple-900/50 hover:text-white px-8">Draw Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarotReading;
