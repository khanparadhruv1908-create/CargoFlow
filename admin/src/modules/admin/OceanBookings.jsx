import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ship, ArrowRight, Search, Anchor } from 'lucide-react';
import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function OceanBookings() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['ocean-bookings'],
        queryFn: async () => (await api.get('/ocean/bookings')) || []
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, payload }) => await api.put(`/ocean/bookings/${id}/status`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['ocean-bookings']);
            toast.success("Vessel status synchronized");
        }
    });

    const filtered = bookings.filter(b => 
        b.bolNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.schedule?.vesselName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Accessing Maritime Logs...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search BOL or Vessel..."
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
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">BOL Number</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vessel & Strategic Path</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cargo Unit</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filtered.map((b) => (
                                <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-mono font-bold text-teal-600 uppercase">{b.bolNumber}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800">{b.schedule?.vesselName}</p>
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                            {b.schedule?.originPort} <ArrowRight size={10}/> {b.schedule?.destPort}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-700">{b.containerType?.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">ETA: {new Date(b.eta).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <select 
                                                className="text-[10px] font-black bg-gray-100 border-none rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer uppercase"
                                                value={b.vesselStatus}
                                                onChange={(e) => statusMutation.mutate({ id: b._id, payload: { vesselStatus: e.target.value } })}
                                            >
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="In Transit">Transit</option>
                                                <option value="Arrived">Arrived</option>
                                            </select>
                                            <select 
                                                className="text-[10px] font-black bg-gray-100 border-none rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer uppercase"
                                                value={b.containerStatus}
                                                onChange={(e) => statusMutation.mutate({ id: b._id, payload: { containerStatus: e.target.value } })}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Loaded">Loaded</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
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
