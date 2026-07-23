import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

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

      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
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
         <h1 className="text-3xl font-bold font-serif text-yellow-400 mb-6 text-center tracking-wider">Enter the Sanctum</h1>
         <form onSubmit={handleSubmit}>
            <div className="mb-4">
               <label className="block text-purple-300 mb-2">Email Address</label>
               <input required type="email" name="username" value={formData.username} onChange={handleChange} className="mystic-input w-full" placeholder="seeker@example.com" />
            </div>
            <div className="mb-6">
               <label className="block text-purple-300 mb-2">Secret Key (Password)</label>
               <input required type="password" name="password" value={formData.password} onChange={handleChange} className="mystic-input w-full" />
            </div>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <button disabled={loading} type="submit" className="btn-mystic w-full py-3">{loading ? 'Verifying...' : 'Login'}</button>
         </form>
         <p className="mt-6 text-center text-slate-400">
           New to the mystical arts? <Link to="/register" className="text-purple-400 hover:text-yellow-400">Sign Up</Link>
         </p>
      </div>
    </div>
  );
};

export default Login;
