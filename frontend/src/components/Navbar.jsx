import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Package, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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

        if (user && (user.role === 'admin' || user.role === 'manager')) {
            links.push({ name: 'Admin', path: 'http://localhost:5174/', external: true });
        }

        return links;
    };

    const navLinks = getNavLinks();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

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
                            {!user ? (
                                <>
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
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                        <div className="bg-primary/10 p-1 rounded-full">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-semibold">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-slate-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
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
                            {!user ? (
                                <>
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
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                                        <User className="h-5 w-5 text-primary" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{user.name}</span>
                                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{user.role}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-2.5 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
