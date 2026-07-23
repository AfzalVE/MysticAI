import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, Loader2 } from 'lucide-react';
import CosmicBackground from '../components/animations/CosmicBackground';

const Success = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/booking/checkout/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCheckout();
  }, [sessionId]);

  if (!booking) return <div className="min-h-screen flex items-center justify-center text-white"><Loader2 className="animate-spin w-10 h-10 text-purple-500" /></div>;

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 z-10">
      <div className="glass-panel p-10 rounded-3xl border border-purple-500/30 max-w-lg w-full text-center relative overflow-hidden bg-black/60 shadow-[0_0_50px_rgba(168,85,247,0.15)] animate-fadeIn">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

        <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)] animate-bounce" />
        
        <h2 className="text-4xl font-serif text-white mb-4">Payment Successful!</h2>
        
        <p className="text-slate-300 font-sans text-lg mb-8">
          Your intention has been set and the appointment is secured in the cosmos. A calendar invitation has been sent to <span className="font-bold text-purple-300">{booking.details.email}</span>.
        </p>
        
        <div className="bg-black/40 p-6 rounded-xl border border-white/10 mb-8 text-left space-y-4">
           <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-slate-400 flex items-center gap-2"><Calendar size={16} /> Date</span>
              <span className="text-white font-bold">{booking.date}</span>
           </div>
           <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-slate-400 flex items-center gap-2"><Clock size={16} /> Time</span>
              <span className="text-white font-bold">{booking.time}</span>
           </div>
           <div className="flex justify-between">
              <span className="text-slate-400 uppercase tracking-widest text-xs mt-1">Booking Ref</span>
              <span className="font-mono text-yellow-400 text-sm truncate max-w-[150px]">{sessionId}</span>
           </div>
        </div>
        
        <div className="flex gap-4">
           <button onClick={() => navigate('/dashboard')} className="flex-1 btn-mystic py-3">View Dashboard</button>
           <button onClick={() => navigate('/')} className="flex-1 btn-outline py-3">Return Home</button>
        </div>
      </div>
    </div>
  );
};

export default Success;
