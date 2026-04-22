import { Globe2, Users, Target, ShieldCheck } from 'lucide-react';

const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '150+', label: 'Countries Covered' },
    { value: '10K+', label: 'Active Clients' },
    { value: '500+', label: 'Team Members' },
];

const values = [
    {
        icon: Globe2,
        title: 'Global Reach',
        desc: 'Connecting continents through our extensive network of partners and carriers.'
    },
    {
        icon: ShieldCheck,
        title: 'Reliability',
        desc: 'Ensuring your cargo reaches its destination safely, securely, and on schedule.'
    },
    {
        icon: Users,
        title: 'Customer First',
        desc: 'Dedicated support teams providing personalized solutions for every client.'
    },
    {
        icon: Target,
        title: 'Innovation',
        desc: 'Leveraging cutting-edge logistics technology for real-time tracking and efficiency.'
    }
];

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-24 bg-slate-900 border-b border-slate-800">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-outfit">About CargoFlow</h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        We are a leading global logistics provider, dedicated to making international trade seamless, reliable, and entirely transparent.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Our Story</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit leading-tight">
                                Pioneering the future of global supply chains.
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Founded in 2008, CargoFlow started with a simple mission: to simplify the complex world of global logistics. Over the years, we have grown from a regional freight forwarder into a global supply chain leader.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Today, we operate across 150+ countries, leveraging advanced technology and a massive network of carriers to provide unparalleled visibility and reliability for our clients.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-shadow duration-300">
                                    <div className="text-4xl font-bold text-secondary mb-2 font-outfit">{stat.value}</div>
                                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Core Values</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit">The principles that drive us forward</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <div key={idx} className="bg-slate-50 rounded-3xl p-8 hover:bg-primary group transition-colors duration-500 shadow-sm hover:shadow-xl">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary-light group-hover:text-white transition-colors duration-500 shadow-sm">
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-white transition-colors duration-300">{value.title}</h4>
                                    <p className="text-slate-600 group-hover:text-primary-50 transition-colors duration-300 leading-relaxed">
                                        {value.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
