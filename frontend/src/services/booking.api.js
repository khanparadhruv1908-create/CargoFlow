import api from './api';

export const bookingApi = {
    getAirBookings: () => api.get('/air-bookings'),
    getOceanBookings: () => api.get('/ocean/bookings'),
    getShipments: () => api.get('/shipments'),
    getWarehouseBookings: () => api.get('/warehouse/bookings'),
    getCustomsDeclarations: () => api.get('/customs/declarations'),
};
