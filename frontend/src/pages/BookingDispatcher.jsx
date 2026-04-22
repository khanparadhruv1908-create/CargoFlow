import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
    Plane, Ship, Warehouse, FileText, 
    ArrowRight, Calculator, CheckCircle2, 
    ShieldCheck, DollarSign, Package, MapPin, 
    Clock, Weight, ChevronRight, AlertCircle, RefreshCw,
    CreditCard, Lock
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// --- VALIDATION SCHEMAS ---
const airSchema = z.object({
    origin: z.string().min(1, "Origin is required"),
    destination: z.string().min(1, "Destination is required"),
    airlineId: z.string().min(1, "Select an airline"),
    weight: z.number().min(1, "Weight mandatory"),
    cargoType: z.string().min(1, "Required"),
    shipmentDate: z.string().min(1, "Shipment date is required"),
});

const oceanSchema = z.object({
    scheduleId: z.string().min(1, "Select route"),
    containerTypeId: z.string().min(1, "Select container"),
    weight: z.number().min(1, "Weight mandatory"),
    loadDate: z.string().min(1, "Load date is required"),
});

const customsSchema = z.object({
    portId: z.string().min(1, "Select port"),
    cargoValue: z.number().min(1, "Value required"),
    weight: z.number().min(1, "Weight mandatory"),
    description: z.string().min(5, "Description too short"),
});

const warehouseSchema = z.object({
    locationId: z.string().min(1, "Select facility"),
    days: z.number().min(1, "Days required"),
    weight: z.number().min(1, "Weight mandatory"),
    startDate: z.string().min(1, "Start date is required"),
});

// --- STRIPE PAYMENT FORM COMPONENT ---
const CheckoutForm = ({ amount, onPaymentSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        try {
            // 1. Create PaymentIntent on server
            const { clientSecret } = await api.post('/payment/create-intent', { amount });

            // 2. Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                toast.error(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    onPaymentSuccess(result.paymentIntent.id);
                }
            }
        } catch (err) {
            toast.error("Payment initialization failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSimulate = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            onPaymentSuccess('simulated_' + Math.random().toString(36).substr(2, 9));
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Secure Checkout</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black bg-primary/20 text-primary px-2 py-1 rounded">SIMULATOR ACTIVE</span>
                        <Lock size={16} className="text-primary" />
                    </div>
                </div>
                <div className="text-4xl font-black font-mono mb-2">${amount.toFixed(2)}</div>
                <p className="text-slate-400 text-[10px] font-bold uppercase">Total Charges to be Authorized</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Credit or Debit Card</label>
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#1e293b',
                                '::placeholder': { color: '#cbd5e1' },
                            },
                        },
                    }} />
                </div>

                <div className="flex flex-col gap-4">
                    <button 
                        type="submit" 
                        disabled={!stripe || isProcessing}
                        className="w-full bg-slate-200 text-slate-500 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                    >
                        <CreditCard size={18} /> PAY VIA STRIPE (OFFLINE)
                    </button>

                    <div className="relative py-2 flex items-center justify-center">
                        <div className="absolute w-full h-px bg-slate-100"></div>
                        <span className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                    </div>

                    <button 
                        type="button"
                        onClick={handleSimulate}
                        disabled={isProcessing}
                        className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                    >
                        {isProcessing ? <RefreshCw className="animate-spin" /> : <ShieldCheck />}
                        {isProcessing ? 'AUTHORIZING...' : 'SIMULATE PAYMENT (PROCEED)'}
                    </button>
                    
                    <button type="button" onClick={onCancel} className="text-slate-400 font-bold uppercase text-[10px] tracking-widest pt-2">Back to Review</button>
                </div>
            </form>
        </div>
    );
};

