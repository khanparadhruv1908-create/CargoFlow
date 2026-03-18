import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck, Package, Clock, MapPin, X, Map as MapIcon, CalendarIcon, CheckCircle } from 'lucide-react';
import L from 'leaflet';
import { useTracking } from '../../hooks/useTracking';

// Fix for default Leaflet marker icons in React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = customIcon;

export default function ShipmentDetails({ shipment, onClose }) {
    const liveLocation = useTracking(shipment?._id);

    if (!shipment) return null;

    const steps = [
        { label: 'Order Created', date: new Date(shipment.createdAt).toLocaleDateString(), completed: true },
        { label: 'Pending Dispatch', date: '-', completed: ['Pending', 'In Transit', 'Delivered', 'Delayed'].includes(shipment.status) },
        { label: 'In Transit', date: '-', completed: ['In Transit', 'Delivered'].includes(shipment.status) },
        { label: 'Delivered', date: new Date(shipment.eta).toLocaleDateString(), completed: shipment.status === 'Delivered' }
    ];

    const bounds = [
        [shipment.originLat, shipment.originLng],
        [shipment.destLat, shipment.destLng]
    ];

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors z-[1000]"
            >
                <X size={24} />
            </button>

            <div className="mb-8 border-b pb-4">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Shipment {shipment.shipmentId}
                </h2>
                <p className="text-gray-500 mt-2 flex items-center">
                    <CalendarIcon size={16} className="mr-2" />
                    Created on {new Date(shipment.createdAt).toLocaleDateString()}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Col: Details & Timeline */}
                <div className="space-y-8">
                    {/* Details Card */}
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Package className="mr-2 text-blue-500" />
                            Package Info
                        </h3>

                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 text-sm">Cargo Type</span>
                                <span className="font-medium text-gray-800">{shipment.cargoType}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 text-sm">Weight</span>
                                <span className="font-medium text-gray-800">{shipment.weight} kg</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 text-sm">Status</span>
                                <span className={`font-semibold px-2 py-0.5 rounded text-sm ${shipment.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                        shipment.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {shipment.status}
                                </span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 text-sm">Assigned Driver</span>
                                <span className="font-medium text-gray-800 flex items-center">
                                    <Truck size={14} className="mr-1 text-gray-400" />
                                    {shipment.assignedDriver}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">ETA</span>
                                <span className="font-medium text-gray-800 flex items-center">
                                    <Clock size={14} className="mr-1 text-gray-400" />
                                    {new Date(shipment.eta).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline UI */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                            <MapPin className="mr-2 text-indigo-500" />
                            Tracking History
                        </h3>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {steps.map((step, idx) => (
                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${step.completed ? 'bg-indigo-500 border-indigo-100 text-white' : 'bg-white border-slate-200 text-slate-400'
                                        }`}>
                                        {step.completed ? <CheckCircle size={18} /> : <div className="w-3 h-3 bg-slate-300 rounded-full" />}
                                    </div>

                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm ml-4 md:ml-0">
                                        <div className="flex flex-col">
                                            <div className={`font-bold ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>{step.label}</div>
                                            <div className="text-sm text-slate-500">{step.date}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col: Map */}
                <div className="bg-gray-100 rounded-xl overflow-hidden shadow-inner h-[400px] md:h-auto border border-gray-200 relative">
                    <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm font-semibold text-sm flex items-center text-gray-700 pointer-events-none">
                        <MapIcon size={16} className="mr-2 text-blue-500" />
                        Live Route Maps
                    </div>
                    <MapContainer
                        bounds={bounds}
                        scrollWheelZoom={true}
                        className="h-full w-full z-10"
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <Marker position={[shipment.originLat, shipment.originLng]}>
                            <Popup><strong>Origin:</strong> <br />{shipment.origin}</Popup>
                        </Marker>

                        <Marker position={[shipment.destLat, shipment.destLng]}>
                            <Popup><strong>Destination:</strong> <br />{shipment.destination}</Popup>
                        </Marker>

                        {liveLocation && (
                            <Marker position={[liveLocation.lat, liveLocation.lng]}>
                                <Popup><strong>Live Location:</strong> <br />{shipment.id}</Popup>
                            </Marker>
                        )}

                        <Polyline
                            positions={bounds}
                            pathOptions={{ color: '#4f46e5', weight: 4, dashArray: '8, 8' }}
                        />
                    </MapContainer>
                </div>

            </div>
        </div>
    );
}
