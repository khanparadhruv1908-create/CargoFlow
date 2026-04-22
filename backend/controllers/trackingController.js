import Tracking from '../models/Tracking.js';

export const updateTracking = async (req, res, next) => {
    try {
        const { shipmentId, lat, lng } = req.body;

        const trackingData = await Tracking.create({
            shipmentId,
            lat,
            lng
        });

        // Emit live update using socket.io if required
        req.io.to(shipmentId).emit('tracking_update', { lat, lng, timestamp: trackingData.timestamp });

        res.status(201).json(trackingData);
    } catch (error) {
        next(error);
    }
};

export const getTrackingHistory = async (req, res, next) => {
    try {
        const history = await Tracking.find({ shipmentId: req.params.shipmentId }).sort({ timestamp: -1 });
        res.json(history);
    } catch (error) {
        next(error);
    }
};
