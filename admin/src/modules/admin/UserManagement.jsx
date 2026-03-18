import { useAdminUsers } from '../../hooks/useAdminData';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    IconButton
} from '@mui/material';
import { Edit, Delete, Security } from 'lucide-react';

export default function UserManagement() {
    const { data: users, isLoading } = useAdminUsers();

    if (isLoading) return <div>Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h2>
                    <p className="text-gray-500">Manage internal accounts and assign roles securely.</p>
                </div>
                <Button variant="contained" color="primary" startIcon={<Security size={18} />}>
                    Add User
                </Button>
            </div>

            <TableContainer component={Paper} elevation={0} className="border border-gray-200 rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-50">
                        <TableRow>
                            <TableCell className="font-semibold text-gray-600">ID</TableCell>
                            <TableCell className="font-semibold text-gray-600">Name</TableCell>
                            <TableCell className="font-semibold text-gray-600">Email</TableCell>
                            <TableCell className="font-semibold text-gray-600">Role</TableCell>
                            <TableCell className="font-semibold text-gray-600">Status</TableCell>
                            <TableCell align="right" className="font-semibold text-gray-600">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-mono text-xs">{user.id}</TableCell>
                                <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                                <TableCell className="text-gray-500">{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        size="small"
                                        color={
                                            user.role === 'Admin' ? 'error' :
                                                user.role === 'Manager' ? 'warning' :
                                                    user.role === 'Dispatcher' ? 'info' : 'default'
                                        }
                                        variant={user.role === 'Customer' ? "outlined" : "filled"}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.status}
                                        size="small"
                                        color={user.status === 'Active' ? 'success' : 'default'}
                                        className={user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : ''}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" size="small"><Edit size={18} /></IconButton>
                                    <IconButton color="error" size="small"><Delete size={18} /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
