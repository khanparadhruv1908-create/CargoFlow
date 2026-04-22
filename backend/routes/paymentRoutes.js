import express from 'express';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config/env.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const stripe = new Stripe(STRIPE_SECRET_KEY);

/**
 * @route   POST /api/payment/create-intent
 * @desc    Create a Stripe PaymentIntent for logistics services
 * @access  Private
 */
router.post('/create-intent', protect, async (req, res) => {
    try {
        const { amount, serviceType, metadata } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Valid amount is required" });
        }

        // Stripe expects amount in cents
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            metadata: {
                ...metadata,
                serviceType: serviceType || 'logistics_service',
                userId: req.user.id
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe Payment Error:", error.message);
        res.status(500).json({ message: error.message });
    }
});

export default router;
