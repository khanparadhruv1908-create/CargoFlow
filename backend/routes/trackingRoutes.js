import express from 'express';
import { updateTracking, getTrackingHistory } from '../controllers/trackingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/update', protect, authorize('admin', 'dispatcher'), updateTracking);
router.get('/:shipmentId', protect, getTrackingHistory);

export default router;
