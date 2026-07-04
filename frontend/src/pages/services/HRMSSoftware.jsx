// frontend/src/pages/services/HRMSSoftware.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../../utils/api';
import { 
  FaCheckCircle, FaArrowRight, FaUsers, FaClock, 
  FaChartLine, FaDatabase, FaCrown, FaUserCheck, 
  FaBuilding, FaMapPin, FaGlobe, FaMicrophone, 
  FaComments, FaStar, FaTrophy, FaMedal, FaAward
} from 'react-icons/fa';

const HRMSSoftware = () => {
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
        const response = await api.getServiceData('hrms-software');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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

  return (
    <>
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO COMBINED */}
      {/* ========================================== */}
      <Helmet>
        {/* ===== SEO TAGS ===== */}
        <title>HRMS Software India - Best Human Resource Management System | Krynova Technologies</title>
        <meta name="description" content="Krynova Technologies offers the best HRMS software in India for attendance tracking, payroll management, leave management, and employee performance. Trusted by 50+ businesses in Agra, Delhi, Mumbai, Bangalore, and globally. Free demo available." />
        <meta name="keywords" content="HRMS software India, HR management system, payroll software India, attendance management system, leave management software, employee tracking system, best HRMS software Agra, HR software Delhi, human resource management system, Krynova HRMS, enterprise HR solutions India, global HRMS" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* ✅ Canonical Tag */}
        <link rel="canonical" href={`${siteUrl}/services/hrms-software`} />
        
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
        <meta name="question" content="What is the best HRMS software in India?" />
        <meta name="answer" content="Krynova Technologies offers the best HRMS software in India with features including attendance management, payroll processing, leave management, performance tracking, and employee self-service portal. Trusted by 50+ businesses across India and globally." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="HRMS software, payroll system, attendance management, HR software India, best HRMS, employee management system" />
        
        {/* ===== AEO - Rich Snippets ===== */}
        <meta name="rich-snippet" content="service" />
        <meta name="structured-data" content="true" />
        <meta name="service-type" content="HRMS Software" />
        <meta name="service-availability" content="India, Worldwide" />
        
        {/* ===== Open Graph ===== */}
        <meta property="og:title" content="HRMS Software India - Best Human Resource Management System | Krynova Technologies" />
        <meta property="og:description" content="Krynova Technologies offers the best HRMS software in India with attendance tracking, payroll, leave management, and performance tracking. Free demo available." />
        <meta property="og:url" content={`${siteUrl}/services/hrms-software`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HRMS Software India - Best Human Resource Management System" />
        <meta name="twitter:description" content="Krynova Technologies offers the best HRMS software in India. Free demo available." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>HRMS Software India - Krynova Technologies</h2>
        <p>Krynova Technologies offers the best HRMS software in India with complete human resource management features including attendance tracking, payroll processing, leave management, employee performance tracking, and self-service portal.</p>
        <p>Trusted by 50+ businesses in Agra, Delhi, Mumbai, Bangalore, Hyderabad, Pune, Kolkata, and all major cities in India, as well as international clients worldwide.</p>
        <ul>
          <li>Attendance Management - Biometric integration, real-time tracking</li>
          <li>Payroll Processing - Automated salary calculations, tax management</li>
          <li>Leave Management - Easy leave requests, approvals, and tracking</li>
          <li>Performance Tracking - Employee performance monitoring and reviews</li>
          <li>Employee Self-Service - Portal for employees to access their information</li>
        </ul>
        <p>Free demo available for businesses in India and globally.</p>
      </div>

      {/* ========================================== */}
      {/* ✅ SCHEMA.ORG - SEO + AEO + GEO */}
      {/* ========================================== */}
      
      {/* 📦 Service Schema - HRMS Software */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "HRMS Software",
          "description": "Complete Human Resource Management System for businesses in India and globally. Features include attendance tracking, payroll management, leave management, and performance tracking.",
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
            "name": "Businesses in India and Worldwide",
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
            "description": "HRMS software with flexible pricing for businesses of all sizes",
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
          "description": "Best HRMS software provider in India. Serving businesses in Agra, Delhi, Mumbai, Bangalore, and globally.",
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
          "slogan": "Best HRMS Software in India",
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
              "name": "What is HRMS software?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "HRMS (Human Resource Management System) software is a digital solution that helps businesses manage employee information, attendance, payroll, leave, performance, and other HR functions efficiently."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best HRMS software in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies offers one of the best HRMS software solutions in India with comprehensive features including attendance tracking, payroll processing, leave management, and performance tracking. Trusted by 50+ businesses across India."
              }
            },
            {
              "@type": "Question",
              "name": "Where is Krynova Technologies located?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies is based in Agra, Uttar Pradesh, India. We serve clients across all major cities in India including Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and many more, as well as international clients worldwide."
              }
            },
            {
              "@type": "Question",
              "name": "How much does HRMS software cost in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "HRMS software from Krynova Technologies starts from ₹25,000 with flexible pricing options for businesses of all sizes. Contact us for a custom quote tailored to your specific requirements."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer a free demo for HRMS software?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Krynova Technologies offers free demos for our HRMS software. You can request a personalized demo to see how our system can streamline your HR operations."
              }
            },
            {
              "@type": "Question",
              "name": "What features does Krynova HRMS software include?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova HRMS software includes attendance management, payroll processing, leave management, employee performance tracking, employee self-service portal, reporting and analytics, and integration with biometric devices."
              }
            }
          ]
        })}
      </script>

      {/* ========================================== */}
      {/* ✅ MAIN CONTENT */}
      {/* ========================================== */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full filter blur-3xl"></div>
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
                {hero?.title || 'HRMS Software for Indian Businesses'}
              </h1>
              <p className="text-xl text-green-100 max-w-2xl mx-auto">
                {hero?.description || 'Complete Human Resource Management System'}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link
                  to={hero?.cta_link || '/contact'}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-green-900 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  {hero?.cta || 'Request Demo'} <FaArrowRight />
                </Link>
                <a href="#services" className="border-2 border-white/50 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-900 transition-all duration-300">
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
              <div className="text-center"><div className="text-4xl font-bold text-green-600">500+</div><div className="text-sm text-gray-500">Employees Managed</div></div>
              <div className="text-center"><div className="text-4xl font-bold text-green-600">100%</div><div className="text-sm text-gray-500">Data Security</div></div>
              <div className="text-center"><div className="text-4xl font-bold text-green-600">24/7</div><div className="text-sm text-gray-500">Support</div></div>
              <div className="text-center"><div className="text-4xl font-bold text-green-600">99.9%</div><div className="text-sm text-gray-500">Uptime</div></div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">HRMS Services</h2>
              <p className="text-gray-600 mt-2">Complete HR solutions for Indian businesses</p>
              <p className="text-sm text-green-600 mt-2">
                <FaMapPin className="inline mr-1" /> Serving businesses in all major Indian cities and globally
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services && services.map((service, index) => {
                const icons = [FaUsers, FaClock, FaChartLine, FaDatabase];
                const Icon = icons[index] || FaUserCheck;
                return (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-2xl mb-4">
                      <Icon />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 text-sm mt-2">{service.description}</p>
                    <p className="text-green-600 font-semibold mt-3">{service.price}</p>
                    <Link to="/contact" className="text-green-600 text-sm font-semibold mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all">
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
              <h2 className="text-3xl font-bold text-gray-900">Why Choose Krynova HRMS?</h2>
              <p className="text-gray-600 mt-2">Trusted by businesses in India and worldwide</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {why_choose && why_choose.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
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
              <p className="text-gray-600 mt-2">Complete HR management features for modern businesses</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features && features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-green-50 p-4 rounded-lg border border-green-100">
                  <FaCheckCircle className="text-green-600 flex-shrink-0" />
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
              <p className="text-gray-600 mt-2">Quick answers about our HRMS software</p>
            </div>
            <div className="space-y-3">
              {faqs && faqs.map((faq, index) => (
                <details key={index} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-green-300 transition-all">
                  <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-green-600 transition-colors flex items-center justify-between">
                    <span>{faq.q}</span>
                    <FaArrowRight className="text-green-600 text-sm transition-transform duration-300" />
                  </summary>
                  <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Global & Local */}
        <section className="py-16 bg-gradient-to-r from-green-900 to-emerald-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your HR?</h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Get a free demo and see how our HRMS software can transform your HR operations.
              Serving businesses in Agra, Delhi, Mumbai, Bangalore, across India, and worldwide.
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
            <Link to="/contact" className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2">
              Request Demo <FaArrowRight />
            </Link>
            <p className="text-green-200 text-sm mt-4">
              <FaMapPin className="inline mr-1" />
              Based in Agra, Uttar Pradesh, India • Serving Global Clients
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

export default HRMSSoftware;