import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { PlaneTakeoff } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function FlightBookings() {
    const queryClient = useQueryClient();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['air-bookings'],
        queryFn: async () => {
            const { data } = await api.get('/air-bookings');
            return data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            await api.put(`/air-bookings/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['air-bookings']);
            toast.success("Flight status updated");
        }
    });

    const handleStatusChange = (id, newStatus) => {
        statusMutation.mutate({ id, status: newStatus });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'default';
            case 'In Transit': return 'warning';
            case 'Delivered': return 'success';
            case 'Delayed': return 'error';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <PlaneTakeoff className="text-blue-600" />
                Air Freight Bookings
            </h1>

            <TableContainer component={Paper} className="shadow-sm border border-slate-100 rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50">
                        <TableRow>
                            <TableCell className="font-bold">AWB Number</TableCell>
                            <TableCell className="font-bold">Route</TableCell>
                            <TableCell className="font-bold">Airline</TableCell>
                            <TableCell className="font-bold">Weight/Charges</TableCell>
                            <TableCell className="font-bold">Status</TableCell>
                            <TableCell align="right" className="font-bold">Update Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                        ) : bookings.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-500">No flight bookings found.</TableCell></TableRow>
                        ) : (
                            bookings.map((booking) => (
                                <TableRow key={booking._id} hover>
                                    <TableCell className="font-mono font-medium tracking-wide text-blue-600">{booking.awbNumber}</TableCell>
                                    <TableCell>
                                        <div className="text-sm font-semibold">{booking.origin}</div>
                                        <div className="text-xs text-slate-500">to {booking.destination}</div>
                                    </TableCell>
                                    <TableCell>{booking.airline?.name || 'Unknown'}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{booking.weight} kg</div>
                                        <div className="text-xs text-green-600 font-bold">${booking.totalCharges}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={booking.status} color={getStatusColor(booking.status)} size="small" className="font-bold" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <select
                                            className="px-3 py-1.5 border rounded-lg text-sm bg-slate-50 w-32"
                                            value={booking.status}
                                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                                            disabled={statusMutation.isPending}
                                        >
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="In Transit">In Transit</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Delayed">Delayed</option>
                                        </select>
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
