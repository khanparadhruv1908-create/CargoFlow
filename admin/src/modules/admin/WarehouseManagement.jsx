import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Warehouse, Trash2, MapPin, Plus, Box, ShieldCheck, DollarSign } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function WarehouseManagement() {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [baseRate, setBaseRate] = useState('');

    const { data: locations = [], isLoading } = useQuery({
        queryKey: ['warehouse-locations'],
        queryFn: async () => (await api.get('/warehouse/locations')) || []
    });

    const createMutation = useMutation({
        mutationFn: async (payload) => await api.post('/warehouse/locations', payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['warehouse-locations']);
            toast.success("Storage facility registered");
            setName(''); setAddress(''); setBaseRate('');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await api.delete(`/warehouse/locations/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['warehouse-locations']);
            toast.success("Facility removed");
        }
    });

    if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Scanning Network Hubs...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Plus size={18} className="text-blue-600" /> New Hub
                        </h3>
                        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ name, address, baseRatePerDay: Number(baseRate), ratePerKgPerDay: 0.1 }); }} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Facility Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Central Hub"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                <input 
                                    type="text" 
                                    value={address} 
                                    onChange={e => setAddress(e.target.value)}
                                    placeholder="Location..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Base Rate / Day ($)</label>
                                <input 
                                    type="number" 
                                    value={baseRate} 
                                    onChange={e => setBaseRate(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={createMutation.isPending}
                                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'Registering...' : 'Register Hub'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800 uppercase tracking-tight">Active Storage Hubs</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {locations.map(loc => (
                                <div key={loc._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                            <Warehouse size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{loc.name}</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10}/> {loc.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Rate</p>
                                            <p className="text-sm font-bold text-blue-600">${loc.baseRatePerDay}/day</p>
                                        </div>
                                        <button 
                                            onClick={() => { if(window.confirm('Remove facility?')) deleteMutation.mutate(loc._id) }}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {locations.length === 0 && (
                                <div className="p-10 text-center text-gray-400 text-sm font-medium">No hubs registered</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
