import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PackageOpen, Activity, UserPlus, DollarSign, Plane, Ship, Warehouse, FileText, Zap } from 'lucide-react';
import { useAdminMetrics, useAdminTrends } from '../../hooks/useAdminData';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => {
    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${colorClass} text-white shadow-lg`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className="text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                        +{trend}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 font-outfit">{value}</h3>
            </div>
        </div>
    );
};

const ServiceStat = ({ label, count, icon: Icon, color }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white shadow-sm ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={16} />
            </div>
            <span className="text-xs font-bold text-slate-600">{label}</span>
        </div>
        <span className="text-sm font-black text-slate-900 font-mono">{count}</span>
    </div>
);

export default function DashboardOverview() {
    const { data: metrics, isLoading: isMetricsLoading } = useAdminMetrics();
    const { data: trends, isLoading: isTrendsLoading } = useAdminTrends();

    // Fetch live service counts
    const { data: airCount = 0 } = useQuery({ queryKey: ['air-count'], queryFn: async () => (await api.get('/air-bookings')).length });
    const { data: oceanCount = 0 } = useQuery({ queryKey: ['ocean-count'], queryFn: async () => (await api.get('/ocean/bookings')).length });
    const { data: whCount = 0 } = useQuery({ queryKey: ['wh-count'], queryFn: async () => (await api.get('/warehouse/bookings')).length });
    const { data: customsCount = 0 } = useQuery({ queryKey: ['customs-count'], queryFn: async () => (await api.get('/customs/declarations')).length });

    if (isMetricsLoading || isTrendsLoading) return (
        <div className="h-screen flex items-center justify-center">
            <Activity className="animate-spin text-primary" size={48} />
        </div>
    );

    const pieData = [
        { name: 'Air', value: airCount, color: '#3b82f6' },
        { name: 'Ocean', value: oceanCount, color: '#0d9488' },
        { name: 'Warehouse', value: whCount, color: '#6366f1' },
        { name: 'Customs', value: customsCount, color: '#d97706' },
    ];

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Global Command</h2>
                    <p className="text-slate-500 font-medium mt-1">Real-time intelligence across the CargoFlow network.</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xl">
                        <Zap size={14} className="text-primary fill-primary" /> LIVE NETWORK STATUS
                    </div>
                </div>
            </div>

            {/* HIGH-LEVEL METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Total Shipments"
                    value={metrics?.totalShipments.toLocaleString()}
                    icon={PackageOpen}
                    colorClass="bg-blue-600"
                    trend={12}
                />
                <StatCard
                    title="Net Revenue"
                    value={`$${metrics?.revenueSummary.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="bg-indigo-600"
                    trend={8}
                />
                <StatCard
                    title="Network Users"
                    value={metrics?.newUsers}
                    icon={UserPlus}
                    colorClass="bg-slate-900"
                />
                <StatCard
                    title="System Uptime"
                    value="99.9%"
                    icon={Activity}
                    colorClass="bg-emerald-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* REVENUE CHART */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                            <DollarSign size={20} className="text-indigo-600" />
                            Financial Performance
                        </h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SERVICE MIX */}
                <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 flex flex-col">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-8">Service Utilization</h3>
                    
                    <div className="h-48 mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-3 flex-grow">
                        <ServiceStat label="Air Freight" count={airCount} icon={Plane} color="text-blue-500" />
                        <ServiceStat label="Ocean Freight" count={oceanCount} icon={Ship} color="text-teal-500" />
                        <ServiceStat label="Warehousing" count={whCount} icon={Warehouse} color="text-indigo-500" />
                        <ServiceStat label="Customs" count={customsCount} icon={FileText} color="text-amber-600" />
                    </div>
                </div>
            </div>
        </div>
    );
}
