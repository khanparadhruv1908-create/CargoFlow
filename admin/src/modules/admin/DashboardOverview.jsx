import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PackageOpen, Activity, UserPlus, DollarSign } from 'lucide-react';
import { useAdminMetrics, useAdminTrends } from '../../hooks/useAdminData';

const StatCard = ({ title, value, icon, colorClass }) => {
    const IconComponent = icon;
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <IconComponent size={24} className="text-white" />
            </div>
        </div>
    );
};

export default function DashboardOverview() {
    const { data: metrics, isLoading: isMetricsLoading } = useAdminMetrics();
    const { data: trends, isLoading: isTrendsLoading } = useAdminTrends();

    if (isMetricsLoading || isTrendsLoading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h2>
                <p className="text-gray-500 dark:text-gray-400">Welcome to your logistics command center.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Shipments"
                    value={metrics?.totalShipments.toLocaleString()}
                    icon={PackageOpen}
                    colorClass="bg-blue-500 shadow-blue-500/20"
                />
                <StatCard
                    title="Active Deliveries"
                    value={metrics?.activeDeliveries}
                    icon={Activity}
                    colorClass="bg-emerald-500 shadow-emerald-500/20"
                />
                <StatCard
                    title="Revenue (This Month)"
                    value={`$${metrics?.revenueSummary.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="bg-violet-500 shadow-violet-500/20"
                />
                <StatCard
                    title="New Users"
                    value={metrics?.newUsers}
                    icon={UserPlus}
                    colorClass="bg-amber-500 shadow-amber-500/20"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trends Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800 dark:text-gray-200">
                        <DollarSign size={20} className="mr-2 text-violet-500" />
                        Revenue Trends
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Volume Trends Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800 dark:text-gray-200">
                        <PackageOpen size={20} className="mr-2 text-blue-500" />
                        Shipment Volume
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="shipments" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
