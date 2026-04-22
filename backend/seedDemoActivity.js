import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AirBooking from './models/AirBooking.js';
import { OceanBooking, VesselSchedule, ContainerType } from './models/Ocean.js';
import Shipment from './models/Shipment.js';
import Invoice from './models/Invoice.js';
import Airline from './models/Airline.js';
import Tracking from './models/Tracking.js';
import fs from 'fs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cargoflow';

const seedDemoActivity = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for Demo Activity Seeding...');

        // 1. CLEAR DYNAMIC DATA (Bookings, Invoices, Shipments)
        await AirBooking.deleteMany({});
        await OceanBooking.deleteMany({});
        try { await Shipment.collection.dropIndexes(); } catch (e) { console.log("Indexes already clean on Shipment"); }
        await Shipment.deleteMany({});
        await Invoice.deleteMany({});
        try { await Tracking.collection.drop(); } catch (e) { console.log("Tracking collection not yet present."); }
        await Tracking.deleteMany({});

        const userClerkId = 'user_demo_123';

        // 2. GET MASTER REFERENCES
        const airline = await Airline.findOne({ name: 'Emirates SkyCargo' });
        const schedule = await VesselSchedule.findOne({ originPort: 'Mumbai (BOM)' });
        const container = await ContainerType.findOne({ name: '20ft Standard' });

        if (!airline || !schedule || !container) {
            console.error('Master data missing. Please run seedMaster.js first.');
            process.exit(1);
        }

        // 3. CREATE AIR BOOKINGS
        const airBooking = await AirBooking.create({
            origin: 'Mumbai (BOM)',
            destination: 'Dubai (DXB)',
            airline: airline._id,
            weight: 450,
            cargoType: 'Perishable',
            totalCharges: 5625,
            shipmentDate: new Date(),
            eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            status: 'In Transit',
            customer: userClerkId
        });
        console.log('Created Air Booking:', airBooking.awbNumber);

        // 4. CREATE OCEAN BOOKINGS
        const oceanBooking = await OceanBooking.create({
            schedule: schedule._id,
            containerType: container._id,
            weight: 12000,
            loadDate: new Date(),
            departureDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            eta: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            totalCharges: 3250,
            vesselStatus: 'In Transit',
            customer: userClerkId
        });
        console.log('Created Ocean Booking:', oceanBooking.bolNumber);

        // 5. CREATE SHIPMENTS (linked to standard freight flow)
        const shipment1 = await Shipment.create({
            shipmentId: 'SHIP-DXB-9921',
            origin: 'Toronto (YYZ)',
            destination: 'Dubai (DXB)',
            cargoType: 'General Cargo',
            weight: 850,
            status: 'In Transit',
            assignedDriver: 'John Doe',
            eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            customer: userClerkId
        });
        
        const shipment2 = await Shipment.create({
            shipmentId: 'SHIP-BOM-1022',
            origin: 'Frankfurt (FRA)',
            destination: 'Mumbai (BOM)',
            cargoType: 'Cold Storage',
            weight: 1200,
            status: 'Delivered',
            assignedDriver: 'Sam Smith',
            eta: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            customer: userClerkId
        });
        console.log('Created Demo Shipments.');

        // 6. CREATE TRACKING DATA for shipment1
        await Tracking.create([
            { shipmentId: shipment1.shipmentId, lat: 43.6532, lng: -79.3832, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            { shipmentId: shipment1.shipmentId, lat: 35.2271, lng: -80.8431, timestamp: new Date() }
        ]);
        console.log('Created Tracking History.');

        // 7. CREATE INVOICES
        await Invoice.create([
            { 
                invoiceId: 'INV-88210', 
                customer: userClerkId, 
                serviceType: 'Air Freight', 
                bookingId: airBooking.awbNumber, 
                amount: 5200, 
                tax: 260, 
                totalAmount: 5460, 
                status: 'Paid' 
            },
            { 
                invoiceId: 'INV-88211', 
                customer: userClerkId, 
                serviceType: 'Ocean Freight', 
                bookingId: oceanBooking.bolNumber, 
                amount: 3250, 
                tax: 162.5, 
                totalAmount: 3412.5, 
                status: 'Unpaid' 
            }
        ]);
        console.log('Created Demo Invoices.');

        console.log('DEMO ACTIVITY SEEDING COMPLETED!');
        process.exit();
    } catch (error) {
        console.error('Error seeding demo activity:', error);
        fs.writeFileSync('error.log', error.stack || String(error));
        process.exit(1);
    }
};

seedDemoActivity();
