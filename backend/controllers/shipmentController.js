import Shipment from '../models/Shipment.js';
import Tracking from '../models/Tracking.js';

// ---- CREATE NEW SHIPMENT (WITH SENDER/RECEIVER) ----
export const createShipment = async (req, res, next) => {
    try {
        const { sender, receiver, origin, destination, cargoType, weight, eta } = req.body;

        const shipment = await Shipment.create({
            sender,
            receiver,
            origin,
            destination,
            cargoType,
            weight,
            eta,
            customer: req.user?.id
        });

        // Add Initial Tracking Milestone
        await Tracking.create({
            shipmentId: shipment.shipmentId,
            status: 'Booking Confirmed',
            location: origin,
            updatedBy: req.user?.name || 'System'
        });

        res.status(201).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ---- GET ALL SHIPMENTS ----
export const getShipments = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role !== 'admin' && req.user.role !== 'manager' && req.user.role !== 'dispatcher') {
            query.customer = req.user.id;
        }
        const shipments = await Shipment.find(query).sort({ createdAt: -1 });
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ---- SMART TRACKING UPDATE (HISTORY milestonse) ----
export const updateTracking = async (req, res, next) => {
    try {
        const { status, location, lat, lng, details } = req.body;
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

        // 1. Update Current Shipment Status
        shipment.status = status;
        await shipment.save();

        // 2. Add to Tracking History
        const trackingUpdate = await Tracking.create({
            shipmentId: shipment.shipmentId,
            status,
            location,
            lat,
            lng,
            details,
            updatedBy: req.user?.name || 'Dispatcher'
        });

        res.json({ message: 'Tracking updated successfully', trackingUpdate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ---- FETCH SHIPMENT WITH TRACKING HISTORY ----
export const getShipmentById = async (req, res, next) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

        const history = await Tracking.find({ shipmentId: shipment.shipmentId }).sort({ timestamp: -1 });

        res.json({ shipment, history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update main shipment fields (Assigned Driver, etc.)
export const updateShipment = async (req, res, next) => {
    try {
        const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete shipment
export const deleteShipment = async (req, res, next) => {
    try {
        await Shipment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Shipment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
