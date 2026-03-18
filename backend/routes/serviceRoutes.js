import express from 'express';

const router = express.Router();

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

// @route   GET /api/services
// @desc    Get all active services
// @access  Public
router.get('/', (req, res) => {
    res.json(services);
});

export default router;
