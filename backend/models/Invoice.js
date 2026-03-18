import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    invoiceId: { type: String, required: true, unique: true },
    customer: { type: String, required: true }, // Clerk ID
    serviceType: { type: String, required: true }, // air, ocean, etc.
    bookingId: { type: String, required: true }, // The AWB/BOL/WH number
    amount: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Cancelled'], default: 'Unpaid' },
    paymentIntentId: { type: String }
}, { timestamps: true });

invoiceSchema.pre('validate', function(next) {
    if (!this.invoiceId) {
        this.invoiceId = 'INV-' + Math.floor(10000000 + Math.random() * 90000000);
    }
    next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
