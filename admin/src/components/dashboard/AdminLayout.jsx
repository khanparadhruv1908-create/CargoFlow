import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.dispatchEvent(new Event('storage')); // Trigger App.jsx update
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <Sidebar onLogout={handleLogout} />
            <div className="flex-1 flex flex-col overflow-hidden h-screen">
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-end px-8 shadow-sm z-10">
                    <div className="flex items-center space-x-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex flex-col">
                            <span className="hidden sm:inline font-bold leading-tight">{user?.name || 'Admin User'}</span>
                            <span className="hidden sm:inline text-[10px] text-slate-400 uppercase font-black">{user?.role}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="ml-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-slate-950 p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
