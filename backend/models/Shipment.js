import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
    shipmentId: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => 'SHIP-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    cargoType: { type: String, required: true },
    weight: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'In Transit', 'Delivered', 'Delayed'],
        default: 'Pending'
    },
    assignedDriver: { type: String, default: 'Unassigned' },
    eta: { type: Date, required: true },
    customer: { type: String }, // Clerk ID
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' }
}, { timestamps: true });

shipmentSchema.pre('save', function (next) {
    if (!this.shipmentId) {
        // Fallback for some versions of mongoose
        this.shipmentId = 'SHIP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;
