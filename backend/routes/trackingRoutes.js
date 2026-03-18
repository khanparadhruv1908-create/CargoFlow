import express from 'express';
import AirBooking from '../models/AirBooking.js';
import { OceanBooking } from '../models/Ocean.js';

const router = express.Router();

// @route   GET /api/track/:refId
// @desc    Smart Search for any AWB or BOL number
router.get('/:refId', async (req, res) => {
    try {
        const { refId } = req.params;
        let shipment = null;
        let type = '';

        // 1. Check Air Freight
        shipment = await AirBooking.findOne({ awbNumber: refId }).populate('airline', 'name');
        if (shipment) {
            type = 'Air Freight';
            return res.json({
                type,
                referenceId: shipment.awbNumber,
                carrier: shipment.airline?.name,
                origin: shipment.origin,
                destination: shipment.destination,
                status: shipment.status,
                eta: shipment.eta,
                weight: shipment.weight,
                lastUpdate: shipment.updatedAt,
                timeline: [
                    { status: 'Booked', date: shipment.createdAt, location: shipment.origin, completed: true },
                    { status: 'In Transit', date: shipment.updatedAt, location: 'International Airspace', completed: shipment.status === 'In Transit' || shipment.status === 'Arrived' },
                    { status: 'Arrived', date: shipment.eta, location: shipment.destination, completed: shipment.status === 'Arrived' }
                ]
            });
        }

        // 2. Check Ocean Freight
        shipment = await OceanBooking.findOne({ bolNumber: refId }).populate('schedule');
        if (shipment) {
            type = 'Ocean Freight';
            return res.json({
                type,
                referenceId: shipment.bolNumber,
                carrier: shipment.schedule?.vesselName,
                origin: shipment.schedule?.originPort,
                destination: shipment.schedule?.destPort,
                status: shipment.vesselStatus,
                eta: shipment.eta,
                weight: shipment.weight,
                lastUpdate: shipment.updatedAt,
                timeline: [
                    { status: 'Container Loaded', date: shipment.createdAt, location: shipment.schedule?.originPort, completed: true },
                    { status: 'Vessel Departed', date: shipment.updatedAt, location: 'High Seas', completed: shipment.vesselStatus !== 'Scheduled' },
                    { status: 'Arrived at Port', date: shipment.eta, location: shipment.schedule?.destPort, completed: shipment.vesselStatus === 'Arrived' }
                ]
            });
        }

        res.status(404).json({ message: 'Reference number not found in our global network.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
