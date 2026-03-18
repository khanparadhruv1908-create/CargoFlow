import Invoice from '../models/Invoice.js';

export const createInvoice = async (req, res, next) => {
    try {
        const { invoiceId, shipmentId, amount, tax, totalAmount } = req.body;

        // In a real app we would compute Stripe/Razorpay integrations here
        const invoice = await Invoice.create({
            invoiceId,
            shipment: shipmentId,
            amount,
            tax,
            totalAmount,
            status: 'Unpaid'
        });

        res.status(201).json(invoice);
    } catch (error) {
        next(error);
    }
};

export const getInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.find().populate('shipment');
        res.json(invoices);
    } catch (error) {
        next(error);
    }
};
