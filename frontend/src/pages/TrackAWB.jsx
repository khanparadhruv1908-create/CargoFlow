import { useState } from 'react';
import { Search, MapPin, CheckCircle2, Package, Plane, Clock, AlertCircle, Ship, Navigation, Activity, ArrowRight, User, Phone, Map, RefreshCw, Box } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const UniversalTracking = () => {
    const [refId, setRefId] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!refId) return toast.error("Please enter a Tracking ID");

        setIsLoading(true);
        setTrackingData(null);
        try {
            const data = await api.get(`/track/${refId}`);
            setTrackingData(data);
            toast.success("Manifest Found");
        } catch (err) {
            toast.error(err.response?.data?.message || "Tracking ID not found in our network.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16 px-4">
            <div className="max-w-5xl mx-auto">
                
                {/* 1. HEADER & SEARCH SECTION */}
                <div className="text-center mb-10">
                    <span className="inline-block px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4 shadow-lg shadow-indigo-100">
                        CargoFlow Intelligence Network
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none mb-4 uppercase italic italic-style font-mono tracking-tighter">
                        Radar <span className="text-indigo-600">Terminal</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto text-sm md:text-base">
                        Global freight visibility via real-time satellite telemetry.
                    </p>
                </div>

                {/* SEARCH INPUT */}
                <form onSubmit={handleTrack} className="bg-white p-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row gap-2 mb-12">
                    <div className="flex-grow relative">
                        <Search className="absolute left-6 top-5 text-indigo-400" size={24} />
                        <input 
                            type="text"
                            value={refId}
                            onChange={(e) => setRefId(e.target.value.toUpperCase())}
                            placeholder="MANIFEST ID (e.g. CF-XXXXX)..."
                            className="w-full pl-16 pr-6 py-5 bg-transparent text-lg font-black text-slate-800 outline-none placeholder:text-slate-200"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? <RefreshCw className="animate-spin" /> : <Navigation size={20} />}
                        SYNC DATA
                    </button>
                </form>

                {/* 2. SHIPMENT RESULTS */}
                {trackingData && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        {/* THE MASTER CARD */}
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/20 border border-slate-100 overflow-hidden">
                            
                            {/* TOP BANNER */}
                            <div className="bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-20 bg-indigo-600 rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                                
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                    <div>
                                        <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-3">
                                            <Activity size={18} /> LIVE TELEMETRY
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black font-mono tracking-tighter leading-none mb-2 text-white">
                                            {trackingData.shipmentId}
                                        </h2>
                                        <div className="flex items-center gap-4 mt-4">
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Clock size={14} className="text-indigo-500" /> 
                                                Last Sync: {formatDistanceToNow(new Date(trackingData.lastUpdate))} ago
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="px-6 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-lg font-black uppercase tracking-wide">
                                            {trackingData.status}
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manifest Vector Status</p>
                                    </div>
                                </div>
                            </div>

                            {/* CORE INFO SECTION */}
                            <div className="p-8 md:p-12">
                                
                                {/* SENDER & RECEIVER INFO */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    
                                    {/* SHIPPER CARD */}
                                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative group">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="px-4 py-1.5 bg-white rounded-xl text-[10px] font-black tracking-[0.2em] text-indigo-600 border border-indigo-50 shadow-sm">
                                                SHIPPER (Sender)
                                            </span>
                                            <Box className="text-indigo-400" />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-2xl font-black text-slate-900">{trackingData.shipper}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Origin Node</p>
                                            </div>
                                            <div className="pt-4 border-t border-slate-200">
                                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Departure Point</p>
                                                <p className="text-sm font-bold text-slate-800">{trackingData.from}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CONSIGNEE CARD */}
                                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative group">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="px-4 py-1.5 bg-white/10 rounded-xl text-[10px] font-black tracking-[0.2em] text-white border border-white/10">
                                                CONSIGNEE (Receiver)
                                            </span>
                                            <User className="text-indigo-200" />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-2xl font-black text-white">{trackingData.consignee}</h4>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Destination Node</p>
                                            </div>
                                            <div className="pt-4 border-t border-white/10">
                                                <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Arrival Point</p>
                                                <p className="text-sm font-bold text-white">{trackingData.to}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* TIMELINE */}
                                <div className="space-y-8">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                                        <Activity size={16} className="text-indigo-600" /> Manifest Lifecycle Logs
                                    </h3>

                                    <div className="relative pl-6">
                                        <div className="absolute left-[34px] top-6 bottom-6 w-[2px] bg-slate-100"></div>
                                        
                                        <div className="space-y-12">
                                            {trackingData.timeline?.map((event, idx) => (
                                                <div key={idx} className="relative pl-16">
                                                    {/* PIN */}
                                                    <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl border-4 border-white flex items-center justify-center z-10 transition-transform hover:scale-110 ${
                                                        idx === 0 
                                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 animate-pulse' 
                                                            : 'bg-slate-200 text-slate-400'
                                                    }`}>
                                                        {idx === 0 ? <RefreshCw size={20} /> : <CheckCircle2 size={20} />}
                                                    </div>
                                                    
                                                    {/* CONTENT */}
                                                    <div className={`${idx === 0 ? 'bg-indigo-50/50' : ''} p-6 rounded-[2rem] border border-transparent hover:border-indigo-100 transition-all`}>
                                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                            <div>
                                                                <h4 className={`text-xl font-black uppercase tracking-tight ${idx === 0 ? 'text-indigo-700' : 'text-slate-800'}`}>
                                                                    {event.status}
                                                                </h4>
                                                                <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-2 uppercase">
                                                                    <MapPin size={14} className="text-indigo-400" /> {event.location}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-[10px] font-black text-slate-400 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-50">
                                                                    {new Date(event.time).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {event.info && (
                                                            <div className="mt-4 p-4 bg-white/60 border border-slate-100 rounded-2xl text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                                LOG: {event.info}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!trackingData && !isLoading && (
                    <div className="text-center py-24 bg-white/40 border-2 border-dashed border-slate-200 rounded-[3rem] mt-12">
                        <Package size={48} className="mx-auto text-slate-200 mb-6" />
                        <h3 className="font-black text-xl text-slate-400 uppercase tracking-[0.2em]">Awaiting Manifest Scan</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversalTracking;
