import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Plane, MapPin, Clock, Trash2, Activity, User, Box } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function FlightBookings() {
    const queryClient = useQueryClient();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['admin-flight-bookings'],
        queryFn: async () => await api.get('/air-bookings')
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => await api.put(`/air-bookings/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-flight-bookings']);
            toast.success("Flight status updated");
        }
    });

    if (isLoading) return <div className="flex justify-center py-20"><Activity className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3 font-outfit uppercase">
                    <Plane className="text-primary w-8 h-8" />
                    Air Cargo Operations
                </h2>
                <p className="text-slate-500 font-medium">Manage specific air waybill bookings and flight logistics.</p>
            </div>

            <TableContainer component={Paper} elevation={0} className="rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-900">
                        <TableRow>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">AWB Number</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Route Path</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Cargo Specs</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Financials</th>
                            <th className="px-6 py-5 text-right text-[10px] font-black text-white uppercase tracking-widest">Operational Status</th>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y divide-slate-50">
                        {bookings?.map((book) => (
                            <TableRow key={book._id} hover className="group transition-colors">
                                <TableCell className="px-6 py-6">
                                    <div className="font-mono font-black text-primary bg-primary/5 px-2 py-1 rounded inline-block text-xs uppercase">
                                        {book.awbNumber}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1">
                                        <Plane size={10}/> {book.airline?.name}
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-6">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-800 text-sm">{book.origin}</span>
                                        <span className="text-slate-300">→</span>
                                        <span className="font-black text-slate-800 text-sm">{book.destination}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter flex items-center gap-1">
                                        <Clock size={10}/> ETA: {new Date(book.eta).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
                                            <Box size={12} className="text-slate-400"/> {book.cargoType}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400">
                                            Mass: {book.weight}kg
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-6">
                                    <div className="text-sm font-black text-slate-900">${book.totalCharges?.toFixed(2)}</div>
                                    <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Paid via Account</div>
                                </TableCell>
                                <TableCell className="px-6 py-6" align="right">
                                    <select 
                                        className={`text-[10px] font-black border-2 rounded-xl p-2 focus:ring-2 focus:ring-primary appearance-none text-center cursor-pointer transition-all ${
                                            book.status === 'Arrived' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                                            book.status === 'In Transit' ? 'border-blue-100 bg-blue-50 text-blue-600' :
                                            'border-slate-100 bg-slate-50 text-slate-600'
                                        }`}
                                        value={book.status}
                                        onChange={(e) => statusMutation.mutate({ id: book._id, status: e.target.value })}
                                    >
                                        <option value="Scheduled">SCHEDULED</option>
                                        <option value="Departed">DEPARTED</option>
                                        <option value="In Transit">IN TRANSIT</option>
                                        <option value="Arrived">ARRIVED</option>
                                        <option value="Cancelled">CANCELLED</option>
                                    </select>
                                </TableCell>
                            </TableRow>
                        ))}
                        {bookings?.length === 0 && (
                            <TableRow><TableCell colSpan={5} className="px-6 py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No active flight bookings</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
