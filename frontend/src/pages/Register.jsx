import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Mail, Lock, User, Loader2, Briefcase } from 'lucide-react';
import { authApi } from '../services/auth.api';
import toast from 'react-hot-toast';

const registerSchema = z.object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['admin', 'manager', 'dispatcher', 'customer']),
});

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'customer' }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await authApi.register(data);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({
                id: response._id,
                name: response.name,
                email: response.email,
                role: response.role
            }));
            toast.success(`Account created! Welcome, ${response.name}!`);
            navigate('/shipments');
        } catch (error) {
            // Error handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 py-12">
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-lg relative z-10">
                <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
                            <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-500 transition-colors shadow-lg">
                                <Package className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-2xl text-slate-800 tracking-tight">
                                Cargo<span className="text-blue-500">Flow</span>
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Create an Account</h1>
                        <p className="text-slate-500 text-sm">Join the network of seamless logistics</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User size={18} />
                                </div>
                                <input
                                    {...register('name')}
                                    type="text"
                                    placeholder="John Doe"
                                    className={`block w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                                />
                            </div>
                            {errors.name && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="name@company.com"
                                    className={`block w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                                />
                            </div>
                            {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Briefcase size={18} />
                                </div>
                                <select
                                    {...register('role')}
                                    className="block w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                                >
                                    <option value="customer">Customer</option>
                                    <option value="dispatcher">Dispatcher</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            {errors.role && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.role.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    {...register('password')}
                                    type="password"
                                    placeholder="••••••••"
                                    className={`block w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-slate-200'}`}
                                />
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 underline-offset-4 hover:underline">
                            Log in instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
