import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Warehouse, Calculator, MapPin, Weight, Calendar, DollarSign, ChevronRight, CheckCircle2, Info } from 'lucide-react';
import api from '../services/api';

const storageSchema = z.object({
    locationId: z.string().min(1, "Please select a storage location"),
    days: z.number({ invalid_type_error: "Days must be a number" }).min(1, "Minimum 1 day required"),
    weight: z.number({ invalid_type_error: "Weight must be a number" }).min(1, "Weight is mandatory"),
});

const WarehouseStorage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [calcResult, setCalcResult] = useState(null);
    const [bookingResult, setBookingResult] = useState(null);

    const { data: locations = [], isLoading: loadingLocs } = useQuery({
        queryKey: ['warehouse-locations'],
        queryFn: async () => {
            const { data } = await api.get('/warehouse/locations');
            return data;
        }
    });

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(storageSchema),
    });

    const watchLocationId = watch('locationId');
    const watchDays = watch('days');
    const watchWeight = watch('weight');

    // Dynamic Calculation Preview
    useEffect(() => {
        if (watchLocationId && watchDays > 0 && watchWeight > 0) {
            const timer = setTimeout(async () => {
                try {
                    const { data } = await api.post('/warehouse/calculate', {
                        locationId: watchLocationId,
                        days: watchDays,
                        weight: watchWeight
                    });
                    setCalcResult(data);
                } catch (err) {
                    console.error("Calc error", err);
                }
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setCalcResult(null);
        }
    }, [watchLocationId, watchDays, watchWeight]);

    const bookingMutation = useMutation({
        mutationFn: async (formData) => {
            const { data } = await api.post('/warehouse/bookings', formData);
            return data;
        },
        onSuccess: (data) => {
            setBookingResult(data);
            setStep(2);
            toast.success("Storage space reserved!");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Booking failed");
        }
    });

    const onSubmit = (data) => {
        bookingMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex items-center gap-3 border-b-4 border-indigo-500">
                    <Warehouse className="text-indigo-400 h-8 w-8" />
                    <div>
                        <h2 className="text-2xl font-bold text-white font-outfit">Warehousing & Storage</h2>
                        <p className="text-slate-400 text-sm">Secure storage & inventory management</p>
                    </div>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form Section */}
                            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Storage Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <select {...register('locationId')} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                                <option value="">-- Choose a Facility --</option>
                                                {locations.map(loc => (
                                                    <option key={loc._id} value={loc._id}>{loc.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.locationId && <p className="text-red-500 text-xs mt-1">{errors.locationId.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Cargo Weight (kg)</label>
                                        <div className="relative">
                                            <Weight className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <input type="number" {...register('weight', { valueAsNumber: true })} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
                                        </div>
                                        {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Storage Period (Days)</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <input type="number" {...register('days', { valueAsNumber: true })} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Minimum 1" />
                                        </div>
                                        {errors.days && <p className="text-red-500 text-xs mt-1">{errors.days.message}</p>}
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                                    <Info className="text-indigo-600 h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <div className="text-xs text-indigo-900 leading-relaxed font-medium">
                                        Pricing is calculated based on cumulative space occupied (weight) and duration. Facilities are climate-controlled and monitored 24/7.
                                    </div>
                                </div>

                                <button type="submit" disabled={bookingMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                                    {bookingMutation.isPending ? 'Processing...' : 'Reserve Storage Space'} <ChevronRight size={20} />
                                </button>
                            </form>

                            {/* Cost Breakdown Sidebar */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit sticky top-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Calculator className="text-indigo-600" /> Cost Summary
                                </h3>

                                {calcResult ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Base Handling Cost</span>
                                            <span className="font-semibold">${(calcResult.breakdown.baseRate * calcResult.breakdown.days).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Weight-based Storage</span>
                                            <span className="font-semibold text-indigo-600">${(calcResult.totalCharges - (calcResult.breakdown.baseRate * calcResult.breakdown.days)).toFixed(2)}</span>
                                        </div>
                                        <div className="pt-4 border-t border-slate-200 mt-4 flex justify-between items-baseline">
                                            <span className="font-bold text-slate-700">Total Estimated</span>
                                            <span className="text-2xl font-black text-slate-900 font-mono">${calcResult.totalCharges.toFixed(2)}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-6 leading-tight italic">
                                            Rate per Kg/Day: ${calcResult.breakdown.weightRate.toFixed(3)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="text-slate-400 text-sm italic">Enter weight and duration to see real-time storage rates</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Success Screen */
                        <div className="text-center py-12 max-w-xl mx-auto">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">Storage Secured</h2>
                            <p className="text-slate-600 mb-8">
                                Your booking reference <span className="font-mono font-bold text-indigo-600">{bookingResult.bookingNumber}</span> has been created. Please proceed to drop-off or arrange pickup.
                            </p>
                            
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left mb-8">
                                <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Storage Summary</div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <span className="text-slate-500">Location</span>
                                    <span className="font-bold text-right">{locations.find(l => l._id === bookingResult.location)?.name}</span>
                                    <span className="text-slate-500">Duration</span>
                                    <span className="font-bold text-right">{bookingResult.days} Days</span>
                                    <span className="text-slate-500">Amount Due</span>
                                    <span className="font-bold text-slate-900 text-right font-mono">${bookingResult.totalCharges.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={() => navigate('/shipments')} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                View My Bookings
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WarehouseStorage;
