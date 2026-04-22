import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cargoflow';

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        
        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@cargoflow.com' });
        
        if (adminExists) {
            console.log('Admin user already exists.');
        } else {
            await User.create({
                name: 'System Administrator',
                email: 'admin@cargoflow.com',
                password: 'admin123', // Will be hashed by pre-save hook
                role: 'admin'
            });
            console.log('Admin user created successfully!');
            console.log('Email: admin@cargoflow.com');
            console.log('Password: admin123');
        }
        
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
