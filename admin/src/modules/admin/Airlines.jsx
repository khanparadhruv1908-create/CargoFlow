import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Plane, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Airlines() {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');

    const { data: airlines = [], isLoading } = useQuery({
        queryKey: ['airlines'],
        queryFn: async () => {
            const { data } = await api.get('/airlines');
            return data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newAirline) => {
            const { data } = await api.post('/airlines', newAirline);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['airlines']);
            toast.success("Airline created successfully");
            setName('');
            setPricePerKg('');
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to create airline")
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/airlines/${id}`);
        },
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

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Plane className="text-blue-600" />
                Manage Airlines
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-4">Add New Airline</h3>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm text-slate-500 mb-1">Airline Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. FedEx Air" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm text-slate-500 mb-1">Price per Kg ($)</label>
                        <input type="number" step="0.01" value={pricePerKg} onChange={e => setPricePerKg(e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                    </div>
                    <Button type="submit" variant="contained" disabled={createMutation.isPending} startIcon={<Plus />} className="h-[46px]">
                        Save Airline
                    </Button>
                </form>
            </div>

            <TableContainer component={Paper} className="shadow-sm border border-slate-100 rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50">
                        <TableRow>
                            <TableCell className="font-bold">Airline Name</TableCell>
                            <TableCell className="font-bold">Price Rate ($/kg)</TableCell>
                            <TableCell align="right" className="font-bold">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={3} className="text-center py-8">Loading...</TableCell></TableRow>
                        ) : airlines.length === 0 ? (
                            <TableRow><TableCell colSpan={3} className="text-center py-8 text-slate-500">No airlines configured yet.</TableCell></TableRow>
                        ) : (
                            airlines.map((airline) => (
                                <TableRow key={airline._id} hover>
                                    <TableCell className="font-medium">{airline.name}</TableCell>
                                    <TableCell>${airline.pricePerKg.toFixed(2)}/kg</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="error" onClick={() => { if (window.confirm('Delete airline?')) deleteMutation.mutate(airline._id) }}>
                                            <Trash2 size={20} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
