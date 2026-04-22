import mongoose from 'mongoose';
import Service from './models/Service.js';
import { MONGO_URI } from './config/env.js';

const seedServices = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for service seeding...');

        // Clear existing
        await Service.deleteMany({});

        const services = [
            {
                id: "air-freight",
                title: "Air Freight",
                description: "Rapid global delivery for time-critical cargo. Leverage our extensive network of top-tier airline partners for the fastest transit times.",
                icon: "Plane",
                features: ['Next-Flight-Out delivery', 'Consolidated airfreight', 'Temperature-controlled cargo']
            },
            {
                id: "ocean-freight",
                title: "Ocean Freight",
                description: "Cost-effective logistics for heavy, bulky, and long-lead-time cargo. Comprehensive LCL and FCL solutions worldwide.",
                icon: "Ship",
                features: ['Full Container Load (FCL)', 'Less than Container Load (LCL)', 'Project Cargo']
            },
            {
                id: "customs-brokerage",
                title: "Customs Brokerage",
                description: "Seamless international trade compliance. Ensure your cargo passes borders rapidly without delays.",
                icon: "FileText",
                features: ['Tariff classification', 'Duty and tax calculation', 'Regulatory compliance']
            },
            {
                id: "warehousing",
                title: "Warehousing & Storage",
                description: "Secure, modern storage facilities designed for operational efficiency. Short-term and long-term storage options.",
                icon: "Warehouse",
                features: ['Inventory management system', 'Cross-docking', '24/7 security']
            }
        ];

        await Service.insertMany(services);
        console.log('Services Seeded');

        console.log('Service Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedServices();
