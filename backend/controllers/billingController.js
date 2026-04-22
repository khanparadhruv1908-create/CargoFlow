import Invoice from '../models/Invoice.js';

export const createInvoice = async (req, res, next) => {
    try {
        const { invoiceId, bookingId, serviceType, amount, tax, totalAmount, customer } = req.body;

        const invoice = await Invoice.create({
            invoiceId,
            bookingId,
            serviceType,
            amount,
            tax,
            totalAmount,
            customer,
            status: 'Unpaid'
        });

        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
