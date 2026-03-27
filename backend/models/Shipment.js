import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
    shipmentId: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => 'SHIP-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    },
    // MODERN NAMING (REPLACING SHIPPER/CONSIGNEE)
    sender: {
        name: { type: String, required: true },
        phone: { type: String },
        address: { type: String, required: true }
    },
    receiver: {
        name: { type: String, required: true },
        phone: { type: String },
        address: { type: String, required: true }
    },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    cargoType: { type: String, required: true },
    weight: { type: Number, required: true },
    
    // AMAZON STYLE STATUS SYSTEM
    status: {
        type: String,
        enum: ['Booking Confirmed', 'Picked Up', 'In Transit', 'Arrived', 'Out for Delivery', 'Delivered', 'Delayed', 'Cancelled'],
        default: 'Booking Confirmed'
    },
    
    assignedDriver: { type: String, default: 'Unassigned' },
    eta: { type: Date, required: true },
    customer: { type: String }, // Clerk ID
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' }
}, { timestamps: true });

shipmentSchema.pre('save', async function () {
    if (!this.shipmentId) {
        this.shipmentId = 'SHIP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;
