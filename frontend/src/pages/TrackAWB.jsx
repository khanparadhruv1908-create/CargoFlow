import { useState } from 'react';
import { Search, MapPin, CheckCircle2, Package, Plane, Clock, AlertCircle, Ship, Navigation, Activity, ArrowRight, User, Phone, Map, RefreshCw } from 'lucide-react';
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
            toast.success("Shipment Manifest Found");
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
                        Global Logistics Network
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none mb-4 uppercase italic italic-style font-mono">
                        Radar <span className="text-indigo-600">Tracking</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto text-sm md:text-base">
                        Real-time intelligence for your global cargo. Enter your Tracking ID (AWB / BOL / SHIP) to begin tracking.
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
                            placeholder="Enter SHIP-XXXX, AWB-XXXX or BOL-XXXX..."
                            className="w-full pl-16 pr-6 py-5 bg-transparent text-lg font-black text-slate-800 outline-none placeholder:text-slate-200"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? <RefreshCw className="animate-spin" /> : <Navigation size={20} />}
                        TRACK NOW
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
                                            {trackingData.type.includes('Air') ? <Plane size={18} /> : <Ship size={18} />}
                                            {trackingData.type}
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black font-mono tracking-tighter leading-none mb-2">
                                            {trackingData.referenceId}
                                        </h2>
                                        <div className="flex items-center gap-4 mt-4">
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Clock size={14} className="text-indigo-500" /> 
                                                Last Active: {formatDistanceToNow(new Date(trackingData.lastUpdate))} ago
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="px-6 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-lg font-black uppercase tracking-wide">
                                            {trackingData.status}
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status Terminal</p>
                                    </div>
                                </div>
                            </div>

                            {/* CORE INFO SECTION */}
                            <div className="p-8 md:p-12">
                                
                                {/* SENDER & RECEIVER INFO (BENTO STYLE) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                    
                                    {/* SENDER CARD */}
                                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-colors">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black tracking-[0.2em] text-indigo-600 border border-indigo-50 shadow-sm">
                                                SENDER (મોકલનાર)
                                            </span>
                                            <Package className="text-indigo-300 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Contact Person</p>
                                                <h4 className="text-xl font-black text-slate-900">{trackingData.sender?.name || 'Authorized Sender'}</h4>
                                            </div>
                                            <div className="flex gap-8">
                                                <div>
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pickup From</p>
                                                    <p className="text-sm font-bold text-slate-600 leading-tight">{trackingData.origin}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RECEIVER CARD */}
                                    <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100 group">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black tracking-[0.2em] text-white/90 border border-white/10">
                                                RECEIVER (મેળવનાર)
                                            </span>
                                            <Navigation className="text-indigo-200 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Target Contact</p>
                                                <h4 className="text-xl font-black text-white">{trackingData.receiver?.name || 'Reserved Receiver'}</h4>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Delivery Address</p>
                                                <p className="text-sm font-bold text-white/80 leading-tight">{trackingData.destination}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* OPERATIONAL TIMELINE */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Activity size={16} className="text-indigo-600" /> Intelligent Timeline
                                        </h3>
                                        {trackingData.eta && (
                                            <div className="text-[10px] font-black uppercase text-indigo-600">
                                                Est. Arrival: {new Date(trackingData.eta).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative pl-4">
                                        <div className="absolute left-[20px] top-4 bottom-4 w-[2px] bg-slate-100"></div>
                                        
                                        <div className="space-y-8">
                                            {trackingData.timeline && trackingData.timeline.length > 0 ? (
                                                trackingData.timeline.map((event, idx) => (
                                                    <div key={idx} className="relative pl-12">
                                                        {/* DOT PIN */}
                                                        <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10 ${
                                                            idx === 0 
                                                                ? 'bg-indigo-600 text-white animate-pulse shadow-xl shadow-indigo-200' 
                                                                : 'bg-emerald-500 text-white'
                                                        }`}>
                                                            {idx === 0 ? <RefreshCw size={18} /> : <CheckCircle2 size={18} />}
                                                        </div>
                                                        
                                                        {/* CONTENT */}
                                                        <div className={`${idx === 0 ? 'bg-indigo-50/50' : 'bg-transparent'} p-4 rounded-3xl transition-all border border-transparent hover:border-indigo-100`}>
                                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                                                <h4 className={`text-lg font-black uppercase tracking-tight ${idx === 0 ? 'text-indigo-700' : 'text-slate-800'}`}>
                                                                    {event.status}
                                                                </h4>
                                                                <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-md shadow-sm">
                                                                    {new Date(event.time).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-1.5 uppercase">
                                                                <MapPin size={14} className="text-indigo-400" /> {event.location}
                                                            </p>
                                                            {event.details && (
                                                                <div className="mt-3 p-3 bg-white/50 border border-slate-100 rounded-xl text-xs font-medium text-slate-500 italic">
                                                                    "{event.details}"
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-slate-400 italic text-sm py-4">
                                                    Initial manifest recording standard operations...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. EMPTY STATE SECTION */}
                {!trackingData && !isLoading && (
                    <div className="text-center py-20 px-8 bg-white/50 border-2 border-dashed border-slate-200 rounded-[3rem] mt-12 flex flex-col items-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                            <Package size={40} className="text-indigo-300" />
                        </div>
                        <h3 className="font-black text-xl text-slate-900 uppercase tracking-widest">Awaiting Manifest Scan</h3>
                        <p className="text-slate-400 text-sm max-w-xs mt-2 font-medium">
                            Enter a valid Air Waybill or Tracking ID above to retrieve live telemetry data.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversalTracking;
