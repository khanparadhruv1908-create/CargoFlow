import { useState, useEffect } from 'react';
import { ArrowRight, Plane, Ship, Truck, Clock, ShieldCheck, MapPin, Package as PackageIcon, ChevronRight, Activity, Users, FileText, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const iconMap = {
    Plane: Plane,
    Ship: Ship,
    Truck: Truck,
    PackageIcon: PackageIcon,
    Warehouse: Warehouse,
    FileText: FileText
};

const Home = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await api.get('/services');
                setServices(data.slice(0, 4)); // Show first 4 on home
            } catch (err) {
                console.error("Home: Failed to fetch services", err);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[90vh] bg-slate-900 flex items-center justify-center overflow-hidden w-full">
                {/* Abstract Background pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-[20%] w-[70%] h-[70%] rounded-full bg-primary/40 blur-[120px]"></div>
                    <div className="absolute bottom-0 -right-[20%] w-[70%] h-[70%] rounded-full bg-secondary/40 blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md mb-8 border border-white/20">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                        </span>
                        <span className="text-sm font-medium text-slate-200 tracking-wide uppercase">Global Logistics Leader</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 font-outfit max-w-4xl tracking-tight">
                        Streamlining <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Supply Chains</span> Worldwide.
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl leading-relaxed">
                        Delivering your cargo safely, securely, and on time. We handle the complexity of global logistics so you can focus on growth.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link
                            to="/services"
                            className="bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center"
                        >
                            Explore Services
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            to="/contact"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/20 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center hover:-translate-y-1"
                        >
                            Get a Quote
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Grid - DYNAMIC */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Our Core Services</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit">Comprehensive logistics designed for modern business</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.length > 0 ? (
                            services.map((service, index) => {
                                const Icon = iconMap[service.icon] || PackageIcon;
                                return (
                                    <div
                                        key={service._id}
                                        className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-primary/10 border border-slate-100 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-primary flex items-center justify-center mb-8 transition-colors duration-500">
                                            <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors duration-300" />
                                        </div>

                                        <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors duration-300">{service.title}</h4>
                                        <p className="text-slate-600 leading-relaxed mb-6 group-hover:text-slate-700 line-clamp-3">{service.description}</p>

                                        <Link to="/services" className="inline-flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                            Learn more <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                );
                            })
                        ) : (
                            // Loading state placeholders
                            [1,2,3,4].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-slate-100"></div>)
                        )}
                    </div>
                </div>
            </section>

            {/* Stats/Why Choose Us Section */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-sm font-bold tracking-widest text-secondary uppercase mb-3">Why Choose CargoFlow</h2>
                                <h3 className="text-4xl font-bold text-slate-900 leading-tight font-outfit">
                                    Delivering reliability and speed at global scale.
                                </h3>
                            </div>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                We blend advanced technology with deep industry expertise to offer end-to-end supply chain visibility. With us, your goods are always secure, tracked, and mapped efficiently.
                            </p>

                            <div className="space-y-6 pt-4">
                                {[
                                    { icon: <Clock className="w-6 h-6 text-white" />, title: "On-Time Delivery", desc: "99.8% on-time delivery track record across all regions." },
                                    { icon: <ShieldCheck className="w-6 h-6 text-white" />, title: "Secure Handling", desc: "Advanced security protocols ensuring your goods remain intact." },
                                    { icon: <Activity className="w-6 h-6 text-white" />, title: "Real-time Tracking", desc: "Live API tracking ensuring complete visibility throughout the journey." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start group">
                                        <div className="bg-primary group-hover:bg-secondary transition-colors duration-300 p-3 rounded-xl shadow-md">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800 mb-1">{item.title}</h4>
                                            <p className="text-slate-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-6 transform translate-y-12">
                                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow text-center">
                                    <div className="text-5xl font-black text-primary mb-2 font-outfit">10K+</div>
                                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Shipments Delivered</div>
                                </div>
                                <div className="bg-secondary/10 rounded-3xl p-8 border border-secondary/20 shadow-sm hover:shadow-lg transition-shadow text-center">
                                    <div className="text-5xl font-black text-secondary mb-2 font-outfit">150+</div>
                                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">Countries Covered</div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-primary text-white rounded-3xl p-8 shadow-xl shadow-primary/20 text-center">
                                    <div className="text-5xl font-black mb-2 font-outfit">99%</div>
                                    <div className="text-sm font-medium text-primary-light uppercase tracking-wide">Customer Satisfaction</div>
                                </div>
                                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow text-center">
                                    <div className="text-5xl font-black text-primary mb-2 font-outfit">24/7</div>
                                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Dedicated Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,0 L100,100 L100,0 L0,100 Z" fill="currentColor"></path>
                    </svg>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-outfit">Ready to move your business forward?</h2>
                    <p className="text-xl text-primary-light mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of companies who trust CargoFlow for their global supply chain needs. Get a transparent quote in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/contact" className="bg-secondary hover:bg-white hover:text-primary text-slate-900 transition-all duration-300 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-secondary/20 hover:-translate-y-1">
                            Contact Sales
                        </Link>
                        <Link to="/register" className="bg-transparent border-2 border-primary-light hover:border-white hover:bg-white/10 transition-all duration-300 px-8 py-4 rounded-xl font-bold text-lg hover:-translate-y-1">
                            Create an Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
