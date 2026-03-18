import mongoose from 'mongoose';

const storageBookingSchema = new mongoose.Schema({
    bookingNumber: { 
        type: String, 
        unique: true,
        default: () => 'WH-' + Math.floor(10000000 + Math.random() * 90000000)
    },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'WarehouseLocation', required: true },
    cargoType: { type: String, enum: ['Pallets', 'Crates', 'Barrels', 'Loose'], default: 'Pallets' },
    unitCount: { type: Number, default: 1 },
    days: { type: Number, required: true },
    weight: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalCharges: { type: Number, required: true },
    pricingBreakdown: {
        baseTotal: Number,
        weightTotal: Number,
        baseRateUsed: Number,
        weightRateUsed: Number
    },
    status: { type: String, enum: ['Reserved', 'Stored', 'Released', 'Cancelled'], default: 'Reserved' },
    customer: { type: String } // Clerk ID
}, { timestamps: true });

storageBookingSchema.pre('save', function (next) {
    if (!this.bookingNumber) {
        this.bookingNumber = 'WH-' + Math.floor(10000000 + Math.random() * 90000000);
    }
    next();
});

const StorageBooking = mongoose.model('StorageBooking', storageBookingSchema);
export default StorageBooking;
