import { useAdminShipments } from '../../hooks/useAdminData';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button
} from '@mui/material';
import { Filter, Edit } from 'lucide-react';

export default function ShipmentManagement() {
    const { data: shipments, isLoading } = useAdminShipments();

    if (isLoading) return <div>Loading shipments...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shipment Directory</h2>
                    <p className="text-gray-500">Global overview of all dispatched and pending shipments.</p>
                </div>
                <Button variant="outlined" startIcon={<Filter size={18} />}>
                    Filter
                </Button>
            </div>

            <TableContainer component={Paper} elevation={0} className="border border-gray-200 rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-50">
                        <TableRow>
                            <TableCell className="font-semibold text-gray-600">Shipment ID</TableCell>
                            <TableCell className="font-semibold text-gray-600">Route</TableCell>
                            <TableCell className="font-semibold text-gray-600">Date</TableCell>
                            <TableCell className="font-semibold text-gray-600">Driver</TableCell>
                            <TableCell className="font-semibold text-gray-600">Status</TableCell>
                            <TableCell align="right" className="font-semibold text-gray-600">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shipments?.map((ship) => (
                            <TableRow key={ship.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-mono text-sm font-medium">{ship.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold">{ship.origin}</span>
                                        <span className="text-gray-400">→</span>
                                        <span className="font-semibold">{ship.destination}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-500">{ship.date}</TableCell>
                                <TableCell>{ship.driver}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={ship.status}
                                        size="small"
                                        className={
                                            ship.status === 'Delivered' ? '!bg-green-100 !text-green-800' :
                                                ship.status === 'In Transit' ? '!bg-blue-100 !text-blue-800' :
                                                    ship.status === 'Delayed' ? '!bg-red-100 !text-red-800' :
                                                        '!bg-yellow-100 !text-yellow-800'
                                        }
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button size="small" startIcon={<Edit size={14} />}>Manage</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
