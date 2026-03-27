import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton
} from '@mui/material';
import { Filter, Edit, Package, MapPin, Clock, User, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ShipmentManagement() {
    const queryClient = useQueryClient();

    const { data: shipments = [], isLoading } = useQuery({
        queryKey: ['admin-shipments'],
        queryFn: async () => await api.get('/shipments')
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => await api.put(`/shipments/${id}`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-shipments']);
            toast.success("Shipment status updated");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await api.delete(`/shipments/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-shipments']);
            toast.success("Shipment record purged");
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3 font-outfit uppercase">
                    <Package className="text-primary w-8 h-8" />
                    Standard Shipment Directory
                </h2>
                <p className="text-slate-500 font-medium">Global overview of all dispatched and pending road/standard freight.</p>
            </div>

            <TableContainer component={Paper} elevation={0} className="rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-900">
                        <TableRow>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Shipment ID</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Route Path</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Logistics Details</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-white uppercase tracking-widest">Operational Status</th>
                            <th className="px-6 py-5 text-right text-[10px] font-black text-white uppercase tracking-widest">Actions</th>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y divide-slate-50">
                        {shipments?.map((ship) => (
                            <TableRow key={ship._id} hover className="group transition-colors">
                                <TableCell className="px-6 py-6">
                                    <div className="font-mono font-black text-primary bg-primary/5 px-2 py-1 rounded inline-block text-xs uppercase">
                                        {ship.shipmentId}
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-6">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-800 text-sm">{ship.origin}</span>
                                        <span className="text-slate-300">→</span>
                                        <span className="font-black text-slate-800 text-sm">{ship.destination}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Verified Transcontinental Path</div>
                                </TableCell>
                                <TableCell className="px-6 py-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <User size={12} className="text-slate-400"/> {ship.assignedDriver || 'Unassigned'}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                            <Clock size={12}/> ETA: {new Date(ship.eta).toLocaleDateString()}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-6">
                                    <select 
                                        className={`text-[10px] font-black border-2 rounded-xl p-2 focus:ring-2 focus:ring-primary appearance-none text-center cursor-pointer transition-all ${
                                            ship.status === 'Delivered' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                                            ship.status === 'In Transit' ? 'border-blue-100 bg-blue-50 text-blue-600' :
                                            ship.status === 'Delayed' ? 'border-red-100 bg-red-50 text-red-600' :
                                            'border-slate-100 bg-slate-50 text-slate-600'
                                        }`}
                                        value={ship.status}
                                        onChange={(e) => statusMutation.mutate({ id: ship._id, status: e.target.value })}
                                    >
                                        <option value="Pending">PENDING</option>
                                        <option value="In Transit">IN TRANSIT</option>
                                        <option value="Delivered">DELIVERED</option>
                                        <option value="Delayed">DELAYED</option>
                                    </select>
                                </TableCell>
                                <TableCell className="px-6 py-6" align="right">
                                    <IconButton 
                                        className="hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all"
                                        onClick={() => { if (window.confirm('Purge shipment record?')) deleteMutation.mutate(ship._id) }}
                                    >
                                        <Trash2 size={18} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {shipments?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center opacity-20">
                                        <Package size={48} className="text-slate-900 mb-2" />
                                        <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">No Active Shipments</h3>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
