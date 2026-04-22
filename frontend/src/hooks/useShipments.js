import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shipmentApi } from '../services/shipment.api';

export const useShipments = () => {
    const queryClient = useQueryClient();

    // GET /shipments
    const { data: shipments = [], isLoading, isError, error } = useQuery({
        queryKey: ['shipments'],
        queryFn: shipmentApi.getAll,
    });

    // POST /shipments
    const createMutation = useMutation({
        mutationFn: shipmentApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shipments'] });
        },
    });

    // PUT /shipments/:id
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => shipmentApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shipments'] });
        },
    });

    // DELETE /shipments/:id
    const deleteMutation = useMutation({
        mutationFn: shipmentApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shipments'] });
        },
    });

    return {
        shipments,
        isLoading,
        isError,
        error,
        createShipment: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateShipment: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteShipment: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};
