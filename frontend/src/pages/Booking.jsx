import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CreditCard, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const { isAuthenticated, token } = useAuthStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    consultation_type: 'tarot',
    date: '',
    time: '10:00',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Option to force login, but let's just proceed for now
      // navigate('/login');
    }
    setStep(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/booking/create-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(isAuthenticated && { 'Authorization': `Bearer ${token}` }) },
          body: JSON.stringify({
            consultation_type: formData.consultation_type,
            date: formData.date,
            time: formData.time,
            details: {
               name: formData.name,
               email: formData.email,
               notes: formData.notes
            }
          })
        });
        
        if (!res.ok) throw new Error('Failed to create checkout session');
        const data = await res.json();
        
        // Redirect to our "third-party" mock checkout gateway
        window.location.href = `/checkout/${data.booking_id}`;
    } catch (err) {
      console.error(err);
      alert('Failed to process booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-yellow-400 font-serif">
          Book a Consultation
        </h1>
        <p className="text-slate-300 text-center mb-12 font-sans text-lg">
          Connect directly with our master mystics for a personalized 1-on-1 spiritual awakening.
        </p>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 px-8">
           <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-purple-400' : 'text-slate-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-purple-400 bg-purple-900/50' : 'border-slate-500 bg-black'}`}>1</div>
              <span className="text-xs font-bold uppercase tracking-wider">Details</span>
           </div>
           <div className={`flex-1 h-[2px] mx-4 ${step >= 2 ? 'bg-purple-400' : 'bg-slate-700'}`}></div>
           <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-purple-400' : 'text-slate-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-purple-400 bg-purple-900/50' : 'border-slate-500 bg-black'}`}>2</div>
              <span className="text-xs font-bold uppercase tracking-wider">Payment</span>
           </div>
           <div className={`flex-1 h-[2px] mx-4 ${step >= 3 ? 'bg-purple-400' : 'bg-slate-700'}`}></div>
           <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-green-400' : 'text-slate-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-green-400 bg-green-900/50' : 'border-slate-500 bg-black'}`}>3</div>
              <span className="text-xs font-bold uppercase tracking-wider">Confirm</span>
           </div>
        </div>

        <div className="glass-panel bg-black/50 border-purple-500/20">
          {step === 1 && (
            <form onSubmit={handleNext} className="animate-fadeIn">
              <h2 className="text-2xl font-serif text-white mb-6 border-b border-white/10 pb-2">Session Details</h2>
              {!isAuthenticated && (
                 <div className="mb-6 p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 text-sm">
                   You are not logged in. You can proceed as a guest, but logging in allows you to save and manage your bookings. 
                   <button type="button" onClick={() => navigate('/login')} className="ml-2 underline font-bold text-yellow-400">Login Now</button>
                 </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-purple-300 mb-2 font-bold">Your Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="mystic-input bg-black/40" />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-bold">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mystic-input bg-black/40" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-purple-300 mb-2 font-bold">Consultation Type</label>
                <select name="consultation_type" value={formData.consultation_type} onChange={handleChange} className="mystic-input bg-black/40 cursor-pointer">
                  <option value="tarot">Deep Dive Tarot Reading ($45)</option>
                  <option value="astrology">Full Astrological Birth Chart Analysis ($60)</option>
                  <option value="spiritual">Spiritual Guidance & Energy Clearing ($80)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-purple-300 mb-2 font-bold flex items-center gap-2"><CalendarIcon size={18} /> Preferred Date</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleChange} className="mystic-input bg-black/40" />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-bold flex items-center gap-2"><Clock size={18} /> Preferred Time</label>
                  <input required type="time" name="time" value={formData.time} onChange={handleChange} className="mystic-input bg-black/40" />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-purple-300 mb-2 font-bold">Notes / Intentions (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="mystic-input bg-black/40 h-24 resize-none" placeholder="What are you seeking guidance on?"></textarea>
              </div>

              <button type="submit" className="btn-mystic w-full py-4 text-lg flex justify-center items-center gap-2">
                Continue to Payment <ArrowRight size={20} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePayment} className="animate-fadeIn">
              <h2 className="text-2xl font-serif text-white mb-6 border-b border-white/10 pb-2">Complete Payment</h2>
              <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-xl mb-8">
                 <h3 className="text-lg font-bold text-yellow-400 mb-2">Order Summary</h3>
                 <div className="flex justify-between text-slate-200 mb-2">
                    <span className="capitalize">{formData.consultation_type} Consultation</span>
                    <span>{formData.consultation_type === 'tarot' ? '$45.00' : formData.consultation_type === 'astrology' ? '$60.00' : '$80.00'}</span>
                 </div>
                 <div className="flex justify-between text-slate-400 text-sm mb-4">
                    <span>{formData.date} at {formData.time}</span>
                 </div>
                 <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-xl text-white">
                    <span>Total</span>
                    <span>{formData.consultation_type === 'tarot' ? '$45.00' : formData.consultation_type === 'astrology' ? '$60.00' : '$80.00'}</span>
                 </div>
              </div>

              <h3 className="text-lg font-bold text-purple-300 mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 <label className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-colors ${paymentMethod === 'card' ? 'border-purple-400 bg-purple-900/40' : 'border-white/10 hover:bg-white/5'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                    <CreditCard className="text-purple-300" />
                    <span className="text-white font-bold">Credit Card (Stripe)</span>
                 </label>
                 <label className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-colors ${paymentMethod === 'paypal' ? 'border-purple-400 bg-purple-900/40' : 'border-white/10 hover:bg-white/5'}`}>
                    <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="hidden" />
                    <span className="font-bold text-blue-400 italic">PayPal</span>
                    <span className="text-white font-bold ml-1">Mock</span>
                 </label>
              </div>

              {paymentMethod === 'card' && (
                 <div className="space-y-4 mb-8">
                    <input type="text" placeholder="Card Number (Mock UI)" className="mystic-input bg-black/40 w-full" disabled />
                    <div className="grid grid-cols-2 gap-4">
                       <input type="text" placeholder="MM/YY" className="mystic-input bg-black/40 w-full" disabled />
                       <input type="text" placeholder="CVC" className="mystic-input bg-black/40 w-full" disabled />
                    </div>
                 </div>
              )}

              <div className="flex gap-4">
                 <button type="button" onClick={() => setStep(1)} className="btn-outline px-6">Back</button>
                 <button type="submit" disabled={loading} className="btn-mystic flex-1 py-4 text-lg flex justify-center items-center gap-2">
                   {loading ? <><Loader2 className="animate-spin" /> Processing Ethereal Transfer...</> : 'Pay & Confirm Booking'}
                 </button>
              </div>
            </form>
          )}

          {/* Step 3 was removed since Success is handled on a dedicated page after checkout */}
        </div>
      </div>
    </div>
  );
};

export default Booking;
