import express from 'express';
import { getTrackingInfo } from '../controllers/shipmentController.js';

const router = express.Router();

/**
 * @route   GET /api/track/:shipmentId
 * @desc    Dedicated, simple endpoint for tracking searches
 * @access  Public
 */
router.get('/:shipmentId', getTrackingInfo);

export default router;
