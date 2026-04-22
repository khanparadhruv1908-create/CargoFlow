import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import { MONGO_URI } from './config/env.js';

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('--- MongoDB Connected ---');

        const email = 'admin@cargoflow.com';
        const pass = 'admin123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('FAIL: User not found in database.');
            process.exit(1);
        }

        console.log(`SUCCESS: User found. Email: ${user.email}, Role: ${user.role}`);
        console.log(`Stored Hashed Password: ${user.password}`);

        const isMatch = await user.matchPassword(pass);
        console.log(`Password Match Result: ${isMatch}`);

        if (isMatch) {
            console.log('--- LOGIN TEST PASSED ---');
        } else {
            console.log('--- LOGIN TEST FAILED: Password mismatch ---');
            
            // Re-hash and check
            const salt = await bcrypt.genSalt(10);
            const manualHash = await bcrypt.hash(pass, salt);
            console.log(`New Manual Hash for "admin123": ${manualHash}`);
            const checkAgain = await bcrypt.compare(pass, manualHash);
            console.log(`Self-check on manual hash: ${checkAgain}`);
        }

        process.exit();
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
        process.exit(1);
    }
};

testLogin();
