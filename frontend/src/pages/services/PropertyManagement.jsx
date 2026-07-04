// frontend/src/pages/services/PropertyManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../../utils/api';
import { 
  FaCheckCircle, FaArrowRight, FaBuilding, FaHome, 
  FaMoneyBillWave, FaChartLine, FaUsers, FaTools,
  FaMapPin, FaGlobe, FaMicrophone, FaComments, 
  FaStar, FaTrophy, FaMedal, FaAward, FaCrown
} from 'react-icons/fa';

const PropertyManagement = () => {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Get current URL for canonical
  const siteUrl = window.location.origin;

  // ✅ All major Indian cities for GEO targeting
  const indianCities = [
    "Agra", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", 
    "Pune", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Lucknow", 
    "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", 
    "Patna", "Vadodara", "Ludhiana", "Nashik", "Faridabad", "Meerut", 
    "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", 
    "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", 
    "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", 
    "Chandigarh", "Guwahati", "Solapur", "Hubballi-Dharwad", "Mysore", 
    "Tiruchirappalli", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", 
    "Dehradun", "Noida", "Gurugram", "Ghaziabad", "Faridabad"
  ];

  // ✅ Global countries for international reach
  const globalCountries = [
    "USA", "UK", "Canada", "Australia", "UAE", "Singapore", 
    "Germany", "France", "Japan", "South Korea", "Netherlands", 
    "Sweden", "Norway", "Denmark", "Finland", "New Zealand", 
    "Ireland", "Malaysia", "Thailand", "Vietnam", "Indonesia", 
    "Philippines", "South Africa", "Kenya", "Nigeria", "Egypt", 
    "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"
  ];

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const response = await api.getServiceData('property-management');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
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

  const serviceIcons = [FaBuilding, FaHome, FaMoneyBillWave, FaChartLine];

  return (
    <>
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO COMBINED */}
      {/* ========================================== */}
      <Helmet>
        {/* ===== SEO TAGS ===== */}
        <title>Property Management System - Best Real Estate Management Software | Krynova Technologies</title>
        <meta name="description" content="Krynova Technologies offers the best property management system in India for real estate businesses. Features include tenant management, rent collection, property tracking, and maintenance. Trusted by 50+ businesses in Agra, Delhi, Mumbai, Bangalore, and globally. Free demo available." />
        <meta name="keywords" content="property management system India, real estate management software, tenant management system, rent collection software, property tracking software, best property management software Agra, real estate software Delhi, property management solution Mumbai, Krynova property management, real estate CRM India, global property management" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* ✅ Canonical Tag */}
        <link rel="canonical" href={`${siteUrl}/services/property-management`} />
        
        {/* ===== GEO TAGS - Local Targeting ===== */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="city" content="Agra" />
        <meta name="state" content="Uttar Pradesh" />
        <meta name="country" content="India" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta name="serviceArea" content={`India, ${globalCountries.join(", ")}, Worldwide`} />
        <meta name="coverage" content="Global, National, Local" />
        
        {/* ===== GEO TAGS - All Indian Cities ===== */}
        <meta name="targetedCities" content={indianCities.join(", ")} />
        <meta name="targetedStates" content="Uttar Pradesh, Delhi, Maharashtra, Karnataka, Tamil Nadu, Telangana, West Bengal, Gujarat, Rajasthan, Punjab, Haryana, Madhya Pradesh, Bihar, Odisha, Kerala, Andhra Pradesh, Jharkhand, Chhattisgarh, Uttarakhand, Himachal Pradesh, Goa, Assam, Jammu & Kashmir" />
        <meta name="targetedCountries" content={globalCountries.join(", ")} />
        
        {/* ===== GEO TAGS - Multi-language ===== */}
        <meta name="language" content="en, hi, bn, te, ta, ur, gu, mr, kn, ml, pa" />
        <meta name="locales" content="en_IN, hi_IN, bn_IN, te_IN, ta_IN, ur_IN, gu_IN, mr_IN, kn_IN, ml_IN, pa_IN" />
        
        {/* ===== AEO TAGS - Answer Engine Optimization ===== */}
        <meta name="question" content="What is the best property management system in India?" />
        <meta name="answer" content="Krynova Technologies offers the best property management system in India with features including tenant management, rent collection, property tracking, maintenance management, and financial reporting. Trusted by 50+ real estate businesses across India and globally." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="property management software, real estate management, tenant management, rent collection system, property tracking, best property management India" />
        
        {/* ===== AEO - Rich Snippets ===== */}
        <meta name="rich-snippet" content="service" />
        <meta name="structured-data" content="true" />
        <meta name="service-type" content="Property Management System" />
        <meta name="service-availability" content="India, Worldwide" />
        
        {/* ===== Open Graph ===== */}
        <meta property="og:title" content="Property Management System - Best Real Estate Management Software | Krynova Technologies" />
        <meta property="og:description" content="Krynova Technologies offers the best property management system in India with tenant management, rent collection, property tracking, and maintenance. Free demo available." />
        <meta property="og:url" content={`${siteUrl}/services/property-management`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Property Management System - Best Real Estate Management Software" />
        <meta name="twitter:description" content="Krynova Technologies offers the best property management system in India. Free demo available." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Property Management System - Krynova Technologies</h2>
        <p>Krynova Technologies offers the best property management system in India with complete real estate management features including tenant management, rent collection, property tracking, maintenance management, and financial reporting.</p>
        <p>Trusted by 50+ real estate businesses in Agra, Delhi, Mumbai, Bangalore, Hyderabad, Pune, Kolkata, and all major cities in India, as well as international clients worldwide.</p>
        <ul>
          <li>Tenant Management - Complete tenant profiles and history</li>
          <li>Rent Collection - Automated rent tracking and reminders</li>
          <li>Property Tracking - Real-time property status and availability</li>
          <li>Maintenance Management - Track and manage maintenance requests</li>
          <li>Financial Reporting - Comprehensive financial reports and analytics</li>
        </ul>
        <p>Free demo available for real estate businesses in India and globally.</p>
      </div>

      {/* ========================================== */}
      {/* ✅ SCHEMA.ORG - SEO + AEO + GEO */}
      {/* ========================================== */}
      
      {/* 📦 Service Schema - Property Management */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Property Management System",
          "description": "Complete real estate management system with tenant management, rent collection, property tracking, maintenance management, and financial reporting.",
          "provider": {
            "@type": "Organization",
            "name": "Krynova Technologies",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Agra",
              "addressRegion": "Uttar Pradesh",
              "addressCountry": "India"
            }
          },
          "areaServed": indianCities,
          "availableLanguage": ["English", "Hindi", "Bengali", "Telugu", "Tamil", "Urdu", "Gujarati", "Marathi", "Kannada", "Malayalam", "Punjabi"],
          "audience": {
            "@type": "Audience",
            "name": "Real Estate Businesses in India and Worldwide",
            "geographicArea": {
              "@type": "AdministrativeArea",
              "name": `India, ${globalCountries.join(", ")}, Worldwide`
            }
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          },
          "offers": {
            "@type": "Offer",
            "description": "Property management system with flexible pricing for real estate businesses of all sizes",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "Starting from ₹25,000",
              "priceCurrency": "INR"
            }
          }
        })}
      </script>

      {/* 🏢 Local Business Schema - GEO Focus */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Krynova Technologies",
          "description": "Best property management system provider in India. Serving real estate businesses in Agra, Delhi, Mumbai, Bangalore, and globally.",
          "url": siteUrl,
          "telephone": "+918630519082",
          "email": "princeb744@gmail.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Agra",
            "addressRegion": "Uttar Pradesh",
            "addressCountry": "India"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 27.1767,
            "longitude": 78.0081
          },
          "areaServed": indianCities,
          "availableLanguage": ["English", "Hindi", "Bengali", "Telugu", "Tamil", "Urdu", "Gujarati", "Marathi", "Kannada", "Malayalam", "Punjabi"],
          "slogan": "Best Property Management System in India",
          "globalLocationNumber": "IN-UP-AGRA"
        })}
      </script>

      {/* ❓ FAQ Schema - AEO Focus */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is a property management system?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A property management system is software that helps real estate businesses manage properties, tenants, rent collection, maintenance, and financial reporting efficiently."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best property management system in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies offers one of the best property management systems in India with comprehensive features including tenant management, rent collection, property tracking, maintenance management, and financial reporting."
              }
            },
            {
              "@type": "Question",
              "name": "Where is Krynova Technologies located?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies is based in Agra, Uttar Pradesh, India. We serve real estate clients across all major cities in India including Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and many more, as well as international clients worldwide."
              }
            },
            {
              "@type": "Question",
              "name": "How much does a property management system cost?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our property management system starts from ₹25,000 with flexible pricing options for real estate businesses of all sizes. Contact us for a custom quote tailored to your specific requirements."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer a free demo for property management software?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Krynova Technologies offers free demos for our property management system. You can request a personalized demo to see how our solution can streamline your real estate operations."
              }
            },
            {
              "@type": "Question",
              "name": "What features does Krynova property management software include?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova property management software includes tenant management, rent collection, property tracking, maintenance management, lease management, financial reporting, document management, and owner/tenant portals."
              }
            }
          ]
        })}
      </script>

      {/* ========================================== */}
      {/* ✅ MAIN CONTENT */}
      {/* ========================================== */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
                  <FaMapPin className="text-yellow-400" /> {indianCities.length}+ Indian Cities
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
                  <FaGlobe className="text-yellow-400" /> {globalCountries.length}+ Countries
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
                  <FaStar className="text-yellow-400" /> 4.8/5 Rating
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {hero?.title || 'Property Management System'}
              </h1>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                {hero?.description || 'Complete Real Estate Management Solution'}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link to={hero?.cta_link || '/contact'} className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 flex items-center gap-2">
                  {hero?.cta || 'Get Started'} <FaArrowRight />
                </Link>
                <a href="#services" className="border-2 border-white/50 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition-all duration-300">
                  Our Services
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Property Management Services</h2>
              <p className="text-gray-600 mt-2">Complete solutions for real estate businesses</p>
              <p className="text-sm text-purple-600 mt-2">
                <FaMapPin className="inline mr-1" /> Serving real estate businesses in all major Indian cities and globally
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services && services.map((service, index) => {
                const Icon = serviceIcons[index] || FaTools;
                return (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-2xl mb-4">
                      <Icon />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 text-sm mt-2">{service.description}</p>
                    <p className="text-purple-600 font-semibold mt-3">{service.price}</p>
                    <Link to="/contact" className="text-purple-600 text-sm font-semibold mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all">
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
              <h2 className="text-3xl font-bold text-gray-900">Why Choose Krynova Property Management?</h2>
              <p className="text-gray-600 mt-2">Trusted by real estate businesses in India and worldwide</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {why_choose && why_choose.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <FaCheckCircle className="text-purple-500 mt-1 flex-shrink-0" />
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
              <p className="text-gray-600 mt-2">Complete property management features for real estate businesses</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features && features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <FaCheckCircle className="text-purple-600 flex-shrink-0" />
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
              <p className="text-gray-600 mt-2">Quick answers about our property management system</p>
            </div>
            <div className="space-y-3">
              {faqs && faqs.map((faq, index) => (
                <details key={index} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-purple-300 transition-all">
                  <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors flex items-center justify-between">
                    <span>{faq.q}</span>
                    <FaArrowRight className="text-purple-600 text-sm transition-transform duration-300" />
                  </summary>
                  <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Global & Local */}
        <section className="py-16 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Manage Your Properties?</h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Get started with our property management system and streamline your real estate operations.
              Serving real estate businesses in Agra, Delhi, Mumbai, Bangalore, across India, and worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                <FaMapPin /> {indianCities.length}+ Indian Cities
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                <FaGlobe /> {globalCountries.length}+ Countries
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                <FaTrophy /> 50+ Happy Clients
              </span>
            </div>
            <Link to="/contact" className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2">
              Get Started <FaArrowRight />
            </Link>
            <p className="text-purple-200 text-sm mt-4">
              <FaMapPin className="inline mr-1" />
              Based in Agra, Uttar Pradesh, India • Serving Global Real Estate Clients
            </p>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}} />
    </>
  );
};

export default PropertyManagement;