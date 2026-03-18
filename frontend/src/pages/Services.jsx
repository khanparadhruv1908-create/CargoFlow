import { useState, useEffect } from 'react';
import { Plane, Ship, Truck, Package as PackageIcon, Warehouse, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Map string icon names to Lucide react components
const iconMap = {
    Plane: Plane,
    Ship: Ship,
    Truck: Truck,
    PackageIcon: PackageIcon,
    Warehouse: Warehouse,
    FileText: FileText
};

const Services = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await api.get('/services');
                setServices(data);
            } catch (err) {
                console.error("Failed to fetch services", err);
                setError(err.response?.data?.message || 'Failed to fetch services.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Page Header */}
            <section className="bg-slate-900 py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 blur-3xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-outfit">Our Services</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Comprehensive, end-to-end logistics solutions designed to streamline your global supply chain.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <span className="text-lg font-medium text-gray-500">Loading active services...</span>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center py-20">
                            <span className="text-lg font-medium text-red-500">{error}</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {services.map((service) => {
                                const Icon = iconMap[service.icon] || PackageIcon;
                                return (
                                    <div key={service.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <Icon className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-4 font-outfit">{service.title}</h3>
                                        <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
                                            {service.description}
                                        </p>
                                        <ul className="space-y-3 mb-8">
                                            {service.features && service.features.map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-start gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                                                    <span className="text-sm text-slate-600">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            to={
                                                service.id === 'warehousing' ? '/warehouse' :
                                                service.id === 'air-freight' ? '/book?service=air-freight' :
                                                service.id === 'ocean-freight' ? '/book?service=ocean-freight' :
                                                service.id === 'customs-brokerage' ? '/book?service=customs-brokerage' :
                                                `/book?service=${service.id}`
                                            }
                                            className="mt-auto w-full text-center py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Banner */}
            <section className="bg-primary/5 py-16 border-y border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6 font-outfit">Require a customized logistics plan?</h2>
                    <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                        Our experts are ready to design a supply chain solution tailored specifically to your business requirements.
                    </p>
                    <Link to="/contact" className="inline-block bg-primary text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-light transition-all hover:-translate-y-1">
                        Talk to an Expert
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Services;
