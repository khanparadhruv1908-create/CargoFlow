import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Ship, ChevronRight, CheckCircle2, Weight, MapPin, Calendar, Anchor, FileText } from 'lucide-react';
import api from '../services/api';

const bookingSchema = z.object({
    scheduleId: z.string().min(1, "Please select an available port route"),
    containerTypeId: z.string().min(1, "Please select a container type"),
    weight: z.number({ invalid_type_error: "Weight must be a number" }).min(1, "Weight is mandatory"),
    loadDate: z.string().min(1, "Vessel Load Date is required"),
});

const OceanBooking = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [summaryData, setSummaryData] = useState(null);
    const [bookingResult, setBookingResult] = useState(null);

    const { data: containers = [], isLoading: loadingContainers } = useQuery({
        queryKey: ['ocean-containers'],
        queryFn: async () => {
            const data = await api.get('/ocean/containers');
            return data;
        }
    });

    const { data: schedules = [], isLoading: loadingSchedules } = useQuery({
        queryKey: ['ocean-schedules'],
        queryFn: async () => {
            const data = await api.get('/ocean/schedules');
            return data;
        }
    });

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(bookingSchema),
    });

    // Auto-calculating dates on form
    const watchLoadDate = watch('loadDate');
    const watchScheduleId = watch('scheduleId');

    const calculatedDates = useMemo(() => {
        if (!watchLoadDate || !watchScheduleId) return null;

        const schedule = schedules.find(s => s._id === watchScheduleId);
        if (!schedule) return null;

        const ld = new Date(watchLoadDate);
        const dep = new Date(ld);
        dep.setDate(dep.getDate() + 1); // Departure Day
        const eta = new Date(dep);
        eta.setDate(eta.getDate() + schedule.transitDays);

        return { departure: dep, eta };
    }, [watchLoadDate, watchScheduleId, schedules]);

    const bookMutation = useMutation({
        mutationFn: async (bookingData) => {
            console.log('Sending Ocean Booking:', bookingData);
            const data = await api.post('/ocean/bookings', bookingData);
            return data;
        },
        onSuccess: (data) => {
            console.log('Ocean Booking SUCCESS Response:', data);
            setBookingResult(data);
            setStep(3); // Success/BOL choice step
            toast.success("Container booked successfully!");
            // Auto-redirect after 30 seconds if no BOL choice made (longer for review)
            setTimeout(() => {
                navigate('/shipments');
            }, 30000);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create ocean booking");
        }
    });

    const bolMutation = useMutation({
        mutationFn: async ({ id, bolOption }) => {
            await api.put(`/ocean/bookings/${id}/bol-option`, { bolOption });
        },
        onSuccess: () => {
            toast.success("Bill of Lading option saved!");
            navigate('/shipments');
        }
    });

    const onValidateForm = (data) => {
        const schedule = schedules.find(s => s._id === data.scheduleId);
        const container = containers.find(c => c._id === data.containerTypeId);
        const totalCharges = container.price + (data.weight * 0.5); // base + simple weight logic

        setSummaryData({ ...data, schedule, container, totalCharges, dates: calculatedDates });
        setStep(2); // Summary step
    };

    const confirmBooking = () => {
        bookMutation.mutate(summaryData);
    };

    const handleBolSelection = (option) => {
        bolMutation.mutate({ id: bookingResult._id, bolOption: option });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex items-center gap-3 border-b-4 border-teal-500">
                    <Ship className="text-teal-400 h-8 w-8" />
                    <div>
                        <h2 className="text-2xl font-bold text-white font-outfit">Ocean Freight Booking</h2>
                        <p className="text-slate-400 text-sm">Global container shipping & vessel routing</p>
                    </div>
                </div>

                <div className="p-8">
                    {/* Stepper Progress */}
                    <div className="flex items-center justify-center mb-10 gap-4 text-sm font-medium">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>1</span>
                            Booking Details
                        </div>
                        <ChevronRight className="text-slate-300 w-5 h-5" />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>2</span>
                            Confirmation
                        </div>
                        <ChevronRight className="text-slate-300 w-5 h-5" />
                        <div className={`flex items-center gap-2 ${step === 3 ? 'text-teal-600' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>3</span>
                            Bill of Lading
                        </div>
                    </div>

                    {/* Step 1: Form */}
                    {step === 1 && (
                        <form onSubmit={handleSubmit(onValidateForm)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Port Route (Origin → Destination)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <select {...register('scheduleId')} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500">
                                            <option value="">-- View available routes --</option>
                                            {schedules.map(route => (
                                                <option key={route._id} value={route._id}>
                                                    {route.originPort} → {route.destPort} (Vessel: {route.vesselName} | Transit: {route.transitDays} Days)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.scheduleId && <p className="text-red-500 text-xs mt-1">{errors.scheduleId.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Container Type</label>
                                    <div className="relative">
                                        <Anchor className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <select {...register('containerTypeId')} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500">
                                            <option value="">-- Choose Container --</option>
                                            {containers.map(c => (
                                                <option key={c._id} value={c._id}>{c.name} (+${c.price})</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.containerTypeId && <p className="text-red-500 text-xs mt-1">{errors.containerTypeId.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Cargo Weight (kg) *</label>
                                    <div className="relative">
                                        <Weight className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input type="number" step="1" {...register('weight', { valueAsNumber: true })} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="0.00" />
                                    </div>
                                    {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Vessel Load Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input type="date" {...register('loadDate')} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500" />
                                    </div>
                                    {errors.loadDate && <p className="text-red-500 text-xs mt-1">{errors.loadDate.message}</p>}
                                </div>

                                {calculatedDates && (
                                    <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 flex flex-col justify-center">
                                        <div className="text-xs text-teal-800 font-bold uppercase tracking-wider mb-2">Automated Trip Logic</div>
                                        <div className="text-sm font-semibold text-teal-900 flex justify-between">
                                            <span>Departure:</span> <span>{calculatedDates.departure.toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-teal-900 flex justify-between mt-1">
                                            <span>ETA:</span> <span>{calculatedDates.eta.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2">
                                    Review Summary <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 2: Summary */}
                    {step === 2 && summaryData && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-4">Ocean Booking Summary</h3>
                                <div className="grid grid-cols-2 gap-y-4 text-sm">
                                    <div className="text-slate-500">Port Route</div>
                                    <div className="font-semibold text-slate-800 text-right">{summaryData.schedule.originPort} → {summaryData.schedule.destPort}</div>

                                    <div className="text-slate-500">Vessel</div>
                                    <div className="font-semibold text-slate-800 text-right">{summaryData.schedule.vesselName}</div>

                                    <div className="text-slate-500">Container</div>
                                    <div className="font-semibold text-slate-800 text-right">{summaryData.container.name} ({summaryData.weight} kg)</div>

                                    <div className="text-slate-500">Load Date</div>
                                    <div className="font-semibold text-slate-800 text-right">{new Date(summaryData.loadDate).toLocaleDateString()}</div>

                                    <div className="text-slate-500">Auto Departure</div>
                                    <div className="font-semibold text-slate-800 text-right">{summaryData.dates.departure.toLocaleDateString()}</div>

                                    <div className="text-slate-500">Est. Arrival (ETA)</div>
                                    <div className="font-semibold text-slate-800 text-right">{summaryData.dates.eta.toLocaleDateString()}</div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                                    <span className="font-bold text-slate-700">Estimated Total Charges:</span>
                                    <span className="text-2xl font-black text-teal-600">${summaryData.totalCharges.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 font-semibold px-4 py-2 transition-colors">
                                    ← Edit Details
                                </button>
                                <button
                                    onClick={confirmBooking}
                                    disabled={bookMutation.isPending}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all disabled:opacity-50"
                                >
                                    {bookMutation.isPending ? 'Processing...' : 'Confirm Ocean Booking'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: BOL Choice */}
                    {step === 3 && bookingResult && (
                        <div className="text-center py-6 animate-in zoom-in duration-500 max-w-2xl mx-auto">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 mb-2">Booking Reserved!</h2>
                            <p className="text-slate-600 mb-6">Your Bill of Lading Number is <span className="font-mono font-bold text-teal-600">{bookingResult.bolNumber}</span>.</p>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 text-left">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <FileText className="text-teal-600" /> Choose Bill of Lading Option
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleBolSelection("Sea Way Bill")}
                                        disabled={bolMutation.isPending}
                                        className="p-4 border-2 border-slate-200 rounded-xl hover:border-teal-500 focus:border-teal-500 transition-colors text-left bg-white text-slate-700 group hover:shadow-md"
                                    >
                                        <div className="font-bold text-slate-900 mb-1 group-hover:text-teal-600">Sea Way Bill</div>
                                        <div className="text-xs text-slate-500">Fast release without physical documents. Ideal for trusted parties.</div>
                                    </button>

                                    <button
                                        onClick={() => handleBolSelection("Original Bill of Lading")}
                                        disabled={bolMutation.isPending}
                                        className="p-4 border-2 border-slate-200 rounded-xl hover:border-teal-500 focus:border-teal-500 transition-colors text-left bg-white text-slate-700 group hover:shadow-md"
                                    >
                                        <div className="font-bold text-slate-900 mb-1 group-hover:text-teal-600">Original BOL</div>
                                        <div className="text-xs text-slate-500">Requires physical paper surrender. Used for Letter of Credit.</div>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <button 
                                    onClick={() => navigate('/shipments')}
                                    className="text-slate-500 hover:text-teal-600 font-bold text-sm transition-colors"
                                >
                                    Skip and View Dashboard →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OceanBooking;
