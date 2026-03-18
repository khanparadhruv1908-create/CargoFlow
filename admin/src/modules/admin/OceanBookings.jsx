import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Ship, Package, Anchor, Navigation, Clock, Activity, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function OceanBookings() {
    const queryClient = useQueryClient();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['ocean-bookings'],
        queryFn: async () => await api.get('/ocean/bookings')
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, payload }) => await api.put(`/ocean/bookings/${id}/status`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['ocean-bookings']);
            toast.success("Maritime status synchronized");
        }
    });

    if (isLoading) return <div className="flex justify-center py-20"><Activity className="animate-spin text-teal-600" /></div>;

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3 font-outfit uppercase">
                    <Ship className="text-teal-600 w-8 h-8" />
                    Maritime Fleet Operations
                </h2>
                <p className="text-slate-500 font-medium">Global container management and real-time vessel tracking across international waters.</p>
            </div>

            <TableContainer component={Paper} elevation={0} className="rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-900">
                        <TableRow>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Bill of Lading (BOL)</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Vessel & Strategic Route</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Manifest Details</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Operational Status</th>
                            <th className="px-6 py-5 text-right text-[10px] font-black text-white uppercase tracking-widest">BOL Option</th>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y divide-slate-50">
                        {bookings.map((booking) => (
                            <TableRow key={booking._id} hover className="group transition-colors">
                                <TableCell className="px-6 py-6">
                                    <div className="font-mono font-black text-teal-600 bg-teal-50 px-2 py-1 rounded inline-block text-xs uppercase tracking-wider">
                                        {booking.bolNumber}
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-6">
                                    <div className="font-black text-slate-800 text-sm flex items-center gap-2">
                                        <Ship size={14} className="text-teal-600"/> {booking.schedule?.vesselName}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1">
                                        {booking.schedule?.originPort} <Navigation size={8}/> {booking.schedule?.destPort}
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-6">
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                            <Package size={12} className="text-slate-400"/> {booking.containerType?.name}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                            <Clock size={10}/> ETA: {new Date(booking.eta).toLocaleDateString()} | {booking.weight}kg
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-6">
                                    <div className="flex gap-2">
                                        <select 
                                            className={`text-[9px] font-black border-2 rounded-lg p-1.5 focus:ring-2 focus:ring-teal-500 appearance-none text-center cursor-pointer transition-all ${
                                                booking.vesselStatus === 'Arrived' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-slate-100 bg-slate-50'
                                            }`}
                                            value={booking.vesselStatus}
                                            onChange={(e) => statusMutation.mutate({ id: booking._id, payload: { vesselStatus: e.target.value } })}
                                        >
                                            <option value="Scheduled">VESSEL: SCHEDULED</option>
                                            <option value="Departed">VESSEL: DEPARTED</option>
                                            <option value="In Transit">VESSEL: TRANSIT</option>
                                            <option value="Arrived">VESSEL: ARRIVED</option>
                                        </select>

                                        <select 
                                            className="text-[9px] font-black border-2 border-slate-100 bg-slate-50 rounded-lg p-1.5 focus:ring-2 focus:ring-teal-500 appearance-none text-center cursor-pointer"
                                            value={booking.containerStatus}
                                            onChange={(e) => statusMutation.mutate({ id: booking._id, payload: { containerStatus: e.target.value } })}
                                        >
                                            <option value="Pending">BOX: PENDING</option>
                                            <option value="Loaded">BOX: LOADED</option>
                                            <option value="Discharged">BOX: DISCHARGED</option>
                                            <option value="Delivered">BOX: DELIVERED</option>
                                        </select>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-6" align="right">
                                    <div className="flex items-center gap-1 justify-end font-bold text-[10px] text-slate-500 uppercase tracking-tighter bg-slate-100 px-2 py-1 rounded-lg w-fit ml-auto">
                                        <FileText size={10}/> {booking.bolOption}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {bookings.length === 0 && (
                            <TableRow><TableCell colSpan={5} className="px-6 py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No active ocean fleet bookings</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
