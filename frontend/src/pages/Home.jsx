import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { 
  FaRocket, FaUsers, FaCode, FaShieldAlt, FaArrowRight, 
  FaCheckCircle, FaSpinner, FaStar, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter,
  FaAward, FaTrophy, FaMedal, FaBuilding, FaClock,
  FaHeart, FaBriefcase, FaChartBar, FaChevronDown,
  FaGlobe, FaServer, FaCloud, FaMobile, FaDesktop,
  FaLaptop, FaDatabase, FaPlug, FaCog, FaTools,
  FaHeadset, FaLock, FaUserShield,
  FaGraduationCap, FaCertificate, FaTachometerAlt,
  FaChartLine, FaCoins, FaRupeeSign, FaDollarSign,
  FaEuroSign, FaPoundSign, FaWallet, FaCreditCard,
  FaTag, FaShoppingCart, FaStore, FaBox, FaShippingFast,
  // Free Tools Icons
  FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel,
  FaQrcode, FaImage, FaDownload, FaUpload,
  FaPrint, FaCopy, FaFile,
  FaFileImage, FaFileArchive, FaFileExport, FaFileImport,
  FaMagic, FaPenFancy, FaFileSignature,
  FaUserEdit, FaRegFilePdf, FaRegFileWord, FaRegFileExcel,
  FaRegFileAlt, FaRegFileArchive, FaRegFileImage,
  FaArrowUp, FaArrowDown, FaExchangeAlt,
  // Website Creation Icons
  FaPalette, FaReact, FaNode, FaPython,
  FaDocker, FaAws, FaGitAlt, FaFigma,
  FaMicrophone, FaComments, FaMapPin
} from 'react-icons/fa';

// ============================================
// CONSTANTS
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL;
const PROJECTS_LIMIT = 4;
const TESTIMONIALS_LIMIT = 3;

// ============================================
// UI COMPONENTS
// ============================================

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="container py-20 text-center">
    <div className="flex justify-center items-center space-x-3">
      <FaSpinner className="text-4xl text-blue-600 animate-spin" />
      <p className="text-xl text-gray-600">Loading...</p>
    </div>
  </div>
);

// Stat Card
const StatCard = ({ icon: Icon, text, className = '' }) => (
  <span className={`bg-blue-800/50 px-4 py-2 rounded-full ${className}`}>
    <Icon className="inline mr-2" /> {text}
  </span>
);

