import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Navigation,
    Warehouse,
    Receipt,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Shipments', path: '/shipments', icon: Package },
    { name: 'Bookings', path: '/flights', icon: Navigation },
    { name: 'Warehouse', path: '/warehouse', icon: Warehouse },
    { name: 'Billing', path: '/billing', icon: Receipt },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ onLogout, isCollapsed, setIsCollapsed, isMobile, isOpen, setIsOpen }) {
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-200 transition-all duration-300
                ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
                ${isCollapsed ? 'w-20' : 'w-64'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                            <Package size={20} />
                        </div>
                        {!isCollapsed && <span className="font-bold text-lg text-gray-800">CargoFlow</span>}
                    </div>
                    {!isMobile && (
                        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 text-gray-400 hover:text-gray-600">
                            {isCollapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
                        </button>
                    )}
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => isMobile && setIsOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                    ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}
                                `}
                            >
                                <item.icon size={20} />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
