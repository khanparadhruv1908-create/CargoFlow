import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
    // SMART TRACKING DATA STRUCTURE
    shipmentId: { type: String, required: true, ref: 'Shipment' },
    status: { type: String, required: true },
    location: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: String, default: 'System' },
    details: { type: String } // Optional: "Flight EK0505", "Port Gateway gate-2"
});

const Tracking = mongoose.model('Tracking', trackingSchema);
export default Tracking;
