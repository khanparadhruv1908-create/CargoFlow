import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, UserButton, useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from './services/api';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Shipments from './pages/Shipments';
import BookingDispatcher from './pages/BookingDispatcher';
import TrackAWB from './pages/TrackAWB';
import WarehouseStorage from './pages/WarehouseStorage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Component for external redirects (like from 5173 to 5174)
const ExternalRedirect = ({ url }) => {
  useEffect(() => {
    window.location.href = url;
  }, [url]);
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50 font-outfit">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Accessing Command Center...</p>
        </div>
    </div>
  );
};

// Component to handle Clerk token and pass it to axios
const TokenManager = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return null;
};

// ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout wrapper to conditionally show/hide Navbar/Footer
const AppLayout = () => {
  const location = useLocation();
  const hideNavFooterRoutes = ['/login', '/register'];
  const shouldHide = hideNavFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <TokenManager />
      <ScrollToTop />
      {!shouldHide && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track" element={<TrackAWB />} />
          <Route path="/warehouse" element={<WarehouseStorage />} />
          <Route
            path="/shipments"
            element={
              <>
                <SignedIn>
                  <Shipments />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/book"
            element={
              <>
                <SignedIn>
                  <BookingDispatcher />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </main>

      {!shouldHide && <Footer />}
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
