import express from 'express';
import {
    getCustomsPorts, createCustomsPort, deleteCustomsPort,
    calculateCustoms, createDeclaration, getDeclarations, updateDeclarationStatus
} from '../controllers/customsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Port Management
router.route('/ports')
    .get(getCustomsPorts)
    .post(protect, authorize('admin', 'manager'), createCustomsPort);
router.route('/ports/:id')
    .delete(protect, authorize('admin', 'manager'), deleteCustomsPort);

// Declarations & Logic
router.route('/calculate')
    .post(calculateCustoms);

router.route('/declarations')
    .post(protect, createDeclaration)
    .get(protect, authorize('admin', 'manager'), getDeclarations);

router.route('/declarations/:id/status')
    .put(protect, authorize('admin', 'manager'), updateDeclarationStatus);

export default router;
