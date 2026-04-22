import { useAdminMetrics } from '../../hooks/useAdminData';
import { Package, Activity, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color.bg} ${color.text}`}>
                <Icon size={24} />
            </div>
        </div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
    </div>
);

export default function DashboardOverview() {
    const { data: metrics, isLoading } = useAdminMetrics();

    const { data: shipments = [] } = useQuery({
        queryKey: ['recent-shipments'],
        queryFn: async () => (await api.get('/shipments')).data
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Dashboard...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Shipments" 
                    value={metrics?.totalShipments || 0} 
                    icon={Package} 
                    color={{ bg: 'bg-blue-50', text: 'text-blue-600' }} 
                />
                <StatCard 
                    title="Active Orders" 
                    value={shipments.filter(s => s.status !== 'Delivered').length} 
                    icon={Activity} 
                    color={{ bg: 'bg-amber-50', text: 'text-amber-600' }} 
                />
                <StatCard 
                    title="Total Revenue" 
                    value={`$${metrics?.revenueSummary?.toLocaleString() || 0}`} 
                    icon={DollarSign} 
                    color={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }} 
                />
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 uppercase tracking-tight">Recent Shipments</h3>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipment ID</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipper</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Origin</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Yield</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {shipments.slice(0, 5).map((s) => (
                                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-blue-600 uppercase">{s.shipmentId}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">{s.shipper?.name || 'Customer'}</td>
                                    <td className="px-6 py-4 text-gray-500 font-medium">{s.origin}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                                            s.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                            s.status === 'In Transit' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-800">
                                        ${(s.weight * 2.5).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