// Feature Item
const FeatureItem = ({ icon: Icon, title, description, delay = 0 }) => (
  <div className="flex items-start gap-3 animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
      <Icon className="text-blue-600 text-lg" />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

// Enhanced Pricing Card with Website Plans
const PricingCard = ({ 
  title, 
  price, 
  currency = '₹', 
  features, 
  isPopular = false, 
  icon: Icon, 
  period = 'project',
  tag = '',
  delay = 0 
}) => (
  <div 
    className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up ${
      isPopular ? 'border-blue-600 shadow-xl relative' : 'border-gray-200 hover:border-blue-400'
    }`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/25">
        Most Popular
      </div>
    )}
    {tag && (
      <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
        {tag}
      </div>
    )}
    <div className="text-center">
      <div className="text-5xl text-blue-600 mb-4">{Icon && <Icon />}</div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <div className="mt-4">
        <span className="text-5xl font-bold text-gray-900">{currency}{price}</span>
        <span className="text-gray-500 text-sm ml-1">/{period}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">{period === 'project' ? 'One-time payment' : 'Starting price'}</p>
    </div>
    <ul className="mt-6 space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
          <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Link
      to="/contact"
      className={`mt-8 w-full py-3.5 rounded-xl font-semibold transition-all duration-300 block text-center ${
        isPopular
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:-translate-y-0.5'
      }`}
    >
      Get Started
    </Link>
  </div>
);

// Tool Card Component for Free Tools
const ToolCard = ({ icon: Icon, title, description, link, isPopular = false, delay = 0 }) => (
  <Link 
    to={link}
    className={`group bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up ${
      isPopular ? 'border-blue-600 shadow-xl relative' : 'border-gray-200 hover:border-blue-400'
    }`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {isPopular && (
      <div className="absolute -top-3 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
        Free
      </div>
    )}
    <div className="text-4xl text-blue-600 mb-4 group-hover:scale-110 transition-transform">
      <Icon />
    </div>
    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 text-sm mt-2">{description}</p>
    <span className="inline-flex items-center gap-1 mt-4 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
      Use Tool <FaArrowRight className="text-xs" />
    </span>
  </Link>
);

// Project Card
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

// Testimonial Card
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

// Counter Animation Component
const Counter = ({ target, label, icon: Icon, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, isVisible]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-blue-600">{count}{suffix}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
      {Icon && <Icon className="text-2xl text-gray-400 mt-2 mx-auto" />}
    </div>
  );
};

// ✅ Indian Cities for GEO Targeting
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

// ✅ Global Countries
const globalCountries = [
  "USA", "UK", "Canada", "Australia", "UAE", "Singapore", 
  "Germany", "France", "Japan", "South Korea", "Netherlands", 
  "Sweden", "Norway", "Denmark", "Finland", "New Zealand", 
  "Ireland", "Malaysia", "Thailand", "Vietnam", "Indonesia", 
  "Philippines", "South Africa", "Kenya", "Nigeria", "Egypt", 
  "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"
];

// ============================================
// MAIN HOME COMPONENT
// ============================================

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const siteUrl = window.location.origin;
const fetchData = useCallback(async () => {
  try {
    setError(null);
    const [projectsRes, testimonialsRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/projects`),
      axios.get(`${API_BASE_URL}/api/testimonials`)
    ]);

    // ✅ SAFE: Handle both array and object responses
    let testimonialsData = [];
    
    // Check if it's an array directly
    if (Array.isArray(testimonialsRes.data)) {
      testimonialsData = testimonialsRes.data;
    } 
    // Check if it's an object with a data property that's an array
    else if (testimonialsRes.data && typeof testimonialsRes.data === 'object') {
      if (Array.isArray(testimonialsRes.data.data)) {
        testimonialsData = testimonialsRes.data.data;
      } else if (Array.isArray(testimonialsRes.data.testimonials)) {
        testimonialsData = testimonialsRes.data.testimonials;
      } else {
        // Try to find any array property
        const arrayProp = Object.values(testimonialsRes.data).find(val => Array.isArray(val));
        if (arrayProp) {
          testimonialsData = arrayProp;
        }
      }
    }
    
    // Filter approved testimonials
    const approvedTestimonials = testimonialsData.filter(t => t.is_approved);
    
    // Handle projects data safely
    let projectsData = [];
    if (Array.isArray(projectsRes.data)) {
      projectsData = projectsRes.data;
    } else if (projectsRes.data && Array.isArray(projectsRes.data.data)) {
      projectsData = projectsRes.data.data;
    }
    
    setProjects(projectsData.slice(0, PROJECTS_LIMIT));
    setTestimonials(approvedTestimonials.slice(0, TESTIMONIALS_LIMIT));
  } catch (error) {
    console.error('Error fetching data:', error);
    setError('Failed to load data. Please try again later.');
    // Set empty arrays to prevent further errors
    setProjects([]);
    setTestimonials([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Website Creation Pricing Plans
  const websitePlans = [
    {
      icon: FaPalette,
      title: 'Basic Website',
      price: '15,000',
      features: [
        'Up to 5 Pages',
        'Responsive Design',
        'Basic SEO Setup',
        'Contact Form',
        'Social Media Integration',
        '1 Month Support',
        'Free Domain First Year'
      ],
      tag: 'Best for Startups'
    },
    {
      icon: FaReact,
      title: 'Professional Website',
      price: '35,000',
      features: [
        'Up to 15 Pages',
        'Advanced Responsive Design',
        'Complete SEO Optimization',
        'Blog/News Section',
        'Advanced Animations',
        'Database Integration',
        'Admin Dashboard',
        '3 Months Support',
        'Free Hosting 6 Months'
      ],
      isPopular: true,
      tag: 'Most Popular'
    },
    {
      icon: FaServer,
      title: 'Advanced Web App',
      price: '75,000',
      features: [
        'Unlimited Pages',
        'Custom Web Application',
        'Advanced Security',
        'API Integration',
        'Payment Gateway',
        'User Authentication',
        'Real-time Features',
        'Mobile App Ready',
        '6 Months Support',
        'Free Hosting 1 Year'
      ],
      tag: 'For Growing Businesses'
    },
    {
      icon: FaCloud,
      title: 'Enterprise Solution',
      price: 'Custom',
      features: [
        'Custom Enterprise Software',
        'Scalable Architecture',
        'AI & ML Integration',
        'Advanced Analytics',
        'Multiple Integrations',
        'Team Collaboration',
        '24/7 Premium Support',
        'SLA Guaranteed',
        'Dedicated Team',
        'Custom Quote'
      ],
      tag: 'For Large Enterprises'
    }
  ];

  // Free Tools Data
  const freeTools = [
    {
      icon: FaFileAlt,
      title: 'ATS Friendly Resume Builder',
      description: 'Create professional, ATS-optimized resumes that pass through applicant tracking systems.',
      link: '/tools/resume-builder',
      isPopular: true
    },
    {
      icon: FaPenFancy,
      title: 'Cover Letter Generator',
      description: 'Generate personalized cover letters that stand out to recruiters and hiring managers.',
      link: '/tools/cover-letter-generator'
    },
    {
      icon: FaQrcode,
      title: 'QR Code Generator',
      description: 'Create custom QR codes for websites, products, business cards, and marketing materials.',
      link: '/tools/qr-generator'
    },
    {
      icon: FaFilePdf,
      title: 'PDF to Image Converter',
      description: 'Convert PDF pages to high-quality JPG, PNG images. Perfect for presentations.',
      link: '/tools/pdf-to-image'
    },
    {
      icon: FaFileWord,
      title: 'PDF to Word Converter',
      description: 'Convert PDF documents to editable Word (DOCX) files while preserving formatting.',
      link: '/tools/pdf-to-word'
    },
    {
      icon: FaFileExcel,
      title: 'PDF to Excel Converter',
      description: 'Extract tables and data from PDFs to Excel spreadsheets for analysis and reporting.',
      link: '/tools/pdf-to-excel'
    },
    {
      icon: FaRegFileImage,
      title: 'Image to PDF Converter',
      description: 'Convert multiple images to a single PDF file with customizable layout and compression.',
      link: '/tools/image-to-pdf'
    },
    {
      icon: FaFileArchive,
      title: 'PDF Compressor',
      description: 'Compress PDF files to reduce size while maintaining quality. Great for email attachments.',
      link: '/tools/pdf-compressor'
    },
    {
      icon: FaExchangeAlt,
      title: 'Merge PDF Files',
      description: 'Merge multiple PDF files into one document with custom page order and orientation.',
      link: '/tools/merge-pdf'
    },
    {
      icon: FaFileExport,
      title: 'Split PDF Pages',
      description: 'Split large PDF files into separate pages or smaller documents with ease.',
      link: '/tools/split-pdf'
    },
    {
      icon: FaImage,
      title: 'Image Resizer & Optimizer',
      description: 'Resize and optimize images for web, social media, and print with batch processing.',
      link: '/tools/image-resizer'
    },
    {
      icon: FaMagic,
      title: 'Text to PDF Generator',
      description: 'Convert text, HTML, or markdown content into professional PDF documents instantly.',
      link: '/tools/text-to-pdf'
    }
  ];

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
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO COMBINED */}
      {/* ========================================== */}
      <Helmet>
        {/* ===== SEO TAGS ===== */}
        <title>Krynova Technologies - Best Web Development Company in India | Website Design & Development</title>
        <meta name="description" content="Krynova Technologies - India's leading web development company in Agra. We create custom websites, web applications, and enterprise solutions. From basic websites to advanced web applications with SEO, animations, and security. Trusted by 50+ businesses. Affordable pricing starting from ₹15,000. Serving clients in all Indian cities and globally." />
        <meta name="keywords" content="Krynova Technologies, web development company India, website design company, custom web development, website creation, web application development, best web development company Agra, affordable website design, professional web development, enterprise software development, India web developers, global web development" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* ✅ Canonical Tag */}
        <link rel="canonical" href={siteUrl} />
        
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
        <meta name="question" content="Which is the best web development company in India?" />
        <meta name="answer" content="Krynova Technologies is India's leading web development company based in Agra, offering custom websites, web applications, and enterprise solutions. Trusted by 50+ businesses with 8+ years of experience. Pricing starting from ₹15,000." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="web development company India, website design, custom web development, best web developer Agra, affordable website design, enterprise software India" />
        
        {/* ===== AEO - Rich Snippets ===== */}
        <meta name="rich-snippet" content="organization" />
        <meta name="structured-data" content="true" />
        
        {/* ===== Open Graph ===== */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content="Krynova Technologies - Best Web Development Company in India | Website Design & Development" />
        <meta property="og:description" content="Krynova Technologies - India's leading web development company in Agra. Custom websites, web applications, and enterprise solutions. Trusted by 50+ businesses. Starting from ₹15,000." />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:locale" content="en_IN" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content="Krynova Technologies - Best Web Development Company in India" />
        <meta name="twitter:description" content="Custom websites, web applications, and enterprise solutions. Trusted by 50+ businesses. Starting from ₹15,000." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h1>Krynova Technologies - Best Web Development Company in India</h1>
        <p>Krynova Technologies is India's leading web development company based in Agra, offering custom websites, web applications, and enterprise solutions. Trusted by 50+ businesses with 8+ years of experience.</p>
        <p>We serve clients in Agra, Delhi, Mumbai, Bangalore, Hyderabad, Pune, Kolkata, and all major cities in India, as well as international clients in USA, UK, Canada, Australia, UAE, and worldwide.</p>
        <ul>
          <li>Custom Website Design - Beautiful, responsive websites</li>
          <li>Web Application Development - Custom web applications</li>
          <li>E-commerce Solutions - Online stores and marketplaces</li>
          <li>Enterprise Web Solutions - Scalable enterprise websites</li>
          <li>HRMS Software - Complete human resource management</li>
          <li>Property Management System - Real estate management</li>
          <li>WhatsApp Automation - AI-powered business communication</li>
        </ul>
        <p>Affordable pricing starting from ₹15,000. Free consultation available.</p>
      </div>

      {/* ========================================== */}
      {/* ✅ SCHEMA.ORG - Organization Schema */}
      {/* ========================================== */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Krynova Technologies",
          "description": "India's leading web development company in Agra. Custom websites, web applications, and enterprise solutions.",
          "url": siteUrl,
          "logo": `${siteUrl}/logo.png`,
          "foundingDate": "2024-03",
          "founders": [
            {
              "@type": "Person",
              "name": "Shivam Sharma",
              "jobTitle": "Founder & CEO",
              "description": "Full Stack Developer with 8+ years of experience, building 50+ enterprise systems."
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
          "areaServed": indianCities,
          "availableLanguage": ["English", "Hindi", "Bengali", "Telugu", "Tamil", "Urdu", "Gujarati", "Marathi", "Kannada", "Malayalam", "Punjabi"],
          "offers": {
            "@type": "Offer",
            "description": "Custom web solutions for businesses",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "Starting from ₹15,000",
              "priceCurrency": "INR"
            }
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          }
        })}
      </script>

      {/* ========================================== */}
      {/* HERO SECTION */}
      {/* ========================================== */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-10"></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <FaCode className="text-4xl text-blue-400/30" />
          </div>
          <div className="absolute bottom-20 right-10 animate-float-delayed">
            <FaCloud className="text-5xl text-blue-400/30" />
          </div>
          <div className="absolute top-1/2 left-1/4 animate-float-slow">
            <FaRocket className="text-3xl text-yellow-400/20" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delayed">
            <FaFileAlt className="text-3xl text-green-400/20" />
          </div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="/logo.png" 
                alt="Krynova Technologies Logo" 
                className="h-20 w-auto md:h-24 hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 bg-blue-800/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-blue-700/50">
                <FaStar className="text-yellow-400" />
                India's Leading Web Development Company
              </span>
              <span className="inline-flex items-center gap-2 bg-green-800/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-green-700/50">
                <FaTools className="text-yellow-400" />
                12 Free Online Tools
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Web Solutions</span>
              <br />
              <span className="text-blue-200">for Every Business Need</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-slide-up max-w-3xl mx-auto">
              From basic websites to advanced web applications — we build custom solutions with SEO, animations, and enterprise-grade security. <strong className="text-yellow-400">Starting from ₹15,000</strong>
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up-delayed">
              <Link 
                to="/contact" 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 group"
              >
                Get Free Quote <FaArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
              <a 
                href="#pricing"
                className="border-2 border-white/50 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 backdrop-blur-sm"
              >
                View Pricing
              </a>
              <Link 
                to="/products"
                className="border-2 border-green-400/50 text-green-400 px-8 py-3 rounded-lg font-semibold hover:bg-green-400 hover:text-blue-900 transition-all duration-300"
              >
                Our Products
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-yellow-400">8+</div>
                <div className="text-sm text-blue-200">Years Experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-yellow-400">50+</div>
                <div className="text-sm text-blue-200">Systems Built</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-yellow-400">100%</div>
                <div className="text-sm text-blue-200">Client Satisfaction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-yellow-400">24/7</div>
                <div className="text-sm text-blue-200">Premium Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* WEBSITE CREATION PRICING SECTION */}
      {/* ========================================== */}
      <section id="pricing" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaRocket /> Website Creation Plans
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your <span className="gradient-text">Website Plan</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From simple business websites to complex web applications — we have a plan for every budget and requirement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {websitePlans.map((plan, index) => (
              <PricingCard
                key={index}
                {...plan}
                delay={index * 100}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-500 text-sm">
              * All prices are inclusive of GST. Custom quotes available for enterprise solutions.
              <br />
              Get a <strong>free consultation</strong> to discuss your specific requirements.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Free Consultation <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* TRUST & CREDIBILITY */}
      {/* ========================================== */}
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
              <FaTools className="text-blue-600 text-xl" />
              <span>12 Free Tools</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaGlobe className="text-blue-600 text-xl" />
              <span>Global Presence</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* ABOUT SECTION */}
      {/* ========================================== */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl font-bold mb-4 mt-2">Why Choose Krynova?</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in March 2024, Krynova Technologies is a cutting-edge technology company dedicated to providing 
                custom web solutions for businesses of all sizes and industries. We also offer <strong>12 FREE online tools</strong> 
                to help professionals and businesses boost their productivity.
              </p>
              <div className="space-y-4">
                <FeatureItem 
                  icon={FaRocket}
                  title="Our Vision"
                  description="To become the go-to partner for businesses seeking innovative, scalable, and secure web solutions."
                  delay={0}
                />
                <FeatureItem 
                  icon={FaShieldAlt}
                  title="Our Mission"
                  description="Empower businesses with custom software that drives growth, efficiency, and customer satisfaction."
                  delay={100}
                />
                <FeatureItem 
                  icon={FaUsers}
                  title="Our Commitment"
                  description="Deliver excellence with 100% client satisfaction, transparent communication, and long-term support."
                  delay={200}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-blue-900">Why Choose Krynova?</h3>
                <ul className="space-y-3">
                  {[
                    '100% Custom Solutions',
                    'Ready-to-Deploy Demos',
                    'Complete SEO & Performance',
                    '24/7 Support & Maintenance',
                    'Free Consultation',
                    'Cost-Effective Pricing',
                    'Enterprise-Grade Security',
                    '12 Free Online Tools'
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

      {/* ========================================== */}
      {/* FOUNDER SECTION */}
      {/* ========================================== */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Leadership</span>
              <h2 className="text-3xl font-bold mt-2">Meet Our Founder</h2>
              <p className="text-gray-600 mt-2">Driven by innovation and a passion for technology</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0 relative">
                  <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-5xl md:text-7xl font-bold shadow-xl ring-4 ring-blue-200 overflow-hidden">
                    <img 
                      src="/founder-shivam-sharma.png" 
                      alt="Shivam Sharma - Founder & CEO of Krynova Technologies" 
                      className="w-full h-full rounded-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/founder-shivam-sharma';
                        e.target.onerror = () => {
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          if (parent) {
                            parent.innerHTML = '';
                            const initials = document.createElement('span');
                            initials.textContent = 'SS';
                            initials.className = 'text-white text-5xl md:text-7xl font-bold';
                            parent.appendChild(initials);
                            parent.className = parent.className + ' flex items-center justify-center';
                          }
                        };
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    CEO
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">Shivam Sharma</h3>
                  <p className="text-blue-600 font-semibold">Founder & CEO, Krynova Technologies</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Full Stack Developer</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">8+ Years Experience</span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">Enterprise Solutions</span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">50+ Systems Built</span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Data Analyst</span>
                  </div>
                  <p className="text-gray-600 mt-4 leading-relaxed">
                    Shivam Sharma is an experienced Full Stack Developer and Data Analyst with over 8 years of industry experience. 
                    He has successfully built and deployed 50+ enterprise systems for leading organizations including
                    <strong> Torrent Power Limited</strong>, <strong>Tech Mahindra</strong>, <strong>Romsons</strong>,
                    <strong> Agra Chain</strong>, and <strong>Anna Infrastructure Limited</strong>.
                    His expertise spans across custom software development, data analytics, and enterprise architecture.
                  </p>
                  <p className="text-gray-600 mt-2">
                    Shivam specializes in <strong>website creation from basic to advanced</strong>, custom web applications, 
                    and enterprise solutions with modern technologies like React, Node.js, Python, and cloud platforms.
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

      {/* ========================================== */}
      {/* EXPERIENCE & CLIENTS */}
      {/* ========================================== */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Experience</span>
            <h2 className="text-3xl font-bold mt-2">Trusted By Leading Enterprises</h2>
            <p className="text-gray-600 mt-2">8+ years of experience building solutions for industry leaders</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center shadow-xl">
              <div className="text-4xl font-bold">8+</div>
              <div className="text-sm text-blue-100">Years Experience</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center shadow-xl">
              <div className="text-4xl font-bold">50+</div>
              <div className="text-sm text-green-100">Systems Built</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl">
              <div className="text-4xl font-bold">100+</div>
              <div className="text-sm text-purple-100">Websites Created</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white text-center shadow-xl">
              <div className="text-4xl font-bold">100%</div>
              <div className="text-sm text-orange-100">Client Satisfaction</div>
            </div>
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
                className={`bg-gradient-to-r ${client.color} text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}
              >
                <FaBuilding className="text-2xl mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-sm">{client.name}</p>
                <p className="text-xs opacity-80">Enterprise Client</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SERVICES SECTION */}
      {/* ========================================== */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Services</span>
            <h2 className="text-3xl font-bold mt-2">What We Offer</h2>
            <p className="text-gray-600 mt-2">Comprehensive web solutions for every business need</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FaServer, title: 'Custom Web Development', desc: 'Tailored web applications built with modern technologies for your specific business needs.' },
              { icon: FaPalette, title: 'Website Design', desc: 'Beautiful, responsive, and user-friendly website designs that convert visitors into customers.' },
              { icon: FaDatabase, title: 'HRMS Solutions', desc: 'Complete human resource management systems with payroll, attendance, and performance tracking.' },
              { icon: FaBuilding, title: 'Property Management', desc: 'Advanced property management systems for real estate businesses with tenant management and rent collection.' },
              { icon: FaMobile, title: 'WhatsApp Automation', desc: 'AI-powered WhatsApp bots for lead generation, customer support, and automated communication.' },
              { icon: FaChartLine, title: 'Data Analytics', desc: 'Comprehensive data analytics solutions with real-time dashboards and business intelligence.' },
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center text-blue-600 text-2xl group-hover:scale-110 transition-transform">
                  <service.icon />
                </div>
                <h3 className="text-lg font-bold mt-4 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{service.desc}</p>
                <Link to="/contact" className="text-blue-600 font-semibold text-sm mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn More <FaArrowRight className="text-xs" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FEATURED PRODUCTS */}
      {/* ========================================== */}
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

      {/* ========================================== */}
      {/* TESTIMONIALS */}
      {/* ========================================== */}
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

      {/* ========================================== */}
      {/* FREE TOOLS SECTION */}
      {/* ========================================== */}
      <section id="free-tools" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaTools /> Free Tools
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Free Online Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Boost your productivity with our completely free online tools. No sign-up required, unlimited usage!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {freeTools.map((tool, index) => (
              <ToolCard key={index} {...tool} delay={index * 50} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link 
              to="/tools" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore All Tools <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FAQ SECTION */}
      {/* ========================================== */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl font-bold mt-2">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-2">Quick answers about our services and free tools</p>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "What services does Krynova Technologies offer?",
                a: "We provide custom web solutions including website creation (basic to advanced), HRMS software, property management systems, task management tools, WhatsApp automation bots, and enterprise-grade business applications. Our expertise covers everything from simple business websites to complex web applications."
              },
              {
                q: "How much does a website cost?",
                a: "Our website creation pricing starts from ₹15,000 for a basic website (up to 5 pages). Professional websites with advanced features start from ₹35,000. Advanced web applications with custom functionality start from ₹75,000. Enterprise solutions are custom-quoted based on your specific requirements."
              },
              {
                q: "What is included in a basic website package?",
                a: "Our basic website package includes up to 5 pages, responsive design, basic SEO setup, contact form, social media integration, 1 month support, and free domain for the first year. Perfect for startups and small businesses."
              },
              {
                q: "Where is Krynova Technologies located?",
                a: "We are based in Agra, Uttar Pradesh, India. We serve clients nationwide including Torrent Power (Gujarat), Tech Mahindra (Pune), Romsons, Agra Chain, and Anna Infrastructure Limited, as well as international clients worldwide."
              },
              {
                q: "How long does it take to create a website?",
                a: "Simple websites take 1-2 weeks. Professional websites take 2-4 weeks. Advanced web applications typically take 1-3 months. We provide regular updates and transparent communication throughout the development process."
              },
              {
                q: "Do you provide free online tools?",
                a: "Yes! We offer 12+ free online tools including ATS-friendly Resume Builder, Cover Letter Generator, QR Code Generator, PDF to Image Converter, PDF to Word Converter, PDF to Excel Converter, Image to PDF Converter, PDF Compressor, Merge PDF, Split PDF, Image Resizer, and Text to PDF Generator. All tools are completely free to use."
              },
              {
                q: "Do you offer post-deployment support?",
                a: "Yes! We offer 24/7 premium support and maintenance packages. All our solutions come with a warranty period and ongoing support options to ensure your business runs smoothly."
              }
            ].map((faq, index) => (
              <details 
                key={index}
                className={`bg-gray-50 rounded-xl overflow-hidden border transition-all duration-300 ${
                  activeFaq === index ? 'border-blue-400 shadow-md' : 'border-gray-200 hover:border-blue-200'
                }`}
                onToggle={(e) => setActiveFaq(e.target.open ? index : null)}
              >
                <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex items-center justify-between">
                  <span>{faq.q}</span>
                  <FaChevronDown className={`text-blue-600 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
                </summary>
                <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>

          {/* ✅ FAQ Schema */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "What services does Krynova Technologies offer?", "acceptedAnswer": { "@type": "Answer", "text": "Custom web solutions including website creation (basic to advanced), HRMS, property management, task management, WhatsApp automation, and enterprise applications." } },
                { "@type": "Question", "name": "How much does a website cost?", "acceptedAnswer": { "@type": "Answer", "text": "Basic website: ₹15,000. Professional: ₹35,000. Advanced web app: ₹75,000. Enterprise: custom-quoted." } },
                { "@type": "Question", "name": "Where is Krynova Technologies located?", "acceptedAnswer": { "@type": "Answer", "text": "Agra, Uttar Pradesh, India. Serving clients nationwide and globally." } },
                { "@type": "Question", "name": "Do you provide free online tools?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! 12+ free tools including Resume Builder, Cover Letter Generator, QR Code Generator, PDF converters, and more." } }
              ]
            })}
          </script>
        </div>
      </section>

      {/* ========================================== */}
      {/* FINAL CTA SECTION */}
      {/* ========================================== */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Website?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Get a free consultation and discover how our custom solutions can help your business grow online.
              <br />
              <span className="text-yellow-300 text-lg">From basic websites to advanced web applications — we've got you covered!</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                <FaMapPin /> {indianCities.length}+ Indian Cities
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                <FaGlobe /> {globalCountries.length}+ Countries
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                <FaTrophy /> 50+ Systems Built
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 inline-flex items-center gap-2 transform hover:-translate-y-1"
              >
                Get Free Quote <FaArrowRight />
              </Link>
              <a 
                href="#pricing"
                className="border-2 border-white/50 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 backdrop-blur-sm"
              >
                View Pricing Plans
              </a>
              <Link 
                to="/tools"
                className="border-2 border-green-400/50 text-green-400 px-8 py-3 rounded-lg font-semibold hover:bg-green-400 hover:text-blue-900 transition-all duration-300"
              >
                Try Free Tools
              </Link>
            </div>
            <p className="mt-6 text-blue-200 text-sm">
              Join 50+ satisfied businesses already using our solutions | Trusted by enterprises across India and globally
            </p>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* CSS Animations */}
      {/* ========================================== */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s ease-out; }
        .animate-slide-up-delayed { animation: slideUp 0.8s ease-out 0.3s both; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: floatDelayed 3.5s ease-in-out infinite 1s; }
        .animate-float-slow { animation: floatSlow 4s ease-in-out infinite 0.5s; }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
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
        html { scroll-behavior: smooth; }
      `}} />
    </>
  );
};

export default Home;