import express from 'express';
import {
    getContainerTypes, createContainerType, deleteContainerType,
    getSchedules, createSchedule, deleteSchedule,
    createOceanBooking, getOceanBookings, trackOceanBooking, updateOceanStatus, updateBolOption
} from '../controllers/oceanController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Containers
router.route('/containers')
    .get(getContainerTypes)
    .post(protect, authorize('admin', 'manager'), createContainerType);
router.route('/containers/:id')
    .delete(protect, authorize('admin', 'manager'), deleteContainerType);

// Schedules
router.route('/schedules')
    .get(getSchedules)
    .post(protect, authorize('admin', 'manager'), createSchedule);
router.route('/schedules/:id')
    .delete(protect, authorize('admin', 'manager'), deleteSchedule);

// Bookings
router.route('/bookings')
    .post(protect, createOceanBooking)
    .get(protect, getOceanBookings);

// Track
router.route('/bookings/track/:bol')
    .get(trackOceanBooking);

// Status/Options Updates
router.route('/bookings/:id/status')
    .put(protect, authorize('admin', 'manager'), updateOceanStatus);

router.route('/bookings/:id/bol-option')
    .put(protect, updateBolOption);

export default router;
