import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/admin.api';

export const useAdminMetrics = () => {
    return useQuery({
        queryKey: ['admin_metrics'],
        queryFn: adminApi.getMetrics,
    });
};

export const useAdminTrends = () => {
    return useQuery({
        queryKey: ['admin_trends'],
        queryFn: adminApi.getRevenueTrends,
    });
};

export const useAdminUsers = () => {
    return useQuery({
        queryKey: ['admin_users'],
        queryFn: adminApi.getUsers,
    });
};

export const useAdminShipments = () => {
    return useQuery({
        queryKey: ['admin_shipments_all'],
        queryFn: adminApi.getAllShipments,
    });
};

export const useAdminInvoices = () => {
    return useQuery({
        queryKey: ['admin_invoices'],
        queryFn: adminApi.getInvoices,
    });
};
