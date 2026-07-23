import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, Mail, Key, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuthStore();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formBody = new URLSearchParams();
      formBody.append('username', formData.username);
      formBody.append('password', formData.password);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody,
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      const token = data.access_token;
      
      // Now verify admin status
      const profileRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!profileRes.ok) throw new Error('Failed to fetch profile');
      const profileData = await profileRes.json();
      
      if (profileData.is_admin) {
        login(token);
        navigate('/admin');
      } else {
        logout();
        throw new Error('Unauthorized: Admins Only');
      }
      
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fadeIn p-4">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-purple-600"></div>
        
        <div className="text-center mb-8">
          <div className="bg-purple-900/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <Lock size={32} className="text-purple-400" />
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">Admin Portal</h2>
          <p className="text-slate-400 text-sm">Secure access for mystical administrators</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/50" size={18} />
            <input 
              type="email" 
              name="username"
              placeholder="Admin Email"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
              required 
            />
          </div>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/50" size={18} />
            <input 
              type="password" 
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-mystic py-3 font-bold shadow-lg flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Enter Portal'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-400">
          Not an admin? <Link to="/login" className="text-purple-400 hover:text-purple-300">User Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
