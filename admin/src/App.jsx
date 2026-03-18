import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

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

// A simple login component placeholder (since we redirect unauthed users to frontend usually, or admin should have its own login)
const AdminLogin = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Admin Access Only</h1>
        <p className="mb-4 text-gray-600">Please login from the main customer portal using an admin or manager account.</p>
        <a href="http://localhost:5173/login" className="bg-blue-600 text-white px-4 py-2 rounded">Go to Login</a>
      </div>
    </div>
  );
}

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white shadow rounded">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/"
            element={
              <ProtectedAdminRoute allowedRoles={['admin', 'manager']}>
                <AdminLayout />
              </ProtectedAdminRoute>
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
