import express from 'express';
import {
    createShipment,
    getShipments,
    getShipmentById,
    updateShipment,
    deleteShipment,
    updateTracking
} from '../controllers/shipmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createShipment)
    .get(protect, getShipments);

router.route('/:id')
    .get(protect, getShipmentById)
    .put(protect, authorize('admin', 'manager', 'dispatcher'), updateShipment)
    .delete(protect, authorize('admin'), deleteShipment);

// NEW ENDPOINT FOR SMART TRACKING UPDATES (HISTORY Milestones)
router.route('/:id/tracking')
    .post(protect, authorize('admin', 'manager', 'dispatcher'), updateTracking);

export default router;
