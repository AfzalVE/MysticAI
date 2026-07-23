import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Loader2, ArrowLeft } from 'lucide-react';

const MockCheckout = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/booking/checkout/${sessionId}`);
        if (!res.ok) throw new Error('Session not found');
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCheckout();
  }, [sessionId]);

  const handlePay = async () => {
    setProcessing(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/booking/confirm/${sessionId}`, { method: 'POST' });
      if (res.ok) {
        navigate(`/success/${sessionId}`);
      } else {
        alert("Payment failed");
        setProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate('/book');
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>;
  if (!booking) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-800">Checkout session invalid or expired.</div>;

  const price = booking.consultation_type === 'tarot' ? 45 : booking.consultation_type === 'astrology' ? 60 : 80;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 font-sans text-gray-900">
      
      {/* Mock Third-Party Header */}
      <div className="mb-8 text-center flex flex-col items-center">
         <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <ShieldCheck size={32} />
            <span className="text-2xl font-bold tracking-tight">SecurePay</span>
         </div>
         <p className="text-sm text-gray-500 font-medium bg-gray-200 px-3 py-1 rounded-full">TEST MODE</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
        
        {/* Order Summary */}
        <div className="bg-gray-50 p-8 border-b border-gray-100">
           <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">Paying MysticAI</p>
           <h2 className="text-3xl font-bold text-gray-900 mb-4">${price}.00</h2>
           
           <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                 <span className="capitalize">{booking.consultation_type} Consultation</span>
                 <span>${price}.00</span>
              </div>
              <div className="flex justify-between">
                 <span>Date & Time</span>
                 <span>{booking.date} @ {booking.time}</span>
              </div>
           </div>
        </div>

        {/* Payment Form */}
        <div className="p-8">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard size={20} className="text-gray-400" /> Card Information</h3>
           
           <div className="space-y-4 mb-8">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
                <div className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 shadow-sm opacity-50 cursor-not-allowed flex items-center justify-between">
                   <span>•••• •••• •••• 4242</span>
                   <span className="text-gray-400 font-bold italic">VISA</span>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                  <div className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 shadow-sm opacity-50 cursor-not-allowed">12/34</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <div className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 shadow-sm opacity-50 cursor-not-allowed">123</div>
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <div className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 shadow-sm opacity-50 cursor-not-allowed">{booking.details.name}</div>
             </div>
           </div>

           <button 
             onClick={handlePay}
             disabled={processing}
             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
           >
             {processing ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : `Pay $${price}.00`}
           </button>
           
           <button 
             onClick={handleCancel}
             disabled={processing}
             className="w-full mt-4 bg-white text-gray-500 hover:text-gray-800 font-medium py-3 rounded-lg flex justify-center items-center gap-2 transition-colors"
           >
             <ArrowLeft size={16} /> Cancel and return to MysticAI
           </button>

           <div className="mt-8 text-center flex items-center justify-center gap-1 text-xs text-gray-400">
             <ShieldCheck size={14} /> Payments are secure and encrypted.
           </div>
        </div>
      </div>
    </div>
  );
};

export default MockCheckout;
