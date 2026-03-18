import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField } from '@mui/material';
import { Warehouse, Plus, Trash2, Box, Calendar, User as UserIcon } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function WarehouseManagement() {
    const queryClient = useQueryClient();

    // Facility Form
    const [name, setName] = useState('');
    const [baseRate, setBaseRate] = useState('');
    const [weightRate, setWeightRate] = useState('');

    const { data: locations = [], isLoading: loadingLocs } = useQuery({
        queryKey: ['warehouse-locations'],
        queryFn: async () => { const { data } = await api.get('/warehouse/locations'); return data; }
    });

    const { data: bookings = [], isLoading: loadingBookings } = useQuery({
        queryKey: ['warehouse-bookings'],
        queryFn: async () => { const { data } = await api.get('/warehouse/bookings'); return data; }
    });

    const createLocation = useMutation({
        mutationFn: async (payload) => { await api.post('/warehouse/locations', payload); },
        onSuccess: () => {
            queryClient.invalidateQueries(['warehouse-locations']);
            toast.success("Storage facility added");
            setName(''); setBaseRate(''); setWeightRate('');
        }
    });

    const delLocation = useMutation({
        mutationFn: async (id) => await api.delete(`/warehouse/locations/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['warehouse-locations'])
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => { await api.put(`/warehouse/bookings/${id}/status`, { status }); },
        onSuccess: () => {
            queryClient.invalidateQueries(['warehouse-bookings']);
            toast.success("Storage status updated");
        }
    });

    return (
        <div className="space-y-8 pb-12">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Warehouse className="text-indigo-600" />
                Warehouse & Facility Management
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* 1. Facility Config */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 font-outfit">Add New Storage Facility</h3>
                        <form onSubmit={(e) => { 
                            e.preventDefault(); 
                            createLocation.mutate({ name, baseRatePerDay: Number(baseRate), ratePerKgPerDay: Number(weightRate) }); 
                        }} className="space-y-4">
                            <AdminTextField label="Facility Name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Dallas Hub - A1" />
                            <div className="grid grid-cols-2 gap-4">
                                <AdminTextField label="Base Rate / Day ($)" type="number" value={baseRate} onChange={e => setBaseRate(e.target.value)} required placeholder="10.00" />
                                <AdminTextField label="Rate per Kg / Day ($)" type="number" step="0.001" value={weightRate} onChange={e => setWeightRate(e.target.value)} required placeholder="0.05" />
                            </div>
                            <Button type="submit" variant="contained" fullWidth disabled={createLocation.isPending} style={{backgroundColor: '#4f46e5', fontWeight: 'bold'}}>Register Facility</Button>
                        </form>
                    </div>

                    <TableContainer component={Paper} className="shadow-sm border border-slate-100 overflow-hidden rounded-xl">
                        <Table size="small">
                            <TableHead className="bg-slate-50"><TableRow><TableCell>Facility Name</TableCell><TableCell>Base Rate</TableCell><TableCell>Weight Rate</TableCell><TableCell></TableCell></TableRow></TableHead>
                            <TableBody>
                                {locations.map(loc => (
                                    <TableRow key={loc._id} hover>
                                        <TableCell className="font-semibold text-slate-700">{loc.name}</TableCell>
                                        <TableCell>${loc.baseRatePerDay}/day</TableCell>
                                        <TableCell>${loc.ratePerKgPerDay}/kg/day</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" color="error" onClick={() => delLocation.mutate(loc._id)}><Trash2 size={16}/></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/* 2. Reservations Management */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 font-outfit"><Box className="w-5 h-5 text-slate-600" /> Current Reservations</h3>
                    <TableContainer component={Paper} className="shadow-sm border border-slate-100 overflow-hidden rounded-xl">
                        <Table size="small">
                            <TableHead className="bg-slate-50">
                                <TableRow>
                                    <TableCell>WH #</TableCell>
                                    <TableCell>Client / Facility</TableCell>
                                    <TableCell>Storage Details</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map(book => (
                                    <TableRow key={book._id} hover>
                                        <TableCell className="font-mono text-xs font-bold text-indigo-600">{book.bookingNumber}</TableCell>
                                        <TableCell>
                                            <div className="text-xs font-bold flex items-center gap-1"><UserIcon size={10}/> {book.customer?.name || 'Guest'}</div>
                                            <div className="text-[10px] text-slate-500">{book.location?.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs">{book.days} Days | {book.weight}kg</div>
                                            <div className="text-[10px] font-bold text-slate-900">${book.totalCharges.toFixed(2)}</div>
                                        </TableCell>
                                        <TableCell align="right">
                                            <select 
                                                className="text-[10px] border rounded p-1 bg-white"
                                                value={book.status}
                                                onChange={(e) => statusMutation.mutate({ id: book._id, status: e.target.value })}
                                            >
                                                <option value="Reserved">Reserved</option>
                                                <option value="Stored">Stored</option>
                                                <option value="Released">Released</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {bookings.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No active bookings</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

            </div>
        </div>
    );
}

function AdminTextField({ label, type = 'text', value, onChange, required, placeholder, step }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</label>
            <input 
                type={type} 
                step={step}
                value={value} 
                onChange={onChange} 
                required={required}
                placeholder={placeholder}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    );
}
