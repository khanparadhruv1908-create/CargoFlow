import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
    shipmentId: { type: String, required: true, ref: 'Shipment' },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Tracking = mongoose.model('Tracking', trackingSchema);
export default Tracking;
