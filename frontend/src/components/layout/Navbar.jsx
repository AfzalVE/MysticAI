import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const isActive = (path) => {
    return location.pathname === path ? 'text-purple-400' : 'text-slate-200 hover:text-purple-300 transition-colors';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center py-4 px-8 m-4 rounded-full sticky top-4 z-50 glass-panel !p-4">
      <div className="text-2xl font-bold text-yellow-400 flex items-center gap-2" style={{fontFamily: 'Cinzel, serif'}}>
        <Link to="/" className="flex items-center gap-2">
          <span>✨</span> MysticAI
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-8 font-sans font-medium">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/fortune" className={isActive('/fortune')}>Fortune</Link>
        <Link to="/tarot" className={isActive('/tarot')}>Tarot</Link>
        <Link to="/chat" className={isActive('/chat')}>AI Guide</Link>
        <Link to="/book" className="btn-mystic !py-2 !px-5 text-sm">Book Session</Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4 border-l border-white/20 pl-4">
            <Link to="/dashboard" className="text-yellow-400 hover:text-white transition-colors">Dashboard</Link>
            <button onClick={handleLogout} className="text-slate-300 hover:text-red-400 text-sm">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-4 border-l border-white/20 pl-4">
            <Link to="/login" className="text-slate-200 hover:text-white transition-colors">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