const UnifiedBooking = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const serviceId = new URLSearchParams(search).get('service') || 'air-freight';
    
    const [step, setStep] = useState(1); // 1: Form, 2: Summary, 3: Payment, 4: Success
    const [bookingResult, setBookingResult] = useState(null);
    const [paymentIntentId, setPaymentIntentId] = useState(null);

    // --- DATA FETCHING ---
    const { data: airlines = [] } = useQuery({ queryKey: ['airlines'], queryFn: () => api.get('/airlines'), enabled: serviceId === 'air-freight' });
    const { data: oceanData = { containers: [], schedules: [] } } = useQuery({ 
        queryKey: ['ocean-config'], 
        queryFn: async () => ({
            containers: await api.get('/ocean/containers'),
            schedules: await api.get('/ocean/schedules')
        }),
        enabled: serviceId === 'ocean-freight' 
    });
    const { data: ports = [] } = useQuery({ queryKey: ['ports'], queryFn: () => api.get('/customs/ports'), enabled: serviceId === 'customs-brokerage' });
    const { data: whLocs = [] } = useQuery({ queryKey: ['wh-locs'], queryFn: () => api.get('/warehouse/locations'), enabled: serviceId === 'warehousing' });

    // --- FORM SETUP ---
    const currentSchema = serviceId === 'air-freight' ? airSchema : 
                         serviceId === 'ocean-freight' ? oceanSchema : 
                         serviceId === 'customs-brokerage' ? customsSchema : warehouseSchema;

    const { register, handleSubmit, watch, formState: { errors }, trigger, getValues } = useForm({
        resolver: zodResolver(currentSchema),
        defaultValues: { 
            weight: 100, 
            days: 7, 
            cargoType: 'General',
            shipmentDate: new Date().toISOString().split('T')[0],
            loadDate: new Date().toISOString().split('T')[0],
            startDate: new Date().toISOString().split('T')[0],
        }
    });

    const formData = watch();

    // --- CALCULATION LOGIC ---
    const summary = useMemo(() => {
        if (!serviceId) return null;
        
        let cost = 0;
        let details = { from: '', to: '', info: '' };

        if (serviceId === 'air-freight') {
            const airline = airlines.find(a => a._id === formData.airlineId);
            cost = (airline?.pricePerKg || 0) * formData.weight;
            details = { from: formData.origin, to: formData.destination, info: `${formData.cargoType} (${formData.weight}kg)` };
        } else if (serviceId === 'ocean-freight') {
            const schedule = oceanData.schedules.find(s => s._id === formData.scheduleId);
            const container = oceanData.containers.find(c => c._id === formData.containerTypeId);
            cost = (container?.price || 0) + (formData.weight * 0.5);
            details = { from: schedule?.originPort, to: schedule?.destPort, info: `${container?.name} (${formData.weight}kg)` };
        } else if (serviceId === 'customs-brokerage') {
            const port = ports.find(p => p._id === formData.portId);
            cost = (port?.baseCharge || 0) + (formData.cargoValue * (port?.dutyPercentage / 100 || 0));
            details = { from: 'Origin Port', to: port?.name, info: `Value: $${formData.cargoValue} (${formData.weight}kg)` };
        } else if (serviceId === 'warehousing') {
            const loc = whLocs.find(l => l._id === formData.locationId);
            cost = ((loc?.baseRatePerDay || 0) * formData.days) + ((loc?.ratePerKgPerDay || 0) * formData.weight * formData.days);
            details = { from: 'Sender Address', to: loc?.name, info: `${formData.days} Days (${formData.weight}kg)` };
        }

        return { cost, ...details };
    }, [serviceId, formData, airlines, oceanData, ports, whLocs]);

    // --- MUTATION ---
    const bookMutation = useMutation({
        mutationFn: async (data) => {
            const endpoint = serviceId === 'air-freight' ? '/air-bookings' : 
                           serviceId === 'ocean-freight' ? '/ocean/bookings' :
                           serviceId === 'customs-brokerage' ? '/customs/declarations' : '/warehouse/bookings';
            
            return await api.post(endpoint, { ...data, paymentIntentId });
        },
        onSuccess: (res) => {
            setBookingResult(res);
            setStep(4);
            toast.success("Manifest Generated Successfully");
        },
        onError: (err) => toast.error(err.response?.data?.message || "Booking Error")
    });

    const handleToSummary = async () => {
        const valid = await trigger();
        if (valid) setStep(2);
    };

    const onPaymentSuccess = (pId) => {
        setPaymentIntentId(pId);
        bookMutation.mutate(getValues());
    };

    const ServiceIcon = () => {
        switch(serviceId) {
            case 'air-freight': return <Plane className="text-blue-500" />;
            case 'ocean-freight': return <Ship className="text-teal-500" />;
            case 'warehousing': return <Warehouse className="text-indigo-500" />;
            default: return <FileText className="text-amber-500" />;
        }
    };

    if (step === 4 && bookingResult) {
        return (
            <div className="min-h-screen bg-slate-50 py-20 px-4">
                <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 text-center animate-in zoom-in duration-700">
                    <div className="bg-emerald-500 p-16 text-white relative">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                            <CheckCircle2 size={48} className="text-white" />
                        </div>
                        <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter">Manifest Secured</h2>
                        <p className="text-emerald-100 mt-2 font-bold tracking-widest text-[10px] uppercase">Transaction & Logistics Verified</p>
                    </div>
                    <div className="p-12 space-y-8">
                        <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Operational Reference ID</p>
                            <h3 className="text-4xl font-black text-slate-900 font-mono tracking-tighter">
                                {bookingResult.awbNumber || bookingResult.bolNumber || bookingResult.bookingNumber || bookingResult.declarationNumber}
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Paid Amount</span>
                                <div className="text-xl font-black text-slate-900">${summary.cost.toFixed(2)}</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Invoice Status</span>
                                <div className="text-xl font-black text-emerald-600 uppercase">PAID</div>
                            </div>
                        </div>
                        <button onClick={() => navigate('/shipments')} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl">
                            Go to Dashboard →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Stepper */}
                <div className="flex items-center justify-center mb-12 gap-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
                                step >= s ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-200 text-slate-400'
                            }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? 'bg-slate-900' : 'bg-slate-200'}`}></div>}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 p-8 text-white flex justify-between items-center border-b-4 border-primary">
                        <div>
                            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-1">
                                <ServiceIcon /> {serviceId.replace('-', ' ')}
                            </div>
                            <h1 className="text-2xl font-black font-outfit uppercase tracking-tight">
                                {step === 1 ? 'Logistics Config' : step === 2 ? 'Operational Review' : 'Secure Checkout'}
                            </h1>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 hidden sm:block">
                            <CreditCard className="text-primary" size={24} />
                        </div>
                    </div>

                    <div className="p-10">
                        {/* STEP 1: FORM */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {serviceId === 'air-freight' && (
                                        <>
                                            <InputWrapper label="Origin hub" error={errors.origin}>
                                                <input {...register('origin')} placeholder="e.g. Dubai" className="booking-input" />
                                            </InputWrapper>
                                            <InputWrapper label="Destination hub" error={errors.destination}>
                                                <input {...register('destination')} placeholder="e.g. Toronto" className="booking-input" />
                                            </InputWrapper>
                                            <InputWrapper label="Airline Network" error={errors.airlineId} colSpan={2}>
                                                <select {...register('airlineId')} className="booking-input">
                                                    <option value="">Select Carrier</option>
                                                    {airlines.map(a => <option key={a._id} value={a._id}>{a.name} - ${a.pricePerKg}/kg</option>)}
                                                </select>
                                            </InputWrapper>
                                            <InputWrapper label="Cargo Type" error={errors.cargoType}>
                                                <select {...register('cargoType')} className="booking-input">
                                                    <option value="General">General Cargo</option>
                                                    <option value="Electronics">High Value / Tech</option>
                                                    <option value="Medical">Temperature Controlled</option>
                                                </select>
                                            </InputWrapper>
                                            <InputWrapper label="Shipment Date" error={errors.shipmentDate}>
                                                <input type="date" {...register('shipmentDate')} className="booking-input" />
                                            </InputWrapper>
                                        </>
                                    )}

                                    {serviceId === 'ocean-freight' && (
                                        <>
                                            <InputWrapper label="Active Shipping Lane" error={errors.scheduleId} colSpan={2}>
                                                <select {...register('scheduleId')} className="booking-input">
                                                    <option value="">Select Route</option>
                                                    {oceanData.schedules.map(s => <option key={s._id} value={s._id}>{s.originPort} → {s.destPort} ({s.transitDays}d)</option>)}
                                                </select>
                                            </InputWrapper>
                                            <InputWrapper label="Container Unit Type" error={errors.containerTypeId}>
                                                <select {...register('containerTypeId')} className="booking-input">
                                                    <option value="">Select Unit</option>
                                                    {oceanData.containers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                                </select>
                                            </InputWrapper>
                                            <InputWrapper label="Vessel Load Date" error={errors.loadDate}>
                                                <input type="date" {...register('loadDate')} className="booking-input" />
                                            </InputWrapper>
                                        </>
                                    )}

                                    {serviceId === 'customs-brokerage' && (
                                        <>
                                            <InputWrapper label="Terminal Point" error={errors.portId} colSpan={2}>
                                                <select {...register('portId')} className="booking-input">
                                                    <option value="">Select Port/Airport</option>
                                                    {ports.map(p => <option key={p._id} value={p._id}>{p.name} ({p.type})</option>)}
                                                </select>
                                            </InputWrapper>
                                            <InputWrapper label="Declared Cargo Value ($)" error={errors.cargoValue}>
                                                <input type="number" {...register('cargoValue', { valueAsNumber: true })} className="booking-input" />
                                            </InputWrapper>
                                            <InputWrapper label="Manifest Description" error={errors.description} colSpan={2}>
                                                <input {...register('description')} placeholder="Detail your cargo contents..." className="booking-input" />
                                            </InputWrapper>
                                        </>
                                    )}

                                    {serviceId === 'warehousing' && (
                                        <>
                                            <InputWrapper label="Storage Hub Facility" error={errors.locationId} colSpan={2}>
                                                <select {...register('locationId')} className="booking-input">
                                                    <option value="">Select Hub</option>
                                                    {whLocs.map(l => <option key={l._id} value={l._id}>{l.name} — {l.address}</option>)}
                                                </select>
                                            </InputWrapper>
                                            <InputWrapper label="Duration (Days)" error={errors.days}>
                                                <input type="number" {...register('days', { valueAsNumber: true })} className="booking-input" />
                                            </InputWrapper>
                                            <InputWrapper label="Intake Date" error={errors.startDate}>
                                                <input type="date" {...register('startDate')} className="booking-input" />
                                            </InputWrapper>
                                        </>
                                    )}

                                    <InputWrapper label="Total Payload Weight (kg)" error={errors.weight}>
                                        <div className="relative">
                                            <Weight className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                            <input type="number" {...register('weight', { valueAsNumber: true })} className="booking-input pl-12" />
                                        </div>
                                    </InputWrapper>
                                </div>

                                <button onClick={handleToSummary} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group mt-10">
                                    Calculate & Review <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: SUMMARY */}
                        {step === 2 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics Path</span>
                                                <div className="text-xl font-black text-slate-900 flex items-center gap-2">
                                                    {summary.from} <ArrowRight size={16} className="text-slate-300" /> {summary.to}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Load Manifest</span>
                                                <div className="text-lg font-bold text-slate-700">{summary.info}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col justify-center">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Guaranteed Quote</span>
                                        <div className="text-5xl font-black font-mono tracking-tighter">${summary.cost.toFixed(2)}</div>
                                        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black mt-4 uppercase">
                                            <ShieldCheck size={14} /> Official Tariff Applied
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all font-outfit uppercase text-xs tracking-widest">Edit Details</button>
                                    <button onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all font-outfit uppercase text-xs tracking-widest">Proceed to Payment</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: PAYMENT (Stripe) */}
                        {step === 3 && (
                            <Elements stripe={stripePromise}>
                                <CheckoutForm 
                                    amount={summary.cost} 
                                    onPaymentSuccess={onPaymentSuccess}
                                    onCancel={() => setStep(2)}
                                />
                            </Elements>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .booking-input {
                    width: 100%;
                    padding: 1.25rem;
                    background-color: #f8fafc;
                    border: 2px solid #f1f5f9;
                    border-radius: 1.25rem;
                    font-weight: 800;
                    font-size: 0.875rem;
                    color: #1e293b;
                    transition: all 0.2s;
                    outline: none;
                }
                .booking-input:focus {
                    border-color: #4f46e5;
                    background-color: white;
                    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.1);
                }
            `}</style>
        </div>
    );
};

const InputWrapper = ({ label, error, children, colSpan = 1 }) => (
    <div className={colSpan === 2 ? 'md:col-span-2' : ''}>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">{label}</label>
        {children}
        {error && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{error.message}</p>}
    </div>
);

export default UnifiedBooking;
