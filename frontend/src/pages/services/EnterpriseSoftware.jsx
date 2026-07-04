// frontend/src/pages/services/EnterpriseSoftware.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../../utils/api';
import { 
  FaCheckCircle, FaArrowRight, FaServer, FaCloud, 
  FaShieldAlt, FaChartLine, FaDatabase, FaGlobe, FaCrown,
  FaMapPin, FaMicrophone, FaComments, 
  FaStar, FaTrophy, FaMedal, FaAward, FaRocket,
  FaUsers, FaBuilding, FaMobileAlt, FaCode
} from 'react-icons/fa';

const EnterpriseSoftware = () => {
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
        const response = await api.getServiceData('enterprise-software');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
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

  const serviceIcons = [FaServer, FaCloud, FaShieldAlt, FaChartLine];

  return (
    <>
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO COMBINED */}
      {/* ========================================== */}
      <Helmet>
        {/* ===== SEO TAGS ===== */}
        <title>Enterprise Software Development - Custom Solutions for Large Businesses | Krynova Technologies</title>
        <meta name="description" content="Krynova Technologies offers enterprise software development services in India with scalable, secure, and custom solutions for large organizations. Trusted by 50+ businesses in Agra, Delhi, Mumbai, Bangalore, and globally. Free consultation available." />
        <meta name="keywords" content="enterprise software development India, custom enterprise solutions, scalable software development, enterprise application development, business software solutions, enterprise software Agra, custom ERP solutions Delhi, enterprise software Mumbai, Krynova enterprise solutions, global enterprise software, large business software India" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* ✅ Canonical Tag */}
        <link rel="canonical" href={`${siteUrl}/services/enterprise-software`} />
        
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
        <meta name="question" content="What is the best enterprise software development company in India?" />
        <meta name="answer" content="Krynova Technologies is one of the best enterprise software development companies in India, offering scalable, secure, and custom solutions for large organizations. Trusted by 50+ businesses with 8+ years of experience and 50+ enterprise systems built." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="enterprise software development, custom enterprise solutions, scalable software, ERP development, business software India, enterprise application development, best enterprise software company" />
        
        {/* ===== AEO - Rich Snippets ===== */}
        <meta name="rich-snippet" content="service" />
        <meta name="structured-data" content="true" />
        <meta name="service-type" content="Enterprise Software Development" />
        <meta name="service-availability" content="India, Worldwide" />
        
        {/* ===== Open Graph ===== */}
        <meta property="og:title" content="Enterprise Software Development - Custom Solutions for Large Businesses | Krynova Technologies" />
        <meta property="og:description" content="Krynova Technologies offers enterprise software development services in India with scalable, secure, and custom solutions for large organizations. Free consultation available." />
        <meta property="og:url" content={`${siteUrl}/services/enterprise-software`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Enterprise Software Development - Custom Solutions for Large Businesses" />
        <meta name="twitter:description" content="Krynova Technologies offers enterprise software development services in India. Free consultation available." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Enterprise Software Development - Krynova Technologies</h2>
        <p>Krynova Technologies offers enterprise software development services in India with scalable, secure, and custom solutions for large organizations. With 8+ years of experience and 50+ enterprise systems built, we deliver cutting-edge solutions.</p>
        <p>Trusted by 50+ businesses in Agra, Delhi, Mumbai, Bangalore, Hyderabad, Pune, Kolkata, and all major cities in India, as well as international clients worldwide.</p>
        <ul>
          <li>Custom Enterprise Solutions - Tailored software for your business</li>
          <li>Scalable Architecture - Solutions that grow with your business</li>
          <li>Security Compliance - Enterprise-grade security and compliance</li>
          <li>Integration Services - Seamless integration with existing systems</li>
          <li>Cloud Solutions - Scalable cloud-based enterprise applications</li>
        </ul>
        <p>Free consultation available for businesses in India and globally.</p>
      </div>

      {/* ========================================== */}
      {/* ✅ SCHEMA.ORG - SEO + AEO + GEO */}
      {/* ========================================== */}
      
      {/* 📦 Service Schema - Enterprise Software */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Enterprise Software Development",
          "description": "Scalable, secure, and custom enterprise software solutions for large organizations. Includes custom development, cloud solutions, integration services, and security compliance.",
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
            "name": "Large Organizations in India and Worldwide",
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
            "description": "Enterprise software development with flexible pricing for organizations of all sizes",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "Starting from ₹75,000",
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
          "description": "Best enterprise software development company in India. Serving businesses in Agra, Delhi, Mumbai, Bangalore, and globally.",
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
          "slogan": "Best Enterprise Software Development in India",
          "globalLocationNumber": "IN-UP-AGRA",
          "foundingDate": "2024-03-01",
          "founder": {
            "@type": "Person",
            "name": "Shivam Sharma"
          }
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
              "name": "What is enterprise software development?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Enterprise software development involves creating scalable, secure, and custom software solutions for large organizations to manage business operations, workflows, and data efficiently."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best enterprise software development company in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies is one of the best enterprise software development companies in India with 8+ years of experience and 50+ enterprise systems built for clients across India and globally."
              }
            },
            {
              "@type": "Question",
              "name": "Where is Krynova Technologies located?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies is based in Agra, Uttar Pradesh, India. We serve large organizations across all major cities in India including Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and many more, as well as international clients worldwide."
              }
            },
            {
              "@type": "Question",
              "name": "How much does enterprise software development cost?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Enterprise software development costs vary based on requirements. Krynova Technologies offers flexible pricing starting from ₹75,000 for custom enterprise solutions. Contact us for a custom quote tailored to your specific needs."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer free consultation for enterprise software?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Krynova Technologies offers free consultation for enterprise software development. Contact us to discuss your requirements and get expert advice on your enterprise solution."
              }
            },
            {
              "@type": "Question",
              "name": "What technologies do you use for enterprise software?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies uses modern technologies including React, Node.js, Python, Java, .NET, Cloud platforms (AWS, Azure, GCP), and enterprise-grade databases for scalable and secure enterprise solutions."
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
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl"></div>
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
                {hero?.title || 'Enterprise Software Development'}
              </h1>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                {hero?.description || 'Scalable Solutions for Growing Businesses'}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link to={hero?.cta_link || '/contact'} className="bg-gradient-to-r from-yellow-400 to-orange-400 text-indigo-900 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 flex items-center gap-2">
                  {hero?.cta || 'Contact Us'} <FaArrowRight />
                </Link>
                <a href="#services" className="border-2 border-white/50 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-all duration-300">
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
              <div className="text-center"><div className="text-4xl font-bold text-indigo-600">8+</div><div className="text-sm text-gray-500">Years Experience</div></div>
              <div className="text-center"><div className="text-4xl font-bold text-indigo-600">50+</div><div className="text-sm text-gray-500">Enterprise Systems</div></div>
              <div className="text-center"><div className="text-4xl font-bold text-indigo-600">100%</div><div className="text-sm text-gray-500">Security Compliant</div></div>
              <div className="text-center"><div className="text-4xl font-bold text-indigo-600">24/7</div><div className="text-sm text-gray-500">Premium Support</div></div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Enterprise Software Services</h2>
              <p className="text-gray-600 mt-2">Custom solutions for large organizations</p>
              <p className="text-sm text-indigo-600 mt-2">
                <FaMapPin className="inline mr-1" /> Serving large organizations in all major Indian cities and globally
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services && services.map((service, index) => {
                const Icon = serviceIcons[index] || FaGlobe;
                return (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-2xl mb-4">
                      <Icon />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 text-sm mt-2">{service.description}</p>
                    <p className="text-indigo-600 font-semibold mt-3">{service.price}</p>
                    <Link to="/contact" className="text-indigo-600 text-sm font-semibold mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all">
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
              <h2 className="text-3xl font-bold text-gray-900">Why Choose Krynova Enterprise?</h2>
              <p className="text-gray-600 mt-2">Trusted by large organizations in India and worldwide</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {why_choose && why_choose.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <FaCheckCircle className="text-indigo-500 mt-1 flex-shrink-0" />
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
              <p className="text-gray-600 mt-2">Enterprise-grade features for large organizations</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features && features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <FaCheckCircle className="text-indigo-600 flex-shrink-0" />
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
              <p className="text-gray-600 mt-2">Quick answers about enterprise software development</p>
            </div>
            <div className="space-y-3">
              {faqs && faqs.map((faq, index) => (
                <details key={index} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-300 transition-all">
                  <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors flex items-center justify-between">
                    <span>{faq.q}</span>
                    <FaArrowRight className="text-indigo-600 text-sm transition-transform duration-300" />
                  </summary>
                  <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Global & Local */}
        <section className="py-16 bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Enterprise Solution?</h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
              Get a free consultation and discover how our enterprise solutions can transform your business.
              Serving large organizations in Agra, Delhi, Mumbai, Bangalore, across India, and worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                <FaMapPin /> {indianCities.length}+ Indian Cities
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                <FaGlobe /> {globalCountries.length}+ Countries
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                <FaTrophy /> 50+ Enterprise Systems Built
              </span>
            </div>
            <Link to="/contact" className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2">
              Contact Us <FaArrowRight />
            </Link>
            <p className="text-indigo-200 text-sm mt-4">
              <FaMapPin className="inline mr-1" />
              Based in Agra, Uttar Pradesh, India • Serving Global Enterprises
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

export default EnterpriseSoftware;