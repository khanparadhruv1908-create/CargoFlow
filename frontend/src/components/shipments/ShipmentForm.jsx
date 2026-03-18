import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const shipmentSchema = z.object({
    origin: z.string().min(2, 'Origin is required'),
    destination: z.string().min(2, 'Destination is required'),
    cargoType: z.string().min(2, 'Cargo type is required'),
    weight: z.preprocess((a) => parseInt(a, 10), z.number().positive('Weight must be positive')),
    status: z.enum(['Pending', 'In Transit', 'Delivered', 'Delayed']),
    assignedDriver: z.string().min(2, 'Driver is required'),
    eta: z.string().min(1, 'ETA is required'),
});

const STATUS_OPTIONS = ['Pending', 'In Transit', 'Delivered', 'Delayed'];
const DRIVER_OPTIONS = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Unassigned'];

export default function ShipmentForm({ defaultValues, onSubmit, onCancel, submitting }) {
    const [defaultEta] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(shipmentSchema),
        defaultValues: defaultValues || {
            status: 'Pending',
            assignedDriver: 'Unassigned',
            eta: defaultEta
        }
    });

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 relative max-w-lg w-full">
            <button
                onClick={onCancel}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <X size={20} />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {defaultValues ? 'Edit Shipment' : 'New Shipment'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Origin *</label>
                        <input
                            {...register('origin')}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.origin ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                        <input
                            {...register('destination')}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.destination ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Type *</label>
                        <input
                            {...register('cargoType')}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cargoType ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.cargoType && <p className="text-red-500 text-xs mt-1">{errors.cargoType.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                        <input
                            type="number"
                            {...register('weight')}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            {...register('status')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Driver</label>
                        <select
                            {...register('assignedDriver')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {DRIVER_OPTIONS.map(driver => (
                                <option key={driver} value={driver}>{driver}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ETA *</label>
                    <input
                        type="date"
                        {...register('eta')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.eta ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.eta && <p className="text-red-500 text-xs mt-1">{errors.eta.message}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : 'Save Shipment'}
                    </button>
                </div>
            </form>
        </div>
    );
}
