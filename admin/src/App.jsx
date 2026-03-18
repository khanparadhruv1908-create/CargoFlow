import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from './services/api';

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

const TokenManager = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return null;
};

// Admin Login component matching new UI
const AdminLogin = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-100 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Admin Portal</h1>
        <p className="mb-8 text-slate-500 text-sm">Sign in via the main customer portal using an authorized administrator account to access this dashboard.</p>
        <a href="http://localhost:5173/login" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md shadow-blue-500/20">Go to Secure Login</a>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Router>
        <TokenManager />
        <Routes>
          <Route path="/login" element={
            <>
              <SignedIn>
                  <Navigate to="/" replace />
              </SignedIn>
              <SignedOut>
                  <AdminLogin />
              </SignedOut>
            </>
          } />
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <AdminLayout />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/login" replace />
                </SignedOut>
              </>
            }
          >
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
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
