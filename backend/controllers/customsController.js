import CustomsPort from '../models/CustomsPort.js';
import CustomsDeclaration from '../models/CustomsDeclaration.js';
import Invoice from '../models/Invoice.js';

// ---- PORT MANAGEMENT (ADMIN) ----
export const getCustomsPorts = async (req, res, next) => {
    try {
        const ports = await CustomsPort.find({});
        res.json(ports);
    } catch (error) { next(error); }
};

export const createCustomsPort = async (req, res, next) => {
    try {
        const port = await CustomsPort.create(req.body);
        res.status(201).json(port);
    } catch (error) { next(error); }
};

export const deleteCustomsPort = async (req, res, next) => {
    try {
        await CustomsPort.findByIdAndDelete(req.params.id);
        res.json({ message: 'Port removed' });
    } catch (error) { next(error); }
};

// ---- CUSTOMS DECLARATIONS ----
export const calculateCustoms = async (req, res, next) => {
    try {
        const { portId, weight, cargoValue } = req.body;
        const port = await CustomsPort.findById(portId);

        if (!port) return res.status(404).json({ message: 'Port not found' });

        // 1. Calculate Duty
        const dutyAmount = (cargoValue * port.dutyPercentage) / 100;

        // 2. Calculate Clearance Charges (Base + Weight Surcharge from Slabs)
        let ratePerKg = 0;
        if (port.weightSlabs && port.weightSlabs.length > 0) {
            const applicableSlab = [...port.weightSlabs]
                .sort((a, b) => b.minWeight - a.minWeight)
                .find(s => weight >= s.minWeight);

            if (applicableSlab) ratePerKg = applicableSlab.ratePerKg;
        }

        const clearanceCharges = port.baseCharge + (weight * ratePerKg);
        const totalAmount = dutyAmount + clearanceCharges;

        res.json({
            dutyAmount,
            clearanceCharges,
            totalAmount,
            details: {
                baseCharge: port.baseCharge,
                weightSurcharge: weight * ratePerKg,
                dutyPercentage: port.dutyPercentage
            }
        });
    } catch (error) { next(error); }
};

export const createDeclaration = async (req, res, next) => {
    try {
        const { portId, weight, cargoValue, description, paymentIntentId } = req.body;
        const port = await CustomsPort.findById(portId);
        if (!port) return res.status(404).json({ message: 'Port not found' });

        // Re-calculate on server for security
        const dutyAmount = (cargoValue * port.dutyPercentage) / 100;
        let ratePerKg = 0;
        const applicableSlab = [...port.weightSlabs]
            .sort((a, b) => b.minWeight - a.minWeight)
            .find(s => weight >= s.minWeight);
        if (applicableSlab) ratePerKg = applicableSlab.ratePerKg;

        const clearanceCharges = port.baseCharge + (weight * ratePerKg);
        const totalAmount = dutyAmount + clearanceCharges;

        const declaration = await CustomsDeclaration.create({
            port: portId,
            weight,
            cargoValue,
            description,
            dutyAmount,
            clearanceCharges,
            totalAmount,
            customer: req.user?.id
        });

        // Generate Automated Invoice
        await Invoice.create({
            customer: req.user.id,
            serviceType: 'Customs Clearance',
            bookingId: declaration.declarationNumber,
            amount: totalAmount,
            tax: 0, // Duty is already a tax-like fee
            totalAmount: totalAmount,
            status: 'Paid',
            paymentIntentId
        });

        res.status(201).json(declaration);
    } catch (error) { next(error); }
};

export const getDeclarations = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            query.customer = req.user.id;
        }

        const declarations = await CustomsDeclaration.find(query)
            .populate('port')
            .sort({ createdAt: -1 });
        res.json(declarations);
    } catch (error) { next(error); }
};

export const updateDeclarationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const dec = await CustomsDeclaration.findById(req.params.id);
        if (dec) {
            dec.status = status;
            await dec.save();
            res.json(dec);
        } else {
            res.status(404).json({ message: 'Declaration not found' });
        }
    } catch (error) { next(error); }
};
