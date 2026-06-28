import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaRocket, FaUsers, FaCode, FaShieldAlt, FaArrowRight, 
  FaCheckCircle, FaSpinner, FaStar, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter,
  FaAward, FaTrophy, FaMedal, FaBuilding, FaClock,
  FaHeart, FaBriefcase, FaChartBar, FaChevronDown
} from 'react-icons/fa';

// Constants
const API_BASE_URL = import.meta.env.VITE_API_URL;
const PROJECTS_LIMIT = 4;
const TESTIMONIALS_LIMIT = 3;

// Enhanced SEO Component for Home.jsx
const SEO = () => {
  const siteTitle = "Krynova Technologies - Custom Web Solutions & Enterprise Software Development Company";
  const siteDescription = "Krynova Technologies - Leading web development company in Agra, India. We deliver custom HRMS software, property management systems, and enterprise solutions. 8+ years experience, 50+ systems built for Torrent Power, Tech Mahindra, Romsons, and more. Get a free consultation today!";
  const siteKeywords = "Krynova Technologies, web development company India, custom web solutions, HRMS software India, property management system India, enterprise software development, best web development company Agra, Shivam Sharma web developer, Torrent Power software, Tech Mahindra solutions, custom software development, Indian web developers, business management system, web application development, professional web development company";
  const siteUrl = window.location.origin;
  const siteImage = `${siteUrl}/logo.png`;

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="3 days" />
      <meta name="author" content="Krynova Technologies" />
      <meta name="copyright" content="Krynova Technologies" />
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Agra" />
      <meta name="geo.position" content="27.1767;78.0081" />
      <meta name="ICBM" content="27.1767, 78.0081" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Krynova Technologies" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={siteImage} />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Krynova Technologies",
          "description": siteDescription,
          "url": siteUrl,
          "logo": `${siteUrl}/logo.png`,
          "foundingDate": "2026-03",
          "founders": [
            {
              "@type": "Person",
              "name": "Shivam Sharma",
              "jobTitle": "Founder & CEO",
              "description": "Full Stack Developer with 8+ years of experience, building 50+ enterprise systems for clients including Torrent Power, Tech Mahindra, Romsons, and more.",
              "alumniOf": [
                {
                  "@type": "Organization",
                  "name": "Torrent Power Limited"
                },
                {
                  "@type": "Organization",
                  "name": "Tech Mahindra"
                },
                {
                  "@type": "Organization",
                  "name": "Romsons"
                }
              ]
            }
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+918630519082",
            "contactType": "sales",
            "email": "princeb744@gmail.com",
            "availableLanguage": ["English", "Hindi"]
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Agra",
            "addressRegion": "Uttar Pradesh",
            "addressCountry": "India"
          },
          "sameAs": [
            "https://www.linkedin.com/company/krynova",
            "https://twitter.com/krynova",
            "https://github.com/krynova"
          ],
          "offers": {
            "@type": "Offer",
            "description": "Custom web solutions for businesses",
            "availability": "https://schema.org/InStock",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "Contact for pricing",
              "priceCurrency": "INR"
            }
          }
        })}
      </script>

      {/* WebSite Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Krynova Technologies",
          "url": siteUrl,
          "description": siteDescription,
          "keywords": siteKeywords,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/products?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="container py-20 text-center">
    <div className="flex justify-center items-center space-x-3">
      <FaSpinner className="text-4xl text-blue-600 animate-spin" />
      <p className="text-xl text-gray-600">Loading...</p>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ icon: Icon, text, className = '' }) => (
  <span className={`bg-blue-800/50 px-4 py-2 rounded-full ${className}`}>
    <Icon className="inline mr-2" /> {text}
  </span>
);

// Feature Item Component
const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3">
    <Icon className="text-blue-600 mt-1 flex-shrink-0" />
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

// Project Card Component
const ProjectCard = ({ project }) => {
  const IconComponent = useMemo(() => {
    try {
      return require(`react-icons/fa`)[`Fa${project.icon?.charAt(0).toUpperCase() + project.icon?.slice(1) || 'Cube'}`];
    } catch {
      return FaCode;
    }
  }, [project.icon]);

  return (
    <Link 
      to={`/products/${project.id}`} 
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 group transform hover:-translate-y-1"
    >
      <div className="text-4xl text-blue-600 mb-4">
        <IconComponent />
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
        {project.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2">
        {project.short_desc || project.description?.substring(0, 60) || ''}
      </p>
      {project.is_upcoming && (
        <span className="inline-block mt-2 bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">
          Upcoming
        </span>
      )}
      <span className="inline-block mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
        View Demo →
      </span>
    </Link>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
        {testimonial.client_name?.charAt(0) || '?'}
      </div>
      <div>
        <h4 className="font-semibold">{testimonial.client_name}</h4>
        <p className="text-gray-500 text-sm">{testimonial.client_company || 'Client'}</p>
      </div>
    </div>
    <div className="flex text-yellow-400 mb-2">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-lg">
          {i < (testimonial.rating || 0) ? '★' : '☆'}
        </span>
      ))}
    </div>
    <p className="text-gray-600 text-sm italic">"{testimonial.feedback}"</p>
  </div>
);

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [projectsRes, testimonialsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/projects`),
        axios.get(`${API_BASE_URL}/api/testimonials`)
      ]);

      const approvedTestimonials = testimonialsRes.data.filter(t => t.is_approved);
      
      setProjects(projectsRes.data.slice(0, PROJECTS_LIMIT));
      setTestimonials(approvedTestimonials.slice(0, TESTIMONIALS_LIMIT));
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="container py-20 text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchData}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* SEO */}
      <SEO />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src="/logo.png" 
                alt="Krynova Technologies Logo" 
                className="h-20 w-auto md:h-24"
                loading="lazy"
              />
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-800/50 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-sm">
              <FaStar className="text-yellow-400" />
              <span>India's Leading Web Development Company</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              Custom <span className="text-yellow-400">Web Solutions</span> for Every Industry
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-slide-up max-w-3xl mx-auto">
              Enterprise-grade HRMS, property management, and business systems — built with SEO, animations, and military-grade security.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up-delayed">
              <Link 
                to="/products" 
                className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Products <FaArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
              <Link 
                to="/contact" 
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                Request Demo
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm animate-fade-in-delayed">
              <StatCard icon={FaRocket} text="Founded March 2026" />
              <StatCard icon={FaUsers} text="50+ Happy Clients" />
              <StatCard icon={FaCode} text="10+ Products" />
              <StatCard icon={FaAward} text="8+ Years Experience" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Credibility Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-gray-600">
              <FaAward className="text-blue-600 text-xl" />
              <span>Trusted by 50+ Businesses</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaTrophy className="text-blue-600 text-xl" />
              <span>50+ Enterprise Systems</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaMedal className="text-blue-600 text-xl" />
              <span>24/7 Premium Support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaShieldAlt className="text-blue-600 text-xl" />
              <span>GDPR & Security Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl font-bold mb-4 mt-2">Why Choose Krynova?</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in March 2026, Krynova Technologies is a cutting-edge technology company dedicated to providing 
                custom web solutions for businesses of all sizes and industries.
              </p>
              <div className="space-y-4">
                <FeatureItem 
                  icon={FaRocket}
                  title="Our Vision"
                  description="To become the go-to partner for businesses seeking innovative, scalable, and secure web solutions."
                />
                <FeatureItem 
                  icon={FaShieldAlt}
                  title="Our Mission"
                  description="Empower businesses with custom software that drives growth, efficiency, and customer satisfaction."
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-blue-900">Why Choose Krynova?</h3>
                <ul className="space-y-3">
                  {[
                    '100% Custom Solutions',
                    'Ready-to-Deploy Demos',
                    'Complete SEO & Performance',
                    '24/7 Support & Maintenance',
                    'Free Consultation',
                    'Cost-Effective Pricing'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 group hover:translate-x-1 transition-transform">
                      <span className="bg-green-100 text-green-600 p-1 rounded-full flex-shrink-0">
                        <FaCheckCircle />
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder/CEO Section - Updated */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Leadership</span>
              <h2 className="text-3xl font-bold mt-2">Meet Our Founder</h2>
              <p className="text-gray-600 mt-2">Driven by innovation and a passion for technology</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-5xl md:text-6xl font-bold shadow-xl">
                    SS
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Shivam Sharma</h3>
                  <p className="text-blue-600 font-semibold">Founder & CEO, Krynova Technologies</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Full Stack Developer</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">8+ Years Experience</span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">Enterprise Solutions</span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">50+ Systems Built</span>
                  </div>
                  <p className="text-gray-600 mt-4 leading-relaxed">
                    Shivam Sharma is an experienced Full Stack Developer and Data Analyst with over 8 years of industry experience. 
                    He has successfully built and deployed 50+ enterprise systems for leading organizations including 
                    <strong> Torrent Power Limited</strong>, <strong>Tech Mahindra</strong>, <strong>Romsons</strong>, 
                    <strong> Agra Chain</strong>, and <strong>Anna Infrastructure Limited</strong>. 
                    His expertise spans across custom software development, data analytics, and enterprise architecture.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <a 
                      href="mailto:princeb744@gmail.com" 
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                    >
                      <FaEnvelope /> princeb744@gmail.com
                    </a>
                    <a 
                      href="tel:+918630519082" 
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                    >
                      <FaPhone /> +91 86305 19082
                    </a>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <a href="#" className="text-gray-500 hover:text-blue-600 transition text-xl" aria-label="LinkedIn">
                      <FaLinkedin />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 transition text-xl" aria-label="GitHub">
                      <FaGithub />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-400 transition text-xl" aria-label="Twitter">
                      <FaTwitter />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience & Clients Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Experience</span>
            <h2 className="text-3xl font-bold mt-2">Trusted By Leading Enterprises</h2>
            <p className="text-gray-600 mt-2">8+ years of experience building solutions for industry leaders</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Torrent Power', color: 'from-red-500 to-red-700' },
              { name: 'Tech Mahindra', color: 'from-blue-500 to-blue-700' },
              { name: 'Romsons', color: 'from-green-500 to-green-700' },
              { name: 'Agra Chain', color: 'from-purple-500 to-purple-700' },
              { name: 'Anna Infra', color: 'from-orange-500 to-orange-700' }
            ].map((client, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-r ${client.color} text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <FaBuilding className="text-2xl mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-sm">{client.name}</p>
                <p className="text-xs opacity-80">Enterprise Client</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">8+</div>
              <div className="text-sm text-gray-500">Years Experience</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-500">Systems Built</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-500">Enterprise Clients</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-500">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Details Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl text-center border border-gray-100 hover:shadow-lg transition">
              <FaBuilding className="text-4xl text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold">Company Name</h4>
              <p className="text-gray-600 text-sm">Krynova Technologies</p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center border border-gray-100 hover:shadow-lg transition">
              <FaMapMarkerAlt className="text-4xl text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold">Location</h4>
              <p className="text-gray-600 text-sm">Agra, Uttar Pradesh, India</p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center border border-gray-100 hover:shadow-lg transition">
              <FaClock className="text-4xl text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold">Founded</h4>
              <p className="text-gray-600 text-sm">March 2026</p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center border border-gray-100 hover:shadow-lg transition">
              <FaHeart className="text-4xl text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold">Mission</h4>
              <p className="text-gray-600 text-sm">Empowering Businesses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Products</span>
            <h2 className="text-3xl font-bold mt-2">Featured Solutions</h2>
            <p className="text-gray-600 mt-2">Explore our ready-to-deploy enterprise solutions</p>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl shadow">
              <p className="text-gray-500">No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link 
              to="/products" 
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors inline-flex items-center gap-2 group"
            >
              View All Products 
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl font-bold mt-2">What Our Clients Say</h2>
            <p className="text-gray-600 mt-2">Real feedback from real businesses</p>
          </div>
          {testimonials.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500">No testimonials yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link 
              to="/testimonials" 
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors inline-flex items-center gap-2 group"
            >
              Read All Testimonials 
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

            {/* ============================================ */}
      {/* AEO/GEO: FAQ Section for Google AI Overviews */}
      {/* ============================================ */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl font-bold mt-2">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-2">Quick answers about our services</p>
          </div>
          <div className="space-y-3">
            <details className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-200 transition-colors">
              <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">What services does Krynova Technologies offer?</summary>
              <p className="px-4 pb-4 text-gray-600 text-sm">We provide custom web solutions including HRMS software, property management systems, task management tools, WhatsApp automation bots, and enterprise-grade business applications. All solutions are 100% customizable to your business needs.</p>
            </details>
            <details className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-200 transition-colors">
              <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">How much does a custom web solution cost?</summary>
              <p className="px-4 pb-4 text-gray-600 text-sm">Pricing depends on project complexity. Basic solutions start from ₹25,000. Enterprise systems are custom-quoted. We offer free consultations and competitive pricing with no hidden costs.</p>
            </details>
            <details className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-200 transition-colors">
              <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">Where is Krynova Technologies located?</summary>
              <p className="px-4 pb-4 text-gray-600 text-sm">We are based in Agra, Uttar Pradesh, India. We serve clients nationwide including Torrent Power (Gujarat), Tech Mahindra (Pune), Romsons, Agra Chain, and Anna Infrastructure Limited.</p>
            </details>
            <details className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-200 transition-colors">
              <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">How long does it take to develop a web application?</summary>
              <p className="px-4 pb-4 text-gray-600 text-sm">Simple systems take 2-4 weeks. Enterprise solutions typically take 2-3 months. We provide regular updates and maintain transparent communication throughout the development process.</p>
            </details>
            <details className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-200 transition-colors">
              <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">Do you provide support after deployment?</summary>
              <p className="px-4 pb-4 text-gray-600 text-sm">Yes! We offer 24/7 premium support and maintenance packages. All our solutions come with a warranty period and ongoing support options to ensure your business runs smoothly.</p>
            </details>
          </div>
          {/* FAQPage Schema for Google */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "What services does Krynova Technologies offer?", "acceptedAnswer": { "@type": "Answer", "text": "Custom web solutions including HRMS software, property management systems, task management tools, WhatsApp automation bots, and enterprise-grade business applications." } },
                { "@type": "Question", "name": "How much does a custom web solution cost?", "acceptedAnswer": { "@type": "Answer", "text": "Pricing depends on complexity. Basic solutions from ₹25,000. Enterprise systems custom-quoted. Free consultation available." } },
                { "@type": "Question", "name": "Where is Krynova Technologies located?", "acceptedAnswer": { "@type": "Answer", "text": "Based in Agra, Uttar Pradesh, India. Serving clients nationwide." } },
                { "@type": "Question", "name": "How long does development take?", "acceptedAnswer": { "@type": "Answer", "text": "Simple systems: 2-4 weeks. Enterprise: 2-3 months with regular updates." } },
                { "@type": "Question", "name": "Do you provide post-deployment support?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, 24/7 premium support with warranty and ongoing maintenance." } }
              ]
            })}
          </script>
        </div>
      </section>
      

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Get a free consultation and discover how our custom solutions can help you scale.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Now <FaArrowRight />
              </Link>
              <Link 
                to="/products" 
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                Browse Products
              </Link>
            </div>
            <p className="mt-6 text-blue-200 text-sm">
              Join 50+ satisfied businesses already using our solutions
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;