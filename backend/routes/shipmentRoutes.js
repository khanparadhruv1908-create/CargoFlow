import express from 'express';
import {
    createShipment,
    getAllShipments,
    updateTrackingStatus,
    getTrackingInfo,
    updateShipment,
    deleteShipment
} from '../controllers/shipmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ---- SHIPMENT MANAGEMENT ROUTES ----

/**
 * @route   POST /api/shipments/create-shipment
 * @desc    Create a new shipment (Modern Sender/Receiver format)
 */
router.post('/create-shipment', protect, authorize('admin', 'manager', 'dispatcher'), createShipment);

/**
 * @route   GET /api/shipments
 * @desc    Get all shipments (Admin sees all, user sees theirs)
 */
router.get('/', protect, getAllShipments);

/**
 * @route   POST /api/shipments/update-tracking/:id
 * @desc    Add a new tracking milestone to a shipment
 */
router.post('/update-tracking/:id', protect, authorize('admin', 'manager', 'dispatcher'), updateTrackingStatus);

/**
 * @route   GET /api/shipments/track/:shipmentId
 * @desc    Public tracking endpoint for modern UI
 */
router.get('/track/:shipmentId', getTrackingInfo);

/**
 * @route   PUT /api/shipments/:id
 * @desc    Update master shipment details
 */
router.put('/:id', protect, authorize('admin', 'manager'), updateShipment);

/**
 * @route   DELETE /api/shipments/:id
 * @desc    Delete shipment and its history
 */
router.delete('/:id', protect, authorize('admin'), deleteShipment);

export default router;
