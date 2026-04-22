import express from 'express';
import { getAirlines, createAirline, deleteAirline } from '../controllers/airlineController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getAirlines)
    .post(protect, authorize('admin', 'manager'), createAirline);

router.route('/:id')
    .delete(protect, authorize('admin', 'manager'), deleteAirline);

export default router;
