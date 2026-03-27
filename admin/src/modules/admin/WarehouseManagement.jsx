import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Collapse, Box } from '@mui/material';
import { Warehouse, Trash2, DollarSign, MapPin, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

function BookingRow({ book, statusMutation }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow hover className="group transition-colors">
                <TableCell className="px-4 py-5">
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </IconButton>
                    <div className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block text-xs uppercase tracking-tighter ml-2">
                        {book.bookingNumber}
                    </div>
                </TableCell>
                <TableCell className="px-4 py-5">
                    <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                        {book.customer?.name || 'Customer User'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                        <MapPin size={10}/> {book.location?.name}
                    </div>
                </TableCell>
                <TableCell className="px-4 py-5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        {book.days}d × {book.weight}kg
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                        ${book.totalCharges?.toFixed(2)}
                    </div>
                </TableCell>
                <TableCell className="px-4 py-5" align="right">
                    <select 
                        className={`text-[10px] font-black border-2 rounded-xl p-2 focus:ring-2 focus:ring-indigo-500 appearance-none text-center cursor-pointer transition-all ${
                            book.status === 'Reserved' ? 'border-blue-100 bg-blue-50 text-blue-600' :
                            book.status === 'Stored' ? 'border-amber-100 bg-amber-50 text-amber-600' :
                            book.status === 'Released' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                            'border-slate-100 bg-slate-50 text-slate-600'
                        }`}
                        value={book.status}
                        onChange={(e) => statusMutation.mutate({ id: book._id, status: e.target.value })}
                    >
                        <option value="Reserved">RESERVED</option>
                        <option value="Stored">IN STORAGE</option>
                        <option value="Released">RELEASED</option>
                        <option value="Cancelled">CANCELLED</option>
                    </select>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap size={12} className="text-indigo-500"/> Pricing Logic Breakdown
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">Base Calculation:</span>
                                        <span className="text-slate-900 font-mono">${book.pricingBreakdown?.baseTotal?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="text-[9px] text-slate-400 italic">
                                        (Rate: ${book.pricingBreakdown?.baseRateUsed}/day × {book.days} days)
                                    </div>
                                    <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-200">
                                        <span className="text-slate-500">Weight Calculation:</span>
                                        <span className="text-slate-900 font-mono">${book.pricingBreakdown?.weightTotal?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="text-[9px] text-slate-400 italic">
                                        (Rate: ${book.pricingBreakdown?.weightRateUsed}/kg/day × {book.weight}kg × {book.days} days)
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
                                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Final Billed Amount</div>
                                    <div className="text-3xl font-black text-indigo-600 font-mono">${book.totalCharges?.toFixed(2)}</div>
                                </div>
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function WarehouseManagement() {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        baseRatePerDay: '',
        ratePerKgPerDay: '',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
        features: '24/7 Security, Climate Control'
    });

    const { data: locations = [] } = useQuery({
        queryKey: ['warehouse-locations'],
        queryFn: async () => { 
            const data = await api.get('/warehouse/locations'); 
            return data; 
        }
    });

    const { data: bookings = [] } = useQuery({
        queryKey: ['warehouse-bookings'],
        queryFn: async () => { 
            const data = await api.get('/warehouse/bookings'); 
            return data; 
        }
    });

    const createLocation = useMutation({
        mutationFn: async (payload) => { 
            const formattedPayload = {
                ...payload,
                baseRatePerDay: Number(payload.baseRatePerDay),
                ratePerKgPerDay: Number(payload.ratePerKgPerDay),
                features: payload.features.split(',').map(f => f.trim())
            };
            await api.post('/warehouse/locations', formattedPayload); 
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['warehouse-locations']);
            toast.success("Storage facility added & Pricing set");
            setFormData({
                name: '', address: '', baseRatePerDay: '', ratePerKgPerDay: '',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
                features: '24/7 Security, Climate Control'
            });
        }
    });

    const delLocation = useMutation({
        mutationFn: async (id) => await api.delete(`/warehouse/locations/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['warehouse-locations']);
            toast.success("Facility removed");
        }
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
            <div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 font-outfit">
                    <Warehouse className="text-indigo-600 w-8 h-8" />
                    Admin Pricing & Facility Control
                </h1>
                <p className="text-slate-500 mt-1 font-medium text-sm">Set global pricing and track dynamic storage calculations.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* ADMIN CONFIG FORM */}
                <div className="xl:col-span-5 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
                            <DollarSign className="text-indigo-600 w-4 h-4" /> Add Facility & Set Pricing
                        </h3>
                        <form onSubmit={(e) => { e.preventDefault(); createLocation.mutate(formData); }} className="space-y-5">
                            <AdminTextField label="Facility Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            <AdminTextField label="Physical Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
                            <div className="grid grid-cols-2 gap-4">
                                <AdminTextField label="Base / Day ($)" type="number" value={formData.baseRatePerDay} onChange={e => setFormData({...formData, baseRatePerDay: e.target.value})} required />
                                <AdminTextField label="Rate / Kg ($)" type="number" step="0.001" value={formData.ratePerKgPerDay} onChange={e => setFormData({...formData, ratePerKgPerDay: e.target.value})} required />
                            </div>
                            <AdminTextField label="Features" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} />
                            <Button type="submit" variant="contained" fullWidth style={{backgroundColor: '#4f46e5', fontWeight: '900', padding: '14px', borderRadius: '16px'}}>REGISTER FACILITY</Button>
                        </form>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Hubs</span>
                        </div>
                        <Table size="small">
                            <TableBody>
                                {locations?.map(loc => (
                                    <TableRow key={loc._id} hover className="group">
                                        <TableCell><div className="font-bold text-xs">{loc.name}</div></TableCell>
                                        <TableCell align="right"><IconButton size="small" color="error" onClick={() => delLocation.mutate(loc._id)}><Trash2 size={14}/></IconButton></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* RESERVATIONS with BREAKDOWN */}
                <div className="xl:col-span-7 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                        <h3 className="font-black text-slate-800 mb-8 uppercase tracking-widest text-xs">Customer Reservations & Calculation Results</h3>
                        <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-50 overflow-hidden">
                            <Table>
                                <TableHead className="bg-slate-900">
                                    <TableRow>
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest">ID</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest">Client & Port</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest">Pricing</th>
                                        <th className="px-4 py-4 text-right text-[10px] font-black text-white uppercase tracking-widest">Status</th>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y divide-slate-50">
                                    {bookings?.map(book => (
                                        <BookingRow key={book._id} book={book} statusMutation={statusMutation} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdminTextField({ label, type = 'text', value, onChange, required, step }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">{label}</label>
            <input type={type} step={step} value={value} onChange={onChange} required={required} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none" />
        </div>
    );
}
