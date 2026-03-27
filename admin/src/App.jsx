import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import api from './services/api';

import AdminLayout from './components/dashboard/AdminLayout';
import DashboardOverview from './modules/admin/DashboardOverview';
import UserManagement from './modules/admin/UserManagement';
import ShipmentManagement from './modules/admin/ShipmentManagement';
import TrackingMonitor from './modules/admin/TrackingMonitor';
import BillingManagement from './modules/admin/BillingManagement';
import Settings from './modules/admin/Settings';
import Airlines from './modules/admin/Airlines';
import FlightBookings from './modules/admin/FlightBookings';
import Containers from './modules/admin/Containers';
import OceanBookings from './modules/admin/OceanBookings';
import CustomsManagement from './modules/admin/CustomsManagement';
import WarehouseManagement from './modules/admin/WarehouseManagement';

const queryClient = new QueryClient();

// SIMPLE ADMIN LOGIN COMPONENT
const AdminLogin = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      console.log("Login Response Data:", data);

      const userRole = data.role ? data.role.toLowerCase() : '';
      if (userRole !== 'admin' && userRole !== 'manager') {
        toast.error(`Access Denied: ${data.role} is not an authorized account.`);
        return;
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data));
      setAuth(true);
      toast.success(`Welcome back, ${data.name}! Redirecting...`);
    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Invalid credentials";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 text-center max-w-md w-full mx-4">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-lg shadow-blue-500/20">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2 font-outfit uppercase">Command Center</h1>
        <p className="mb-10 text-slate-400 text-sm font-medium">Internal access only. Restricted network.</p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@cargoflow.com"
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-blue-600 focus:bg-white transition-all outline-none mt-1"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-blue-600 focus:bg-white transition-all outline-none mt-1"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-4 rounded-2xl transition-all shadow-xl shadow-blue-500/30 uppercase tracking-widest text-xs mt-6"
          >
            {loading ? 'Authenticating...' : 'Secure Authorization'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50">
          <a href="http://localhost:5173/" className="text-slate-400 hover:text-blue-600 text-xs font-bold transition-colors">Return to Main Network</a>
        </div>
      </div>
    </div>
  );
}

const ProtectedRoute = ({ isAuth }) => {
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('admin_token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(!!localStorage.getItem('admin_token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/login" element={
            isAuth ? <Navigate to="/" replace /> : <AdminLogin setAuth={setIsAuth} />
          } />

          <Route element={<ProtectedRoute isAuth={isAuth} />}>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="shipments" element={<ShipmentManagement />} />
              <Route path="airlines" element={<Airlines />} />
              <Route path="flights" element={<FlightBookings />} />
              <Route path="containers" element={<Containers />} />
              <Route path="ocean-bookings" element={<OceanBookings />} />
              <Route path="customs" element={<CustomsManagement />} />
              <Route path="warehouse" element={<WarehouseManagement />} />
              <Route path="tracking" element={<TrackingMonitor />} />
              <Route path="billing" element={<BillingManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
