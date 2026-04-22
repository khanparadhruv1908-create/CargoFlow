import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Shield, Key, Bell, Database } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
    const [apiKey, setApiKey] = useState('sk_test_••••••••••••••••••••');
    
    return (
        <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
            {/* General Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Shield size={18} className="text-blue-600" /> Security & Access
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                            <Key size={14} /> Stripe API Secret
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="password" 
                                value={apiKey}
                                onChange={e => setApiKey(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                Update
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400">Used for processing secure global payments via Stripe.</p>
                    </div>

                    <div className="pt-6 border-t border-gray-50 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-800">Email Notifications</p>
                                <p className="text-xs text-gray-400">Receive alerts for new shipment requests</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-blue-600 transition-all cursor-pointer relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-5 after:transition-all" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-800">Maintenance Mode</p>
                                <p className="text-xs text-gray-400">Disable frontend access for maintenance</p>
                            </div>
                            <input type="checkbox" className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-blue-600 transition-all cursor-pointer relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-5 after:transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Economics */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Database size={18} className="text-blue-600" /> Platform Multipliers
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Service Fee ($)</label>
                        <input type="number" defaultValue="25.00" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Global Tax Rate (%)</label>
                        <input type="number" defaultValue="12.5" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div className="md:col-span-2 pt-4 flex justify-end">
                        <button className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">
                            <Save size={18} /> Save Economics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
