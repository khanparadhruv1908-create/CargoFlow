import {
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider
} from '@mui/material';
import { Save } from 'lucide-react';

export default function Settings() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Platform Settings</h2>
                <p className="text-gray-500">Configure global application variables and secrets.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">API Keys Configuration</h3>
                    <p className="text-sm text-gray-500 mb-4">Required for critical external logistics services.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Stripe Secret Key"
                            variant="outlined"
                            fullWidth
                            defaultValue="sk_test_mock_secret_key_..."
                            type="password"
                        />
                        <TextField
                            label="Google Maps / Leaflet Routing API"
                            variant="outlined"
                            fullWidth
                            defaultValue="AIzaSyA_m0ck_R0uting_k3y..."
                            type="password"
                        />
                    </div>
                </div>

                <Divider />

                <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Pricing Engine Variables</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TextField
                            label="Base Route Cost ($/km)"
                            variant="outlined"
                            fullWidth
                            type="number"
                            defaultValue="1.25"
                        />
                        <TextField
                            label="Standard Tax Rate (%)"
                            variant="outlined"
                            fullWidth
                            type="number"
                            defaultValue="10.0"
                        />
                        <TextField
                            label="Surcharge Weight Threshold (kg)"
                            variant="outlined"
                            fullWidth
                            type="number"
                            defaultValue="1000"
                        />
                    </div>
                </div>

                <Divider />

                <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">System Preferences</h3>
                    <div className="flex flex-col gap-2">
                        <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Enable Automated Invoicing" />
                        <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Allow Customer Dispatch Creation" />
                        <FormControlLabel control={<Switch color="primary" />} label="Maintenance Mode (Lockout Customers)" />
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
                    <Button variant="contained" color="primary" startIcon={<Save size={18} />} className="shadow-md">
                        Save Configurations
                    </Button>
                </div>

            </div>
        </div>
    );
}
