import mongoose from 'mongoose';
import Airline from './models/Airline.js';
import { MONGO_URI } from './config/env.js';

const seedAirlines = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for airline seeding...');

        // Clear existing
        await Airline.deleteMany({});

        // Add requested airlines
        const airlines = [
            { name: 'Qatar Airways', pricePerKg: 12.5 },
            { name: 'Emirates', pricePerKg: 13.2 },
            { name: 'British Airways', pricePerKg: 11.8 },
            { name: 'Turkish Airlines', pricePerKg: 10.5 },
            { name: 'Delta Air Lines', pricePerKg: 14.0 }
        ];

        await Airline.insertMany(airlines);
        console.log('Airlines Seeded');

        console.log('Airline Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAirlines();
