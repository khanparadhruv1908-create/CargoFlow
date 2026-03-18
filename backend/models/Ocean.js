import mongoose from 'mongoose';

const containerTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. "20ft Standard"
    price: { type: Number, required: true } // base price
}, { timestamps: true });

export const ContainerType = mongoose.model('ContainerType', containerTypeSchema);

const vesselScheduleSchema = new mongoose.Schema({
    vesselName: { type: String, required: true },
    originPort: { type: String, required: true },
    destPort: { type: String, required: true },
    transitDays: { type: Number, required: true }, // Defines ETA Logic
}, { timestamps: true });

export const VesselSchedule = mongoose.model('VesselSchedule', vesselScheduleSchema);

const oceanBookingSchema = new mongoose.Schema({
    bolNumber: { type: String, unique: true },
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'VesselSchedule', required: true },
    containerType: { type: mongoose.Schema.Types.ObjectId, ref: 'ContainerType', required: true },
    weight: { type: Number, required: true },
    loadDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    eta: { type: Date, required: true },
    totalCharges: { type: Number, required: true },
    bolOption: { type: String, enum: ['Sea Way Bill', 'Original Bill of Lading', 'Pending'], default: 'Pending' },
    containerStatus: { type: String, enum: ['Pending', 'Loaded', 'Discharged', 'Delivered'], default: 'Pending' },
    vesselStatus: { type: String, enum: ['Scheduled', 'Departed', 'In Transit', 'Arrived'], default: 'Scheduled' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

oceanBookingSchema.pre('save', function (next) {
    if (!this.bolNumber) {
        this.bolNumber = 'BOL-' + Math.floor(10000000 + Math.random() * 90000000);
    }
    next();
});

export const OceanBooking = mongoose.model('OceanBooking', oceanBookingSchema);
