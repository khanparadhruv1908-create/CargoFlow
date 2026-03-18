import mongoose from 'mongoose';

const airlineSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    pricePerKg: { type: Number, required: true },
}, { timestamps: true });

const Airline = mongoose.model('Airline', airlineSchema);
export default Airline;
