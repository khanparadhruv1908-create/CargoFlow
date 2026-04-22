import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        // Add logic here (e.g., API call)
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Background Header */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-slate-900 border-b border-slate-800">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-outfit">Get in Touch</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Have a question about our services or need a quick quote? Our team is ready to assist you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-4 transform hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-primary/10 text-primary p-4 rounded-xl">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Office Location</h3>
                                <p className="text-slate-600 leading-relaxed">123 Logistics Way, Transport Hub<br />New York, NY 10001</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-4 transform hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-secondary/10 text-secondary p-4 rounded-xl">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Phone Number</h3>
                                <p className="text-slate-600 leading-relaxed">+1 (555) 123-4567<br />+1 (800) LOG-FLOW</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-4 transform hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-primary/10 text-primary p-4 rounded-xl">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Email Address</h3>
                                <p className="text-slate-600 leading-relaxed">support@cargoflow.com<br />sales@cargoflow.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 font-outfit">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 bg-slate-50 focus:bg-white"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 bg-slate-50 focus:bg-white"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 bg-slate-50 focus:bg-white"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 bg-slate-50 focus:bg-white resize-none"
                                    placeholder="Tell us about your logistics needs..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1"
                            >
                                Send Message
                                <Send className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
