import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../services/booking.api';

export const useAllBookings = () => {
    const { data: airBookings = [], isLoading: loadingAir } = useQuery({
        queryKey: ['air-bookings'],
        queryFn: bookingApi.getAirBookings,
    });

    const { data: oceanBookings = [], isLoading: loadingOcean } = useQuery({
        queryKey: ['ocean-bookings'],
        queryFn: bookingApi.getOceanBookings,
    });

    const { data: shipments = [], isLoading: loadingShipments } = useQuery({
        queryKey: ['shipments'],
        queryFn: bookingApi.getShipments,
    });

    const { data: warehouseBookings = [], isLoading: loadingWarehouse } = useQuery({
        queryKey: ['warehouse-bookings'],
        queryFn: bookingApi.getWarehouseBookings,
    });

    const { data: customsDeclarations = [], isLoading: loadingCustoms } = useQuery({
        queryKey: ['customs-declarations'],
        queryFn: bookingApi.getCustomsDeclarations,
    });

    // Combine all and format for a unified table
    const allBookings = [
        ...airBookings.map(b => ({ ...b, type: 'Air Freight', displayId: b.awbNumber, displayTitle: `${b.origin} → ${b.destination}` })),
        ...oceanBookings.map(b => ({ ...b, type: 'Ocean Freight', displayId: b.bolNumber, displayTitle: `${b.schedule?.originPort} → ${b.schedule?.destPort}` })),
        ...shipments.map(b => ({ ...b, type: 'Shipment', displayId: b.shipmentId, displayTitle: `${b.origin} → ${b.destination}` })),
        ...warehouseBookings.map(b => ({ ...b, type: 'Warehouse', displayId: b.bookingNumber, displayTitle: `Storage at ${b.location?.name}` })),
        ...customsDeclarations.map(b => ({ ...b, type: 'Customs', displayId: b.declarationNumber, displayTitle: `Declaration at ${b.port?.name}` })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
        allBookings,
        isLoading: loadingAir || loadingOcean || loadingShipments || loadingWarehouse || loadingCustoms
    };
};
