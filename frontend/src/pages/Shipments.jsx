import { useState, useMemo } from 'react';
import { useShipments } from '../hooks/useShipments';
import ShipmentTable from '../components/shipments/ShipmentTable';
import ShipmentForm from '../components/shipments/ShipmentForm';
import ShipmentDetails from '../components/shipments/ShipmentDetails';
import { Search, Plus, Filter, RefreshCw, X } from 'lucide-react';

export default function Shipments() {
    const { shipments, isLoading, isError, error, createShipment, updateShipment, deleteShipment, isCreating, isUpdating } = useShipments();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modals state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);
    const [viewingShipment, setViewingShipment] = useState(null);

    // Filters logic
    const filteredShipments = useMemo(() => {
        return shipments.filter(shipment => {
            const matchesSearch = (shipment.shipmentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter ? shipment.status === statusFilter : true;
            return matchesSearch && matchesStatus;
        });
    }, [shipments, searchTerm, statusFilter]);

    const handleOpenForm = (shipment = null) => {
        setEditingShipment(shipment);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingShipment(null);
    };

    const handleFormSubmit = async (data) => {
        if (editingShipment) {
            await updateShipment({ id: editingShipment._id, data });
        } else {
            await createShipment(data);
        }
        handleCloseForm();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this shipment?')) {
            await deleteShipment(id);
        }
    };

    if (isError) return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-red-50 text-red-500 p-6 rounded-lg text-center max-w-lg">
                <h3 className="text-xl font-bold mb-2">Failed to load shipments</h3>
                <p>{error?.message}</p>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shipments</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage your fleet routing, track delivery times, and update logs in real-time.</p>
                    </div>

                    <button
                        onClick={() => handleOpenForm()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus size={20} className="mr-2" />
                        New Shipment
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by ID, Origin, Destination..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex w-full md:w-auto items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 flex items-center">
                            <Filter size={16} className="mr-1" />
                            Status:
                        </span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Delayed">Delayed</option>
                        </select>
                    </div>
                </div>

                {/* content table */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <RefreshCw size={36} className="text-blue-500 animate-spin" />
                        <span className="ml-3 text-lg font-medium text-gray-500">Loading tracking data...</span>
                    </div>
                ) : (
                    <ShipmentTable
                        shipments={filteredShipments}
                        onView={(ship) => setViewingShipment(ship)}
                        onEdit={handleOpenForm}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Modals OVERLAYS */}
            {(isFormOpen || viewingShipment) && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => {
                            if (isFormOpen) handleCloseForm();
                            if (viewingShipment) setViewingShipment(null);
                        }}
                    />

                    {/* Centered Modal Content */}
                    <div className="relative z-[600] flex justify-center w-full">
                        {isFormOpen && (
                            <ShipmentForm
                                defaultValues={editingShipment}
                                onSubmit={handleFormSubmit}
                                onCancel={handleCloseForm}
                                submitting={isCreating || isUpdating}
                            />
                        )}

                        {viewingShipment && (
                            <ShipmentDetails
                                shipment={viewingShipment}
                                onClose={() => setViewingShipment(null)}
                            />
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
