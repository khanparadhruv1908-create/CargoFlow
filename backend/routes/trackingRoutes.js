import express from 'express';
import AirBooking from '../models/AirBooking.js';
import { OceanBooking } from '../models/Ocean.js';
import Shipment from '../models/Shipment.js';
import Tracking from '../models/Tracking.js';

const router = express.Router();

// @route   GET /api/track/:refId
// @desc    Smart Search across all shipment types (Air, Ocean, Local)
router.get('/:refId', async (req, res) => {
    try {
        const { refId } = req.params;
        let shipment = null;
        let history = [];
        let type = '';

        // 1. CHECK SHIPMENT MODEL (Modern Logistics)
        const localShipment = await Shipment.findOne({ shipmentId: refId });
        if (localShipment) {
            type = 'Standard Freight';
            history = await Tracking.find({ shipmentId: refId }).sort({ timestamp: -1 });
            
            return res.json({
                type,
                referenceId: localShipment.shipmentId,
                status: localShipment.status,
                sender: localShipment.sender,
                receiver: localShipment.receiver,
                origin: localShipment.origin,
                destination: localShipment.destination,
                eta: localShipment.eta,
                lastUpdate: localShipment.updatedAt,
                timeline: history.map(h => ({
                    status: h.status,
                    location: h.location,
                    time: h.timestamp,
                    details: h.details,
                    by: h.updatedBy,
                    completed: true
                }))
            });
        }

        // 2. CHECK AIR BOOKING (AWB)
        const air = await AirBooking.findOne({ awbNumber: refId }).populate('airline', 'name');
        if (air) {
            type = 'Air Freight';
            return res.json({
                type,
                referenceId: air.awbNumber,
                carrier: air.airline?.name,
                status: air.status,
                origin: air.origin,
                destination: air.destination,
                eta: air.eta,
                lastUpdate: air.updatedAt,
                // Mock timeline if no Tracking log exists
                timeline: [
                    { status: 'Booking Confirmed', location: 'System', time: air.createdAt, completed: true },
                    { status: air.status, location: air.origin, time: air.updatedAt, completed: true }
                ]
            });
        }

        // 3. CHECK OCEAN BOOKING (BOL)
        const ocean = await OceanBooking.findOne({ bolNumber: refId }).populate('schedule');
        if (ocean) {
            type = 'Ocean Freight';
            return res.json({
                type,
                referenceId: ocean.bolNumber,
                carrier: ocean.schedule?.vesselName,
                status: ocean.vesselStatus,
                origin: ocean.schedule?.originPort,
                destination: ocean.schedule?.destPort,
                eta: ocean.eta,
                lastUpdate: ocean.updatedAt,
                timeline: [
                    { status: 'Confirmed', location: ocean.schedule?.originPort, time: ocean.createdAt, completed: true },
                    { status: ocean.vesselStatus, location: 'High Seas', time: ocean.updatedAt, completed: true }
                ]
            });
        }

        res.status(404).json({ message: 'Tracking reference not found in our network.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
