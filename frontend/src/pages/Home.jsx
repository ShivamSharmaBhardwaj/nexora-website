// frontend/src/pages/Home.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
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
  FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel,
  FaQrcode, FaImage, FaDownload, FaUpload,
  FaPrint, FaCopy, FaFile,
  FaFileImage, FaFileArchive, FaFileExport, FaFileImport,
  FaMagic, FaPenFancy, FaFileSignature,
  FaUserEdit, FaRegFilePdf, FaRegFileWord, FaRegFileExcel,
  FaRegFileAlt, FaRegFileArchive, FaRegFileImage,
  FaArrowUp, FaArrowDown, FaExchangeAlt,
  FaPalette, FaReact, FaNode, FaPython,
  FaDocker, FaAws, FaGitAlt, FaFigma,
  FaMicrophone, FaComments, FaMapPin,
  FaMoon, FaSun, FaGem, FaCubes, FaCube,
  FaBorderAll, FaLayerGroup, FaQuestionCircle, FaBars, FaTimes,
  FaTextHeight, FaUserTie
} from 'react-icons/fa';

// ============================================
// CONSTANTS
// ============================================
const PROJECTS_LIMIT = 4;
const TESTIMONIALS_LIMIT = 3;

// ============================================
// LOADING SKELETON
// ============================================
const LoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div className="p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-blue-200/50 shadow-2xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin text-5xl text-blue-600 dark:text-blue-400">
          <FaSpinner />
        </div>
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  </div>
);

