// frontend/src/pages/services/WhatsAppAutomation.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { 
  FaCheckCircle, FaArrowRight, FaWhatsapp, FaRobot, FaUsers, 
  FaChartLine, FaComment, FaClock, FaMobileAlt 
} from 'react-icons/fa';

const WhatsAppAutomation = () => {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const response = await api.getServiceData('whatsapp-automation');
        if (response.success) {
          setServiceData(response.data);
        } else {
          setError('Failed to load service data');
        }
      } catch (err) {
        console.error('Error fetching service data:', err);
        setError('Failed to load service data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchServiceData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-500 text-xl">⚠️ {error || 'Service not found'}</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  const { title, meta_description, keywords, hero, services, features, why_choose, faqs } = serviceData;

  document.title = title || 'WhatsApp Automation Bot | Krynova Technologies';

  const serviceIcons = [FaUsers, FaComment, FaClock, FaChartLine];

  return (
    <>
      <meta name="description" content={meta_description} />
      <meta name="keywords" content={keywords} />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {hero?.title || 'WhatsApp Automation Bot'}
              </h1>
              <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                {hero?.description || '24/7 Customer Engagement with AI'}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link to={hero?.cta_link || '/contact'} className="bg-gradient-to-r from-yellow-400 to-orange-400 text-teal-900 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 flex items-center gap-2">
                  {hero?.cta || 'Try Demo'} <FaArrowRight />
                </Link>
                <a href="#services" className="border-2 border-white/50 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-900 transition-all duration-300">
                  Our Services
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="text-center"><div className="text-4xl font-bold text-teal-600">24/7</div><div className="text-sm text-gray-500">Automated Support</div></div>
              <div className="text-center"><div className="text-4xl font-bold text-teal-600">10K+</div><div className="text-sm text-gray-500">Messages/Month</div></div>
              <div className="text-center"><div className="text-4xl font-bold text-teal-600">99%</div><div className="text-sm text-gray-500">Response Rate</div></div>
              <div className="text-center"><div className="text-4xl font-bold text-teal-600">60%</div><div className="text-sm text-gray-500">Time Saved</div></div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">WhatsApp Automation Services</h2>
              <p className="text-gray-600 mt-2">AI-powered solutions for your business communication</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services && services.map((service, index) => {
                const Icon = serviceIcons[index] || FaMobileAlt;
                return (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-2xl mb-4">
                      <Icon />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 text-sm mt-2">{service.description}</p>
                    <p className="text-teal-600 font-semibold mt-3">{service.price}</p>
                    <Link to="/contact" className="text-teal-600 text-sm font-semibold mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all">
                      Learn More <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose Krynova WhatsApp Automation?</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {why_choose && why_choose.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <FaCheckCircle className="text-teal-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features && features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-teal-50 p-4 rounded-lg border border-teal-100">
                  <FaCheckCircle className="text-teal-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {faqs && faqs.map((faq, index) => (
                <details key={index} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-teal-300 transition-all">
                  <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-teal-600 transition-colors flex items-center justify-between">
                    <span>{faq.q}</span>
                    <FaArrowRight className="text-teal-600 text-sm transition-transform duration-300" />
                  </summary>
                  <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-teal-900 to-cyan-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Automate Your WhatsApp?</h2>
            <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
              Get started with our WhatsApp automation bot and transform your business communication.
            </p>
            <Link to="/contact" className="bg-white text-teal-700 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2">
              Try Demo <FaArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default WhatsAppAutomation;