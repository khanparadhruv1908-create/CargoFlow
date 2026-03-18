import express from 'express';
import { 
    getWarehouseLocations, createWarehouseLocation, deleteWarehouseLocation,
    calculateStorage, createStorageBooking, getStorageBookings, updateStorageStatus
} from '../controllers/warehouseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Location Management
router.route('/locations')
    .get(getWarehouseLocations)
    .post(protect, authorize('admin', 'manager'), createWarehouseLocation);
router.route('/locations/:id')
    .delete(protect, authorize('admin', 'manager'), deleteWarehouseLocation);

// Bookings & Logic
router.route('/calculate')
    .post(calculateStorage);

router.route('/bookings')
    .post(protect, createStorageBooking)
    .get(protect, getStorageBookings);

router.route('/bookings/:id/status')
    .put(protect, authorize('admin', 'manager'), updateStorageStatus);

export default router;
