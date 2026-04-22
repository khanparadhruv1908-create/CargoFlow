import express from 'express';
import { createInvoice, getInvoices } from '../controllers/billingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin', 'manager'), getInvoices)
    .post(protect, authorize('admin', 'manager'), createInvoice);

export default router;
