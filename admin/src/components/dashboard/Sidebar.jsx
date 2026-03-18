import { Link, useLocation } from 'react-router-dom';
import {
    BarChart3,
    Users,
    Package,
    Map as MapIcon,
    Receipt,
    Settings,
    LogOut,
    Plane,
    PlaneTakeoff,
    Anchor,
    Ship,
    Gavel,
    Warehouse
} from 'lucide-react';

const navItems = [
    { name: 'Overview', path: '/', icon: BarChart3 },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Shipments', path: '/shipments', icon: Package },
    { name: 'Airlines', path: '/airlines', icon: Plane },
    { name: 'Flight Bookings', path: '/flights', icon: PlaneTakeoff },
    { name: 'Vessels & Cont.', path: '/containers', icon: Ship },
    { name: 'Ocean Bookings', path: '/ocean-bookings', icon: Anchor },
    { name: 'Customs Mgmt', path: '/customs', icon: Gavel },
    { name: 'Warehouse Mgmt', path: '/warehouse', icon: Warehouse },
    { name: 'Tracking', path: '/tracking', icon: MapIcon },
    { name: 'Billing', path: '/billing', icon: Receipt },
    { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen sticky top-0 border-r border-slate-800 transition-colors duration-300">
            <div className="h-20 flex items-center px-6 border-b border-slate-800">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
                        <Package size={20} />
                    </div>
                    <span className="font-outfit font-bold text-xl text-white tracking-tight">
                        Admin<span className="text-blue-500">Panel</span>
                    </span>
                </Link>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-blue-600/10 text-blue-500 font-semibold border-r-4 border-blue-500'
                                : 'hover:bg-slate-800 hover:text-white border-transparent border-r-4'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-blue-500' : 'text-slate-400'} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-800">
                <a
                    href="http://localhost:5173/"
                    className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Exit Admin</span>
                </a>
            </div>
        </div>
    );
}
