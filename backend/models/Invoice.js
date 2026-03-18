import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    invoiceId: { type: String, required: true, unique: true },
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
    amount: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Cancelled'], default: 'Unpaid' }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
