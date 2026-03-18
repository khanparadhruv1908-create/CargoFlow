import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Package } from 'lucide-react';
import { UserButton, useUser, SignedIn, SignedOut } from '@clerk/clerk-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, isLoaded } = useUser();

    const getNavLinks = () => {
        let links = [
            { name: 'Home', path: '/' },
            { name: 'All Services', path: '/services' },
            { name: 'About Us', path: '/about' },
            { name: 'Contact Us', path: '/contact' },
        ];

        if (user) {
            links.push({ name: 'Shipments', path: '/shipments' });
        }

        // You might want to handle admin roles via Clerk metadata later
        // For now, let's keep it simple or check a specific email/metadata if needed
        const isAdmin = user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'manager';
        if (isAdmin) {
            links.push({ name: 'Admin', path: 'http://localhost:5174/', external: true });
        }

        return links;
    };

    const navLinks = getNavLinks();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary text-white p-2 rounded-xl group-hover:bg-primary-light transition-colors duration-300">
                                <Package className="h-6 w-6" />
                            </div>
                            <span className="font-outfit font-bold text-2xl text-slate-800 tracking-tight">
                                Cargo<span className="text-secondary">Flow</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex space-x-6">
                            {navLinks.map((link) => (
                                link.external ? (
                                    <a
                                        key={link.name}
                                        href={link.path}
                                        className="text-slate-600 hover:text-primary transition-colors duration-200 text-sm font-medium"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`${isActive(link.path)
                                            ? 'text-primary font-semibold'
                                            : 'text-slate-600 hover:text-primary'
                                            } transition-colors duration-200 text-sm font-medium`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                        </div>
                        <div className="flex items-center space-x-4 ml-6 border-l border-gray-200 pl-6">
                            <SignedOut>
                                <Link
                                    to="/login"
                                    className="text-slate-600 hover:text-primary transition-colors duration-200 text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    Register
                                </Link>
                            </SignedOut>
                            <SignedIn>
                                <UserButton 
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: 'w-10 h-10'
                                        }
                                    }}
                                />
                                {isLoaded && user && (
                                    <span className="text-sm font-semibold text-slate-700 hidden lg:block">
                                        {user.fullName || user.primaryEmailAddress?.emailAddress}
                                    </span>
                                )}
                            </SignedIn>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-primary focus:outline-none p-2"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            link.external ? (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    className="text-slate-600 hover:bg-gray-50 hover:text-primary border-transparent block px-4 py-3 rounded-lg text-base font-medium transition-colors border-l-4"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`${isActive(link.path)
                                        ? 'bg-primary/5 text-primary font-semibold border-primary'
                                        : 'text-slate-600 hover:bg-gray-50 hover:text-primary border-transparent'
                                        } block px-4 py-3 rounded-lg text-base font-medium transition-colors border-l-4`}
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                        <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col space-y-3 px-4">
                            <SignedOut>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center text-slate-600 hover:text-primary font-medium py-2.5 bg-gray-50 rounded-lg"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center bg-primary text-white font-medium py-2.5 rounded-lg shadow-md"
                                >
                                    Register
                                </Link>
                            </SignedOut>
                            <SignedIn>
                                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                                    <UserButton afterSignOutUrl="/" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">{user?.fullName}</span>
                                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{user?.primaryEmailAddress?.emailAddress}</span>
                                    </div>
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
