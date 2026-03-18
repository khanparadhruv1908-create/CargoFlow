// Mocked API service to simulate REST endpoints for the module demonstration.
// In a real application, replace these with actual fetch/axios calls to your backend.

const mockShipments = [
    {
        id: 'SHIP-1001',
        origin: 'New York, NY',
        originLat: 40.7128,
        originLng: -74.0060,
        destination: 'Los Angeles, CA',
        destLat: 34.0522,
        destLng: -118.2437,
        cargoType: 'Electronics',
        weight: 1250,
        status: 'In Transit',
        assignedDriver: 'John Doe',
        eta: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'SHIP-1002',
        origin: 'Chicago, IL',
        originLat: 41.8781,
        originLng: -87.6298,
        destination: 'Miami, FL',
        destLat: 25.7617,
        destLng: -80.1918,
        cargoType: 'Perishables',
        weight: 850,
        status: 'Pending',
        assignedDriver: 'Jane Smith',
        eta: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
    },
    {
        id: 'SHIP-1003',
        origin: 'Seattle, WA',
        originLat: 47.6062,
        originLng: -122.3321,
        destination: 'Austin, TX',
        destLat: 30.2672,
        destLng: -97.7431,
        cargoType: 'Machinery',
        weight: 4200,
        status: 'Delivered',
        assignedDriver: 'Mike Johnson',
        eta: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    }
];

// Provide initial cache
if (!localStorage.getItem('cargoFlow_shipments')) {
    localStorage.setItem('cargoFlow_shipments', JSON.stringify(mockShipments));
}

const getStoredShipments = () => JSON.parse(localStorage.getItem('cargoFlow_shipments'));
const setStoredShipments = (data) => localStorage.setItem('cargoFlow_shipments', JSON.stringify(data));

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const shipmentsApi = {
    // GET /shipments
    getAll: async () => {
        await delay(600);
        return getStoredShipments();
    },

    // POST /shipments
    create: async (data) => {
        await delay(600);
        const shipments = getStoredShipments();
        const newShipment = {
            ...data,
            id: `SHIP-${1000 + shipments.length + 1}`,
            createdAt: new Date().toISOString(),
            // Adding dummy lat/lng for map integration if not provided
            originLat: 39.8283 + (Math.random() - 0.5) * 10,
            originLng: -98.5795 + (Math.random() - 0.5) * 20,
            destLat: 39.8283 + (Math.random() - 0.5) * 10,
            destLng: -98.5795 + (Math.random() - 0.5) * 20,
        };
        shipments.unshift(newShipment);
        setStoredShipments(shipments);
        return newShipment;
    },

    // PUT /shipments/:id
    update: async (id, data) => {
        await delay(600);
        const shipments = getStoredShipments();
        const index = shipments.findIndex((s) => s.id === id);
        if (index === -1) throw new Error('Shipment not found');

        shipments[index] = { ...shipments[index], ...data };
        setStoredShipments(shipments);
        return shipments[index];
    },

    // DELETE /shipments/:id
    delete: async (id) => {
        await delay(600);
        let shipments = getStoredShipments();
        shipments = shipments.filter((s) => s.id !== id);
        setStoredShipments(shipments);
        return true;
    }
};
