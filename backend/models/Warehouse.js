import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true }
    },
    capacity: { type: Number, required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
