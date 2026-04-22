import mongoose from 'mongoose';

const warehouseLocationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    baseRatePerDay: { type: Number, required: true }, // Fixed daily cost for space
    ratePerKgPerDay: { type: Number, required: true }, // Weight-based daily cost
    totalUnits: { type: Number, default: 100 },
    occupiedUnits: { type: Number, default: 0 },
    image: { type: String }, // URL to warehouse image
    features: [{ type: String }], // e.g. ['Cold Storage', '24/7 Security', 'Cross-Docking']
}, { timestamps: true });

const WarehouseLocation = mongoose.model('WarehouseLocation', warehouseLocationSchema);
export default WarehouseLocation;
