import { createClerkClient, verifyToken } from '@clerk/backend';
import { CLERK_SECRET_KEY, JWT_SECRET } from '../config/env.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

// Unified protect that handles both Clerk (frontend) and Local JWT (admin)
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        
        // 1. TRY LOCAL JWT FIRST (Fastest for Admin)
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
                return next(); // SUCCESS
            }
        } catch (jwtErr) {
            // Not a valid local JWT, continue to Clerk
        }

        // 2. TRY CLERK
        if (!CLERK_SECRET_KEY) {
            console.warn('CRITICAL: CLERK_SECRET_KEY is missing in backend env. Clerk verification skipped.');
        } else {
            try {
                // In @clerk/backend v3, verifyToken is an independent function
                const decodedClerk = await verifyToken(token, {
                    secretKey: CLERK_SECRET_KEY
                });
                
                if (decodedClerk) {
                    req.user = {
                        id: decodedClerk.sub,
                        clerkId: decodedClerk.sub,
                        role: (decodedClerk.metadata ? decodedClerk.metadata.role : 'user') || 'user'
                    };
                    return next(); // SUCCESS
                }
            } catch (clerkErr) {
                console.error('Clerk Verification Error:', clerkErr.message);
            }
        }

        // 3. IF BOTH FAIL
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            return next(new Error(`Role ${req.user?.role || 'none'} is not authorized to access this route`));
        }
        next();
    };
};
