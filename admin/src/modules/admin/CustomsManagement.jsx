import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Chip } from '@mui/material';
import { Landmark, Plus, Trash2, Gavel, Scale, Coins } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CustomsManagement() {
    const queryClient = useQueryClient();

    // Port Form
    const [name, setName] = useState('');
    const [type, setType] = useState('Airport');
    const [baseCharge, setBaseCharge] = useState('');
    const [duty, setDuty] = useState('');
    const [slabs, setSlabs] = useState([{ minWeight: 0, ratePerKg: 1 }]);

    const { data: ports = [], isLoading: loadingPorts } = useQuery({
        queryKey: ['customs-ports'],
        queryFn: async () => { const { data } = await api.get('/customs/ports'); return data; }
    });

    const { data: declarations = [], isLoading: loadingDec } = useQuery({
        queryKey: ['customs-declarations'],
        queryFn: async () => { const { data } = await api.get('/customs/declarations'); return data; }
    });

    const createPort = useMutation({
        mutationFn: async (payload) => { await api.post('/customs/ports', payload); },
        onSuccess: () => {
            queryClient.invalidateQueries(['customs-ports']);
            toast.success("Customs Port configured");
            setName(''); setBaseCharge(''); setDuty('');
            setSlabs([{ minWeight: 0, ratePerKg: 1 }]);
        }
    });

    const delPort = useMutation({
        mutationFn: async (id) => await api.delete(`/customs/ports/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['customs-ports'])
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => { await api.put(`/customs/declarations/${id}/status`, { status }); },
        onSuccess: () => {
            queryClient.invalidateQueries(['customs-declarations']);
            toast.success("Declaration status updated");
        }
    });

    const addSlab = () => setSlabs([...slabs, { minWeight: 0, ratePerKg: 0 }]);
    const updateSlab = (idx, field, val) => {
        const newSlabs = [...slabs];
        newSlabs[idx][field] = Number(val);
        setSlabs(newSlabs);
    };

    return (
        <div className="space-y-8 pb-12">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Landmark className="text-amber-600" />
                Customs & Regulatory Management
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* 1. Port Pricing Config */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Coins className="w-5 h-5 text-amber-500" /> Configure Port Tariffs</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            createPort.mutate({ name, type, baseCharge: Number(baseCharge), dutyPercentage: Number(duty), weightSlabs: slabs });
                        }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <TextField size="small" label="Port Name" value={name} onChange={e => setName(e.target.value)} required fullWidth />
                                <select value={type} onChange={e => setType(e.target.value)} className="p-2.5 border rounded-lg text-sm bg-slate-50">
                                    <option value="Airport">Airport</option>
                                    <option value="Dry Port">Dry Port</option>
                                    <option value="Seaport">Seaport</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <TextField size="small" type="number" label="Base Clearance ($)" value={baseCharge} onChange={e => setBaseCharge(e.target.value)} required fullWidth />
                                <TextField size="small" type="number" label="Duty Percentage (%)" value={duty} onChange={e => setDuty(e.target.value)} required fullWidth />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Scale size={14} /> Weight Slabs (Admin Logic)</label>
                                    <Button size="small" onClick={addSlab} startIcon={<Plus size={14} />}>Add Slab</Button>
                                </div>
                                {slabs.map((s, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <TextField size="small" type="number" placeholder="Min Weight" value={s.minWeight} onChange={e => updateSlab(i, 'minWeight', e.target.value)} />
                                        <TextField size="small" type="number" placeholder="$/kg Rate" value={s.ratePerKg} onChange={e => updateSlab(i, 'ratePerKg', e.target.value)} />
                                    </div>
                                ))}
                            </div>

                            <Button type="submit" variant="contained" fullWidth disabled={createPort.isPending} style={{ backgroundColor: '#b45309', fontWeight: 'bold' }}>Create Customs logic</Button>
                        </form>
                    </div>

                    <TableContainer component={Paper} className="shadow-sm border border-slate-100">
                        <Table size="small">
                            <TableHead className="bg-slate-50"><TableRow><TableCell>Port</TableCell><TableCell>Base/Duty</TableCell><TableCell>Slabs</TableCell><TableCell></TableCell></TableRow></TableHead>
                            <TableBody>
                                {ports.map(p => (
                                    <TableRow key={p._id} hover>
                                        <TableCell>
                                            <div className="font-bold">{p.name}</div>
                                            <div className="text-[10px] text-slate-500 uppercase">{p.type}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs">${p.baseCharge} fee</div>
                                            <div className="text-xs font-bold text-amber-700">{p.dutyPercentage}% duty</div>
                                        </TableCell>
                                        <TableCell>
                                            {p.weightSlabs?.map((s, i) => <div key={i} className="text-[10px]"> &gt;{s.minWeight}kg: ${s.ratePerKg}/kg</div>)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" color="error" onClick={() => delPort.mutate(p._id)}><Trash2 size={16} /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/* 2. Declaration Management */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Gavel className="w-5 h-5 text-slate-600" /> Incoming Declarations</h3>
                    <TableContainer component={Paper} className="shadow-sm border border-slate-100 overflow-hidden rounded-xl">
                        <Table size="small">
                            <TableHead className="bg-slate-50">
                                <TableRow>
                                    <TableCell>DEC #</TableCell>
                                    <TableCell>Port / Details</TableCell>
                                    <TableCell>Financials</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {declarations.map(dec => (
                                    <TableRow key={dec._id} hover>
                                        <TableCell className="font-mono text-xs font-bold text-amber-600">{dec.declarationNumber}</TableCell>
                                        <TableCell>
                                            <div className="text-xs font-bold">{dec.port?.name}</div>
                                            <div className="text-[10px] text-slate-500">{dec.weight}kg | Val: ${dec.cargoValue}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-[10px]">Duty: +${dec.dutyAmount}</div>
                                            <div className="text-xs font-bold text-slate-900">${dec.totalAmount}</div>
                                        </TableCell>
                                        <TableCell align="right">
                                            <select
                                                className="text-[10px] border rounded p-1 bg-white"
                                                value={dec.status}
                                                onChange={(e) => statusMutation.mutate({ id: dec._id, status: e.target.value })}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Cleared">Cleared</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {declarations.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No declarations found</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

            </div>
        </div>
    );
}

// Minimal TextField Shim for MUI inside the logic
function TextField({ size, label, type = 'text', value, onChange, required, fullWidth, placeholder }) {
    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
            />
        </div>
    );
}
