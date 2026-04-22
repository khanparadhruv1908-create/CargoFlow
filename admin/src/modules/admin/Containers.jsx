import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ship, Anchor, Trash2, Navigation, Clock, Package, DollarSign, MapPin, Search, Filter, Plus, Zap, ArrowUpRight, TrendingUp, Globe, FileText, Activity } from 'lucide-react';
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

    const { data: containers = [], isLoading: isContLoading } = useQuery({
        queryKey: ['ocean-containers'],
        queryFn: async () => await api.get('/ocean/containers')
    });

    const { data: schedules = [], isLoading: isSchedLoading } = useQuery({
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

    if (isContLoading || isSchedLoading) return (
        <div className="space-y-8">
            <div className="h-10 w-64 bg-slate-100 animate-pulse rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 h-[500px] bg-white border border-slate-100 animate-pulse rounded-[32px]" />
                <div className="lg:col-span-7 h-[700px] bg-white border border-slate-100 animate-pulse rounded-[32px]" />
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-secondary tracking-tight uppercase">Maritime Command Hub</h2>
                    <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-wider">Manage vessel deployments, transit schedules, and global container pricing</p>
                </div>
                <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Fleet Deployment</span>
                        <span className="text-xl font-black text-secondary leading-none">{schedules.length} Routes Active</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                        <Ship size={20} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                {/* 1. CONTAINER ASSET MANAGEMENT */}
                <div className="xl:col-span-4 space-y-8">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader 
                            title="Asset Configuration" 
                            subtitle="Define new maritime container unit" 
                            icon={Package} 
                        />
                        <CardContent className="p-8">
                            <form onSubmit={(e) => { e.preventDefault(); createContainer.mutate({ name: cName, price: Number(cPrice) }); }} className="space-y-6">
                                <Input label="Container Type" value={cName} onChange={e => setCName(e.target.value)} required placeholder="e.g. 40ft High Cube" icon={Box} />
                                <Input label="Base Loading Price ($)" type="number" step="0.01" value={cPrice} onChange={e => setCPrice(e.target.value)} required placeholder="0.00" icon={DollarSign} />
                                
                                <Button 
                                    type="submit" 
                                    className="w-full shadow-xl py-4 bg-teal-600 hover:bg-teal-700 shadow-teal-500/20"
                                    isLoading={createContainer.isPending}
                                    icon={Zap}
                                >
                                    Activate Container
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader title="Available Asset Fleet" subtitle="Currently active container types" icon={Anchor} />
                        <CardContent className="p-6 space-y-4">
                            {containers.map(c => (
                                <div key={c._id} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-[20px] border border-slate-100 group hover:bg-white hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-teal-600 shadow-sm">
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <div className="font-black text-secondary text-sm tracking-tight">{c.name}</div>
                                            <div className="text-[10px] text-teal-600 font-black uppercase mt-1 tracking-widest">${c.price.toFixed(2)} Base</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="p-2 text-slate-300 hover:text-rose-500 rounded-lg" onClick={() => delC.mutate(c._id)}>
                                        <Trash2 size={16}/>
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* 2. VESSEL SCHEDULE & ROUTE LOGIC */}
                <div className="xl:col-span-8 space-y-8">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader 
                            title="Deployment Terminal" 
                            subtitle="Vessel deployment & transcontinental route logic" 
                            icon={Navigation}
                        />
                        <CardContent className="p-8">
                            <form onSubmit={(e) => { e.preventDefault(); createSchedule.mutate({ vesselName: vessel, originPort: origin, destPort: dest, transitDays: Number(transit) }); }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="md:col-span-2">
                                        <Input label="Vessel Identity" value={vessel} onChange={e => setVessel(e.target.value)} required placeholder="e.g. Majestic Maersk" icon={Ship} />
                                    </div>
                                    <Input label="Origin Port" value={origin} onChange={e => setOrigin(e.target.value)} required placeholder="Mumbai" icon={MapPin} />
                                    <Input label="Destination Port" value={dest} onChange={e => setDest(e.target.value)} required placeholder="Dubai" icon={MapPin} />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-6 items-end">
                                    <Input label="Est. Transit Time (Days)" type="number" value={transit} onChange={e => setTransit(e.target.value)} required placeholder="e.g. 14" icon={Clock} containerClassName="flex-1" />
                                    <Button 
                                        type="submit" 
                                        className="w-full sm:w-auto px-10 shadow-xl py-3.5 bg-secondary hover:bg-slate-800"
                                        isLoading={createSchedule.isPending}
                                        icon={ShieldCheck}
                                    >
                                        Register Vessel Route
                                    </Button>
                                </div>
                            </form>
                        </CardContent>

                        <div className="border-t border-slate-50">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableHeader>Vessel Identity</TableHeader>
                                        <TableHeader>Route Path</TableHeader>
                                        <TableHeader>Transit Time</TableHeader>
                                        <TableHeader className="text-right">Manage</TableHeader>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {schedules.map(s => (
                                        <TableRow key={s._id} stripe>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-50 rounded-lg text-teal-600 border border-slate-100">
                                                        <Ship size={14} />
                                                    </div>
                                                    <span className="font-black text-secondary text-sm tracking-tight">{s.vesselName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 uppercase tracking-widest">
                                                        {s.originPort}
                                                    </span>
                                                    <ArrowRight size={14} className="text-slate-300" />
                                                    <span className="text-[10px] font-black text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 uppercase tracking-widest">
                                                        {s.destPort}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                                                    <Clock size={14} className="text-slate-400" />
                                                    {s.transitDays} Days
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="p-2 text-slate-300 hover:text-rose-500 rounded-lg" onClick={() => delS.mutate(s._id)}>
                                                    <Trash2 size={16}/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {schedules.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                No maritime schedules deployed in the active network
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
