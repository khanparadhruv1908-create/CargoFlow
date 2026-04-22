import { useState, useMemo } from 'react';
import { useAllBookings } from '../hooks/useAllBookings';
import { Search, Filter, RefreshCw, X, Package, Ship, Plane, Warehouse, FileText } from 'lucide-react';

const TypeIcon = ({ type }) => {
    switch (type) {
        case 'Air Freight': return <Plane size={18} className="text-blue-500" />;
        case 'Ocean Freight': return <Ship size={18} className="text-teal-500" />;
        case 'Warehouse': return <Warehouse size={18} className="text-orange-500" />;
        case 'Customs': return <FileText size={18} className="text-purple-500" />;
        default: return <Package size={18} className="text-slate-500" />;
    }
};

export default function Shipments() {
    const { allBookings, isLoading } = useAllBookings();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const filteredBookings = useMemo(() => {
        return allBookings.filter(booking => {
            const matchesSearch = 
                (booking.displayId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (booking.displayTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter ? booking.type === typeFilter : true;
            return matchesSearch && matchesType;
        });
    }, [allBookings, searchTerm, typeFilter]);

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <RefreshCw size={48} className="text-primary animate-spin" />
            <span className="ml-4 text-xl font-bold text-slate-600">Loading your logistics dashboard...</span>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight font-outfit">My Logistics Dashboard</h1>
                    <p className="mt-2 text-slate-500 font-medium">Unified view of all your air, ocean, warehouse, and customs bookings.</p>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, Route, or Service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <span className="text-sm font-bold text-slate-500 flex items-center">
                            <Filter size={16} className="mr-2" /> Filter Service:
                        </span>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-primary p-2.5 font-bold"
                        >
                            <option value="">All Services</option>
                            <option value="Air Freight">Air Freight</option>
                            <option value="Ocean Freight">Ocean Freight</option>
                            <option value="Warehouse">Warehouse Storage</option>
                            <option value="Customs">Customs Clearance</option>
                            <option value="Shipment">Standard Shipments</option>
                        </select>
                    </div>
                </div>

                {/* Unified Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Service Type</th>
                                    <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Reference ID</th>
                                    <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Details</th>
                                    <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Status</th>
                                    <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider text-right">Date Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-slate-50/80 transition-colors group cursor-default">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                                                        <TypeIcon type={booking.type} />
                                                    </div>
                                                    <span className="font-bold text-slate-700">{booking.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-mono font-black text-primary bg-primary/5 px-2 py-1 rounded">
                                                    {booking.displayId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-slate-800 font-semibold">{booking.displayTitle}</div>
                                                <div className="text-xs text-slate-500 font-medium">{booking.cargoType || booking.description || 'Logistics Service'}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${
                                                    ['Delivered', 'Cleared', 'Released', 'Arrived'].includes(booking.status || booking.vesselStatus || booking.containerStatus)
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {booking.status || booking.vesselStatus || 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="text-sm font-bold text-slate-600">{new Date(booking.createdAt).toLocaleDateString()}</div>
                                                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                                    {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <Package size={48} className="text-slate-200 mb-4" />
                                                <h3 className="text-xl font-bold text-slate-400">No bookings found</h3>
                                                <p className="text-slate-400 text-sm">Try adjusting your filters or search term.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
