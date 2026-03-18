import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true }
    },
    capacity: { type: Number, required: true },
    manager: { type: String } // Clerk ID
}, { timestamps: true });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
