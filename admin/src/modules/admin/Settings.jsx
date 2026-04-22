import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Save, Plus, Trash2, Edit, CheckCircle2, XCircle, Settings as SettingsIcon, LayoutGrid } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [serviceForm, setServiceForm] = useState({
        id: '',
        title: '',
        description: '',
        icon: 'Package',
        features: '',
        isActive: true
    });

    const { data: services = [] } = useQuery({
        queryKey: ['admin-services'],
        queryFn: async () => await api.get('/services/admin')
    });

    const saveMutation = useMutation({
        mutationFn: async (payload) => {
            const formatted = {
                ...payload,
                features: typeof payload.features === 'string' ? payload.features.split(',').map(f => f.trim()) : payload.features
            };
            if (editingService) {
                return await api.put(`/services/${editingService._id}`, formatted);
            } else {
                return await api.post('/services', formatted);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-services']);
            toast.success(editingService ? "Service updated" : "Service created");
            setIsDialogOpen(false);
            resetForm();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await api.delete(`/services/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-services']);
            toast.success("Service removed");
        }
    });

    const resetForm = () => {
        setServiceForm({ id: '', title: '', description: '', icon: 'Package', features: '', isActive: true });
        setEditingService(null);
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setServiceForm({
            ...service,
            features: service.features.join(', ')
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2 font-outfit">
                    <SettingsIcon className="text-primary w-8 h-8" />
                    Platform & Service Control
                </h2>
                <p className="text-slate-500 font-medium">Manage core logistics services and global application secrets.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                
                {/* 1. SERVICE MANAGEMENT */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                                <LayoutGrid size={18} className="text-primary" /> Active Logistics Services
                            </h3>
                            <p className="text-slate-400 text-xs mt-1">Control what services are available to customers on the frontend.</p>
                        </div>
                        <Button 
                            variant="contained" 
                            startIcon={<Plus size={18} />} 
                            onClick={() => { resetForm(); setIsDialogOpen(true); }}
                            style={{backgroundColor: '#4f46e5', fontWeight: '900', borderRadius: '12px'}}
                        >
                            Add Service
                        </Button>
                    </div>

                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead className="bg-slate-50">
                                <TableRow>
                                    <TableCell className="font-black text-[10px] uppercase text-slate-400 tracking-widest">Icon/ID</TableCell>
                                    <TableCell className="font-black text-[10px] uppercase text-slate-400 tracking-widest">Service Title</TableCell>
                                    <TableCell className="font-black text-[10px] uppercase text-slate-400 tracking-widest">Description</TableCell>
                                    <TableCell className="font-black text-[10px] uppercase text-slate-400 tracking-widest">Status</TableCell>
                                    <TableCell align="right" className="font-black text-[10px] uppercase text-slate-400 tracking-widest">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services?.map((service) => (
                                    <TableRow key={service._id} hover>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600 font-bold text-xs uppercase">{service.icon}</div>
                                                <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{service.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-black text-slate-800 text-sm">{service.title}</TableCell>
                                        <TableCell className="max-w-md text-xs text-slate-500 truncate">{service.description}</TableCell>
                                        <TableCell>
                                            {service.isActive ? 
                                                <span className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase"><CheckCircle2 size={12}/> Active</span> : 
                                                <span className="flex items-center gap-1 text-slate-400 font-black text-[10px] uppercase"><XCircle size={12}/> Disabled</span>
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" color="primary" onClick={() => handleEdit(service)}><Edit size={16}/></IconButton>
                                            <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(service._id)}><Trash2 size={16}/></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/* 2. API KEYS & PRICING SECRETS */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 space-y-8">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                <Save size={16} /> Global Pricing Engine & API Keys
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <TextField label="Stripe Secret Key" type="password" fullWidth variant="filled" defaultValue="sk_test_mock_..." />
                                <TextField label="Route Calculation API" type="password" fullWidth variant="filled" defaultValue="routing_v2_mock_..." />
                            </div>
                        </div>

                        <Divider />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Platform Fee ($)</label>
                                <TextField type="number" fullWidth variant="outlined" defaultValue="25.00" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Standard Tax Rate (%)</label>
                                <TextField type="number" fullWidth variant="outlined" defaultValue="12.5" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urgent Surcharge (Multiplier)</label>
                                <TextField type="number" fullWidth variant="outlined" defaultValue="1.5" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <FormControlLabel control={<Switch defaultChecked color="primary" />} label={<span className="text-sm font-bold text-slate-700">Enable Automated Invoicing</span>} />
                            <FormControlLabel control={<Switch defaultChecked color="primary" />} label={<span className="text-sm font-bold text-slate-700">Maintenance Mode</span>} />
                        </div>
                    </div>
                    <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-end">
                        <Button variant="contained" style={{backgroundColor: '#0f172a', fontWeight: '900', borderRadius: '12px'}}>Save Global Config</Button>
                    </div>
                </div>
            </div>

            {/* SERVICE DIALOG */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm" PaperProps={{style: {borderRadius: '24px', padding: '16px'}}}>
                <DialogTitle className="font-black text-2xl font-outfit">{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                <DialogContent className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <TextField label="Service ID" fullWidth value={serviceForm.id} onChange={e => setServiceForm({...serviceForm, id: e.target.value})} placeholder="e.g. air-express" />
                        <TextField label="Icon Name" fullWidth value={serviceForm.icon} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})} placeholder="Plane, Ship, Warehouse..." />
                    </div>
                    <TextField label="Service Title" fullWidth value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} />
                    <TextField label="Description" fullWidth multiline rows={3} value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} />
                    <TextField label="Features (Comma separated)" fullWidth value={serviceForm.features} onChange={e => setServiceForm({...serviceForm, features: e.target.value})} />
                    <FormControlLabel control={<Switch checked={serviceForm.isActive} onChange={e => setServiceForm({...serviceForm, isActive: e.target.checked})} />} label="Service is Active" />
                </DialogContent>
                <DialogActions className="p-6">
                    <Button onClick={() => setIsDialogOpen(false)} style={{color: '#64748b', fontWeight: 'bold'}}>Cancel</Button>
                    <Button variant="contained" onClick={() => saveMutation.mutate(serviceForm)} style={{backgroundColor: '#4f46e5', fontWeight: '900', padding: '10px 30px', borderRadius: '12px'}}>
                        {editingService ? 'UPDATE SERVICE' : 'CREATE SERVICE'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
