import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const dashboardPath = isAdmin ? '/admin' : '/dashboard';

    const isActive = (path) => {
        return location.pathname === path ? 'text-purple-400' : 'text-slate-200 hover:text-purple-300 transition-colors';
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="flex justify-between items-center py-4 px-8 m-4 rounded-full sticky top-4 z-50 glass-panel !p-4">
            <div className="text-2xl font-bold text-yellow-400 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
                <Link to="/" className="flex items-center gap-2">
                    <span>✨</span> Mystic-AI
                </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 font-sans font-medium">
                <Link to="/" className={isActive('/')}>Home</Link>
                <Link to="/fortune" className={isActive('/fortune')}>Fortune</Link>
                <Link to="/tarot" className={isActive('/tarot')}>Tarot</Link>
                <Link to="/chat" className={isActive('/chat')}>AI Guide</Link>
                <Link to="/book" className="btn-mystic !py-2 !px-5 text-sm">Book Session</Link>

                {isAuthenticated ? (
                    <div className="flex items-center gap-4 border-l border-white/20 pl-4">
                        <Link to={dashboardPath} className="text-yellow-400 hover:text-white transition-colors">Dashboard</Link>
                        <button onClick={handleLogout} className="text-slate-300 hover:text-red-400 text-sm">Logout</button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 border-l border-white/20 pl-4">
                        <Link to="/login" className="text-slate-200 hover:text-white transition-colors">User Login</Link>
                        <span className="text-slate-500">|</span>
                        <Link to="/admin-login" className="text-slate-200 hover:text-purple-300 transition-colors">Admin Login</Link>
                    </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden text-slate-200 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Navigation Overlay (Click outside to close) */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Navigation Menu */}
            <div className={`
                absolute top-[110%] left-0 w-full glass-panel bg-black/80 flex flex-col p-4 rounded-xl border border-purple-500/30 shadow-2xl md:hidden gap-4 font-sans font-medium z-50
                transition-all duration-300 ease-out origin-top
                ${isMobileMenuOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
            `}>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/')}>Home</Link>
                <Link to="/fortune" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/fortune')}>Fortune</Link>
                <Link to="/tarot" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/tarot')}>Tarot</Link>
                <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/chat')}>AI Guide</Link>
                <Link to="/book" onClick={() => setIsMobileMenuOpen(false)} className="btn-mystic text-center py-2 text-sm w-full">Book Session</Link>
                
                <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link to={dashboardPath} onClick={() => setIsMobileMenuOpen(false)} className="text-yellow-400 hover:text-white">Dashboard</Link>
                            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-slate-300 hover:text-red-400 text-left">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-200 hover:text-white">User Login</Link>
                            <Link to="/admin-login" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-200 hover:text-purple-300">Admin Login</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
