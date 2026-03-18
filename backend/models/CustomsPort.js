import mongoose from 'mongoose';

const customsPortSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Airport', 'Dry Port', 'Seaport'], required: true },
    baseCharge: { type: Number, required: true }, // Fixed clearance fee
    dutyPercentage: { type: Number, required: true }, // Base duty rate (e.g. 5 for 5%)
    weightSlabs: [{
        minWeight: Number,
        ratePerKg: Number
    }]
}, { timestamps: true });

const CustomsPort = mongoose.model('CustomsPort', customsPortSchema);
export default CustomsPort;
