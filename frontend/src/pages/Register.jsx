import { SignUp } from '@clerk/clerk-react';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 group mb-4">
                        <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-500 transition-colors shadow-lg">
                            <Package className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-2xl text-slate-800 tracking-tight">
                            Cargo<span className="text-blue-500">Flow</span>
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h1>
                    <p className="text-slate-500 text-sm">Join us for seamless logistics</p>
                </div>

                <SignUp 
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
                            card: 'shadow-2xl shadow-slate-200/50 border border-slate-100 rounded-3xl',
                            headerTitle: 'hidden',
                            headerSubtitle: 'hidden',
                        }
                    }}
                    signInUrl="/login"
                    forceRedirectUrl="/shipments"
                />
            </div>
        </div>
    );
};

export default Register;
