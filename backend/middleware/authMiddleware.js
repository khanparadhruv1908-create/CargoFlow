import { createClerkClient } from '@clerk/backend';
import { CLERK_SECRET_KEY } from '../config/env.js';

const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

export const protect = async (req, res, next) => {
    // DEVELOPMENT MOCK AUTH: If key is the placeholder, use a dummy user
    if (CLERK_SECRET_KEY === 'sk_test_1X8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q') {
        console.warn('WARNING: Using Mock Auth because CLERK_SECRET_KEY is a placeholder.');
        req.user = {
            id: 'user_mock_123',
            clerkId: 'user_mock_123',
            role: 'admin'
        };
        return next();
    }

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Verify the token with Clerk
            const decoded = await clerkClient.verifyToken(token);
            
            if (!decoded) {
                console.error('Clerk Auth: No decoded token returned');
                res.status(401);
                return next(new Error('Not authorized, token failed'));
            }

            req.user = {
                id: decoded.sub,
                clerkId: decoded.sub,
                role: decoded.metadata?.role || 'user'
            };

            return next();
        } catch (error) {
            console.error('Clerk Auth Error Details:', error.message);
            res.status(401);
            return next(new Error('Not authorized, token failed'));
        }
    }

    if (!token) {
        res.status(401);
        return next(new Error('Not authorized, no token'));
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            return next(new Error(`Role ${req.user.role} is not authorized to access this route`));
        }
        next();
    };
};
