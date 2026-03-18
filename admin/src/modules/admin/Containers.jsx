import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Ship, Anchor, Plus, Trash2, Navigation, Clock, Package, DollarSign, MapPin } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ContainerManagement() {
    const queryClient = useQueryClient();

    // Container Form
    const [cName, setCName] = useState('');
    const [cPrice, setCPrice] = useState('');

    // Schedule Form
    const [vessel, setVessel] = useState('');
    const [origin, setOrigin] = useState('');
    const [dest, setDest] = useState('');
    const [transit, setTransit] = useState('');

    const { data: containers = [], isLoading: loadC } = useQuery({
        queryKey: ['ocean-containers'],
        queryFn: async () => await api.get('/ocean/containers')
    });

    const { data: schedules = [], isLoading: loadS } = useQuery({
        queryKey: ['ocean-schedules'],
        queryFn: async () => await api.get('/ocean/schedules')
    });

    const createContainer = useMutation({
        mutationFn: async (payload) => await api.post('/ocean/containers', payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['ocean-containers']);
            toast.success("Container configuration saved");
            setCName(''); setCPrice('');
        }
    });

    const createSchedule = useMutation({
        mutationFn: async (payload) => await api.post('/ocean/schedules', payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['ocean-schedules']);
            toast.success("Vessel route activated");
            setVessel(''); setOrigin(''); setDest(''); setTransit('');
        }
    });

    const delC = useMutation({ mutationFn: async (id) => await api.delete(`/ocean/containers/${id}`), onSuccess: () => queryClient.invalidateQueries(['ocean-containers']) });
    const delS = useMutation({ mutationFn: async (id) => await api.delete(`/ocean/schedules/${id}`), onSuccess: () => queryClient.invalidateQueries(['ocean-schedules']) });

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 font-outfit uppercase tracking-tight">
                    <Ship className="text-teal-600 w-8 h-8" />
                    Ocean Freight Command Hub
                </h1>
                <p className="text-slate-500 mt-1 font-medium text-sm text-slate-500">Manage vessel deployments, transit schedules, and global container pricing.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* 1. CONTAINER ASSET MANAGEMENT */}
                <div className="xl:col-span-5 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <Package className="text-teal-600 w-4 h-4" /> Define Container Asset
                        </h3>
                        
                        <form onSubmit={(e) => { e.preventDefault(); createContainer.mutate({ name: cName, price: Number(cPrice) }); }} className="space-y-6">
                            <AdminTextField label="Container Type" value={cName} onChange={e => setCName(e.target.value)} required placeholder="e.g. 40ft High Cube" />
                            <AdminTextField label="Base Loading Price ($)" type="number" step="0.01" value={cPrice} onChange={e => setCPrice(e.target.value)} required placeholder="0.00" icon={<DollarSign size={14}/>} />
                            
                            <Button 
                                type="submit" 
                                variant="contained" 
                                fullWidth 
                                disabled={createContainer.isPending} 
                                style={{backgroundColor: '#0d9488', fontWeight: '900', padding: '16px', borderRadius: '18px', boxShadow: '0 10px 15px -3px rgba(13, 148, 136, 0.3)'}}
                            >
                                {createContainer.isPending ? 'CONFIGURING...' : 'ACTIVATE CONTAINER'}
                            </Button>
                        </form>
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Anchor size={80} /></div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-teal-400">Available Asset Fleet</h4>
                        <div className="space-y-4">
                            {containers.map(c => (
                                <div key={c._id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 group">
                                    <div>
                                        <div className="font-bold text-xs">{c.name}</div>
                                        <div className="text-[10px] text-teal-400 font-mono mt-1">${c.price.toFixed(2)} Base</div>
                                    </div>
                                    <IconButton size="small" className="text-white/20 group-hover:text-red-400 transition-colors" onClick={() => delC.mutate(c._id)}>
                                        <Trash2 size={14}/>
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. VESSEL SCHEDULE & ROUTE LOGIC */}
                <div className="xl:col-span-7 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <Navigation className="text-teal-600 w-4 h-4" /> Vessel Deployment & Route Logic
                        </h3>
                        
                        <form onSubmit={(e) => { e.preventDefault(); createSchedule.mutate({ vesselName: vessel, originPort: origin, destPort: dest, transitDays: Number(transit) }); }} className="space-y-6 mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <AdminTextField label="Vessel Name" value={vessel} onChange={e => setVessel(e.target.value)} required placeholder="e.g. Majestic Maersk" />
                                </div>
                                <AdminTextField label="Origin Port" value={origin} onChange={e => setOrigin(e.target.value)} required placeholder="Mumbai" icon={<MapPin size={12}/>} />
                                <AdminTextField label="Destination Port" value={dest} onChange={e => setDest(e.target.value)} required placeholder="Dubai" icon={<MapPin size={12}/>} />
                                <div className="md:col-span-2">
                                    <AdminTextField label="Estimated Transit Time (Days)" type="number" value={transit} onChange={e => setTransit(e.target.value)} required placeholder="e.g. 14" icon={<Clock size={12}/>} />
                                </div>
                            </div>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                fullWidth 
                                disabled={createSchedule.isPending} 
                                style={{backgroundColor: '#0f172a', fontWeight: '900', padding: '16px', borderRadius: '18px'}}
                            >
                                {createSchedule.isPending ? 'DEPLOYING...' : 'REGISTER VESSEL ROUTE'}
                            </Button>
                        </form>

                        <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-50 overflow-hidden">
                            <Table size="small">
                                <TableHead className="bg-slate-50">
                                    <TableRow>
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Vessel</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Path</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Transit</th>
                                        <th className="px-4 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y divide-slate-50">
                                    {schedules.map(s => (
                                        <TableRow key={s._id} hover className="group transition-colors">
                                            <TableCell className="px-4 py-4">
                                                <div className="font-black text-slate-800 text-xs flex items-center gap-2">
                                                    <Ship size={12} className="text-teal-600"/> {s.vesselName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4">
                                                <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block">
                                                    {s.originPort} → {s.destPort}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4">
                                                <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
                                                    <Clock size={10}/> {s.transitDays} Days
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4" align="right">
                                                <IconButton size="small" className="opacity-0 group-hover:opacity-100 transition-opacity" color="error" onClick={() => delS.mutate(s._id)}>
                                                    <Trash2 size={14}/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {schedules.length === 0 && (
                                        <TableRow><TableCell colSpan={4} className="text-center py-10 text-slate-400 text-xs font-bold uppercase">No vessel schedules deployed</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdminTextField({ label, type = 'text', value, onChange, required, placeholder, step, icon }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-4 top-4 text-slate-400">{icon}</div>}
                <input 
                    type={type} 
                    step={step}
                    value={value} 
                    onChange={onChange} 
                    required={required}
                    placeholder={placeholder}
                    className={`w-full p-4 ${icon ? 'pl-10' : ''} bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-teal-500 focus:bg-white transition-all outline-none`}
                />
            </div>
        </div>
    );
}
