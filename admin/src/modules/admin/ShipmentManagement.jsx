import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { 
    Package, 
    Search, 
    ArrowRight,
    Eye,
    Trash2,
    Clock,
    RefreshCw,
    User,
    Phone,
    Mail,
    MapPin,
    Building2,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal, Button, Badge } from '../../components/ui';
import DocumentManager from './DocumentManager';

export default function ShipmentManagement() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const { data: shipments = [], isLoading } = useQuery({
        queryKey: ['admin-shipments'],
        queryFn: async () => (await api.get('/shipments')).data || []
    });

    const { data: adminUsers = [] } = useQuery({
        queryKey: ['admin-users-list'],
        queryFn: async () => (await api.get('/auth')).data || []
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }) => await api.put(`/shipments/${id}`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-shipments']);
            toast.success("Manifest updated");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await api.delete(`/shipments/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-shipments']);
            toast.success("Shipment removed");
        }
    });

    const filteredShipments = shipments.filter(s => {
        const matchesSearch = s.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             s.shipper?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAssignHandler = (shipmentId, handlerId) => {
        updateMutation.mutate({ 
            id: shipmentId, 
            payload: { 
                handledBy: handlerId,
                status: 'Assigned to Handler' 
            } 
        });
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accessing Freight Logs...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-72">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by ID or Shipper..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Booking Confirmed">Confirmed</option>
                        <option value="Assigned to Handler">Assigned</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Arrived">Arrived</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
            </div>

            {/* Shipment Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipment ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipper</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Consignee</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Path</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredShipments.map((s) => (
                                <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-mono font-bold text-blue-600 uppercase text-xs">{s.shipmentId}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 flex items-center gap-1">
                                            <Clock size={10} /> {new Date(s.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800 leading-none">{s.shipper?.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium mt-1 truncate max-w-[120px]">{s.shipper?.company}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{s.consignee?.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                            <span className="truncate max-w-[80px]">{s.origin}</span>
                                            <ArrowRight size={12} className="text-gray-300 shrink-0" />
                                            <span className="truncate max-w-[80px]">{s.destination}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            s.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                            s.status === 'In Transit' ? 'bg-blue-50 text-blue-600' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                            {s.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => { setSelectedShipment(s); setIsDetailsOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => { if(window.confirm('Remove this manifest?')) deleteMutation.mutate(s._id) }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DETAILS MODAL */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title={`Shipment Details: ${selectedShipment?.shipmentId}`}
                maxWidth="max-w-4xl"
            >
                {selectedShipment && (
                    <div className="space-y-8 py-4">
                        {/* Status & Handler Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Operational Status</label>
                                <select 
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={selectedShipment.status}
                                    onChange={(e) => updateMutation.mutate({ id: selectedShipment._id, payload: { status: e.target.value } })}
                                >
                                    <option value="Booking Confirmed">Confirmed</option>
                                    <option value="Assigned to Handler">Assigned</option>
                                    <option value="Picked Up">Picked Up</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Internal Handler</label>
                                <select 
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={selectedShipment.handledBy?._id || ""}
                                    onChange={(e) => handleAssignHandler(selectedShipment._id, e.target.value)}
                                >
                                    <option value="" disabled>Select User</option>
                                    {adminUsers.map(u => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Stakeholder Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Building2 size={14} /> Shipper Details
                                </h4>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                    <p className="font-bold text-gray-900 text-lg leading-none">{selectedShipment.shipper?.name}</p>
                                    <p className="text-sm font-medium text-gray-400">{selectedShipment.shipper?.company || 'Personal'}</p>
                                    <div className="pt-3 space-y-2 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                            <Phone size={14} className="text-blue-500" /> {selectedShipment.shipper?.phone}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                            <Mail size={14} className="text-blue-500" /> {selectedShipment.shipper?.email || 'N/A'}
                                        </div>
                                        <div className="flex items-start gap-2 text-xs font-semibold text-gray-600">
                                            <MapPin size={14} className="text-blue-500 mt-0.5 shrink-0" /> {selectedShipment.shipper?.address}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <User size={14} /> Consignee Details
                                </h4>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                    <p className="font-bold text-gray-900 text-lg leading-none">{selectedShipment.consignee?.name}</p>
                                    <p className="text-sm font-medium text-gray-400">{selectedShipment.consignee?.company || 'Personal'}</p>
                                    <div className="pt-3 space-y-2 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                            <Phone size={14} className="text-emerald-500" /> {selectedShipment.consignee?.phone}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                            <Mail size={14} className="text-emerald-500" /> {selectedShipment.consignee?.email || 'N/A'}
                                        </div>
                                        <div className="flex items-start gap-2 text-xs font-semibold text-gray-600">
                                            <MapPin size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {selectedShipment.consignee?.address}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Section */}
                        <div className="border-t border-gray-100 pt-8">
                            <DocumentManager shipmentId={selectedShipment._id} isAdmin={true} />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
