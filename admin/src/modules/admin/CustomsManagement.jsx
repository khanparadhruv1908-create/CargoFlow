import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Landmark, Trash2, Gavel, Coins, MapPin, DollarSign, Calculator, Search, Filter, Plus, Zap, ArrowUpRight, TrendingUp, Globe, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
    Card, 
    CardHeader, 
    CardContent, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableHeader, 
    TableCell,
    Badge,
    Button,
    Input,
    Select
} from '../../components/ui';

export default function CustomsManagement() {
    const queryClient = useQueryClient();

    // Port Form
    const [name, setName] = useState('');
    const [type, setType] = useState('Airport');
    const [baseCharge, setBaseCharge] = useState('');
    const [duty, setDuty] = useState('');
    const [slabs, setSlabs] = useState([{ minWeight: 0, ratePerKg: 1 }]);

    const { data: ports = [], isLoading: isPortsLoading } = useQuery({
        queryKey: ['customs-ports'],
        queryFn: async () => await api.get('/customs/ports')
    });

    const { data: declarations = [], isLoading: isDecsLoading } = useQuery({
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

    if (isPortsLoading || isDecsLoading) return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-100 animate-pulse rounded-xl" />
                    <div className="h-4 w-64 bg-slate-50 animate-pulse rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 h-[600px] bg-white border border-slate-100 animate-pulse rounded-[32px]" />
                <div className="lg:col-span-7 h-[800px] bg-white border border-slate-100 animate-pulse rounded-[32px]" />
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-secondary tracking-tight uppercase">Customs Compliance Hub</h2>
                    <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-wider">Define international border protocols and clearance tariffs</p>
                </div>
                <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Border Nodes</span>
                        <span className="text-xl font-black text-secondary leading-none">{ports.length} Points</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                        <Landmark size={20} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                {/* 1. PORT CONFIGURATION & TARIFFS */}
                <div className="xl:col-span-5 space-y-8">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader 
                            title="Border Point Config" 
                            subtitle="Register new entry/exit terminal" 
                            icon={Coins} 
                        />
                        <CardContent className="p-8">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                createPort.mutate({ name, type, baseCharge: Number(baseCharge), dutyPercentage: Number(duty), weightSlabs: slabs });
                            }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Port Name" value={name} onChange={e => setName(e.target.value)} required placeholder="Heathrow (LHR)" icon={Globe} />
                                    <Select 
                                        label="Terminal Type"
                                        value={type} 
                                        onChange={e => setType(e.target.value)}
                                        options={[
                                            { value: 'Airport', label: 'Airport Terminal' },
                                            { value: 'Dry Port', label: 'Dry Port / Inland' },
                                            { value: 'Seaport', label: 'Seaport Terminal' }
                                        ]}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <Input label="Base Clearance ($)" type="number" value={baseCharge} onChange={e => setBaseCharge(e.target.value)} required placeholder="0.00" icon={DollarSign} />
                                    <Input label="Standard Duty (%)" type="number" value={duty} onChange={e => setDuty(e.target.value)} required placeholder="0" icon={TrendingUp} />
                                </div>

                                <div className="bg-[#0F172A] p-7 rounded-[28px] text-white space-y-5">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Calculator size={14} /> Weight Slabs
                                            </label>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Tiered Pricing Control</p>
                                        </div>
                                        <button type="button" onClick={addSlab} className="text-[10px] font-black bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all border border-white/5 active:scale-95">
                                            + ADD SLAB
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {slabs.map((s, i) => (
                                            <div key={i} className="flex gap-3 items-center animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                                <div className="flex-1">
                                                    <input type="number" placeholder="Min KG" value={s.minWeight} onChange={e => updateSlab(i, 'minWeight', e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-bold outline-none focus:border-amber-500 transition-all placeholder:text-slate-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <input type="number" step="0.01" placeholder="$/KG Rate" value={s.ratePerKg} onChange={e => updateSlab(i, 'ratePerKg', e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-bold outline-none focus:border-amber-500 transition-all placeholder:text-slate-600" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full shadow-xl py-4 bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
                                    isLoading={createPort.isPending}
                                    icon={Zap}
                                >
                                    Activate Border Logic
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm overflow-hidden">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Registered Port</TableHeader>
                                    <TableHeader>Tariff Structure</TableHeader>
                                    <TableHeader className="text-right"></TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ports.map(p => (
                                    <TableRow key={p._id} stripe>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-50 rounded-lg text-amber-600 border border-slate-100">
                                                    <Landmark size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-secondary text-xs tracking-tight leading-none mb-1">{p.name}</p>
                                                    <Badge variant="warning" className="!px-1.5 !py-0.5 text-[8px]">{p.type}</Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-500">
                                                <span className="text-secondary">${p.baseCharge}</span>
                                                <span className="opacity-40">+</span>
                                                <span className="text-amber-600">{p.dutyPercentage}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="p-2 text-slate-300 hover:text-rose-500 rounded-lg" onClick={() => delPort.mutate(p._id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                {/* 2. INCOMING DECLARATIONS FEED */}
                <div className="xl:col-span-7 space-y-8">
                    <Card className="border-none shadow-sm overflow-hidden h-full">
                        <CardHeader 
                            title="Regulatory Manifest" 
                            subtitle="Verified international border entry logs" 
                            icon={Gavel}
                            action={
                                <div className="flex items-center gap-3">
                                    <Input 
                                        placeholder="Search Entry ID..."
                                        icon={Search}
                                        className="!py-2 !px-4 !rounded-xl !bg-slate-50 border-none w-64"
                                        containerClassName="space-y-0"
                                    />
                                </div>
                            }
                        />
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Entry ID</TableHeader>
                                    <TableHeader>Point of Entry</TableHeader>
                                    <TableHeader>Financials</TableHeader>
                                    <TableHeader className="text-right">Decision</TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {declarations.map(dec => (
                                    <TableRow key={dec._id} stripe>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-mono text-[11px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg w-fit border border-amber-100">
                                                    {dec.declarationNumber}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">Border Entry Log</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
                                                    <MapPin size={14} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-secondary text-sm tracking-tight">{dec.port?.name}</span>
                                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                                                        {dec.weight}kg | VAL: ${dec.cargoValue?.toLocaleString() || '0'}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter leading-none mb-1">+${dec.dutyAmount?.toFixed(2) || '0.00'}</span>
                                                <span className="text-sm font-black text-secondary tracking-tight">${dec.totalAmount?.toFixed(2) || '0.00'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="relative group w-fit ml-auto">
                                                <select
                                                    className={`
                                                        text-[10px] font-black rounded-xl border-none py-2.5 pl-4 pr-10 
                                                        focus:ring-4 focus:ring-amber-500/5 appearance-none cursor-pointer transition-all uppercase tracking-[0.1em]
                                                        ${
                                                            dec.status === 'Cleared' ? 'bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-500/5' :
                                                            dec.status === 'Rejected' ? 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-500/5' :
                                                            'bg-amber-50 text-amber-600 shadow-sm shadow-amber-500/5'
                                                        }
                                                    `}
                                                    value={dec.status}
                                                    onChange={(e) => statusMutation.mutate({ id: dec._id, status: e.target.value })}
                                                >
                                                    <option value="Pending">DECISION: PENDING</option>
                                                    <option value="Processing">DECISION: PROCESSING</option>
                                                    <option value="Cleared">DECISION: CLEARED</option>
                                                    <option value="Rejected">DECISION: REJECTED</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                    <Gavel size={14} className="text-amber-600" />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {declarations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-32 text-center">
                                            <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                                                <div className="w-20 h-20 bg-slate-50 rounded-[24px] flex items-center justify-center mb-6 border border-slate-100">
                                                    <FileText size={40} className="text-slate-200" />
                                                </div>
                                                <h4 className="text-lg font-black text-secondary tracking-tight">Empty Declaration Feed</h4>
                                                <p className="text-sm font-medium text-slate-400 mt-2 leading-relaxed">No regulatory declarations were detected in the current terminal cycle.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

            </div>
        </div>
    );
}
