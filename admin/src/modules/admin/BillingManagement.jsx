import { useAdminInvoices } from '../../hooks/useAdminData';
import { Download, Receipt, Search, FileText } from 'lucide-react';
import { useState } from 'react';

export default function BillingManagement() {
    const { data: invoices = [], isLoading } = useAdminInvoices();
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = invoices.filter(inv => 
        inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Accessing Ledger...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search invoice or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking Ref</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filtered.map((inv) => (
                                <tr key={inv.invoiceId} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-gray-800 uppercase">{inv.invoiceId}</td>
                                    <td className="px-6 py-4 font-mono text-blue-600 font-bold">{inv.bookingId}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">${inv.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                                            inv.status === 'Unpaid' ? 'bg-amber-50 text-amber-600' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="p-20 text-center">
                        <Receipt size={40} className="mx-auto text-gray-200 mb-4" />
                        <h4 className="font-bold text-gray-400 uppercase tracking-widest text-sm">No records found</h4>
                    </div>
                )}
            </div>
        </div>
    );
}
