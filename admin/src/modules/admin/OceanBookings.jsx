import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Ship, Package, Anchor } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function OceanBookings() {
    const queryClient = useQueryClient();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['ocean-bookings'],
        queryFn: async () => {
            const { data } = await api.get('/ocean/bookings');
            return data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, payload }) => {
            await api.put(`/ocean/bookings/${id}/status`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['ocean-bookings']);
            toast.success("Shipment status updated");
        }
    });

    const getStatusColor = (vStatus) => {
        switch (vStatus) {
            case 'Departed': return 'info';
            case 'In Transit': return 'warning';
            case 'Arrived': return 'success';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Anchor className="text-teal-600" />
                Ocean Freight Bookings
            </h1>

            <TableContainer component={Paper} className="shadow-sm border border-slate-100 rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50">
                        <TableRow>
                            <TableCell className="font-bold">BOL Number</TableCell>
                            <TableCell className="font-bold">Vessel / Route</TableCell>
                            <TableCell className="font-bold">Cargo</TableCell>
                            <TableCell className="font-bold">Vessel Status</TableCell>
                            <TableCell className="font-bold">Container Status</TableCell>
                            <TableCell align="right" className="font-bold">BOL Option</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                        ) : bookings.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-500">No ocean bookings found.</TableCell></TableRow>
                        ) : (
                            bookings.map((booking) => (
                                <TableRow key={booking._id} hover>
                                    <TableCell className="font-mono font-medium tracking-wide text-teal-600">{booking.bolNumber}</TableCell>
                                    <TableCell>
                                        <div className="font-bold flex items-center gap-1"><Ship size={14} /> {booking.schedule?.vesselName}</div>
                                        <div className="text-xs text-slate-500">{booking.schedule?.originPort} → {booking.schedule?.destPort}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{booking.containerType?.name}</div>
                                        <div className="text-xs text-slate-500 font-semibold">{booking.weight}kg | ETA: {new Date(booking.eta).toLocaleDateString()}</div>
                                    </TableCell>
                                    <TableCell>
                                        <select
                                            className={`px-3 py-1.5 border rounded-lg text-sm bg-slate-50 font-bold ${booking.vesselStatus === 'Arrived' ? 'text-green-600' : ''}`}
                                            value={booking.vesselStatus}
                                            onChange={(e) => statusMutation.mutate({ id: booking._id, payload: { vesselStatus: e.target.value } })}
                                        >
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="Departed">Departed</option>
                                            <option value="In Transit">In Transit</option>
                                            <option value="Arrived">Arrived</option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <select
                                            className="px-3 py-1.5 border rounded-lg text-sm bg-slate-50"
                                            value={booking.containerStatus}
                                            onChange={(e) => statusMutation.mutate({ id: booking._id, payload: { containerStatus: e.target.value } })}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Loaded">Loaded</option>
                                            <option value="Discharged">Discharged</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded inline-block">{booking.bolOption}</div>
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
