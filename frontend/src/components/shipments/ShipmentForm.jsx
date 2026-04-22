import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ArrowRight, ArrowLeft, Package, User, MapPin, CheckCircle2 } from 'lucide-react';
import { Button, Input } from '../ui';

const stakeholderSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    company: z.string().optional(),
    phone: z.string().min(8, 'Valid phone is required'),
    email: z.string().email('Valid email is required').optional().or(z.literal('')),
    address: z.string().min(5, 'Full address is required'),
});

const shipmentSchema = z.object({
    origin: z.string().min(2, 'Origin is required'),
    destination: z.string().min(2, 'Destination is required'),
    cargoType: z.string().min(2, 'Cargo type is required'),
    weight: z.preprocess((a) => parseFloat(a), z.number().positive('Weight must be positive')),
    eta: z.string().min(1, 'ETA is required'),
    shipper: stakeholderSchema,
    consignee: stakeholderSchema,
});

export default function ShipmentForm({ onSubmit, onCancel, submitting }) {
    const [step, setStep] = useState(1);
    const [defaultEta] = useState(() => new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);

    const { register, handleSubmit, trigger, getValues, formState: { errors } } = useForm({
        resolver: zodResolver(shipmentSchema),
        defaultValues: {
            origin: '',
            destination: '',
            cargoType: '',
            weight: '',
            eta: defaultEta,
            shipper: { name: '', company: '', phone: '', email: '', address: '' },
            consignee: { name: '', company: '', phone: '', email: '', address: '' }
        }
    });

    const nextStep = async () => {
        let fieldsToValidate = [];
        if (step === 1) fieldsToValidate = ['origin', 'destination', 'cargoType', 'weight', 'eta'];
        if (step === 2) fieldsToValidate = ['shipper.name', 'shipper.phone', 'shipper.address'];
        if (step === 3) fieldsToValidate = ['consignee.name', 'consignee.phone', 'consignee.address'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const values = getValues();

    return (
        <div className="bg-white rounded-[32px] shadow-2xl p-0 relative max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Form Header */}
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase">New Manifest</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Step {step} of 4: {
                        step === 1 ? 'Logistics Specs' : 
                        step === 2 ? 'Shipper Profile' : 
                        step === 3 ? 'Consignee Profile' : 'Final Verification'
                    }</p>
                </div>
                <button onClick={onCancel} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                    <X size={20} />
                </button>
            </div>

            {/* Stepper Progress */}
            <div className="flex h-1.5 w-full bg-slate-100">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`flex-1 transition-all duration-500 ${i <= step ? 'bg-primary' : ''}`} />
                ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                
                {/* STEP 1: SHIPMENT DETAILS */}
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Departure Node (Origin)" {...register('origin')} error={errors.origin?.message} icon={MapPin} placeholder="e.g. Surat, IN" />
                            <Input label="Arrival Node (Destination)" {...register('destination')} error={errors.destination?.message} icon={MapPin} placeholder="e.g. Dubai, UAE" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Cargo Classification" {...register('cargoType')} error={errors.cargoType?.message} icon={Package} placeholder="e.g. Textiles" />
                            <Input label="Gross Mass (KG)" type="number" {...register('weight')} error={errors.weight?.message} icon={Package} placeholder="0.00" />
                        </div>
                        <Input label="Estimated Arrival (ETA)" type="date" {...register('eta')} error={errors.eta?.message} />
                    </div>
                )}

                {/* STEP 2: SHIPPER DETAILS */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Shipper Name (Sender)" {...register('shipper.name')} error={errors.shipper?.name?.message} icon={User} placeholder="Full Name" />
                            <Input label="Company (Optional)" {...register('shipper.company')} icon={Package} placeholder="Business Name" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Contact Phone" {...register('shipper.phone')} error={errors.shipper?.phone?.message} placeholder="+91 ..." />
                            <Input label="Email Vector" {...register('shipper.email')} error={errors.shipper?.email?.message} placeholder="name@company.com" />
                        </div>
                        <Input label="Pickup Address" {...register('shipper.address')} error={errors.shipper?.address?.message} placeholder="Full physical location" />
                    </div>
                )}

                {/* STEP 3: CONSIGNEE DETAILS */}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Consignee Name (Receiver)" {...register('consignee.name')} error={errors.consignee?.name?.message} icon={User} placeholder="Full Name" />
                            <Input label="Company (Optional)" {...register('consignee.company')} icon={Package} placeholder="Business Name" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Contact Phone" {...register('consignee.phone')} error={errors.consignee?.phone?.message} placeholder="+..." />
                            <Input label="Email Vector" {...register('consignee.email')} error={errors.consignee?.email?.message} placeholder="name@company.com" />
                        </div>
                        <Input label="Delivery Address" {...register('consignee.address')} error={errors.consignee?.address?.message} placeholder="Full physical location" />
                    </div>
                )}

                {/* STEP 4: REVIEW */}
                {step === 4 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                <h4 className="font-black text-secondary text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Package size={16} className="text-primary" /> Manifest Specs
                                </h4>
                                <Badge variant="primary">{values.cargoType} | {values.weight}KG</Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold">
                                <div className="text-slate-400 uppercase">Route Vector</div>
                                <div className="text-secondary">{values.origin} ➔ {values.destination}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Shipper Profile</h5>
                                <p className="text-sm font-bold text-secondary">{values.shipper.name}</p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{values.shipper.address}</p>
                            </div>
                            <div className="space-y-2">
                                <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Consignee Profile</h5>
                                <p className="text-sm font-bold text-secondary">{values.consignee.name}</p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{values.consignee.address}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 text-emerald-700">
                            <CheckCircle2 size={24} className="shrink-0" />
                            <p className="text-xs font-bold leading-relaxed">By submitting, you authorize the transport manifest and agree to CargoFlow's terms of carriage.</p>
                        </div>
                    </div>
                )}

                {/* Navigation Controls */}
                <div className="flex justify-between gap-4 mt-10 pt-6 border-t border-slate-100">
                    {step > 1 ? (
                        <Button type="button" variant="outline" onClick={prevStep} icon={ArrowLeft}>Back</Button>
                    ) : (
                        <div />
                    )}
                    
                    {step < 4 ? (
                        <Button type="button" onClick={nextStep} icon={ArrowRight}>Continue</Button>
                    ) : (
                        <Button type="submit" isLoading={submitting} className="px-10 shadow-xl shadow-primary/20">Authorize & Save</Button>
                    )}
                </div>
            </form>
        </div>
    );
}

const Badge = ({ children, variant }) => (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${variant === 'primary' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
        {children}
    </span>
);
