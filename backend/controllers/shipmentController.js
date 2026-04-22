import Shipment from '../models/Shipment.js';
import Tracking from '../models/Tracking.js';
import { createNotification } from './notificationController.js';
import User from '../models/User.js';

/**
 * @desc    Create a new shipment
 */
export const createShipment = async (req, res) => {
    try {
        const { shipper, consignee, origin, destination, cargoType, weight, eta } = req.body;

        if (!shipper?.name || !consignee?.name || !origin || !destination) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const shipment = await Shipment.create({
            shipper,
            consignee,
            origin,
            destination,
            cargoType,
            weight,
            eta,
            customer: req.user?._id || req.body.customer 
        });

        await Tracking.create({
            shipmentId: shipment.shipmentId,
            status: 'Booking Confirmed',
            location: origin,
            updatedBy: req.user?.name || 'System',
            details: 'Shipment registered.'
        });

        // Async notify
        createNotification({
            userId: req.user._id,
            title: 'Shipment Booked',
            message: `Your shipment ${shipment.shipmentId} has been confirmed.`,
            type: 'shipment',
            relatedId: shipment.shipmentId
        }, req.io).catch(err => console.error("Notification failed", err));

        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
            createNotification({
                userId: admin._id,
                title: 'New Request',
                message: `New shipment ${shipment.shipmentId} booked.`,
                type: 'system',
                relatedId: shipment.shipmentId
            }, req.io).catch(e => {});
        }

        res.status(201).json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update tracking status for a shipment
 */
export const updateTrackingStatus = async (req, res) => {
    try {
        const { status, location, details } = req.body;
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });

        shipment.status = status;
        await shipment.save();

        await Tracking.create({
            shipmentId: shipment.shipmentId,
            status,
            location: location || shipment.destination,
            details,
            updatedBy: req.user?.name || 'Authorized User'
        });

        if (shipment.customer) {
            createNotification({
                userId: shipment.customer,
                title: 'Shipment Update',
                message: `Shipment ${shipment.shipmentId} is now: ${status}`,
                type: 'shipment',
                relatedId: shipment.shipmentId
            }, req.io).catch(e => {});
        }

        res.status(200).json({ success: true, message: `Status updated to: ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Track shipment by tracking ID
 */
export const getTrackingInfo = async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const shipment = await Shipment.findOne({ shipmentId: { $regex: new RegExp(`^${shipmentId}$`, 'i') } });

        if (!shipment) return res.status(404).json({ success: false, message: 'Invalid Tracking ID.' });

        const history = await Tracking.find({ shipmentId: shipment.shipmentId }).sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            data: {
                shipmentId: shipment.shipmentId,
                status: shipment.status,
                shipper: shipment.shipper?.name,
                consignee: shipment.consignee?.name,
                from: shipment.origin,
                to: shipment.destination,
                eta: shipment.eta,
                lastUpdate: shipment.updatedAt,
                timeline: history.map(h => ({
                    status: h.status,
                    location: h.location,
                    time: h.timestamp,
                    info: h.details,
                    by: h.updatedBy
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all shipments
 */
export const getAllShipments = async (req, res) => {
    try {
        let query = {};
        if (req.user?.role !== 'admin' && req.user?.role !== 'manager') {
            query.customer = req.user?._id;
        }
        if (req.query.myShipments === 'true' && req.user?._id) {
            query.handledBy = req.user._id;
        }

        const shipments = await Shipment.find(query)
            .populate('handledBy', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: shipments.length, data: shipments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update Shipment Master Fields
 */
export const updateShipment = async (req, res) => {
    try {
        const oldShipment = await Shipment.findById(req.params.id);
        const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('handledBy', 'name email role');
            
        if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });

        if (!oldShipment.handledBy && shipment.handledBy) {
            createNotification({
                userId: shipment.handledBy._id,
                title: 'New Assignment',
                message: `Assigned to shipment ${shipment.shipmentId}.`,
                type: 'system',
                relatedId: shipment.shipmentId
            }, req.io).catch(e => {});
        }
        
        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete Shipment
 */
export const deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findByIdAndDelete(req.params.id);
        if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
        await Tracking.deleteMany({ shipmentId: shipment.shipmentId });
        res.status(200).json({ success: true, message: 'Shipment and tracking history deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
