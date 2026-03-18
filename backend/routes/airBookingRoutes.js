import express from 'express';
import { createAirBooking, getAirBookings, trackAirBooking, updateBookingStatus } from '../controllers/airBookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createAirBooking)
    .get(protect, authorize('admin', 'manager'), getAirBookings);

router.route('/track/:awbNumber')
    .get(trackAirBooking);

router.route('/:id/status')
    .put(protect, authorize('admin', 'manager'), updateBookingStatus);

export default router;
