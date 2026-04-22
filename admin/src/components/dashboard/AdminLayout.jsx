import Sidebar from './Sidebar';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
    Menu, 
    Bell, 
    User,
    ChevronDown
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import socket from '../../services/socket';
import NotificationDropdown from './NotificationDropdown';
import toast from 'react-hot-toast';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [user, setUser] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            
            // SOCKET CONNECTION
            socket.connect();
            socket.emit('join_user', parsedUser._id || parsedUser.id);
        }

        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setIsMobileMenuOpen(false);
        };

        window.addEventListener('resize', handleResize);

        // Listen for new notifications
        socket.on('new_notification', (notification) => {
            queryClient.invalidateQueries(['notifications']);
            toast.success(notification.title, { icon: '🔔' });
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            socket.off('new_notification');
            socket.disconnect();
        };
    }, [queryClient]);

    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await api.get('/notifications');
            return res.data || [];
        }
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/login');
    };

    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (!path) return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Sidebar 
                onLogout={handleLogout} 
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobile={isMobile}
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
            />

            <div className={`transition-all duration-300 ${!isMobile ? (isCollapsed ? 'ml-20' : 'ml-64') : 'ml-0'}`}>
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        {isMobile && (
                            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                <Menu size={20} />
                            </button>
                        )}
                        <h1 className="font-extrabold text-gray-900 text-lg uppercase tracking-tight">{getPageTitle()}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className={`p-2 rounded-full transition-colors relative ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            {isNotifOpen && (
                                <NotificationDropdown 
                                    notifications={notifications} 
                                    onClose={() => setIsNotifOpen(false)} 
                                />
                            )}
                        </div>

                        <div className="h-8 w-px bg-gray-200" />

                        {/* Profile */}
                        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-200">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.name || 'Admin'}</p>
                                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{user?.role || 'Admin'}</p>
                            </div>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
