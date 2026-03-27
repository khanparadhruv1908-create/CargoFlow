import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Plane, Plus, Trash2, DollarSign, Activity } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Airlines() {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');

    const { data: airlines = [] } = useQuery({
        queryKey: ['airlines'],
        queryFn: async () => await api.get('/airlines')
    });

    const createMutation = useMutation({
        mutationFn: async (newAirline) => await api.post('/airlines', newAirline),
        onSuccess: () => {
            queryClient.invalidateQueries(['airlines']);
            toast.success("Airline partner activated");
            setName('');
            setPricePerKg('');
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to create airline")
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await api.delete(`/airlines/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['airlines']);
            toast.success("Airline removed from network");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !pricePerKg) return toast.error("Please fill all fields");
        createMutation.mutate({ name, pricePerKg: Number(pricePerKg) });
    };

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 font-outfit uppercase tracking-tight">
                    <Plane className="text-primary w-8 h-8" />
                    Air Freight Control Hub
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Manage global airline partnerships and set dynamic cargo rates per KG.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* 1. CONFIGURATION PANEL */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                        <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <Plus className="text-primary w-4 h-4" /> Add Airline Partner
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Airline Company</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-primary focus:bg-white transition-all outline-none"
                                    placeholder="e.g. Qatar Airways"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Standard Rate ($/kg)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-4 text-slate-400 font-black">$</div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={pricePerKg}
                                        onChange={e => setPricePerKg(e.target.value)}
                                        className="w-full p-4 pl-8 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-primary focus:bg-white transition-all outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={createMutation.isPending}
                                style={{ backgroundColor: '#4f46e5', fontWeight: '900', padding: '16px', borderRadius: '18px', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)' }}
                            >
                                {createMutation.isPending ? 'ACTIVATING...' : 'ACTIVATE PARTNER'}
                            </Button>
                        </form>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="text-primary" />
                            <h4 className="font-black text-xs uppercase tracking-widest">Network Health</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-[10px] font-bold uppercase">Total Carriers</span>
                                <span className="text-2xl font-black">{airlines?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-[10px] font-bold uppercase">Avg Rate / KG</span>
                                <span className="text-2xl font-black text-primary">
                                    ${airlines?.length > 0 ? (airlines.reduce((acc, a) => acc + a.pricePerKg, 0) / airlines.length).toFixed(2) : '0.00'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. AIRLINE PARTNERS TABLE */}
                <div className="lg:col-span-8">
                    <TableContainer component={Paper} elevation={0} className="rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <Table>
                            <TableHead className="bg-slate-900">
                                <TableRow>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Partner Identity</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Current Rate</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Pricing Type</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-black text-white uppercase tracking-widest">Actions</th>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y divide-slate-50">
                                {airlines?.map((airline) => (
                                    <TableRow key={airline._id} hover className="group transition-colors">
                                        <TableCell className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <Plane size={20} />
                                                </div>
                                                <div className="font-black text-slate-800 text-sm">{airline.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-6">
                                            <div className="flex items-center gap-1 font-mono font-black text-primary bg-primary/5 px-3 py-1.5 rounded-xl w-fit">
                                                <DollarSign size={12} /> {airline.pricePerKg.toFixed(2)} / kg
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-6">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">Dynamic Weight-Based</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-6" align="right">
                                            <IconButton
                                                className="hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all"
                                                onClick={() => { if (window.confirm('Terminate partner access?')) deleteMutation.mutate(airline._id) }}
                                            >
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {airlines?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center opacity-20">
                                                <Plane size={48} className="text-slate-900 mb-2" />
                                                <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">No Active Carriers</h3>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

            </div>
        </div>
    );
}
