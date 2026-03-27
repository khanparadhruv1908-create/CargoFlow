import api from './api';

export const adminApi = {
    // Key Metrics (Derived or placeholder for now)
    getMetrics: async () => {
        let shipments = [];
        let users = [];
        let invoices = [];

        try { shipments = await api.get('/shipments') || []; } catch (e) { console.error("Metrics: shipments failed", e); }
        try { users = await api.get('/auth') || []; } catch (e) { console.error("Metrics: auth failed", e); }
        try { invoices = await api.get('/invoices') || []; } catch (e) { console.error("Metrics: invoices failed", e); }

        return {
            totalShipments: Array.isArray(shipments) ? shipments.length : 0,
            activeDeliveries: Array.isArray(shipments) ? shipments.filter(s => s.status === 'In Transit').length : 0,
            revenueSummary: Array.isArray(invoices) ? invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0) : 0,
            newUsers: Array.isArray(users) ? users.length : 0,
        };
    },

    // Chart Data (Mocking for now as backend doesn't have trend logic yet)
    getRevenueTrends: async () => {
        return [
            { name: 'Jan', revenue: 4000, shipments: 240 },
            { name: 'Feb', revenue: 3000, shipments: 139 },
            { name: 'Mar', revenue: 2000, shipments: 980 },
            { name: 'Apr', revenue: 2780, shipments: 390 },
            { name: 'May', revenue: 1890, shipments: 480 },
            { name: 'Jun', revenue: 2390, shipments: 380 },
            { name: 'Jul', revenue: 3490, shipments: 430 },
        ];
    },

    // Users
    getUsers: () => api.get('/auth'),

    // Shipments
    getAllShipments: () => api.get('/shipments'),

    // Billing
    getInvoices: () => api.get('/invoices'),
};
