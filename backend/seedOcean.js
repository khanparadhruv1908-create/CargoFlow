import mongoose from 'mongoose';
import { VesselSchedule, ContainerType } from './models/Ocean.js';
import { MONGO_URI } from './config/env.js';

const seedOceanData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing
        await VesselSchedule.deleteMany({});
        await ContainerType.deleteMany({});

        // Add requested routes
        const schedules = [
            {
                vesselName: 'Mumbai Express',
                originPort: 'Mumbai',
                destPort: 'Dubai',
                transitDays: 4
            },
            {
                vesselName: 'Pacific Voyager',
                originPort: 'Singapore',
                destPort: 'New York',
                transitDays: 25
            },
            {
                vesselName: 'Maple Carrier',
                originPort: 'Sydney',
                destPort: 'Canada',
                transitDays: 35
            }
        ];

        await VesselSchedule.insertMany(schedules);
        console.log('Vessel Schedules Seeded');

        // Add some default container types if empty
        const containers = [
            { name: '20ft Standard', price: 1200 },
            { name: '40ft Standard', price: 1800 },
            { name: '40ft High Cube', price: 2100 },
            { name: '20ft Reefer', price: 2800 }
        ];

        await ContainerType.insertMany(containers);
        console.log('Container Types Seeded');

        console.log('Ocean Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedOceanData();
