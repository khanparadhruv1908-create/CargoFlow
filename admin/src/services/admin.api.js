import api from './api';

export const adminApi = {
    // Key Metrics (Derived or placeholder for now)
    getMetrics: async () => {
        const shipments = await api.get('/shipments');
        const users = await api.get('/auth');
        const invoices = await api.get('/invoices');

        return {
            totalShipments: shipments.length,
            activeDeliveries: shipments.filter(s => s.status === 'In Transit').length,
            revenueSummary: invoices.reduce((acc, inv) => acc + inv.totalAmount, 0),
            newUsers: users.length,
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
