import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Landmark, Trash2, Gavel, Coins, MapPin, DollarSign, Calculator } from 'lucide-react';
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

    const { data: ports = [] } = useQuery({
        queryKey: ['customs-ports'],
        queryFn: async () => await api.get('/customs/ports')
    });

    const { data: declarations = [] } = useQuery({
        queryKey: ['customs-declarations'],
        queryFn: async () => await api.get('/customs/declarations')
    });

    const createPort = useMutation({
        mutationFn: async (payload) => await api.post('/customs/ports', payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['customs-ports']);
            toast.success("Customs port logic activated");
            setName(''); setBaseCharge(''); setDuty('');
            setSlabs([{ minWeight: 0, ratePerKg: 1 }]);
        }
    });

    const delPort = useMutation({
        mutationFn: async (id) => await api.delete(`/customs/ports/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['customs-ports']);
            toast.success("Port removed from network");
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => await api.put(`/customs/declarations/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['customs-declarations']);
            toast.success("Declaration status synchronized");
        }
    });

    const addSlab = () => setSlabs([...slabs, { minWeight: 0, ratePerKg: 0 }]);
    const updateSlab = (idx, field, val) => {
        const newSlabs = [...slabs];
        newSlabs[idx][field] = Number(val);
        setSlabs(newSlabs);
    };

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 font-outfit uppercase tracking-tight">
                    <Landmark className="text-amber-600 w-8 h-8" />
                    Customs Compliance Hub
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Define international border protocols, duty percentages, and clearance tariffs.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* 1. PORT CONFIGURATION & TARIFFS */}
                <div className="xl:col-span-5 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <Coins className="text-amber-500 w-4 h-4" /> Border Point Configuration
                        </h3>
                        
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            createPort.mutate({ name, type, baseCharge: Number(baseCharge), dutyPercentage: Number(duty), weightSlabs: slabs });
                        }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AdminTextField label="Port Name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Heathrow (LHR)" />
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Type</label>
                                    <select value={type} onChange={e => setType(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-amber-500 transition-all">
                                        <option value="Airport">Airport Terminal</option>
                                        <option value="Dry Port">Dry Port / Inland</option>
                                        <option value="Seaport">Seaport Terminal</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <AdminTextField label="Base Clearance ($)" type="number" value={baseCharge} onChange={e => setBaseCharge(e.target.value)} required placeholder="0.00" icon={<DollarSign size={14}/>} />
                                <AdminTextField label="Standard Duty (%)" type="number" value={duty} onChange={e => setDuty(e.target.value)} required placeholder="0" icon={<span className="text-[10px] font-black">%</span>} />
                            </div>

                            <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"><Calculator size={14} /> Advanced Weight Slabs</label>
                                    <button type="button" onClick={addSlab} className="text-[10px] font-black bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">+ ADD SLAB</button>
                                </div>
                                <div className="space-y-3">
                                    {slabs.map((s, i) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <div className="flex-1">
                                                <input type="number" placeholder="Min KG" value={s.minWeight} onChange={e => updateSlab(i, 'minWeight', e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 rounded-xl text-xs font-bold outline-none focus:border-amber-500" />
                                            </div>
                                            <div className="flex-1">
                                                <input type="number" step="0.01" placeholder="$/KG Rate" value={s.ratePerKg} onChange={e => updateSlab(i, 'ratePerKg', e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 rounded-xl text-xs font-bold outline-none focus:border-amber-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                variant="contained" 
                                fullWidth 
                                disabled={createPort.isPending} 
                                style={{backgroundColor: '#d97706', fontWeight: '900', padding: '16px', borderRadius: '18px', boxShadow: '0 10px 15px -3px rgba(217, 119, 6, 0.3)'}}
                            >
                                {createPort.isPending ? 'CONFIGURING...' : 'ACTIVATE BORDER LOGIC'}
                            </Button>
                        </form>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <Table size="small">
                            <TableHead className="bg-slate-50"><TableRow>
                                <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase">Registered Port</th>
                                <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase">Tariff Structure</th>
                                <th className="px-4 py-3 text-right text-[9px] font-black text-slate-400 uppercase"></th>
                            </TableRow></TableHead>
                            <TableBody>
                                {ports?.map(p => (
                                    <TableRow key={p._id} hover className="group">
                                        <TableCell className="px-4 py-4">
                                            <div className="font-black text-slate-800 text-xs">{p.name}</div>
                                            <div className="text-[9px] font-bold text-amber-600 uppercase mt-0.5">{p.type}</div>
                                        </TableCell>
                                        <TableCell className="px-4 py-4">
                                            <div className="text-[10px] font-bold text-slate-500">${p.baseCharge} + {p.dutyPercentage}%</div>
                                        </TableCell>
                                        <TableCell align="right" className="px-4 py-4">
                                            <IconButton size="small" className="opacity-0 group-hover:opacity-100" color="error" onClick={() => delPort.mutate(p._id)}><Trash2 size={14} /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* 2. INCOMING DECLARATIONS FEED */}
                <div className="xl:col-span-7 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <Gavel className="text-slate-400 w-4 h-4" /> Regulatory Declaration Feed
                        </h3>
                        <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-slate-50 overflow-hidden">
                            <Table>
                                <TableHead className="bg-slate-900">
                                    <TableRow>
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest">Entry ID</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest">Point of Entry</th>
                                        <th className="px-4 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest">Financials</th>
                                        <th className="px-4 py-4 text-right text-[10px] font-black text-white uppercase tracking-widest">Decision</th>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y divide-slate-50">
                                    {declarations?.map(dec => (
                                        <TableRow key={dec._id} hover className="group transition-colors">
                                            <TableCell className="px-4 py-5">
                                                <div className="font-mono font-black text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block text-xs">
                                                    {dec.declarationNumber}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-5">
                                                <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                                                    <MapPin size={10} className="text-slate-400"/> {dec.port?.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold mt-1">
                                                    {dec.weight}kg | VAL: ${dec.cargoValue?.toLocaleString() || '0'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-5">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase">Duty: +${dec.dutyAmount?.toFixed(2) || '0.00'}</div>
                                                <div className="text-sm font-black text-slate-900 mt-0.5">${dec.totalAmount?.toFixed(2) || '0.00'}</div>
                                            </TableCell>
                                            <TableCell className="px-4 py-5" align="right">
                                                <select
                                                    className={`text-[10px] font-black border-2 rounded-xl p-2 focus:ring-2 focus:ring-amber-500 appearance-none text-center cursor-pointer transition-all ${
                                                        dec.status === 'Cleared' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                                                        dec.status === 'Rejected' ? 'border-red-100 bg-red-50 text-red-600' :
                                                        'border-amber-100 bg-amber-50 text-amber-600'
                                                    }`}
                                                    value={dec.status}
                                                    onChange={(e) => statusMutation.mutate({ id: dec._id, status: e.target.value })}
                                                >
                                                    <option value="Pending">PENDING</option>
                                                    <option value="Processing">PROCESSING</option>
                                                    <option value="Cleared">CLEARED</option>
                                                    <option value="Rejected">REJECTED</option>
                                                </select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {declarations?.length === 0 && (
                                        <TableRow><TableCell colSpan={4} className="px-6 py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No active declarations</TableCell></TableRow>
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
        <div className="space-y-1.5 flex-1">
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
                    className={`w-full p-4 ${icon ? 'pl-10' : ''} bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-amber-500 focus:bg-white transition-all outline-none`}
                />
            </div>
        </div>
    );
}
