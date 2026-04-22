import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    Warehouse, MapPin, Weight, DollarSign, 
    ChevronRight, CheckCircle2, 
    Clock, RefreshCw, ShieldCheck, ThermometerSnowflake,
    Zap, Scale, Timer, PlayCircle, Calculator
} from 'lucide-react';
import api from '../services/api';

const storageSchema = z.object({
    locationId: z.string().min(1, "Please select a storage location"),
    days: z.number({ invalid_type_error: "Number of days is required" }).min(1, "Minimum 1 day required"),
    weight: z.number({ invalid_type_error: "Cargo weight is required" }).min(1, "Weight is mandatory"),
});

const WarehouseStorage = () => {
    const navigate = useNavigate();
    const [viewState, setViewState] = useState('welcome'); // 'welcome', 'inputs', 'output', 'success'
    const [bookingResult, setBookingResult] = useState(null);

    const { data: locations = [], isLoading: loadingLocs } = useQuery({
        queryKey: ['warehouse-locations'],
        queryFn: async () => {
            const data = await api.get('/warehouse/locations');
            return data;
        }
    });

    const { register, handleSubmit, watch, formState: { errors }, trigger, getValues } = useForm({
        resolver: zodResolver(storageSchema),
        defaultValues: {
            days: 7,
            weight: 100
        }
    });

    const watchLocationId = watch('locationId');
    const watchDays = watch('days') || 0;
    const watchWeight = watch('weight') || 0;

    // Live calculation logic
    const chargesBreakdown = useMemo(() => {
        const loc = locations.find(l => l._id === watchLocationId);
        if (!loc || !watchDays || !watchWeight) return null;
        
        const locationBaseTotal = loc.baseRatePerDay * watchDays;
        const weightStorageTotal = loc.ratePerKgPerDay * watchWeight * watchDays;
        const total = locationBaseTotal + weightStorageTotal;

        return {
            locationBase: locationBaseTotal,
            weightStorage: weightStorageTotal,
            total: total,
            locName: loc.name,
            rates: { base: loc.baseRatePerDay, weight: loc.ratePerKgPerDay }
        };
    }, [watchLocationId, watchDays, watchWeight, locations]);

    const bookingMutation = useMutation({
        mutationFn: async (formData) => {
            const payload = {
                ...formData,
                cargoType: 'Pallets', 
                unitCount: 1,        
                startDate: new Date().toISOString().split('T')[0] 
            };
            const data = await api.post('/warehouse/bookings', payload);
            return data;
        },
        onSuccess: (data) => {
            setBookingResult(data);
            setViewState('success');
            toast.success("Storage space reserved successfully!");
            setTimeout(() => navigate('/shipments'), 15000);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Booking failed");
        }
    });

    const handleCalculate = async () => {
        const isValid = await trigger();
        if (isValid) {
            setViewState('output');
        }
    };

    const onConfirmSubmit = (data) => {
        bookingMutation.mutate(data);
    };

    if (loadingLocs) return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <RefreshCw size={48} className="text-indigo-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                
                {/* WELCOME VIEW */}
                {viewState === 'welcome' && (
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="relative h-64">
                            <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Warehouse" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                            <div className="absolute bottom-8 left-8">
                                <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-2">
                                    <Warehouse size={14} /> Global Hub Network
                                </div>
                                <h1 className="text-4xl font-black text-white font-outfit">Premium Storage</h1>
                            </div>
                        </div>
                        <div className="p-12 text-center">
                            <p className="text-slate-500 font-medium text-lg mb-10 max-w-xl mx-auto">
                                Access secure, climate-controlled warehousing in key global trade routes. Real-time availability and dynamic pricing.
                            </p>
                            <button 
                                onClick={() => setViewState('inputs')}
                                className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 group"
                            >
                                <PlayCircle size={24} /> Begin Reservation Process
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {/* INPUTS & OUTPUT WRAPPER */}
                {(viewState === 'inputs' || viewState === 'output') && (
                    <form onSubmit={handleSubmit(onConfirmSubmit)}>
                        {/* INPUTS VIEW */}
                        {viewState === 'inputs' && (
                            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-500">
                                <div className="bg-slate-900 p-8 text-white flex justify-between items-center border-b-4 border-indigo-500">
                                    <div>
                                        <h2 className="text-2xl font-black font-outfit">Step 1: Configuration</h2>
                                        <p className="text-slate-400 text-sm">Enter your storage requirements below.</p>
                                    </div>
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                        <Calculator className="text-indigo-400" size={24} />
                                    </div>
                                </div>
                                <div className="p-10">
                                    <div className="grid grid-cols-1 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">1. Select Storage Location</label>
                                            <select 
                                                {...register('locationId')} 
                                                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700 appearance-none shadow-sm"
                                            >
                                                <option value="">-- View Available Facilities --</option>
                                                {locations.map(loc => (
                                                    <option key={loc._id} value={loc._id}>{loc.name} — {loc.address}</option>
                                                ))}
                                            </select>
                                            {errors.locationId && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.locationId.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">2. Duration (Days)</label>
                                                <input 
                                                    type="number" 
                                                    {...register('days', { valueAsNumber: true })} 
                                                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-bold shadow-sm" 
                                                    placeholder="e.g. 30" 
                                                />
                                                {errors.days && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.days.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">3. Cargo Weight (kg)</label>
                                                <input 
                                                    type="number" 
                                                    {...register('weight', { valueAsNumber: true })} 
                                                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-bold shadow-sm" 
                                                    placeholder="e.g. 500" 
                                                />
                                                {errors.weight && <p className="text-red-500 text-xs mt-2 font-bold ml-2">{errors.weight.message}</p>}
                                            </div>
                                        </div>

                                        <button 
                                            type="button"
                                            onClick={handleCalculate}
                                            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Zap size={20} className="text-indigo-400" />
                                            Calculate Storage Charges
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* OUTPUT VIEW */}
                        {viewState === 'output' && chargesBreakdown && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-t-8 border-indigo-500">
                                    <div className="p-12">
                                        <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-6">
                                            <Zap size={14} /> Step 2: Output Analysis
                                        </div>
                                        <h2 className="text-3xl font-black text-white mb-10">Charges Breakdown</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                                                <MapPin className="text-indigo-400 mb-4" size={24} />
                                                <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Location</div>
                                                <div className="text-white font-bold text-sm truncate">{chargesBreakdown.locName}</div>
                                                <div className="text-[10px] text-slate-400 mt-4">${chargesBreakdown.locationBase.toFixed(2)} Base Total</div>
                                            </div>
                                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                                                <Scale className="text-indigo-400 mb-4" size={24} />
                                                <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Weight</div>
                                                <div className="text-white font-bold text-sm">{watchWeight} kg</div>
                                                <div className="text-[10px] text-slate-400 mt-4">${chargesBreakdown.weightStorage.toFixed(2)} Weight Total</div>
                                            </div>
                                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                                                <Timer className="text-indigo-400 mb-4" size={24} />
                                                <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Duration</div>
                                                <div className="text-white font-bold text-sm">{watchDays} Days</div>
                                                <div className="text-[10px] text-slate-400 mt-4">Verified Timeline</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/10 gap-6">
                                            <div>
                                                <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Total Storage Quote</div>
                                                <div className="text-6xl font-black text-white font-mono tracking-tighter">${chargesBreakdown.total.toFixed(2)}</div>
                                            </div>
                                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                                <button 
                                                    type="submit"
                                                    disabled={bookingMutation.isPending}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                                                >
                                                    {bookingMutation.isPending ? 'Confirming...' : 'Confirm Reservation'}
                                                    <CheckCircle2 size={20} />
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setViewState('inputs')}
                                                    className="text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest"
                                                >
                                                    ← Back to Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                )}

                {/* SUCCESS VIEW */}
                {viewState === 'success' && bookingResult && (
                    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-700">
                        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 text-center">
                            <div className="bg-emerald-500 p-16 text-white">
                                <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                    <CheckCircle2 size={48} className="text-white" />
                                </div>
                                <h2 className="text-5xl font-black font-outfit">Confirmed</h2>
                                <p className="mt-4 text-emerald-100 font-bold uppercase tracking-[0.3em] text-xs">Reference: {bookingResult.bookingNumber}</p>
                            </div>
                            <div className="p-12">
                                <p className="text-slate-500 font-medium mb-10">Your storage space is officially reserved. Our local team will coordinate the intake of your cargo on the scheduled date.</p>
                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Final Amount</div>
                                        <div className="text-2xl font-black text-slate-900">${bookingResult.totalCharges.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</div>
                                        <div className="text-2xl font-black text-emerald-600">RESERVED</div>
                                    </div>
                                </div>
                                <button onClick={() => navigate('/shipments')} className="bg-slate-900 text-white font-black px-12 py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl">
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WarehouseStorage;
