import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, User, Clock, Star, Edit3, X, Check, Key, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [readings, setReadings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [selectedReading, setSelectedReading] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        const [profileRes, readingsRes, bookingsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/user/readings`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/user/bookings`, { headers })
        ]);

        if (profileRes.ok) {
          const pData = await profileRes.json();
          setProfile(pData);
          setEditForm(pData);
        }
        if (readingsRes.ok) setReadings(await readingsRes.json());
        if (bookingsRes.ok) setBookings(await bookingsRes.json());
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, token, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: editForm.name,
          dob: editForm.dob,
          time_of_birth: editForm.time_of_birth,
          birth_place: editForm.birth_place
        })
      });
      if (res.ok) {
        setProfile(await res.json());
        setIsEditing(false);
        setMsg({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setMsg({ type: 'error', text: 'Failed to update profile.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'An error occurred.' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(passwordForm)
      });
      if (res.ok) {
        setIsChangingPassword(false);
        setPasswordForm({ old_password: '', new_password: '' });
        setMsg({ type: 'success', text: 'Password changed successfully.' });
      } else {
        setMsg({ type: 'error', text: 'Incorrect old password.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'An error occurred.' });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-purple-400">Loading your ethereal space...</div>;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif text-yellow-400 mb-2">Welcome, {profile?.name || 'Seeker'}</h1>
            <p className="text-slate-300 font-sans text-lg">Your cosmic journey continues here.</p>
          </div>
          {msg.text && (
            <div className={`px-4 py-2 rounded-lg text-sm font-bold ${msg.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
              {msg.text}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Stats / Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
             <div className="glass-panel bg-black/40 border-purple-500/20">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                   <div className="flex items-center gap-4">
                     <User className="text-purple-400 w-8 h-8" />
                     <h2 className="text-2xl font-serif text-white">Profile</h2>
                   </div>
                   {!isEditing && !isChangingPassword && (
                     <button onClick={() => setIsEditing(true)} className="text-purple-400 hover:text-yellow-400"><Edit3 size={18} /></button>
                   )}
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4 font-sans text-sm">
                    <div>
                      <label className="text-purple-300 block mb-1">Name</label>
                      <input className="mystic-input w-full p-2" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} required />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Date of Birth</label>
                      <input type="date" className="mystic-input w-full p-2" value={editForm.dob || ''} onChange={e => setEditForm({...editForm, dob: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Time of Birth</label>
                      <input type="time" className="mystic-input w-full p-2" value={editForm.time_of_birth || ''} onChange={e => setEditForm({...editForm, time_of_birth: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">Birth Place</label>
                      <input className="mystic-input w-full p-2" value={editForm.birth_place || ''} onChange={e => setEditForm({...editForm, birth_place: e.target.value})} />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white flex-1 py-2 rounded flex items-center justify-center gap-1"><Check size={16}/> Save</button>
                      <button type="button" onClick={() => setIsEditing(false)} className="border border-slate-500 text-slate-300 hover:bg-slate-800 flex-1 py-2 rounded flex items-center justify-center gap-1"><X size={16}/> Cancel</button>
                    </div>
                  </form>
                ) : isChangingPassword ? (
                  <form onSubmit={handlePasswordChange} className="space-y-4 font-sans text-sm">
                    <div>
                      <label className="text-purple-300 block mb-1">Old Password</label>
                      <input type="password" required className="mystic-input w-full p-2" value={passwordForm.old_password} onChange={e => setPasswordForm({...passwordForm, old_password: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-purple-300 block mb-1">New Password</label>
                      <input type="password" required className="mystic-input w-full p-2" value={passwordForm.new_password} onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})} />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button type="submit" className="bg-red-600 hover:bg-red-500 text-white flex-1 py-2 rounded flex items-center justify-center gap-1"><Check size={16}/> Update</button>
                      <button type="button" onClick={() => setIsChangingPassword(false)} className="border border-slate-500 text-slate-300 hover:bg-slate-800 flex-1 py-2 rounded flex items-center justify-center gap-1"><X size={16}/> Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 font-sans text-slate-300">
                     <p><strong>Email:</strong> {profile?.email}</p>
                     <p><strong>DOB:</strong> {profile?.dob || 'Not set'}</p>
                     <p><strong>Time:</strong> {profile?.time_of_birth || 'Not set'}</p>
                     <p><strong>Place:</strong> {profile?.birth_place || 'Not set'}</p>
                     
                     <div className="flex flex-col gap-3 mt-6">
                       <button onClick={() => setIsChangingPassword(true)} className="w-full py-2 border border-purple-500 text-purple-300 rounded hover:bg-purple-900/40 transition-colors flex justify-center items-center gap-2"><Key size={16} /> Change Password</button>
                     </div>
                  </div>
                )}
             </div>

             <div className="glass-panel bg-gradient-to-br from-purple-900/40 to-black border-purple-500/30">
                <h3 className="text-xl font-serif text-yellow-400 mb-2">Total Insights</h3>
                <p className="text-5xl font-bold text-white mb-4">{readings.length}</p>
                <p className="text-sm text-slate-400 font-sans">Readings saved to your history.</p>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Recent Readings */}
            <div className="glass-panel bg-black/40 border-purple-500/20">
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-4">
                     <BookOpen className="text-purple-400 w-8 h-8" />
                     <h2 className="text-2xl font-serif text-white">Recent Readings</h2>
                  </div>
               </div>
               
               {readings.length === 0 ? (
                 <p className="text-slate-400 italic">No readings saved yet. Consult the stars to begin.</p>
               ) : (
                 <div className="space-y-4">
                   {readings.map((r, i) => (
                     <div key={i} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                       <div 
                         className="p-4 flex justify-between items-center hover:bg-white/10 transition-colors cursor-pointer"
                         onClick={() => setSelectedReading(r)}
                       >
                          <div>
                            <p className="font-bold text-purple-300 font-serif capitalize">{r.type} Reading</p>
                            <p className="text-sm text-slate-400 flex items-center gap-2"><Clock size={14} /> {new Date(r.created_at || Date.now()).toLocaleDateString()}</p>
                          </div>
                          <Star className="text-slate-500 hover:text-yellow-400 transition-colors" size={20} />
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            {/* Upcoming Bookings */}
            <div className="glass-panel bg-black/40 border-purple-500/20">
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-4">
                     <Calendar className="text-purple-400 w-8 h-8" />
                     <h2 className="text-2xl font-serif text-white">Upcoming Sessions</h2>
                  </div>
               </div>
               
               {bookings.length === 0 ? (
                 <p className="text-slate-400 italic">No upcoming consultations. Book a 1-on-1 session for deeper insight.</p>
               ) : (
                 <div className="space-y-4">
                   {bookings.map((b, i) => (
                     <div key={i} className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30 flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                          <p className="font-bold text-yellow-400 font-serif">{b.consultation_type} Session</p>
                          <p className="text-sm text-slate-300 font-sans">{b.date} at {b.time}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-xs font-bold uppercase">Confirmed</span>
                     </div>
                   ))}
                 </div>
               )}
            </div>

          </div>
        </div>
      </div>

      {/* Reading Modal Overlay */}
      {selectedReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative glass-panel shadow-2xl">
            <button onClick={() => setSelectedReading(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-black/40 rounded-full p-2 border border-white/10">
              <X size={20} />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-serif text-yellow-400 mb-6 capitalize border-b border-white/10 pb-4">{selectedReading.type} Insight</h2>
              
              {selectedReading.type === 'fortune' ? (
                <div className="space-y-6 text-slate-200">
                  <div className="bg-black/40 p-5 rounded-lg border border-purple-500/20">
                    <p className="whitespace-pre-wrap leading-relaxed">{selectedReading.data?.horoscope || "Your fortune was obscured by the cosmos."}</p>
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
                    <div className="bg-purple-900/20 p-3 rounded border border-purple-500/30 md:col-span-1 col-span-2">
                      <span className="block text-xs text-purple-300 uppercase tracking-widest mb-1">Love Match</span>
                      <strong className="text-lg text-yellow-400">{selectedReading.data?.love_compatibility || 'Mysterious'}</strong>
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
                          <p className="text-slate-300 text-sm leading-snug">{card.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-6 bg-black/40 rounded-lg border border-white/10">
                    <strong className="text-purple-300 block mb-3 text-lg font-serif">AI Interpretation</strong>
                    <p className="whitespace-pre-wrap text-slate-200 leading-relaxed">{selectedReading.data?.interpretation}</p>
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

export default Dashboard;