// ============================================
// CONTROLS PANEL
// ============================================
const ControlsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center"
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
      </button>
      {isOpen && (
        <div className="absolute bottom-20 right-0 p-4 rounded-2xl min-w-[200px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <span className="text-sm font-medium">Theme</span>
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// FOUNDER SECTION - Click to Expand
// ============================================
const FounderSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Clickable Header */}
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
                  <FaUserTie />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Meet Our Founder</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Shivam Sharma - Full Stack Developer & Data Analyst</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-blue-600 dark:text-blue-400"
              >
                <FaChevronDown className="text-xl" />
              </motion.div>
            </div>
          </div>

          {/* Expandable Content */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-4 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-blue-200/50 dark:border-blue-500/20 overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Founder Image */}
                <div className="flex justify-center">
                  <div className="relative">
                    <img 
                      src="/founder-shivam-sharma.png" 
                      alt="Shivam Sharma - Founder of Krynova Technologies" 
                      className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-blue-500 shadow-2xl"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Founder & CEO
                    </div>
                  </div>
                </div>

                {/* Founder Details */}
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Shivam Sharma</h4>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">Full Stack Developer & Data Analyst</p>
                  
                  <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <FaAward className="text-yellow-500" />
                      <span><strong>8+ Years</strong> of Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaServer className="text-blue-500" />
                      <span><strong>50+ Systems</strong> Built & Deployed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-green-500" />
                      <span>Led teams for <strong>Torrent Power, Tech Mahindra, Romsons</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGraduationCap className="text-purple-500" />
                      <span>Expert in <strong>Python, React, Node.js, Data Analytics</strong></span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <a 
                      href="https://linkedin.com/in/shivam-sharma-bhardwaj" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    >
                      <FaLinkedin className="text-2xl" />
                    </a>
                    <a 
                      href="https://github.com/ShivamSharmaBhardwaj" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                    >
                      <FaGithub className="text-2xl" />
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600 transition"
                    >
                      <FaTwitter className="text-2xl" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// ============================================
// FEATURE ITEM
// ============================================
const FeatureItem = ({ icon: Icon, title, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`p-2.5 rounded-lg flex-shrink-0 ${colorClasses[color]}`}>
        <Icon className="text-lg" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};

// ============================================
// PRICING CARD - UPDATED WITH REALISTIC FEATURES
// ============================================
const PricingCard = ({ 
  title, price, features, isPopular = false, icon: Icon, tag = '', gradient = 'from-blue-500 to-indigo-500' 
}) => (
  <div className={`relative p-6 rounded-2xl transition-all duration-300 ${
    isPopular 
      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20' 
      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl'
  }`}>
    {isPopular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg shadow-blue-500/25">
        <FaStar className="inline mr-1 text-yellow-300 text-[10px]" /> Most Popular
      </div>
    )}
    {tag && (
      <div className="absolute top-2 right-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-[10px] font-semibold">
        {tag}
      </div>
    )}
    <div className="text-center">
      <div className={`text-4xl mb-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {Icon && <Icon />}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
      <div className="mt-2">
        <span className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          ₹{price}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">/project</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Affordable one-time payment</p>
    </div>
    <ul className="mt-4 space-y-1.5">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
          <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-[10px]" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Link to="/contact" className={`mt-4 w-full py-2.5 rounded-xl font-semibold transition-all duration-300 block text-center text-sm ${
      isPopular
        ? `bg-gradient-to-r ${gradient} text-white hover:shadow-lg`
        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}>
      Get Started
    </Link>
  </div>
);

// ============================================
// TOOL CARD
// ============================================
const ToolCard = ({ icon: Icon, title, description, link, isPopular = false }) => (
  <Link to={link} className={`group block p-4 rounded-xl transition-all duration-300 ${
    isPopular 
      ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500/50 shadow-lg' 
      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl'
  }`}>
    {isPopular && (
      <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-lg shadow-green-500/30 mb-1">
        <FaGem className="inline mr-1 text-yellow-300 text-[8px]" /> Free
      </div>
    )}
    <div className="text-2xl text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
      <Icon />
    </div>
    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">{description}</p>
  </Link>
);

// ============================================
// PROJECT CARD
// ============================================
const ProjectCard = ({ project }) => {
  const gradients = ['from-blue-500 to-indigo-500', 'from-purple-500 to-pink-500', 'from-green-500 to-emerald-500', 'from-orange-500 to-red-500'];
  const gradient = gradients[project.id % gradients.length] || gradients[0];

  return (
    <Link to={`/products/${project.id}`} className="block p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className={`text-2xl mb-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
        <FaCode />
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white">{project.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mt-1">
        {project.short_desc || project.description?.substring(0, 60) || ''}
      </p>
      <div className="text-blue-600 dark:text-blue-400 font-semibold text-xs mt-2 group-hover:translate-x-1 transition-transform">
        View Details →
      </div>
    </Link>
  );
};

// ============================================
// TESTIMONIAL CARD
// ============================================
const TestimonialCard = ({ testimonial, index }) => {
  const colors = ['from-blue-500 to-indigo-500', 'from-purple-500 to-pink-500', 'from-green-500 to-emerald-500'];
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 bg-gradient-to-r ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0`}>
          {testimonial.client_name?.charAt(0) || '?'}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{testimonial.client_name}</h4>
          <p className="text-gray-500 dark:text-gray-400 text-xs">{testimonial.client_company || 'Client'}</p>
        </div>
      </div>
      <div className="flex text-yellow-400 text-xs mb-1">
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < (testimonial.rating || 0) ? '★' : '☆'}</span>
        ))}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-xs italic">"{testimonial.feedback}"</p>
    </div>
  );
};

// ============================================
// COUNTER
// ============================================
const Counter = ({ target, label, icon: Icon, suffix = '', color = 'from-blue-500 to-indigo-500' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
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
      if (current >= target) { setCount(target); clearInterval(timer); } 
      else { setCount(Math.floor(current)); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, isVisible]);

  return (
    <div ref={ref} className="text-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {count}{suffix}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
      {Icon && <Icon className="text-xl text-gray-400 dark:text-gray-500 mt-1 mx-auto" />}
    </div>
  );
};

// ============================================
// FAQ ITEM
// ============================================
const FAQItem = ({ faq, index, activeFaq, setActiveFaq }) => {
  const isOpen = activeFaq === index;
  return (
    <div className={`rounded-xl overflow-hidden border transition-all duration-300 ${
      isOpen 
        ? 'border-blue-500/50 dark:border-blue-400/50 shadow-lg shadow-blue-500/10 bg-blue-50/50 dark:bg-blue-900/10' 
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-500/30'
    }`}>
      <button
        onClick={() => setActiveFaq(isOpen ? null : index)}
        className="w-full p-3 font-semibold text-gray-900 dark:text-white text-sm flex items-center justify-between text-left"
      >
        <span className="pr-2">{faq.q}</span>
        <FaChevronDown className={`text-blue-600 dark:text-blue-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-3 pb-3">
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
};

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

  // WEBSITE PLANS - UPDATED WITH REALISTIC FEATURES
  const websitePlans = [
    { 
      icon: FaPalette, 
      title: 'Basic Website', 
      price: '15,000', 
      features: [
        'Up to 5 Pages',
        'Responsive Design (Mobile Friendly)',
        'Basic SEO Optimization',
        'Contact Form Integration',
        'Social Media Links',
        'Google Maps Integration',
        '1 Month Free Support',
        'Free Domain for 1 Year',
        'SSL Certificate Included'
      ], 
      tag: 'Best for Startups', 
      gradient: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: FaReact, 
      title: 'Business Website', 
      price: '35,000', 
      features: [
        'Up to 15 Pages',
        'Advanced Responsive Design',
        'Complete SEO Optimization',
        'Blog/News Section',
        'Advanced Animations',
        'Database Integration',
        'Admin Dashboard',
        '3 Months Free Support',
        'Free Hosting for 6 Months',
        'SSL Certificate Included',
        'Google Analytics Setup',
        '1 Year Domain Free'
      ], 
      isPopular: true, 
      tag: 'Most Popular', 
      gradient: 'from-purple-500 to-pink-500' 
    },
    { 
      icon: FaServer, 
      title: 'Advanced Web App', 
      price: '75,000', 
      features: [
        'Unlimited Pages',
        'Custom Web Application',
        'Advanced Security',
        'REST API Integration',
        'Payment Gateway Integration',
        'User Authentication System',
        'Real-time Features',
        'Mobile App Ready (PWA)',
        '6 Months Free Support',
        'Free Hosting for 1 Year',
        'SSL Certificate Included',
        'Custom Domain Setup',
        'Performance Optimization'
      ], 
      tag: 'For Growing Business', 
      gradient: 'from-green-500 to-emerald-500' 
    },
    { 
      icon: FaCloud, 
      title: 'Enterprise Solution', 
      price: 'Custom', 
      features: [
        'Custom Enterprise Software',
        'Scalable Architecture',
        'AI & ML Integration',
        'Advanced Analytics Dashboard',
        'Multiple Third-party Integrations',
        'Team Collaboration Tools',
        '24/7 Premium Support',
        'SLA Guaranteed',
        'Dedicated Development Team',
        'Custom Quote Based on Requirements',
        'On-premise or Cloud Deployment'
      ], 
      tag: 'For Large Enterprises', 
      gradient: 'from-orange-500 to-red-500' 
    }
  ];

  const freeTools = [
    { icon: FaFileAlt, title: 'Resume Builder', description: 'Create ATS-friendly resumes', link: '/tools/resume-builder', isPopular: true },
    { icon: FaPenFancy, title: 'Cover Letter', description: 'Generate personalized cover letters', link: '/tools/cover-letter' },
    { icon: FaQrcode, title: 'QR Generator', description: 'Create custom QR codes', link: '/tools/qr-generator' },
    { icon: FaFilePdf, title: 'PDF to Image', description: 'Convert PDF to images', link: '/tools/pdf-to-image' },
    { icon: FaFileWord, title: 'PDF to Word', description: 'Convert PDF to editable DOCX', link: '/tools/pdf-to-word' },
    { icon: FaFileExcel, title: 'PDF to Excel', description: 'Extract data to spreadsheets', link: '/tools/pdf-to-excel' },
    { icon: FaRegFileImage, title: 'Image to PDF', description: 'Convert images to PDF', link: '/tools/image-to-pdf' },
    { icon: FaFileArchive, title: 'PDF Compressor', description: 'Compress PDF files', link: '/tools/pdf-compressor' },
    { icon: FaExchangeAlt, title: 'Merge PDF', description: 'Combine multiple PDFs', link: '/tools/merge-pdf' },
    { icon: FaFileExport, title: 'Split PDF', description: 'Split PDF into pages', link: '/tools/split-pdf' },
    { icon: FaImage, title: 'Image Resizer', description: 'Resize and optimize images', link: '/tools/image-resizer' },
    { icon: FaMagic, title: 'Text to PDF', description: 'Convert text to PDF', link: '/tools/text-to-pdf' }
  ];

  const faqs = [
    { q: "What services does Krynova Technologies offer?", a: "We provide custom web solutions including website creation, HRMS software, property management systems, WhatsApp automation bots, and enterprise applications." },
    { q: "How much does a website cost?", a: "Our website creation starts from ₹15,000 for a basic website. Professional websites with advanced features start from ₹35,000." },
    { q: "What is included in a basic website package?", a: "Up to 5 pages, responsive design, basic SEO, contact form, social media integration, 1 month support, and free domain for 1 year." },
    { q: "Where is Krynova Technologies located?", a: "We are based in Agra, Uttar Pradesh, India. We serve clients nationwide and internationally." },
    { q: "How long does it take to create a website?", a: "Simple websites take 1-2 weeks. Professional websites take 2-4 weeks. Advanced web applications take 1-3 months." },
    { q: "Do you provide free online tools?", a: "Yes! We offer 12+ free online tools including ATS-friendly Resume Builder, Cover Letter Generator, QR Code Generator, and PDF converters." }
  ];

  const services = [
    { icon: FaServer, title: 'Custom Web Development', desc: 'Tailored web applications for your business needs.', color: 'blue' },
    { icon: FaPalette, title: 'Website Design', desc: 'Beautiful, responsive websites that convert visitors.', color: 'purple' },
    { icon: FaDatabase, title: 'HRMS Solutions', desc: 'Complete human resource management systems.', color: 'green' },
    { icon: FaBuilding, title: 'Property Management', desc: 'Advanced systems for real estate businesses.', color: 'orange' },
    { icon: FaMobile, title: 'WhatsApp Automation', desc: 'AI-powered WhatsApp bots for customer support.', color: 'teal' },
    { icon: FaChartLine, title: 'Data Analytics', desc: 'Real-time dashboards and business intelligence.', color: 'pink' }
  ];

  const staticProjects = [
    { id: 1, title: 'Enterprise HRMS', description: 'Complete HR management system with payroll, attendance, and performance tracking.', short_desc: 'Complete HR management system.' },
    { id: 2, title: 'Property Management', description: 'Advanced property management for real estate with tenant management and rent collection.', short_desc: 'Advanced property management system.' },
    { id: 3, title: 'WhatsApp Business Bot', description: 'AI-powered WhatsApp automation for lead generation, customer support, and communication.', short_desc: 'AI-powered WhatsApp automation.' },
    { id: 4, title: 'Business Management', description: 'Comprehensive business operations platform for growing enterprises.', short_desc: 'Comprehensive business platform.' }
  ];

  const staticTestimonials = [
    { client_name: 'Rahul Singh', client_company: 'Torrent Power', feedback: 'Krynova delivered an exceptional HRMS solution that streamlined our entire HR operations.', rating: 5 },
    { client_name: 'Priya Sharma', client_company: 'Tech Mahindra', feedback: 'The property management system developed by Krynova is robust and user-friendly.', rating: 5 },
    { client_name: 'Amit Kumar', client_company: 'Romsons', feedback: 'Professional team with excellent communication. Highly recommend their services.', rating: 5 }
  ];

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      try {
        const [projectsRes, testimonialsRes] = await Promise.all([
          fetch('/api/projects').then(r => r.json()),
          fetch('/api/testimonials/all').then(r => r.json())
        ]);
        if (projectsRes.data) {
          setProjects(projectsRes.data.slice(0, PROJECTS_LIMIT));
        } else {
          setProjects(staticProjects);
        }
        if (testimonialsRes.data) {
          setTestimonials(testimonialsRes.data.slice(0, TESTIMONIALS_LIMIT));
        } else {
          setTestimonials(staticTestimonials);
        }
      } catch {
        setProjects(staticProjects);
        setTestimonials(staticTestimonials);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setProjects(staticProjects);
      setTestimonials(staticTestimonials);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <ControlsPanel />

      <Helmet>
        <title>Krynova Technologies - Best Web Development Company in India</title>
        <meta name="description" content="Krynova Technologies - India's leading web development company in Agra. Custom websites, web applications, and enterprise solutions. Starting from ₹15,000." />
        <meta name="keywords" content="Krynova Technologies, web development company India, website design company, custom web development" />
        <link rel="canonical" href={siteUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content="Krynova Technologies - Best Web Development Company in India" />
        <meta property="og:description" content="Custom websites, web applications, and enterprise solutions. Trusted by 50+ businesses." />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Krynova Technologies - Best Web Development Company in India" />
        <meta name="twitter:description" content="Custom websites, web applications, and enterprise solutions." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white py-16 md:py-20 min-h-[500px] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-48 h-48 bg-yellow-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="Krynova Technologies" className="h-16 w-auto md:h-20" loading="lazy" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-xs shadow-lg">
                <FaStar className="inline mr-1 text-yellow-400" /> India's Leading Web Dev Company
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-xs shadow-lg">
                <FaTools className="inline mr-1 text-yellow-400" /> 12 Free Tools
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Web Solutions</span>
              <br />
              <span className="text-blue-200 text-2xl md:text-3xl">for Every Business Need</span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              From basic websites to advanced web applications — we build custom solutions with SEO, animations, and enterprise-grade security. <strong className="text-yellow-400">Starting from ₹15,000</strong>
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2 text-sm">
                Get Free Quote <FaArrowRight />
              </Link>
              <a href="#pricing" className="border border-white/30 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 text-sm">
                View Pricing
              </a>
              <Link to="/products" className="border border-green-400/30 text-green-400 px-6 py-2.5 rounded-xl font-semibold hover:bg-green-400/10 transition-all duration-300 text-sm">
                Our Products
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 max-w-3xl mx-auto">
              {[
                { value: '8+', label: 'Years Experience', icon: FaAward },
                { value: '50+', label: 'Systems Built', icon: FaServer },
                { value: '100%', label: 'Client Satisfaction', icon: FaStar },
                { value: '24/7', label: 'Premium Support', icon: FaHeadset }
              ].map((stat, index) => (
                <div key={index} className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg text-center">
                  <div className="text-xl font-bold text-yellow-400">{stat.value}</div>
                  <div className="text-xs text-blue-200 flex items-center gap-1 justify-center">
                    <stat.icon className="text-[10px]" /> {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <FounderSection />

      {/* PRICING SECTION - UPDATED */}
      <section id="pricing" className="py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-sm font-semibold text-blue-700 dark:text-blue-400 border border-blue-200/50 mb-3">
              <FaRocket /> Website Plans
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Affordable <span className="gradient-text">Website Plans</span></h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Quality solutions at affordable prices — not cheap, but value for money</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {websitePlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
              Get Free Consultation <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">About Us</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Why Choose Krynova?</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                Founded in March 2024 by <strong>Shivam Sharma</strong> (Full Stack Developer & Data Analyst with 8+ years experience), Krynova Technologies is a cutting-edge technology company dedicated to providing custom web solutions. We've successfully built <strong>50+ systems</strong> for enterprises like Torrent Power, Tech Mahindra, and Romsons.
              </p>
              <div className="space-y-2">
                <FeatureItem icon={FaRocket} title="Our Vision" description="To become the go-to partner for businesses seeking innovative web solutions." color="blue" />
                <FeatureItem icon={FaShieldAlt} title="Our Mission" description="Empower businesses with custom software that drives growth and efficiency." color="purple" />
                <FeatureItem icon={FaUsers} title="Our Commitment" description="Deliver excellence with 100% client satisfaction and long-term support." color="green" />
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 shadow-xl">
              <h3 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-400">Why Choose Us?</h3>
              <ul className="space-y-2">
                {[
                  '100% Custom Solutions', 'Ready-to-Deploy Demos', 'Complete SEO & Performance',
                  '24/7 Support & Maintenance', 'Free Consultation', '12 Free Online Tools',
                  '8+ Years Experience', '50+ Systems Built'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm group">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-0.5 rounded-full">
                      <FaCheckCircle className="text-[10px]" />
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Trusted By Leading Enterprises</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">8+ years of experience building solutions for industry leaders</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Counter target={8} label="Years Experience" icon={FaAward} suffix="+" color="from-blue-500 to-cyan-500" />
            <Counter target={50} label="Systems Built" icon={FaServer} suffix="+" color="from-purple-500 to-pink-500" />
            <Counter target={100} label="Websites Created" icon={FaGlobe} suffix="+" color="from-green-500 to-emerald-500" />
            <Counter target={100} label="Client Satisfaction" icon={FaStar} suffix="%" color="from-orange-500 to-red-500" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {['Torrent Power', 'Tech Mahindra', 'Romsons', 'Agra Chain', 'Anna Infra'].map((client, index) => (
              <div key={index} className="p-3 rounded-xl text-center shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                <FaBuilding className="text-lg mx-auto mb-1 text-white/80" />
                <p className="font-semibold text-xs text-white">{client}</p>
                <p className="text-[10px] text-white/70">Enterprise Client</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">What We Offer</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Comprehensive web solutions for every business need</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const colorClasses = {
                blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
                teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
                pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
              };
              return (
                <div key={index} className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className={`${colorClasses[service.color]} w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform`}>
                    <service.icon />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{service.desc}</p>
                  <Link to="/contact" className="text-blue-600 dark:text-blue-400 font-semibold text-xs mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn More <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-sm font-semibold text-purple-700 dark:text-purple-400 border border-purple-200/50 mb-3">
              <FaCube /> Our Products
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured Solutions</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Explore our ready-to-deploy enterprise solutions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.length > 0 ? projects.map(project => <ProjectCard key={project.id} project={project} />) : staticProjects.map(project => <ProjectCard key={project.id} project={project} />)}
          </div>
          
          <div className="text-center mt-6">
            <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm group">
              View All Products <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-sm font-semibold text-yellow-700 dark:text-yellow-400 border border-yellow-200/50 mb-3">
              <FaStar /> Testimonials
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">What Our Clients Say</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Real feedback from real businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.length > 0 ? testimonials.map((testimonial, index) => <TestimonialCard key={index} testimonial={testimonial} index={index} />) : staticTestimonials.map((testimonial, index) => <TestimonialCard key={index} testimonial={testimonial} index={index} />)}
          </div>
          
          <div className="text-center mt-6">
            <Link to="/testimonials" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm group">
              Read All Testimonials <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FREE TOOLS */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-sm font-semibold text-green-700 dark:text-green-400 border border-green-200/50 mb-3">
              <FaTools /> Free Tools
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Free Online Tools</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Boost your productivity with our free tools. No sign-up required!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {freeTools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/tools" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
              Explore All Tools <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-sm font-semibold text-blue-700 dark:text-blue-400 border border-blue-200/50 mb-3">
              <FaQuestionCircle /> FAQ
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} activeFaq={activeFaq} setActiveFaq={setActiveFaq} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-12 relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Build Your Website?</h2>
          <p className="text-base md:text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Get a free consultation and discover how our custom solutions can help your business grow online.
            <br />
            <span className="text-yellow-300 text-sm">From basic websites to advanced web applications — we've got you covered!</span>
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2 text-sm">
              Get Free Quote <FaArrowRight />
            </Link>
            <a href="#pricing" className="border border-white/30 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 text-sm">
              View Pricing
            </a>
            <Link to="/tools" className="border border-green-400/30 text-green-400 px-6 py-2.5 rounded-xl font-semibold hover:bg-green-400/10 transition-all duration-300 text-sm">
              Try Free Tools
            </Link>
          </div>
          <p className="mt-4 text-blue-200 text-sm">Join 50+ satisfied businesses already using our solutions</p>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        html { scroll-behavior: smooth; }
      `}} />
    </>
  );
};

export default Home;