import express from 'express';
import {
    createShipment,
    getShipments,
    getShipmentById,
    updateShipment,
    deleteShipment
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

export default router;
