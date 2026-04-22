import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Airline from './models/Airline.js';
import { VesselSchedule, ContainerType } from './models/Ocean.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cargoflow';

const seedDropdowns = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for Dropdown Seeding...');

        // 1. Seed Airlines
        await Airline.deleteMany({});
        const airlines = [
            { name: 'Qatar Airways Cargo', pricePerKg: 12.5 },
            { name: 'Emirates SkyCargo', pricePerKg: 13.2 },
            { name: 'Air India Cargo', pricePerKg: 9.8 },
            { name: 'Blue Dart Express', pricePerKg: 18.2 },
            { name: 'Turkish Airlines', pricePerKg: 10.2 }
        ];
        await Airline.insertMany(airlines);
        console.log('✅ Airlines Seeded');

        // 2. Seed Vessel Routes
        await VesselSchedule.deleteMany({});
        const schedules = [
            { vesselName: 'Ever Given', originPort: 'Shanghai', destPort: 'Rotterdam', transitDays: 22 },
            { vesselName: 'Maersk Mc-Kinney', originPort: 'Singapore', destPort: 'Hamburg', transitDays: 18 },
            { vesselName: 'MSC Oscar', originPort: 'Mumbai', destPort: 'Dubai', transitDays: 4 },
            { vesselName: 'Pacific Star', originPort: 'Kolkata', destPort: 'Singapore', transitDays: 7 },
        ];
        await VesselSchedule.insertMany(schedules);
        console.log('✅ Vessel Routes Seeded');

        // 3. Seed Container Types
        await ContainerType.deleteMany({});
        const containers = [
            { name: '20ft Standard Dry', price: 1200 },
            { name: '40ft Standard Dry', price: 1800 },
            { name: '40ft High Cube HC', price: 2100 },
            { name: '20ft Refrigerated', price: 3200 }
        ];
        await ContainerType.insertMany(containers);
        console.log('✅ Container Types Seeded');

        console.log('\n🌟 ALL DROPDOWN DATA SEEDED SUCCESSFULLY! 🌟');
        process.exit();
    } catch (error) {
        console.error(`❌ Dropdown Seeding Error: ${error.message}`);
        process.exit(1);
    }
};

seedDropdowns();
