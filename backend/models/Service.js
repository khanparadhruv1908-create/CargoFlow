import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g. "air-freight"
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // Lucide icon name
    features: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
