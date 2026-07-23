import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

const AdminRoute = () => {
  const { isAuthenticated, token } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(null);
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.is_admin);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      }
    };
    
    if (isAuthenticated) checkAdmin();
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  if (isAdmin === null) {
    return <div className="h-screen flex items-center justify-center text-purple-400"><Loader2 className="animate-spin w-8 h-8" /></div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default AdminRoute;
