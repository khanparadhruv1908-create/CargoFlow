import mongoose from 'mongoose';

const storageBookingSchema = new mongoose.Schema({
    bookingNumber: { type: String, unique: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'WarehouseLocation', required: true },
    days: { type: Number, required: true },
    weight: { type: Number, required: true },
    totalCharges: { type: Number, required: true },
    status: { type: String, enum: ['Reserved', 'Stored', 'Released', 'Cancelled'], default: 'Reserved' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

storageBookingSchema.pre('save', function (next) {
    if (!this.bookingNumber) {
        this.bookingNumber = 'WH-' + Math.floor(10000000 + Math.random() * 90000000);
    }
    next();
});

const StorageBooking = mongoose.model('StorageBooking', storageBookingSchema);
export default StorageBooking;
