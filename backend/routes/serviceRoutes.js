import express from 'express';
import Service from '../models/Service.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/services
// @desc    Get all active services for frontend
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({ isActive: true });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/services/admin
// @desc    Get all services (including inactive) for admin
router.get('/admin', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/services
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/services/:id
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/services/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
