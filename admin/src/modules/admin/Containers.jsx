import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField } from '@mui/material';
import { Ship, Anchor, Plus, Trash2 } from 'lucide-react';
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
        queryFn: async () => { const { data } = await api.get('/ocean/containers'); return data; }
    });

    const { data: schedules = [], isLoading: loadS } = useQuery({
        queryKey: ['ocean-schedules'],
        queryFn: async () => { const { data } = await api.get('/ocean/schedules'); return data; }
    });

    const createContainer = useMutation({
        mutationFn: async (payload) => { await api.post('/ocean/containers', payload); },
        onSuccess: () => {
            queryClient.invalidateQueries(['ocean-containers']);
            toast.success("Container type added");
            setCName(''); setCPrice('');
        }
    });

    const createSchedule = useMutation({
        mutationFn: async (payload) => { await api.post('/ocean/schedules', payload); },
        onSuccess: () => {
            queryClient.invalidateQueries(['ocean-schedules']);
            toast.success("Schedule route added");
            setVessel(''); setOrigin(''); setDest(''); setTransit('');
        }
    });

    const delC = useMutation({ mutationFn: async (id) => await api.delete(`/ocean/containers/${id}`), onSuccess: () => queryClient.invalidateQueries(['ocean-containers']) });
    const delS = useMutation({ mutationFn: async (id) => await api.delete(`/ocean/schedules/${id}`), onSuccess: () => queryClient.invalidateQueries(['ocean-schedules']) });

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Ship className="text-teal-600" />
                Vessel & Container Management
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Containers */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Anchor className="w-5 h-5" /> Add Container Type</h3>
                        <form onSubmit={(e) => { e.preventDefault(); createContainer.mutate({ name: cName, price: Number(cPrice) }); }} className="flex flex-col gap-3">
                            <input type="text" value={cName} onChange={e => setCName(e.target.value)} required placeholder="e.g. 20ft Standard" className="p-2.5 border rounded-lg focus:ring-teal-500" />
                            <input type="number" step="0.01" value={cPrice} onChange={e => setCPrice(e.target.value)} required placeholder="Base Price ($)" className="p-2.5 border rounded-lg" />
                            <Button type="submit" variant="contained" disabled={createContainer.isPending} startIcon={<Plus />} style={{ backgroundColor: '#0d9488' }}>Add Container</Button>
                        </form>
                    </div>

                    <TableContainer component={Paper} className="shadow-sm border border-slate-100 relative">
                        <Table size="small">
                            <TableHead className="bg-slate-50"><TableRow><TableCell>Name</TableCell><TableCell>Price</TableCell><TableCell></TableCell></TableRow></TableHead>
                            <TableBody>
                                {containers.map(c => (
                                    <TableRow key={c._id}><TableCell>{c.name}</TableCell><TableCell>${c.price}</TableCell>
                                        <TableCell align="right"><IconButton size="small" color="error" onClick={() => delC.mutate(c._id)}><Trash2 size={16} /></IconButton></TableCell>
                                    </TableRow>
                                ))}
                                {containers.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-gray-500">No data</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/* Schedules */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Ship className="w-5 h-5" /> Add Vessel Route</h3>
                        <form onSubmit={(e) => { e.preventDefault(); createSchedule.mutate({ vesselName: vessel, originPort: origin, destPort: dest, transitDays: Number(transit) }); }} className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" value={vessel} onChange={e => setVessel(e.target.value)} required placeholder="Vessel Name" className="p-2.5 border rounded-lg col-span-2" />
                                <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} required placeholder="Origin Port" className="p-2.5 border rounded-lg" />
                                <input type="text" value={dest} onChange={e => setDest(e.target.value)} required placeholder="Dest Port" className="p-2.5 border rounded-lg" />
                                <input type="number" value={transit} onChange={e => setTransit(e.target.value)} required placeholder="Transit Days" className="p-2.5 border rounded-lg col-span-2" />
                            </div>
                            <Button type="submit" variant="contained" disabled={createSchedule.isPending} startIcon={<Plus />} style={{ backgroundColor: '#0f766e' }}>Add Route / ETA Logic</Button>
                        </form>
                    </div>

                    <TableContainer component={Paper} className="shadow-sm border border-slate-100 relative">
                        <Table size="small">
                            <TableHead className="bg-slate-50"><TableRow><TableCell>Vessel</TableCell><TableCell>Route</TableCell><TableCell>Days</TableCell><TableCell></TableCell></TableRow></TableHead>
                            <TableBody>
                                {schedules.map(c => (
                                    <TableRow key={c._id}>
                                        <TableCell>{c.vesselName}</TableCell><TableCell>{c.originPort} → {c.destPort}</TableCell><TableCell>{c.transitDays}</TableCell>
                                        <TableCell align="right"><IconButton size="small" color="error" onClick={() => delS.mutate(c._id)}><Trash2 size={16} /></IconButton></TableCell>
                                    </TableRow>
                                ))}
                                {schedules.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-gray-500">No data</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}
