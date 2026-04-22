import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plane, Plus, Trash2, DollarSign } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Airlines() {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');

    const { data: airlines = [], isLoading } = useQuery({
        queryKey: ['airlines'],
        queryFn: async () => (await api.get('/airlines')) || []
    });

    const createMutation = useMutation({
        mutationFn: async (newAirline) => await api.post('/airlines', newAirline),
        onSuccess: () => {
            queryClient.invalidateQueries(['airlines']);
            toast.success("Airline partner added");
            setName('');
            setPricePerKg('');
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to add airline")
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await api.delete(`/airlines/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['airlines']);
            toast.success("Airline removed");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !pricePerKg) return toast.error("Please fill all fields");
        createMutation.mutate({ name, pricePerKg: Number(pricePerKg) });
    };

    if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Loading Carriers...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Add Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Plus size={18} className="text-blue-600" /> Add New Airline
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Airline Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Emirates"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Price per KG ($)</label>
                                <input 
                                    type="number" 
                                    value={pricePerKg} 
                                    onChange={e => setPricePerKg(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={createMutation.isPending}
                                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'Saving...' : 'Add Carrier'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 uppercase tracking-tight">Airline Partners</h3>
                            <Badge className="bg-blue-50 text-blue-600">{airlines.length} Total</Badge>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate / KG</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {airlines.map((a) => (
                                    <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-700">{a.name}</td>
                                        <td className="px-6 py-4 font-mono font-bold text-blue-600">${a.pricePerKg.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => { if(window.confirm('Delete airline?')) deleteMutation.mutate(a._id) }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {airlines.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-10 text-center text-gray-400 text-sm font-medium">No airlines registered</td>
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

const Badge = ({ children, className }) => (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${className}`}>
        {children}
    </span>
);
