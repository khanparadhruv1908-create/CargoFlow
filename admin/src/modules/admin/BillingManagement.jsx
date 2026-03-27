import { useAdminInvoices } from '../../hooks/useAdminData';
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
import { Download, Receipt } from 'lucide-react';

export default function BillingManagement() {
    const { data: invoices, isLoading } = useAdminInvoices();

    if (isLoading) return <div>Loading billing data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Billing & Invoices</h2>
                    <p className="text-gray-500">Manage customer payments, tax structures, and print manifests.</p>
                </div>
                <Button variant="contained" color="primary" startIcon={<Receipt size={18} />}>
                    Generate Invoice
                </Button>
            </div>

            <TableContainer component={Paper} elevation={0} className="border border-gray-200 rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-50">
                        <TableRow>
                            <TableCell className="font-semibold text-gray-600">Invoice ID</TableCell>
                            <TableCell className="font-semibold text-gray-600">Shipment Ref</TableCell>
                            <TableCell className="font-semibold text-gray-600">Date Issued</TableCell>
                            <TableCell className="font-semibold text-gray-600">Base Amount</TableCell>
                            <TableCell className="font-semibold text-gray-600">Tax</TableCell>
                            <TableCell className="font-semibold text-gray-900">Total</TableCell>
                            <TableCell className="font-semibold text-gray-600">Status</TableCell>
                            <TableCell align="right" className="font-semibold text-gray-600">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices?.map((inv) => (
                            <TableRow key={inv.invoiceId} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-mono font-medium text-sm">{inv.invoiceId}</TableCell>
                                <TableCell className="font-mono text-xs text-blue-600 hover:underline cursor-pointer">
                                    {inv.bookingId}
                                </TableCell>
                                <TableCell className="text-gray-500">{inv.date}</TableCell>
                                <TableCell>${inv.amount.toLocaleString()}</TableCell>
                                <TableCell>${inv.tax.toLocaleString()}</TableCell>
                                <TableCell className="font-bold text-gray-900">${inv.totalAmount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={inv.status}
                                        size="small"
                                        className={
                                            inv.status === 'Paid' ? '!bg-emerald-100 !text-emerald-800' :
                                                inv.status === 'Unpaid' ? '!bg-amber-100 !text-amber-800' :
                                                    '!bg-rose-100 !text-rose-800'
                                        }
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button size="small" variant="outlined" startIcon={<Download size={14} />}>PDF</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
