import { useEffect, useState } from 'react';
import socket from '../services/socket';

export const useTracking = (shipmentId) => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (!shipmentId) return;

        socket.connect();
        socket.emit('join_shipment', shipmentId);

        const handleUpdate = (data) => {
            if (data.shipmentId === shipmentId) {
                setLocation({ lat: data.lat, lng: data.lng });
            }
        };

        socket.on('tracking_update', handleUpdate);

        return () => {
            socket.off('tracking_update', handleUpdate);
            socket.disconnect();
        };
    }, [shipmentId]);

    return location;
};
