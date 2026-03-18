import { Link } from 'react-router-dom';
import { Package, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Logo & About */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group w-max">
                            <div className="bg-primary/20 text-secondary p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
                                <Package className="h-6 w-6" />
                            </div>
                            <span className="font-outfit font-bold text-2xl text-white tracking-tight">
                                Cargo<span className="text-secondary">Flow</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Modern logistics solutions connecting the world. We deliver your goods safely, on time, and with full transparency.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 relative">
                            <span className="relative z-10">Quick Links</span>
                            <span className="absolute left-0 bottom-[-8px] w-12 h-1 bg-primary/50 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Home', 'About Us', 'All Services', 'Careers', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                        className="hover:text-secondary hover:translate-x-2 inline-block transition-all duration-300 text-sm"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 relative">
                            <span className="relative z-10">Our Services</span>
                            <span className="absolute left-0 bottom-[-8px] w-12 h-1 bg-primary/50 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Air Freight', 'Ocean Freight', 'Road Transport', 'Warehousing', 'Customs Clearance'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to="/services"
                                        className="hover:text-secondary hover:translate-x-2 inline-block transition-all duration-300 text-sm"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 relative">
                            <span className="relative z-10">Contact Info</span>
                            <span className="absolute left-0 bottom-[-8px] w-12 h-1 bg-primary/50 rounded-full"></span>
                        </h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="bg-slate-800 p-2 rounded-lg text-secondary mt-1">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-medium mb-1">Location</h4>
                                    <p className="text-sm text-slate-400">123 Logistics Way, Transport Hub, NY 10001</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-slate-800 p-2 rounded-lg text-secondary mt-1">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-medium mb-1">Phone</h4>
                                    <p className="text-sm text-slate-400">+1 (555) 123-4567</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-slate-800 p-2 rounded-lg text-secondary mt-1">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-medium mb-1">Email</h4>
                                    <p className="text-sm text-slate-400">support@cargoflow.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} CargoFlow Logistics. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="#" className="hover:text-secondary transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-secondary transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-secondary transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
