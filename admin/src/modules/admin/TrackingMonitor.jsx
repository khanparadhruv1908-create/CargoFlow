import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAdminShipments } from '../../hooks/useAdminData';
import { MapPin, Navigation } from 'lucide-react';

export default function TrackingMonitor() {
    const { data: shipments, isLoading } = useAdminShipments();
    const [selectedShipment, setSelectedShipment] = useState(null);

    if (isLoading) return <div>Loading Tracking Data...</div>;

    // Static mock locations for USA for visual map distribution
    const mockLocations = [
        { source: [40.7128, -74.0060], dest: [34.0522, -118.2437] }, // NY -> CA
        { source: [29.7604, -95.3698], dest: [25.7617, -80.1918] },  // TX -> FL
        { source: [47.6062, -122.3321], dest: [45.5152, -122.6784] },// WA -> OR
        { source: [41.8781, -87.6298], dest: [39.9612, -82.9988] },  // IL -> OH
    ];

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Live Fleet Monitor</h2>
                    <p className="text-gray-500">Real-time GPS tracking of active logistics assets.</p>
                </div>
            </div>

            <div className="flex-1 min-h-[500px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row relative">

                {/* Sidebar shipment list */}
                <div className="w-full md:w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                        <h3 className="font-semibold text-gray-700 flex items-center">
                            <Navigation size={18} className="mr-2 text-blue-500" />
                            Active Assets
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {shipments?.map((ship, index) => (
                            <div
                                key={ship._id}
                                onClick={() => setSelectedShipment({ ...ship, ...mockLocations[index % mockLocations.length] })}
                                className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedShipment?._id === ship._id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold font-mono text-sm text-gray-900">{ship.shipmentId}</span>
                                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${ship.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                            ship.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-200 text-gray-700'
                                        }`}>
                                        {ship.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">Driver: {ship.assignedDriver || 'Unassigned'}</div>
                                <div className="text-xs text-gray-400 mt-1 flex items-center">
                                    <MapPin size={12} className="mr-1" />
                                    {ship.origin} to {ship.destination}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map View */}
                <div className="flex-1 relative z-0">
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

                        {/* Render all points generically */}
                        {shipments?.map((ship, index) => {
                            const loc = mockLocations[index % mockLocations.length];
                            return (
                                <div key={ship._id}>
                                    <Marker position={loc.source}>
                                        <Popup className="font-mono">{ship.shipmentId} (Origin)</Popup>
                                    </Marker>
                                    <Marker position={loc.dest}>
                                        <Popup className="font-mono">{ship.shipmentId} (Destination)</Popup>
                                    </Marker>
                                </div>
                            );
                        })}

                        {/* Highlight selected route */}
                        {selectedShipment && (
                            <Polyline
                                positions={[selectedShipment.source, selectedShipment.dest]}
                                pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '8, 8' }}
                            />
                        )}
                    </MapContainer>

                    {/* Overlay details box if something is selected */}
                    {selectedShipment && (
                        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white/95 backdrop-blur shadow-2xl rounded-xl p-4 border border-gray-100 z-[1000] animate-in slide-in-from-bottom flex flex-col gap-2">
                            <h4 className="font-bold text-gray-900 flex items-center">
                                Tracking {selectedShipment.shipmentId}
                            </h4>
                            <p className="text-sm text-gray-600">
                                Route: <span className="font-bold">{selectedShipment.origin} &rarr; {selectedShipment.destination}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Driver: <span className="font-bold">{selectedShipment.assignedDriver || 'No Driver Assigned'}</span>
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                            <span className="text-xs text-gray-400 mt-1 text-right">45% Completed</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
