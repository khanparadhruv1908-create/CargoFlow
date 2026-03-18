import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, Calculator, Landmark, Weight, DollarSign, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const customsSchema = z.object({
    portId: z.string().min(1, "Please select a port"),
    cargoValue: z.number({ invalid_type_error: "Value must be a number" }).min(1, "Cargo value is mandatory"),
    weight: z.number({ invalid_type_error: "Weight must be a number" }).min(1, "Weight is mandatory"),
    description: z.string().min(5, "Please provide a brief description of goods"),
});

const CustomsBrokerage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [calcResult, setCalcResult] = useState(null);
    const [finalResult, setFinalResult] = useState(null);

    const { data: ports = [], isLoading: loadingPorts } = useQuery({
        queryKey: ['customs-ports'],
        queryFn: async () => {
            const { data } = await api.get('/customs/ports');
            return data;
        }
    });

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(customsSchema),
    });

    const watchPortId = watch('portId');
    const watchWeight = watch('weight');
    const watchValue = watch('cargoValue');

    // Dynamic Calculation Preview
    useEffect(() => {
        if (watchPortId && watchWeight > 0 && watchValue > 0) {
            const timer = setTimeout(async () => {
                try {
                    const { data } = await api.post('/customs/calculate', {
                        portId: watchPortId,
                        weight: watchWeight,
                        cargoValue: watchValue
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
    }, [watchPortId, watchWeight, watchValue]);

    const declarationMutation = useMutation({
        mutationFn: async (formData) => {
            const { data } = await api.post('/customs/declarations', formData);
            return data;
        },
        onSuccess: (data) => {
            setFinalResult(data);
            setStep(2);
            toast.success("Customs declaration submitted!");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Submission failed");
        }
    });

    const onSubmit = (data) => {
        declarationMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex items-center gap-3 border-b-4 border-amber-500">
                    <ShieldCheck className="text-amber-400 h-8 w-8" />
                    <div>
                        <h2 className="text-2xl font-bold text-white font-outfit">Customs Brokerage</h2>
                        <p className="text-slate-400 text-sm">Regulatory compliance & duty clearance</p>
                    </div>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form Section */}
                            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Port of Entry</label>
                                        <div className="relative">
                                            <Landmark className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <select {...register('portId')} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500">
                                                <option value="">-- Select Airport, Dry Port or Seaport --</option>
                                                {ports.map(p => (
                                                    <option key={p._id} value={p._id}>{p.name} ({p.type})</option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.portId && <p className="text-red-500 text-xs mt-1">{errors.portId.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Cargo Value ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <input type="number" {...register('cargoValue', { valueAsNumber: true })} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="Total Invoice Value" />
                                        </div>
                                        {errors.cargoValue && <p className="text-red-500 text-xs mt-1">{errors.cargoValue.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Total Weight (kg)</label>
                                        <div className="relative">
                                            <Weight className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <input type="number" {...register('weight', { valueAsNumber: true })} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="Gross Weight" />
                                        </div>
                                        {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Description of Goods</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <textarea {...register('description')} rows={3} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="Enter types of products, HS codes if known..."></textarea>
                                        </div>
                                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                                    </div>
                                </div>

                                <button type="submit" disabled={declarationMutation.isPending} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                                    {declarationMutation.isPending ? 'Submitting...' : 'Submit for Clearance'} <ChevronRight size={20} />
                                </button>
                            </form>

                            {/* Calculation Sidebar */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit sticky top-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Calculator className="text-amber-600" /> Live Estimate
                                </h3>

                                {calcResult ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Clearance Fee</span>
                                            <span className="font-semibold">${calcResult.clearanceCharges.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Government Duty ({calcResult.details.dutyPercentage}%)</span>
                                            <span className="font-semibold text-red-600">+ ${calcResult.dutyAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="pt-4 border-t border-slate-200 mt-4 flex justify-between items-baseline">
                                            <span className="font-bold text-slate-700">Total Payable</span>
                                            <span className="text-2xl font-black text-slate-900">${calcResult.totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="bg-amber-100 p-3 rounded-lg text-[10px] text-amber-800 font-medium uppercase tracking-tighter leading-tight mt-6">
                                            Estimated based on current port slabs. Final amount may vary during physical inspection.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="text-slate-400 text-sm italic">Fill out the form to see your dynamic duty calculations</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Success Screen */
                        <div className="text-center py-12 max-w-xl mx-auto">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">Declaration Lodged</h2>
                            <p className="text-slate-600 mb-8">
                                Your customs declaration <span className="font-mono font-bold text-amber-600">{finalResult.declarationNumber}</span> has been received and is pending document review.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left mb-8">
                                <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Clearance Details</div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <span className="text-slate-500">Port</span>
                                    <span className="font-bold text-right">{ports.find(p => p._id === finalResult.port)?.name}</span>
                                    <span className="text-slate-500">Net Amount</span>
                                    <span className="font-bold text-slate-900 text-right font-mono">${finalResult.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={() => navigate('/shipments')} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                View Documentation Status
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomsBrokerage;
