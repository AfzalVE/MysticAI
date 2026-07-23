import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import FortuneTelling from './pages/FortuneTelling';
import TarotReading from './pages/TarotReading';
import AIChat from './pages/AIChat';
import Booking from './pages/Booking';
import MockCheckout from './pages/MockCheckout';
import Success from './pages/Success';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CosmicBackground from './components/animations/CosmicBackground';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReadings from './pages/admin/AdminReadings';
import AdminChatLogs from './pages/admin/AdminChatLogs';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';
import AdminServices from './pages/admin/AdminServices';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';

function App() {
  return (
    <Router>
      <CosmicBackground>
        <div className="app-container relative z-10">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/fortune" element={<FortuneTelling />} />
                <Route path="/tarot" element={<TarotReading />} />
                <Route path="/chat" element={<AIChat />} />
                <Route path="/book" element={<Booking />} />
                <Route path="/checkout/:sessionId" element={<MockCheckout />} />
                <Route path="/success/:sessionId" element={<Success />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="fortune-readings" element={<AdminReadings />} />
                  <Route path="tarot-readings" element={<AdminReadings />} />
                  <Route path="chat-logs" element={<AdminChatLogs />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="calendar" element={<AdminPlaceholder title="Calendar" />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="ai-settings" element={<AdminPlaceholder title="AI Settings" />} />
                  <Route path="content" element={<AdminPlaceholder title="Content Management" />} />
                  <Route path="notifications" element={<AdminPlaceholder title="Notifications" />} />
                  <Route path="reports" element={<AdminPlaceholder title="Reports & Analytics" />} />
                  <Route path="reviews" element={<AdminPlaceholder title="Reviews" />} />
                  <Route path="profile" element={<AdminPlaceholder title="Profile" />} />
                  <Route path="settings" element={<AdminPlaceholder title="Settings" />} />
                </Route>
              </Route>
            </Routes>
          </main>
        </div>
      </CosmicBackground>
    </Router>
  );
}

export default App;