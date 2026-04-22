import { useState, } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plane, CheckCircle2, ChevronRight, Weight, MapPin, Calendar, Box } from 'lucide-react';
import api from '../services/api';

const bookingSchema = z.object({
    origin: z.string().min(1, "Origin is required"),
    destination: z.string().min(1, "Destination is required"),
    airlineId: z.string().min(1, "Please select an airline partner"),
    weight: z.number({ invalid_type_error: "Weight must be a number" }).min(1, "Weight is mandatory"),
    cargoType: z.string().min(1, "Cargo type is required"),
    shipmentDate: z.string().min(1, "Date is required"),
});

const FlightBooking = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [summaryData, setSummaryData] = useState(null);
    const [bookingResult, setBookingResult] = useState(null);

    const { data: airlines = [], isLoading: isLoadingAirlines } = useQuery({
        queryKey: ['airlines'],
        queryFn: async () => await api.get('/airlines')
    });

    const { data: hubs = [], isLoading: isLoadingHubs } = useQuery({
        queryKey: ['hubs'],
        queryFn: async () => await api.get('/customs/ports') // Matches the route in server.js
    });

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: { cargoType: 'General Cargo' }
    });

    const watchAll = watch();

    const bookMutation = useMutation({
        mutationFn: async (bookingData) => {
            console.log('Sending Air Booking:', bookingData);
            const data = await api.post('/air-bookings', bookingData);
            return data;
        },
        onSuccess: (data) => {
            setBookingResult(data);
            setStep(3); // Success step
            toast.success("Flight booked successfully!");
            // Auto-redirect after 15 seconds to success dashboard
            setTimeout(() => {
                navigate('/shipments');
            }, 15000);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create booking");
        }
    });

    const onValidateForm = (data) => {
        // Calculate total charges
        const selectedAirline = airlines.find(a => a._id === data.airlineId);
        const totalCharges = data.weight * selectedAirline.pricePerKg;

        setSummaryData({ ...data, selectedAirline, totalCharges });
        setStep(2); // Summary step
    };

    const confirmBooking = () => {
        bookMutation.mutate(summaryData);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex items-center gap-3">
                    <Plane className="text-primary h-8 w-8" />
                    <div>
                        <h2 className="text-2xl font-bold text-white font-outfit">Air Freight Booking</h2>
                        <p className="text-slate-400 text-sm">Fast & reliable global logistics</p>
                    </div>
                </div>

                <div className="p-8">
                    {/* Stepper Progress */}
                    <div className="flex items-center justify-center mb-10 gap-4 text-sm font-medium">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-100'}`}>1</span>
                            Booking Details
                        </div>
                        <ChevronRight className="text-slate-300 w-5 h-5" />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-100'}`}>2</span>
                            Confirmation
                        </div>
                        <ChevronRight className="text-slate-300 w-5 h-5" />
                        <div className={`flex items-center gap-2 ${step === 3 ? 'text-primary' : 'text-slate-400'}`}>
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step === 3 ? 'bg-primary text-white' : 'bg-slate-100'}`}>3</span>
                            Success
                        </div>
                    </div>

                    {/* Step 1: Form */}
                    {step === 1 && (
                        <form onSubmit={handleSubmit(onValidateForm)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Origin Hub</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <select {...register('origin')} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                            <option value="">-- Select Origin --</option>
                                            {hubs.map(h => <option key={h._id} value={h.name}>{h.name}</option>)}
                                        </select>
                                    </div>
                                    {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Destination Hub</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <select {...register('destination')} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                            <option value="">-- Select Destination --</option>
                                            {hubs.map(h => <option key={h._id} value={h.name}>{h.name}</option>)}
                                        </select>
                                    </div>
                                    {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Airline Partner</label>
                                    <select {...register('airlineId')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                        <option value="">-- Choose Airline --</option>
                                        {airlines.map(a => (
                                            <option key={a._id} value={a._id}>{a.name} (${a.pricePerKg}/kg)</option>
                                        ))}
                                    </select>
                                    {errors.airlineId && <p className="text-red-500 text-xs mt-1">{errors.airlineId.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Cargo Weight (kg) *</label>
                                    <div className="relative">
                                        <Weight className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input type="number" step="0.1" {...register('weight', { valueAsNumber: true })} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="0.00" />
                                    </div>
                                    {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Cargo Type</label>
                                    <div className="relative">
                                        <Box className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <select {...register('cargoType')} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                            <option value="General Cargo">General Cargo</option>
                                            <option value="Perishable">Perishable Goods</option>
                                            <option value="Hazardous">Hazardous Materials</option>
                                            <option value="Fragile">Fragile Items</option>
                                        </select>
                                    </div>
                                    {errors.cargoType && <p className="text-red-500 text-xs mt-1">{errors.cargoType.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Shipment Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input type="date" {...register('shipmentDate')} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                                    </div>
                                    {errors.shipmentDate && <p className="text-red-500 text-xs mt-1">{errors.shipmentDate.message}</p>}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button type="submit" className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2">
                                    Continue to Review <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 2: Summary */}
                    {step === 2 && summaryData && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-4">Booking Summary</h3>
                                <div className="grid grid-cols-2 gap-y-4 text-sm">
                                    <div className="text-slate-500">Route</div>
                                    <div className="font-semibold text-slate-800 text-right">{summaryData.origin} → {summaryData.destination}</div>

                                    <div className="text-slate-500">Airline</div>
                                    <div className="font-semibold text-slate-800 text-right">{summaryData.selectedAirline.name}</div>

                                    <div className="text-slate-500">Cargo Details</div>
                                    <div className="font-semibold text-slate-800 text-right">{summaryData.cargoType} ({summaryData.weight} kg)</div>

                                    <div className="text-slate-500">Pickup Date</div>
                                    <div className="font-semibold text-slate-800 text-right">{new Date(summaryData.shipmentDate).toLocaleDateString()}</div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                                    <span className="font-bold text-slate-700">Estimated Total Charges:</span>
                                    <span className="text-2xl font-black text-secondary">${summaryData.totalCharges.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 font-semibold px-4 py-2 transition-colors">
                                    ← Back to Edit
                                </button>
                                <button
                                    onClick={confirmBooking}
                                    disabled={bookMutation.isPending}
                                    className="bg-secondary hover:bg-teal-500 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all disabled:opacity-50"
                                >
                                    {bookMutation.isPending ? 'Processing...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && bookingResult && (
                        <div className="text-center py-10 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-4">Booking Confirmed!</h2>
                            <p className="text-slate-600 mb-8 max-w-md mx-auto">Your air freight booking has been created successfully. The airline will coordinate pickup shortly.</p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 inline-block mb-8">
                                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Air Way Bill (AWB) Number</div>
                                <div className="text-3xl font-black text-primary font-mono tracking-wider">{bookingResult.awbNumber}</div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button onClick={() => navigate('/track')} className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                                    Track Flight
                                </button>
                                <button onClick={() => navigate('/shipments')} className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-light transition-colors shadow-md">
                                    View My Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlightBooking;
