import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Airline from './models/Airline.js';
import { VesselSchedule, ContainerType } from './models/Ocean.js';
import Shipment from './models/Shipment.js';
import Warehouse from './models/Warehouse.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cargoflow';

const seedAll = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for Master Seeding...');

        // 1. Seed Airlines
        await Airline.deleteMany({});
        const airlines = [
            { name: 'Qatar Airways Cargo', pricePerKg: 12.5 },
            { name: 'Emirates SkyCargo', pricePerKg: 13.2 },
            { name: 'Lufthansa Cargo', pricePerKg: 11.8 },
            { name: 'Cathay Pacific Cargo', pricePerKg: 10.5 },
            { name: 'Turkish Airlines', pricePerKg: 10.2 }
        ];
        await Airline.insertMany(airlines);
        console.log('✅ Airlines Seeded');

        // 2. Seed Ocean Data
        await VesselSchedule.deleteMany({});
        await ContainerType.deleteMany({});
        const schedules = [
            { vesselName: 'Ever Given', originPort: 'Shanghai', destPort: 'Rotterdam', transitDays: 22 },
            { vesselName: 'Maersk Mc-Kinney', originPort: 'Singapore', destPort: 'Hamburg', transitDays: 18 },
            { vesselName: 'MSC Oscar', originPort: 'Mumbai', destPort: 'Dubai', transitDays: 4 },
        ];
        await VesselSchedule.insertMany(schedules);
        const containers = [
            { name: '20ft Standard Dry', price: 1200 },
            { name: '40ft Standard Dry', price: 1800 },
            { name: '40ft High Cube', price: 2100 },
            { name: '20ft Reefer', price: 3200 }
        ];
        await ContainerType.insertMany(containers);
        console.log('✅ Ocean Data Seeded');

        // 3. Seed Warehouses
        await Warehouse.deleteMany({});
        const warehouses = [
            { 
                name: 'Dubai Jebel Ali Hub', 
                location: { lat: 24.99, lng: 55.07, address: 'Zone 1, Jebel Ali Free Zone' }, 
                capacity: 50000 
            },
            { 
                name: 'Singapore North Star', 
                location: { lat: 1.35, lng: 103.82, address: '88 Jurong Island Rd' }, 
                capacity: 80000 
            }
        ];
        const createdWarehouses = await Warehouse.insertMany(warehouses);
        console.log('✅ Warehouses Seeded');

        // 4. Seed Sample Shipments
        await Shipment.deleteMany({});
        const shipments = [
            {
                shipmentId: 'SHIP-GLOBAL123',
                origin: 'London',
                destination: 'New York',
                cargoType: 'Electronics',
                weight: 450,
                status: 'In Transit',
                eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                warehouse: createdWarehouses[0]._id
            },
            {
                shipmentId: 'SHIP-IND-UAE-44',
                origin: 'Mumbai',
                destination: 'Dubai',
                cargoType: 'Textiles',
                weight: 12000,
                status: 'In Transit',
                eta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                warehouse: createdWarehouses[0]._id
            }
        ];
        await Shipment.insertMany(shipments);
        console.log('✅ Sample Shipments Seeded');

        console.log('\n🌟 ALL DATA SEEDED SUCCESSFULLY! 🌟');
        process.exit();
    } catch (error) {
        console.error(`❌ Seeding Error: ${error.message}`);
        process.exit(1);
    }
};

seedAll();
