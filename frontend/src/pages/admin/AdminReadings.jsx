import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useLocation } from 'react-router-dom';
import { Loader2, X } from 'lucide-react';

const AdminReadings = () => {
  const { token } = useAuthStore();
  const location = useLocation();
  const filterType = location.pathname.includes('fortune') ? 'fortune' : 'tarot';
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReading, setSelectedReading] = useState(null);

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

  const filteredReadings = readings.filter(r => r.type === filterType);

  return (
    <div className="p-6 md:p-10 animate-fadeIn">
      <h1 className="text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4 capitalize">All {filterType} Readings</h1>
      
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
              {filteredReadings.map(r => (
                <tr key={r.id} onClick={() => setSelectedReading(r)} className="hover:bg-white/5 transition-colors cursor-pointer">
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

      {/* Reading Modal Overlay */}
      {selectedReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative glass-panel shadow-2xl text-left">
            <button onClick={() => setSelectedReading(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-black/40 rounded-full p-2 border border-white/10">
              <X size={20} />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-serif text-yellow-400 mb-2 capitalize">{selectedReading.type} Insight</h2>
              <p className="text-sm text-slate-400 mb-6 border-b border-white/10 pb-4">For {selectedReading.user_name} on {new Date(selectedReading.created_at).toLocaleString()}</p>
              
              {selectedReading.type === 'fortune' ? (
                <div className="space-y-6 text-slate-200">
                  <div className="bg-black/40 p-5 rounded-lg border border-purple-500/20">
                     <strong className="text-purple-300 block mb-2 font-serif">Horoscope / Prediction</strong>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{selectedReading.data?.horoscope || selectedReading.data?.prediction || "Data obscured."}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-purple-900/20 p-3 rounded border border-purple-500/30">
                      <span className="block text-xs text-purple-300 uppercase tracking-widest mb-1">Lucky Number</span>
                      <strong className="text-2xl text-yellow-400">{selectedReading.data?.lucky_number || '?'}</strong>
                    </div>
                    <div className="bg-purple-900/20 p-3 rounded border border-purple-500/30">
                      <span className="block text-xs text-purple-300 uppercase tracking-widest mb-1">Color</span>
                      <strong className="text-lg text-yellow-400">{selectedReading.data?.lucky_color || 'Unknown'}</strong>
                    </div>
                  </div>
                </div>
              ) : selectedReading.type === 'tarot' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedReading.data?.cards?.map((card, idx) => (
                      <div key={idx} className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30 flex flex-col justify-between">
                        <div>
                          {card.position && <strong className="text-yellow-400 block mb-2 text-sm uppercase tracking-wide border-b border-purple-500/30 pb-1">{card.position}</strong>}
                          <span className="font-bold font-serif text-lg text-white block mb-2">{card.name}</span>
                          <p className="text-slate-300 text-xs leading-snug">{card.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-6 bg-black/40 rounded-lg border border-white/10">
                    <strong className="text-purple-300 block mb-3 text-lg font-serif">AI Interpretation</strong>
                    <p className="whitespace-pre-wrap text-slate-200 text-sm leading-relaxed">{selectedReading.data?.interpretation}</p>
                  </div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-xs text-slate-300 bg-black/50 p-4 rounded overflow-x-auto">{JSON.stringify(selectedReading.data, null, 2)}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReadings;
