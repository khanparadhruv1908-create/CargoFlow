import { useState } from 'react';
import { Search, MapPin, CheckCircle2, Package, Plane, Clock, AlertCircle, Ship, Anchor } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TrackFreight = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [freightType, setFreightType] = useState('AIR'); // 'AIR' or 'OCEAN'
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingNumber.trim()) return;

        setIsLoading(true);
        setTrackingData(null);

        const isOcean = trackingNumber.toUpperCase().startsWith('BOL-');
        setFreightType(isOcean ? 'OCEAN' : 'AIR');

        try {
            const endpoint = isOcean
                ? `/ocean/bookings/track/${trackingNumber.toUpperCase()}`
                : `/air-bookings/track/${trackingNumber.toUpperCase()}`;

            const { data } = await api.get(endpoint);
            setTrackingData(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Tracking Number not recognized');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (statusLabel) => {
        const statusMap = {
            'Scheduled': 'bg-blue-100 text-blue-700',
            'Pending': 'bg-gray-100 text-gray-700',
            'Loaded': 'bg-indigo-100 text-indigo-700',
            'Departed': 'bg-blue-100 text-blue-700',
            'In Transit': 'bg-orange-100 text-orange-700',
            'Discharged': 'bg-yellow-100 text-yellow-700',
            'Delivered': 'bg-green-100 text-green-700',
            'Arrived': 'bg-green-100 text-green-700',
            'Delayed': 'bg-red-100 text-red-700'
        };
        return statusMap[statusLabel] || 'bg-slate-100 text-slate-700';
    };

    const getAppIcon = (statusLabel) => {
        switch (statusLabel) {
            case 'Scheduled': return <Clock className="w-6 h-6" />;
            case 'In Transit': return freightType === 'AIR' ? <Plane className="w-6 h-6" /> : <Ship className="w-6 h-6" />;
            case 'Loaded': return <Anchor className="w-6 h-6" />;
            case 'Departed': return <Ship className="w-6 h-6" />;
            case 'Delivered':
            case 'Arrived': return <CheckCircle2 className="w-6 h-6" />;
            case 'Delayed': return <AlertCircle className="w-6 h-6" />;
            default: return <Package className="w-6 h-6" />;
        }
    };

    const originName = freightType === 'OCEAN' ? trackingData?.schedule?.originPort : trackingData?.origin;
    const destName = freightType === 'OCEAN' ? trackingData?.schedule?.destPort : trackingData?.destination;

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center">
            {/* Header Background */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-slate-900 border-b-4 border-primary">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900 blur-2xl"></div>
            </div>

            <div className="relative w-full max-w-4xl px-4 sm:px-6 py-20 z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 font-outfit">Track Shipment</h1>
                    <p className="text-slate-300 text-lg">Enter your Air Way Bill (AWB) or Bill of Lading (BOL) Number</p>
                </div>

                {/* Search Box */}
                <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 mb-12 border border-slate-100">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Enter AWB-XXXX or BOL-XXXX"
                            disabled={isLoading}
                            className="w-full pl-12 pr-4 py-4 text-lg bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none uppercase font-mono tracking-widest"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !trackingNumber}
                        className="bg-primary hover:bg-primary-light text-white font-bold py-4 px-10 rounded-xl transition-all disabled:opacity-75 shadow-md flex-shrink-0"
                    >
                        {isLoading ? 'Searching...' : 'Track'}
                    </button>
                </form>

                {/* Tracking Result */}
                {trackingData && (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">

                        {/* Status Header */}
                        <div className="bg-slate-50 p-6 md:p-8 flex items-center justify-between gap-6 border-b border-slate-200">
                            {freightType === 'OCEAN' ? (
                                <div className="flex flex-col md:flex-row gap-6 w-full justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl shadow-sm ${getStatusStyle(trackingData.vesselStatus)}`}>
                                            <Ship className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Vessel Status</div>
                                            <div className="text-xl font-bold">{trackingData.vesselStatus}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl shadow-sm ${getStatusStyle(trackingData.containerStatus)}`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Container Status</div>
                                            <div className="text-xl font-bold">{trackingData.containerStatus}</div>
                                        </div>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <div className="text-sm font-semibold text-slate-500 tracking-wider">BOL NUMBER</div>
                                        <div className="text-2xl font-bold font-mono tracking-wider text-teal-600 border border-teal-200 bg-teal-50 px-3 py-1 rounded inline-block">
                                            {trackingData.bolNumber}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex w-full justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl shadow-sm ${getStatusStyle(trackingData.status)}`}>
                                            {getAppIcon(trackingData.status)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-500 tracking-wider">STATUS</div>
                                            <div className={`text-2xl font-black ${trackingData.status === 'Delivered' ? 'text-green-600' : 'text-slate-800'}`}>
                                                {trackingData.status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-slate-500 tracking-wider">AWB NUMBER</div>
                                        <div className="text-2xl font-bold font-mono tracking-wider text-primary">{trackingData.awbNumber}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Route mapping */}
                        <div className="p-8 pb-10">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 relative px-4">
                                <div className="absolute left-16 right-16 top-8 h-0.5 border-t-2 border-dashed border-slate-200 z-0 hidden sm:block">
                                    {freightType === 'OCEAN' ? (
                                        <Ship className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-400 w-8 h-8 bg-white px-1" />
                                    ) : (
                                        <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 w-8 h-8 bg-white px-1" />
                                    )}
                                </div>
                                <div className="relative z-10 flex flex-col items-center sm:items-start mb-6 sm:mb-0">
                                    <div className="w-16 h-16 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center mb-3">
                                        <MapPin className="text-slate-500 h-6 w-6" />
                                    </div>
                                    <span className="font-bold text-slate-800 text-center sm:text-left">{originName}</span>
                                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Origin</span>
                                </div>

                                <div className="relative z-10 flex flex-col items-center sm:items-end">
                                    <div className={`w-16 h-16 border-2 rounded-full flex items-center justify-center mb-3 shadow-lg ${freightType === 'OCEAN' ? 'bg-teal-900 border-teal-900' : 'bg-slate-900 border-slate-900'}`}>
                                        <MapPin className="text-white h-6 w-6" />
                                    </div>
                                    <span className="font-bold text-slate-800 text-center sm:text-right">{destName}</span>
                                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Destination</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        {freightType === 'AIR' ? 'Airline' : 'Vessel'}
                                    </div>
                                    <div className="font-semibold text-slate-800">
                                        {freightType === 'AIR' ? trackingData.airline.name : trackingData.schedule.vesselName}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        {freightType === 'AIR' ? 'Cargo Type' : 'Container'}
                                    </div>
                                    <div className="font-semibold text-slate-800">
                                        {freightType === 'AIR' ? trackingData.cargoType : trackingData.containerType.name}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Weight</div>
                                    <div className="font-semibold text-slate-800">{trackingData.weight} kg</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Arrival</div>
                                    <div className={`font-black ${freightType === 'OCEAN' ? 'text-teal-600' : 'text-primary'}`}>
                                        {new Date(trackingData.eta).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackFreight;
