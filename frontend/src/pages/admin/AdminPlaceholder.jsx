import React from 'react';
import { Hammer } from 'lucide-react';

const AdminPlaceholder = ({ title }) => {
  return (
    <div className="p-6 md:p-10 animate-fadeIn h-full flex flex-col items-center justify-center text-center">
      <div className="bg-purple-900/20 p-8 rounded-full border border-purple-500/30 mb-6">
        <Hammer size={48} className="text-purple-400" />
      </div>
      <h1 className="text-3xl font-serif text-white mb-4">{title}</h1>
      <p className="text-slate-400 max-w-md">
        This portal section is currently under mystical construction. The spiritual developers are working on weaving this feature into reality.
      </p>
    </div>
  );
};

export default AdminPlaceholder;
