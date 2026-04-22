import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAdminShipments } from '../../hooks/useAdminData';
import { MapPin, Navigation, Globe, Zap, Search, Activity, ArrowRight, Clock } from 'lucide-react';
import { 
    Card, 
    CardHeader, 
    CardContent, 
    Badge,
    Button,
    Input
} from '../../components/ui';

export default function TrackingMonitor() {
    const { data: shipments = [], isLoading } = useAdminShipments();
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) return (
        <div className="h-[600px] flex items-center justify-center bg-white rounded-[32px] border border-slate-100 animate-pulse">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Satellite Data...</p>
            </div>
        </div>
    );

    const mockLocations = [
        { source: [40.7128, -74.0060], dest: [34.0522, -118.2437] },
        { source: [29.7604, -95.3698], dest: [25.7617, -80.1918] },
        { source: [47.6062, -122.3321], dest: [45.5152, -122.6784] },
        { source: [41.8781, -87.6298], dest: [39.9612, -82.9988] },
    ];

    const filteredShipments = shipments.filter(s => 
        s.shipmentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-1000">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-secondary tracking-tight">Fleet Intelligence</h2>
                    <p className="text-sm text-slate-400 font-medium mt-1">Real-time GPS telemetry of active transcontinental assets</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                        <Zap size={14} className="fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Satellite Link: 100%</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[650px] bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col lg:flex-row relative">

                {/* Sidebar Asset List */}
                <div className="w-full lg:w-96 bg-slate-50/50 border-r border-slate-100 overflow-y-auto flex flex-col">
                    <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm shadow-slate-900/5">
                        <h3 className="font-black text-secondary text-xs uppercase tracking-[0.2em] flex items-center mb-4">
                            <Navigation size={16} className="mr-3 text-primary" />
                            Active Units
                        </h3>
                        <Input 
                            placeholder="Filter Asset ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={Search}
                            className="!py-2 !px-4 !rounded-xl !bg-slate-50 border-none"
                            containerClassName="space-y-0"
                        />
                    </div>
                    
                    <div className="divide-y divide-slate-100 overflow-y-auto custom-scrollbar flex-1">
                        {filteredShipments.map((ship, index) => (
                            <div
                                key={ship._id}
                                onClick={() => setSelectedShipment({ ...ship, ...mockLocations[index % mockLocations.length] })}
                                className={`
                                    p-6 cursor-pointer transition-all duration-300 group
                                    ${selectedShipment?._id === ship._id 
                                        ? 'bg-white border-l-4 border-primary shadow-lg shadow-slate-900/5 z-10' 
                                        : 'hover:bg-white border-l-4 border-transparent'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col">
                                        <span className={`font-mono text-sm font-black transition-colors ${selectedShipment?._id === ship._id ? 'text-primary' : 'text-secondary'}`}>
                                            {ship.shipmentId}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Freight Asset</span>
                                    </div>
                                    <Badge variant={ship.status === 'In Transit' ? 'primary' : ship.status === 'Delayed' ? 'danger' : 'default'}>
                                        {ship.status}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                        <MapPin size={12} className="text-primary/60" />
                                        <span>{ship.origin}</span>
                                        <ArrowRight size={10} className="text-slate-300" />
                                        <span>{ship.destination}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <Activity size={10} />
                                        Operator: {ship.assignedDriver || 'Awaiting Assign.'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map Interface */}
                <div className="flex-1 relative z-0 bg-slate-100">
                    <MapContainer
                        center={[39.8283, -98.5795]}
                        zoom={4}
                        className="h-full w-full"
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />

                        {filteredShipments.map((ship, index) => {
                            const loc = mockLocations[index % mockLocations.length];
                            return (
                                <div key={ship._id}>
                                    <Marker position={loc.source}>
                                        <Popup>
                                            <div className="p-2 font-outfit">
                                                <p className="font-black text-secondary text-xs mb-1">{ship.shipmentId}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Origin Node</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                    <Marker position={loc.dest}>
                                        <Popup>
                                            <div className="p-2 font-outfit">
                                                <p className="font-black text-secondary text-xs mb-1">{ship.shipmentId}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Destination Node</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </div>
                            );
                        })}

                        {selectedShipment && (
                            <Polyline
                                positions={[selectedShipment.source, selectedShipment.dest]}
                                pathOptions={{ color: '#2563EB', weight: 4, dashArray: '10, 10', lineCap: 'round' }}
                            />
                        )}
                    </MapContainer>

                    {/* HUD Overlay for Selected Shipment */}
                    {selectedShipment && (
                        <div className="absolute bottom-8 left-8 right-8 lg:right-auto lg:w-[400px] bg-white/90 backdrop-blur-xl shadow-2xl rounded-[32px] p-8 border border-white/50 z-[1000] animate-in slide-in-from-bottom-10 duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-xl font-black text-secondary tracking-tight mb-1 flex items-center gap-2">
                                        <Globe size={20} className="text-primary" />
                                        Unit {selectedShipment.shipmentId}
                                    </h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Telemetry</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedShipment(null)}
                                    className="p-2 bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
                                >
                                    <Search size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Route Status</p>
                                    <Badge variant="primary">{selectedShipment.status}</Badge>
                                </div>
                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Time</p>
                                    <div className="flex items-center gap-2 text-xs font-black text-secondary uppercase">
                                        <Clock size={12} className="text-primary" /> 14:02 UTC
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Transit Progress</span>
                                    <span className="text-primary">68%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]" style={{ width: '68%' }}></div>
                                </div>
                                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-wider">Last Sync: 2 minutes ago</p>
                            </div>
                            
                            <Button className="w-full mt-8 shadow-xl" variant="primary" icon={Activity}>Full Manifest Details</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
