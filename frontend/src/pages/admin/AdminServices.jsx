import React from 'react';
import { Sparkles, Edit3 } from 'lucide-react';

const AdminServices = () => {
  const services = [
    { id: 1, name: 'AI Fortune Reading', price: 'Free', status: 'Active', category: 'Divination' },
    { id: 2, name: 'AI Tarot Reading', price: 'Free', status: 'Active', category: 'Divination' },
    { id: 3, name: '1-on-1 Astrology Consultation', price: '$150', status: 'Active', category: 'Consultation' },
    { id: 4, name: 'Aura Analysis Session', price: '$80', status: 'Inactive', category: 'Consultation' }
  ];

  return (
    <div className="p-6 md:p-10 animate-fadeIn">
      <h1 className="text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
        <Sparkles className="text-purple-400" size={32} /> Services Management
      </h1>
      
      <div className="bg-black/40 rounded-xl border border-purple-500/30 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 font-sans">
          <thead className="bg-purple-900/30 text-purple-300 uppercase text-xs font-bold border-b border-purple-500/30">
            <tr>
              <th className="px-6 py-4">Service Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.map(s => (
              <tr key={s.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{s.name}</td>
                <td className="px-6 py-4">{s.category}</td>
                <td className="px-6 py-4 text-yellow-400 font-bold">{s.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${s.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-purple-400 hover:text-white transition-colors p-2 rounded hover:bg-white/10">
                    <Edit3 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminServices;
