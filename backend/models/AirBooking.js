import mongoose from 'mongoose';

const airBookingSchema = new mongoose.Schema({
    awbNumber: { type: String, required: true, unique: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    airline: { type: mongoose.Schema.Types.ObjectId, ref: 'Airline', required: true },
    weight: { type: Number, required: true },
    cargoType: { type: String, required: true },
    shipmentDate: { type: Date, required: true },
    totalCharges: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Scheduled', 'In Transit', 'Delivered'],
        default: 'Scheduled'
    },
    eta: { type: Date },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

airBookingSchema.pre('save', function (next) {
    if (!this.awbNumber) {
        this.awbNumber = 'AWB-' + Math.floor(10000000 + Math.random() * 90000000); // AWB-XXXXXXXX
    }
    // calculate rough ETA (+3 days) if not provided
    if (!this.eta && this.shipmentDate) {
        const d = new Date(this.shipmentDate);
        d.setDate(d.getDate() + 3);
        this.eta = d;
    }
    next();
});

const AirBooking = mongoose.model('AirBooking', airBookingSchema);
export default AirBooking;
