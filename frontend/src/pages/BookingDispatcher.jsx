import { useSearchParams, Navigate } from 'react-router-dom';
import FlightBooking from './FlightBooking';
import OceanBooking from './OceanBooking';
import CustomsBrokerage from './CustomsBrokerage';
import WarehouseStorage from './WarehouseStorage';

export default function BookingDispatcher() {
    const [searchParams] = useSearchParams();
    const service = searchParams.get('service');

    if (service === 'air-freight') {
        return <FlightBooking />;
    }

    if (service === 'ocean-freight') {
        return <OceanBooking />;
    }

    if (service === 'customs-brokerage') {
        return <CustomsBrokerage />;
    }

    if (service === 'warehousing-storage') {
        return <WarehouseStorage />;
    }

    // Default fallback to services page
    return <Navigate to="/services" replace />;
}
