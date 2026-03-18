import mongoose from 'mongoose';
import WarehouseLocation from './models/WarehouseLocation.js';
import { MONGO_URI } from './config/env.js';

const seedWarehouses = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for warehouse seeding...');

        // Clear existing
        await WarehouseLocation.deleteMany({});

        const warehouses = [
            {
                name: 'Dubai Logistics City Hub',
                address: 'Logistics District, Dubai South, UAE',
                baseRatePerDay: 25,
                ratePerKgPerDay: 0.05,
                totalUnits: 500,
                occupiedUnits: 342,
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
                features: ['Temperature Controlled', 'Free Zone', '24/7 Security', 'Real-time Tracking']
            },
            {
                name: 'Singapore Changi Gateway',
                address: '10 Changi South Lane, Singapore',
                baseRatePerDay: 35,
                ratePerKgPerDay: 0.08,
                totalUnits: 300,
                occupiedUnits: 120,
                image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800',
                features: ['Automated Sorting', 'Bonded Warehouse', 'Dangerous Goods Handling']
            },
            {
                name: 'Toronto North Distribution',
                address: 'Brampton, ON, Canada',
                baseRatePerDay: 20,
                ratePerKgPerDay: 0.04,
                totalUnits: 1000,
                occupiedUnits: 850,
                image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=800',
                features: ['Cross-Docking', 'Ecommerce Fulfillment', 'Last-Mile Delivery']
            },
            {
                name: 'Mumbai Central Cargo Park',
                address: 'Bhiwandi, Maharashtra, India',
                baseRatePerDay: 15,
                ratePerKgPerDay: 0.03,
                totalUnits: 800,
                occupiedUnits: 200,
                image: 'https://images.unsplash.com/photo-1487602350387-15377e68d41a?auto=format&fit=crop&q=80&w=800',
                features: ['Scalable Space', 'Heavy Machinery Storage', 'CCTV Monitoring']
            }
        ];

        await WarehouseLocation.insertMany(warehouses);
        console.log('Warehouse Locations Seeded');

        console.log('Warehouse Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedWarehouses();
