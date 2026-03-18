import mongoose from 'mongoose';

const warehouseLocationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    baseRatePerDay: { type: Number, required: true }, // Fixed daily cost for space
    ratePerKgPerDay: { type: Number, required: true }, // Weight-based daily cost
}, { timestamps: true });

const WarehouseLocation = mongoose.model('WarehouseLocation', warehouseLocationSchema);
export default WarehouseLocation;
