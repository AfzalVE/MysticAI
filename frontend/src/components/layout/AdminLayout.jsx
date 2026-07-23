import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Sparkles, ScrollText, 
  MessageSquare, Calendar, CreditCard, Settings, 
  Settings2, BookOpen, Bell, BarChart3, Star, UserCircle, Menu, X
} from 'lucide-react';

const navItems = [
  { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { path: '/admin/users', name: 'Users', icon: <Users size={18} /> },
  { path: '/admin/fortune-readings', name: 'Fortune Readings', icon: <Sparkles size={18} /> },
  { path: '/admin/tarot-readings', name: 'Tarot Readings', icon: <ScrollText size={18} /> },
  { path: '/admin/chat-logs', name: 'AI Chat Logs', icon: <MessageSquare size={18} /> },
  { path: '/admin/bookings', name: 'Bookings', icon: <Calendar size={18} /> },
  { path: '/admin/calendar', name: 'Calendar', icon: <Calendar size={18} /> },
  { path: '/admin/payments', name: 'Payments', icon: <CreditCard size={18} /> },
  { path: '/admin/services', name: 'Services', icon: <BookOpen size={18} /> },
  { path: '/admin/ai-settings', name: 'AI Settings', icon: <Settings2 size={18} /> },
  { path: '/admin/content', name: 'Content Management', icon: <ScrollText size={18} /> },
  { path: '/admin/notifications', name: 'Notifications', icon: <Bell size={18} /> },
  { path: '/admin/reports', name: 'Reports & Analytics', icon: <BarChart3 size={18} /> },
  { path: '/admin/reviews', name: 'Reviews', icon: <Star size={18} /> },
  { path: '/dashboard', name: 'Profile', icon: <UserCircle size={18} /> },
  { path: '/admin/settings', name: 'Settings', icon: <Settings size={18} /> }
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[90vh] bg-black/40 overflow-hidden w-full container mx-auto rounded-xl border border-purple-500/20">
      
      {/* Mobile Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden absolute top-4 left-4 z-50 text-white bg-purple-900/50 p-2 rounded-full border border-purple-500/30"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 absolute md:static z-40 
        w-64 h-full bg-slate-900/90 md:bg-black/40 border-r border-purple-500/30 flex flex-col backdrop-blur-md
      `}>
        <div className="p-6 border-b border-purple-500/30 shrink-0">
          <h2 className="text-xl font-bold text-yellow-400 font-serif">Admin Portal</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-sans text-sm ${
                    isActive 
                      ? 'bg-purple-600/50 text-white border border-purple-500/50' 
                      : 'text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-black/20">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;
