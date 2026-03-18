import { useState } from 'react';
import { Search, MapPin, CheckCircle2, Package, Plane, Clock, AlertCircle, Ship, Navigation, Activity } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const UniversalTracking = () => {
    const [refId, setRefId] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!refId) return toast.error("Please enter a Reference ID (AWB or BOL)");

        setIsLoading(true);
        setTrackingData(null);
        try {
            const data = await api.get(`/track/${refId}`);
            setTrackingData(data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Tracking ID not found.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* Search Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-4">
                        <Activity size={14} /> Global Logistics Radar
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-4">Universal Tracking</h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">
                        Enter your Air Waybill (AWB) or Bill of Lading (BOL) to get real-time status and location updates.
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-white p-2 rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 mb-12">
                    <div className="flex-grow relative">
                        <Search className="absolute left-6 top-5 text-slate-400" size={24} />
                        <input 
                            type="text"
                            value={refId}
                            onChange={(e) => setRefId(e.target.value.toUpperCase())}
                            placeholder="Enter AWB-XXXXXXXX or BOL-XXXXXXXX..."
                            className="w-full pl-16 pr-6 py-5 bg-transparent text-lg font-bold text-slate-800 outline-none placeholder:text-slate-300"
                        />
                    </div>
                    <button 
                        onClick={handleTrack}
                        disabled={isLoading}
                        className="bg-slate-900 text-white font-black px-10 py-5 rounded-[1.5rem] hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                    >
                        {isLoading ? <RefreshCw className="animate-spin" /> : <Navigation size={20} />}
                        TRACK SHIPMENT
                    </button>
                </div>

                {/* Results Display */}
                {trackingData && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Summary Card */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                            <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-2">
                                        {trackingData.type === 'Air Freight' ? <Plane size={14} /> : <Ship size={14} />}
                                        {trackingData.type}
                                    </div>
                                    <h2 className="text-3xl font-black font-mono">{trackingData.referenceId}</h2>
                                    <p className="text-slate-400 font-bold text-xs mt-1 uppercase">Carrier: {trackingData.carrier}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg ${
                                        trackingData.status === 'Arrived' || trackingData.status === 'Delivered' 
                                        ? 'bg-emerald-500 text-white' 
                                        : 'bg-primary text-white'
                                    }`}>
                                        {trackingData.status}
                                    </div>
                                    <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase">Last Update: {new Date(trackingData.lastUpdate).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="p-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-slate-50 pb-10 mb-10">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin</span>
                                        <div className="text-xl font-black text-slate-900">{trackingData.origin}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</span>
                                        <div className="text-xl font-black text-slate-900">{trackingData.destination}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Arrival</span>
                                        <div className="text-xl font-black text-indigo-600">{new Date(trackingData.eta).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                {/* Visual Timeline */}
                                <div className="space-y-10">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Operational Timeline</h3>
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                                        <div className="space-y-12">
                                            {trackingData.timeline.map((event, idx) => (
                                                <div key={idx} className="relative pl-12 flex items-start group">
                                                    <div className={`absolute left-0 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                                                        event.completed ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-100' : 'bg-slate-200 text-white'
                                                    }`}>
                                                        <CheckCircle2 size={16} />
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-sm font-black uppercase tracking-tight ${event.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                                                            {event.status}
                                                        </h4>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                                                            {event.location} • {new Date(event.date).toLocaleDateString()}
                                                        </p>
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

                {/* Empty State */}
                {!trackingData && !isLoading && (
                    <div className="text-center py-20 opacity-20 flex flex-col items-center">
                        <Package size={80} className="text-slate-900 mb-4" />
                        <p className="font-black text-xl uppercase tracking-widest">Awaiting Manifest Entry</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversalTracking;
