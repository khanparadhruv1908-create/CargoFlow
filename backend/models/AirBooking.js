import mongoose from 'mongoose';

const airBookingSchema = new mongoose.Schema({
    awbNumber: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => 'AWB-' + Math.floor(10000000 + Math.random() * 90000000)
    },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    airline: { type: mongoose.Schema.Types.ObjectId, ref: 'Airline', required: true },
    weight: { type: Number, required: true },
    cargoType: { type: String, required: true },
    shipmentDate: { type: Date, required: true },
    totalCharges: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Scheduled', 'In Transit', 'Arrived', 'Delivered', 'Delayed', 'Cancelled'],
        default: 'Scheduled'
    },
    eta: { type: Date },
    customer: { type: String } // Clerk User ID
}, { timestamps: true });

airBookingSchema.pre('validate', async function () {
    if (!this.awbNumber) {
        this.awbNumber = 'AWB-' + Math.floor(10000000 + Math.random() * 90000000);
    }
});

airBookingSchema.pre('save', async function () {
    // calculate rough ETA (+3 days) if not provided
    if (!this.eta && this.shipmentDate) {
        const d = new Date(this.shipmentDate);
        d.setDate(d.getDate() + 3);
        this.eta = d;
    }
});

const AirBooking = mongoose.model('AirBooking', airBookingSchema);
export default AirBooking;
