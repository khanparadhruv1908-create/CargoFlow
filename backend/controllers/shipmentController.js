import Shipment from '../models/Shipment.js';

export const createShipment = async (req, res, next) => {
    try {
        const shipmentData = { ...req.body, customer: req.user?.id };
        const shipment = await Shipment.create(shipmentData);
        res.status(201).json(shipment);
    } catch (error) {
        next(error);
    }
};

export const getShipments = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            query.customer = req.user.id;
        }
        const shipments = await Shipment.find(query).populate('warehouse', 'name').sort({ createdAt: -1 });
        res.json(shipments);
    } catch (error) {
        next(error);
    }
};

export const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await Shipment.findById(req.params.id).populate('warehouse');
        if (shipment) {
            // Check if user has access to this shipment
            if (req.user.role !== 'admin' && req.user.role !== 'manager' && shipment.customer !== req.user.id) {
                res.status(403);
                throw new Error('Not authorized to view this shipment');
            }
            res.json(shipment);
        } else {
            res.status(404);
            throw new Error('Shipment not found');
        }
    } catch (error) {
        next(error);
    }
};

export const updateShipment = async (req, res, next) => {
    try {
        const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (shipment) {
            res.json(shipment);
        } else {
            res.status(404);
            throw new Error('Shipment not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteShipment = async (req, res, next) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (shipment) {
            await Shipment.deleteOne({ _id: req.params.id });
            res.json({ message: 'Shipment removed' });
        } else {
            res.status(404);
            throw new Error('Shipment not found');
        }
    } catch (error) {
        next(error);
    }
};
