import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new URLSearchParams();
      data.append('username', formData.username);
      data.append('password', formData.password);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (!res.ok) throw new Error('Invalid credentials');
      const { access_token } = await res.json();
      login(access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-black/60 z-[-1]"></div>
      <div className="glass-panel max-w-md w-full border-purple-500/30 bg-black/40 relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="bg-purple-900/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <Lock size={32} className="text-purple-400" />
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm mb-2">Continue your cosmic journey</p>
          <div className="inline-block bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-slate-300 font-mono">
            Demo: user@mysticai.com / user123
          </div>
        </div>
        <h1 className="text-3xl font-bold font-serif text-yellow-400 mb-6 text-center tracking-wider drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">Enter the Sanctum</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-purple-300 mb-2 font-medium">Email Address</label>
            <input required type="email" name="username" value={formData.username} onChange={handleChange} className="w-full bg-black/40 border border-purple-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 hover:border-purple-500/50" placeholder="seeker@example.com" />
          </div>
          <div>
            <label className="block text-purple-300 mb-2 font-medium">Password</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-black/40 border border-purple-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 hover:border-purple-500/50" />
          </div>
          {error && <p className="text-red-400 text-sm p-3 bg-red-900/20 border border-red-500/30 rounded-lg">{error}</p>}
          <button disabled={loading} type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex justify-center items-center">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400">
          New to the mystical arts? <Link to="/register" className="text-purple-400 hover:text-yellow-400">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
