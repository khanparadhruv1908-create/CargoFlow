import { createClerkClient, verifyToken } from '@clerk/backend';
import { CLERK_SECRET_KEY, JWT_SECRET } from '../config/env.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Unified protection middleware that supports:
 * 1. Admin/Local users via custom JWT
 * 2. Customer users via Clerk
 */
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        
        // 1. TRY LOCAL JWT FIRST (Used by Admin Panel)
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                // IMPORTANT: Standardize req.user format
                req.user = user;
                req.user._id = user._id; // Ensure Mongoose ID is available
                return next(); 
            }
        } catch (jwtErr) {
            // Not a local token, continue to check Clerk
        }

        // 2. TRY CLERK (Used by Frontend)
        if (CLERK_SECRET_KEY) {
            try {
                const decodedClerk = await verifyToken(token, {
                    secretKey: CLERK_SECRET_KEY
                });
                
                if (decodedClerk) {
                    // Clerk users might not be in our MongoDB 'User' collection yet.
                    // We either find them or create a mock object for compatibility.
                    // To keep it clean, we'll try to find by clerkId or standardize the object.
                    
                    const dbUser = await User.findOne({ clerkId: decodedClerk.sub });

                    req.user = dbUser || {
                        _id: decodedClerk.sub, // Use sub as ID if not in DB
                        id: decodedClerk.sub,
                        name: decodedClerk.name || 'Clerk User',
                        email: decodedClerk.email,
                        role: (decodedClerk.metadata ? decodedClerk.metadata.role : 'user') || 'user',
                        isClerkUser: true
                    };
                    return next();
                }
            } catch (clerkErr) {
                console.error('Clerk Auth Error:', clerkErr.message);
            }
        }

        return res.status(401).json({ success: false, message: 'Authorization failed' });
    }

    return res.status(401).json({ success: false, message: 'No token provided' });
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Forbidden: Access denied for role ${req.user?.role || 'anonymous'}` 
            });
        }
        next();
    };
};
