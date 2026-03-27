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
    Warehouse,
    Globe
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

export default function Sidebar({ onLogout }) {
    const location = useLocation();

    return (
        <div className="w-64 bg-slate-950 text-slate-400 flex flex-col min-h-screen sticky top-0 border-r border-slate-900 transition-colors duration-300">
            <div className="h-20 flex items-center px-6 border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:scale-110 transition-all shadow-lg shadow-blue-500/20">
                        <Package size={20} />
                    </div>
                    <span className="font-outfit font-black text-xl text-white tracking-tighter uppercase">
                        Admin<span className="text-blue-500 italic">HQ</span>
                    </span>
                </Link>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Network Operations</div>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20'
                                : 'hover:bg-slate-900 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-500 transition-colors'} />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-900 space-y-2">
                <a
                    href="http://localhost:5173/"
                    className="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/5 rounded-xl transition-all"
                >
                    <Globe size={18} />
                    <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Main Site</span>
                </a>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Logout Securely</span>
                </button>
            </div>
        </div>
    );
}
