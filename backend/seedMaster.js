import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Airline from './models/Airline.js';
import CustomsPort from './models/CustomsPort.js';
import WarehouseLocation from './models/WarehouseLocation.js';
import { ContainerType, VesselSchedule } from './models/Ocean.js';
import Service from './models/Service.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cargoflow';

const seedMaster = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for Master Seeding...');

        // 1. CLEAR EXISTING DATA
        await Airline.deleteMany({});
        await CustomsPort.deleteMany({});
        await WarehouseLocation.deleteMany({});
        await ContainerType.deleteMany({});
        await VesselSchedule.deleteMany({});
        await Service.deleteMany({});

        console.log('Cleared existing master data.');

        // 2. SEED AIRLINES
        const airlines = await Airline.insertMany([
            { name: 'Emirates SkyCargo', pricePerKg: 12.5 },
            { name: 'Qatar Airways Cargo', pricePerKg: 11.8 },
            { name: 'Lufthansa Cargo', pricePerKg: 10.5 },
            { name: 'Cargolux', pricePerKg: 9.2 }
        ]);
        console.log('Seeded Airlines.');

        // 3. SEED CUSTOMS PORTS (HUBS)
        const hubs = await CustomsPort.insertMany([
            { name: 'Dubai (DXB)', type: 'Airport', baseCharge: 250, dutyPercentage: 5, weightSlabs: [{ minWeight: 0, ratePerKg: 0.5 }] },
            { name: 'Mumbai (BOM)', type: 'Airport', baseCharge: 180, dutyPercentage: 10, weightSlabs: [{ minWeight: 0, ratePerKg: 0.3 }] },
            { name: 'Toronto (YYZ)', type: 'Airport', baseCharge: 320, dutyPercentage: 8, weightSlabs: [{ minWeight: 0, ratePerKg: 0.8 }] },
            { name: 'Frankfurt (FRA)', type: 'Airport', baseCharge: 290, dutyPercentage: 7, weightSlabs: [{ minWeight: 0, ratePerKg: 0.6 }] }
        ]);
        console.log('Seeded Customs Hubs.');

        // 4. SEED WAREHOUSE LOCATIONS
        const warehouses = await WarehouseLocation.insertMany([
            { 
                name: 'DXB Cold Storage Terminal', 
                address: 'Logistics City, Dubai World Central', 
                baseRatePerDay: 50, 
                ratePerKgPerDay: 0.1, 
                features: ['Cold Storage', '24/7 Monitoring', 'Pharma Grade'] 
            },
            { 
                name: 'BOM General Warehouse', 
                address: 'Near Chhatrapati Shivaji Airport, Mumbai', 
                baseRatePerDay: 20, 
                ratePerKgPerDay: 0.05, 
                features: ['General Storage', 'CCTV', 'Secure Loading'] 
            },
            { 
                name: 'YYZ Hazardous Materials Hub', 
                address: 'Derry Rd E, Mississauga, ON', 
                baseRatePerDay: 80, 
                ratePerKgPerDay: 0.2, 
                features: ['Hazardous Storage', 'Fire Suppressant', 'EPA Compliant'] 
            }
        ]);
        console.log('Seeded Warehouses.');

        // 5. SEED CONTAINER TYPES
        const containers = await ContainerType.insertMany([
            { name: '20ft Standard', price: 1200 },
            { name: '40ft Standard', price: 2100 },
            { name: '40ft High Cube', price: 2450 },
            { name: '20ft Reefer', price: 3200 }
        ]);
        console.log('Seeded Container Types.');

        // 6. SEED VESSEL SCHEDULES
        await VesselSchedule.insertMany([
            { vesselName: 'CMA CGM Marco Polo', originPort: 'Mumbai (BOM)', destPort: 'Dubai (DXB)', transitDays: 5 },
            { vesselName: 'Maersk Mc-Kinney Moller', originPort: 'Dubai (DXB)', destPort: 'Toronto (YYZ)', transitDays: 22 },
            { vesselName: 'MSC Oscar', originPort: 'Frankfurt (FRA)', destPort: 'Mumbai (BOM)', transitDays: 14 }
        ]);
        console.log('Seeded Vessel Schedules.');

        // 7. SEED CORE SERVICES (FOR HOME PAGE)
        await Service.insertMany([
            { id: 'air-freight', title: 'Air Freight', description: 'Priority global air cargo solutions', icon: 'Plane', isActive: true },
            { id: 'ocean-freight', title: 'Ocean Freight', description: 'Full container & LCL ocean shipping', icon: 'Ship', isActive: true },
            { id: 'warehouse-storage', title: 'Warehouse Storage', description: 'Secure storage & distribution', icon: 'Warehouse', isActive: true },
            { id: 'customs-brokerage', title: 'Customs Brokerage', description: 'Expert customs brokerage & clearance', icon: 'ClipboardCheck', isActive: true }
        ]);
        console.log('Seeded Core Services.');

        console.log('MASTER SEEDING COMPLETED SUCCESSFULLY!');
        process.exit();
    } catch (error) {
        console.error('Error seeding master data:', error);
        process.exit(1);
    }
};

seedMaster();
