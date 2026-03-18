import Shipment from '../models/Shipment.js';

export const createShipment = async (req, res, next) => {
    try {
        const shipment = await Shipment.create(req.body);
        res.status(201).json(shipment);
    } catch (error) {
        next(error);
    }
};

export const getShipments = async (req, res, next) => {
    try {
        const shipments = await Shipment.find().populate('customer', 'name email').populate('warehouse', 'name');
        res.json(shipments);
    } catch (error) {
        next(error);
    }
};

export const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await Shipment.findById(req.params.id).populate('customer warehouse');
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
