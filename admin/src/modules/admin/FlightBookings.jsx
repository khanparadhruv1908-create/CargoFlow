import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plane, ArrowRight, TrendingUp, Search } from 'lucide-react';
import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function FlightBookings() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['admin-flight-bookings'],
        queryFn: async () => (await api.get('/air-bookings')) || []
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => await api.put(`/air-bookings/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-flight-bookings']);
            toast.success("Flight status updated");
        }
    });

    const filtered = bookings.filter(b => 
        b.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Accessing Aviation Manifest...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search AWB or Route..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">AWB Number</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Route Path</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cargo Specs</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Decision</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filtered.map((b) => (
                                <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-mono font-bold text-blue-600 uppercase">{b.awbNumber}</div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{b.airline?.name}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        <div className="flex items-center gap-2">
                                            {b.origin} <ArrowRight size={12} className="text-gray-300" /> {b.destination}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-700">{b.cargoType}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{b.weight} KG</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative group w-fit">
                                            <select 
                                                className={`
                                                    text-[10px] font-black rounded-lg border-none py-1.5 pl-3 pr-8 
                                                    focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer transition-all uppercase tracking-wider
                                                    ${
                                                        b.status === 'Arrived' ? 'bg-emerald-50 text-emerald-600' :
                                                        b.status === 'In Transit' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-gray-100 text-gray-500'
                                                    }
                                                `}
                                                value={b.status}
                                                onChange={(e) => statusMutation.mutate({ id: b._id, status: e.target.value })}
                                            >
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="Departed">Departed</option>
                                                <option value="In Transit">Transit</option>
                                                <option value="Arrived">Arrived</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            <TrendingUp size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                                        </div>
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
