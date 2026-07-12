// src/pages/Tools.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFileAlt, FaPenFancy, FaQrcode, FaFilePdf, 
  FaFileWord, FaFileExcel, FaImage, FaFileArchive,
  FaExchangeAlt, FaFileExport, FaMagic, FaTools,
  FaArrowRight, FaStar, FaLock, FaCheckCircle,
  FaRocket, FaCrown, FaMicrophone, FaComments,
  FaMapPin, FaGlobe, FaMoon, FaSun, FaBars,
  FaTimes, FaTextHeight, FaPalette, FaBorderAll,
  FaLayerGroup, FaCubes, FaCube, FaGem, FaHeadset,
  FaRegSmile, FaShieldAlt, FaClock, FaDownload
} from 'react-icons/fa';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';

// ============================================
// CONTROLS PANEL - Glassmorphism
// ============================================

const ControlsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center backdrop-blur-xl border border-white/20"
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-20 right-0 p-4 rounded-2xl min-w-[200px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {darkMode ? <FaSun className="text-yellow-400 text-lg" /> : <FaMoon className="text-white text-lg" />}
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// TOOLS PAGE - Enhanced with Morphism
// ============================================

const Tools = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [hoveredTool, setHoveredTool] = useState(null);

  const siteUrl = window.location.origin;

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

  const globalCountries = [
    "USA", "UK", "Canada", "Australia", "UAE", "Singapore", 
    "Germany", "France", "Japan", "South Korea", "Netherlands", 
    "Sweden", "Norway", "Denmark", "Finland", "New Zealand", 
    "Ireland", "Malaysia", "Thailand", "Vietnam", "Indonesia", 
    "Philippines", "South Africa", "Kenya", "Nigeria", "Egypt", 
    "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"
  ];

  const tools = [
    {
      icon: FaFileAlt,
      title: 'ATS Resume Builder',
      description: 'Create professional resumes with multiple templates',
      link: '/tools/resume-builder',
      freeLimit: '3/day',
      popular: true,
      color: 'from-blue-500 to-indigo-600',
      glowColor: 'rgba(59, 130, 246, 0.15)',
    },
    {
      icon: FaPenFancy,
      title: 'Cover Letter Generator',
      description: 'Generate personalized cover letters instantly',
      link: '/tools/cover-letter',
      freeLimit: '3/day',
      color: 'from-purple-500 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.15)',
    },
    {
      icon: FaQrcode,
      title: 'QR Code Generator',
      description: 'Create custom QR codes for any purpose',
      link: '/tools/qr-generator',
      freeLimit: '5/day',
      color: 'from-green-500 to-emerald-500',
      glowColor: 'rgba(34, 197, 94, 0.15)',
    },
    {
      icon: FaFilePdf,
      title: 'PDF to Image',
      description: 'Convert PDF pages to high-quality images',
      link: '/tools/pdf-to-image',
      freeLimit: '3 pages/day',
      color: 'from-red-500 to-orange-500',
      glowColor: 'rgba(239, 68, 68, 0.15)',
    },
    {
      icon: FaFileWord,
      title: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files',
      link: '/tools/pdf-to-word',
      freeLimit: '2/day',
      color: 'from-blue-600 to-blue-800',
      glowColor: 'rgba(37, 99, 235, 0.15)',
    },
    {
      icon: FaFileExcel,
      title: 'PDF to Excel',
      description: 'Extract tables from PDF to Excel spreadsheets',
      link: '/tools/pdf-to-excel',
      freeLimit: '2/day',
      color: 'from-green-600 to-green-800',
      glowColor: 'rgba(22, 163, 74, 0.15)',
    },
    {
      icon: FaImage,
      title: 'Image to PDF',
      description: 'Convert multiple images to a single PDF',
      link: '/tools/image-to-pdf',
      freeLimit: '3 images/day',
      color: 'from-pink-500 to-rose-500',
      glowColor: 'rgba(236, 72, 153, 0.15)',
    },
    {
      icon: FaFileArchive,
      title: 'PDF Compressor',
      description: 'Compress PDF files to reduce file size',
      link: '/tools/pdf-compressor',
      freeLimit: '3/day',
      color: 'from-yellow-500 to-orange-500',
      glowColor: 'rgba(234, 179, 8, 0.15)',
    },
    {
      icon: FaExchangeAlt,
      title: 'Merge PDF',
      description: 'Merge multiple PDFs into one document',
      link: '/tools/merge-pdf',
      freeLimit: '3/day',
      color: 'from-indigo-500 to-purple-500',
      glowColor: 'rgba(99, 102, 241, 0.15)',
    },
    {
      icon: FaFileExport,
      title: 'Split PDF',
      description: 'Split large PDFs into separate files',
      link: '/tools/split-pdf',
      freeLimit: '3/day',
      color: 'from-teal-500 to-cyan-500',
      glowColor: 'rgba(20, 184, 166, 0.15)',
    },
    {
      icon: FaImage,
      title: 'Image Resizer',
      description: 'Resize and optimize images for any use',
      link: '/tools/image-resizer',
      freeLimit: '5/day',
      color: 'from-rose-500 to-red-500',
      glowColor: 'rgba(244, 63, 94, 0.15)',
    },
    {
      icon: FaMagic,
      title: 'Text to PDF',
      description: 'Convert text to professional PDF documents',
      link: '/tools/text-to-pdf',
      freeLimit: '5/day',
      color: 'from-violet-500 to-purple-500',
      glowColor: 'rgba(139, 92, 246, 0.15)',
    }
  ];

  const handleUpgradeClick = (plan = 'yearly') => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      {/* Controls Panel */}
      <ControlsPanel />

      {/* ========================================== */}
      {/* HELMET - SEO + AEO + GEO */}
      {/* ========================================== */}
      <Helmet>
        <title>12+ Free Online Tools - Resume Builder, PDF Tools, QR Generator | Krynova Technologies | India & Global</title>
        <meta name="description" content="Access 12+ free online tools including ATS Resume Builder, Cover Letter Generator, QR Code Generator, PDF to Image, PDF to Word, PDF Compressor, Merge PDF, Image Resizer, and more. No sign-up required, unlimited usage for premium users. Best free tools in India and worldwide." />
        <meta name="keywords" content="free resume builder, cover letter generator, QR code generator, PDF to image, PDF to word, PDF to excel, image to PDF, PDF compressor, merge PDF, split PDF, image resizer, text to PDF, free online tools India, productivity tools, Krynova tools, global online tools" />
        <link rel="canonical" href={`${siteUrl}/tools`} />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta property="og:title" content="12+ Free Online Tools - Resume Builder, PDF Tools & More | Krynova Technologies" />
        <meta property="og:description" content="Boost your productivity with our completely free online tools. Resume Builder, QR Generator, PDF converters, and more. No sign-up required!" />
        <meta property="og:url" content={`${siteUrl}/tools`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="12+ Free Online Tools - Resume Builder, PDF Tools & More | Krynova Technologies" />
        <meta name="twitter:description" content="Access 12+ free online tools. Resume Builder, QR Generator, PDF converters, and more. No sign-up required!" />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Krynova Technologies Free Online Tools</h2>
        <p>Access 12+ free online tools including ATS Resume Builder, Cover Letter Generator, QR Code Generator, PDF to Image, PDF to Word, PDF Compressor, Merge PDF, Image Resizer, and more. No sign-up required.</p>
      </div>

      {/* ========================================== */}
      {/* SCHEMA.ORG */}
      {/* ========================================== */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Krynova Technologies Free Online Tools",
          "description": "Collection of 12+ free online tools including Resume Builder, Cover Letter Generator, QR Code Generator, PDF converters, and more.",
          "url": `${siteUrl}/tools`,
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
          "offers": {
            "@type": "Offer",
            "description": "Free tools with daily limits. Premium upgrade available for unlimited access.",
            "price": "0",
            "priceCurrency": "INR"
          },
          "audience": {
            "@type": "Audience",
            "name": "Businesses and Professionals Worldwide",
            "geographicArea": {
              "@type": "AdministrativeArea",
              "name": `India, ${globalCountries.join(", ")}, Worldwide`
            }
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          }
        })}
      </script>

      {/* ========================================== */}
      {/* MAIN CONTENT - Glassmorphism + Neumorphism */}
      {/* ========================================== */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/20 py-12 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-400/10 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-400/10 rounded-full filter blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-5"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header with Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 glass-badge px-6 py-3 rounded-full text-sm font-medium mb-4 border border-white/20 dark:border-white/5 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 shadow-xl">
              <FaTools className="text-blue-500 dark:text-blue-400" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                12 Free Online Tools
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">Free</span>{' '}
              <span className="gradient-text">Productivity Tools</span>
            </h1>
            
            <div className="glass-card inline-block px-8 py-4 rounded-2xl backdrop-blur-lg bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-white/5 shadow-xl max-w-2xl mx-auto">
              <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                Boost your productivity with our completely free online tools. 
                No sign-up required, unlimited usage for premium users!
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="glass-chip inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-500/20 shadow-sm text-xs font-medium text-blue-700 dark:text-blue-400">
                <FaMapPin className="text-blue-500" /> {indianCities.length}+ Indian Cities
              </span>
              <span className="glass-chip inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-green-50/70 dark:bg-green-900/20 border border-green-200/50 dark:border-green-500/20 shadow-sm text-xs font-medium text-green-700 dark:text-green-400">
                <FaGlobe className="text-green-500" /> {globalCountries.length}+ Countries
              </span>
              <span className="glass-chip inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-purple-50/70 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-500/20 shadow-sm text-xs font-medium text-purple-700 dark:text-purple-400">
                <FaMicrophone className="text-purple-500" /> Voice Search Ready
              </span>
              <span className="glass-chip inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-orange-50/70 dark:bg-orange-900/20 border border-orange-200/50 dark:border-orange-500/20 shadow-sm text-xs font-medium text-orange-700 dark:text-orange-400">
                <FaComments className="text-orange-500" /> FAQ Optimized
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="glass-stat inline-flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/40 dark:border-white/5 shadow-lg"
              >
                <FaStar className="text-yellow-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Free daily limits</span>
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="glass-stat inline-flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/40 dark:border-white/5 shadow-lg"
              >
                <FaLock className="text-green-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Premium: Unlimited</span>
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="glass-stat inline-flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/40 dark:border-white/5 shadow-lg"
              >
                <FaCheckCircle className="text-purple-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">No sign-up required</span>
              </motion.span>
            </div>
          </motion.div>

          {/* Tools Grid with Glassmorphism Cards */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  onMouseEnter={() => setHoveredTool(index)}
                  onMouseLeave={() => setHoveredTool(null)}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Link
                    to={tool.link}
                    className={`group relative glass-tool-card rounded-2xl p-6 backdrop-blur-xl border transition-all duration-500 block ${
                      tool.popular 
                        ? 'bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/30 border-blue-300/50 dark:border-blue-500/30 shadow-xl shadow-blue-200/30 dark:shadow-blue-500/10' 
                        : 'bg-white/40 dark:bg-gray-800/40 border-white/30 dark:border-white/5 hover:border-blue-300/50 dark:hover:border-blue-500/30 shadow-lg hover:shadow-blue-200/20 dark:hover:shadow-blue-500/10'
                    }`}
                  >
                    {/* Glass reflection effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-transparent via-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none"></div>
                    
                    {tool.popular && (
                      <div className="absolute -top-3 right-4 glass-popular px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md bg-gradient-to-r from-green-500/90 to-emerald-500/90 border border-white/30 shadow-lg shadow-green-500/30 animate-pulse-slow">
                        <FaRocket className="text-white text-[10px]" /> 
                        <span className="text-white">Popular</span>
                      </div>
                    )}
                    
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`relative w-14 h-14 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center text-white text-2xl mb-4 shadow-lg`}
                    >
                      <Icon />
                      <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </motion.div>
                    
                    <h3 className="relative text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {tool.title}
                    </h3>
                    
                    <p className="relative text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <div className="relative flex items-center justify-between mt-4 pt-3 border-t border-gray-200/30 dark:border-gray-700/30">
                      <span className="text-xs bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full border border-gray-200/30 dark:border-gray-700/30 shadow-sm">
                        Free: {tool.freeLimit}
                      </span>
                      <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                        Use Tool 
                        <motion.span 
                          animate={{ x: hoveredTool === index ? [0, 5, 0] : 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="inline-block"
                        >
                          <FaArrowRight className="text-xs" />
                        </motion.span>
                      </span>
                    </div>
                    
                    {/* Hover shine effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Premium CTA - Glassmorphism Enhanced */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 relative"
          >
            {/* Background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
            
            <div className="relative glass-premium-card rounded-2xl p-8 md:p-12 text-white text-center backdrop-blur-xl bg-gradient-to-br from-blue-600/95 via-indigo-600/95 to-purple-600/95 border border-white/20 shadow-2xl overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
                {/* Floating particles */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-ping-slow"></div>
                <div className="absolute bottom-10 right-10 w-3 h-3 bg-white/20 rounded-full animate-ping-slow delay-1000"></div>
                <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping-slow delay-2000"></div>
              </div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                {/* Glass crown icon */}
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-block p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl mb-4"
                >
                  <FaCrown className="text-5xl text-yellow-400 drop-shadow-lg" />
                </motion.div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                  Go Premium for <span className="text-yellow-300">Unlimited</span> Access
                </h2>
                
                <p className="text-blue-100 mb-6 text-lg backdrop-blur-sm bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                  Remove all limits and get unlimited access to all 12 tools.
                  Perfect for professionals and businesses!
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <span className="glass-premium-chip inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-xs text-white">
                    <FaMapPin /> {indianCities.length}+ Indian Cities
                  </span>
                  <span className="glass-premium-chip inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-xs text-white">
                    <FaGlobe /> {globalCountries.length}+ Countries
                  </span>
                  <span className="glass-premium-chip inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-xs text-white">
                    <FaRocket /> Unlimited Usage
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpgradeClick('yearly')}
                    className="group inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    <FaCrown className="text-yellow-500" />
                    Upgrade Now 
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight />
                    </motion.span>
                  </motion.button>
                  
                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <FaStar className="text-yellow-300" />
                    View Plans
                  </Link>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-blue-200">
                  <span className="inline-flex items-center gap-1">
                    <FaCheckCircle className="text-green-300" /> Starting from ₹99/month
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FaLock className="text-blue-300" /> Cancel anytime
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FaFileAlt className="text-blue-300" /> All features included
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Badges - Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap justify-center items-center gap-4 text-xs text-gray-500 dark:text-gray-400"
          >
            <span className="glass-trust inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-white/5">
              <FaShieldAlt className="text-green-500 text-sm" /> Secure & Trusted
            </span>
            <span className="glass-trust inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-white/5">
              <FaClock className="text-blue-500 text-sm" /> 24/7 Available
            </span>
            <span className="glass-trust inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-white/5">
              <FaDownload className="text-purple-500 text-sm" /> Free to Use
            </span>
            <span className="glass-trust inline-flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-white/5">
              <FaStar className="text-yellow-400 text-sm" /> 4.8/5 Rating
            </span>
          </motion.div>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          userEmail={localStorage.getItem('userEmail') || undefined}
          userId={localStorage.getItem('userId') || undefined}
          onSuccess={(data) => {
            console.log('Payment success:', data);
            toast.success('🎉 Welcome to Premium!');
            setShowPaymentModal(false);
          }}
        />

        {/* ========================================== */}
        {/* CSS - Glassmorphism + Neumorphism */}
        {/* ========================================== */}
        <style dangerouslySetInnerHTML={{ __html: `
          .gradient-text {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 200% 200%;
            animation: gradient-shift 3s ease-in-out infinite;
          }
          
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          /* ========================================== */
          /* GLASSMORPHISM */
          /* ========================================== */
          .glass-badge {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          }
          
          .dark .glass-badge {
            background: rgba(31, 41, 55, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          
          .glass-card {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.35);
            border: 1px solid rgba(255, 255, 255, 0.25);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          }
          
          .dark .glass-card {
            background: rgba(31, 41, 55, 0.35);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          
          .glass-chip {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: all 0.3s ease;
          }
          
          .glass-chip:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          }
          
          .glass-stat {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
          }
          
          .glass-stat:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
          }
          
          .dark .glass-stat {
            background: rgba(31, 41, 55, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          
          .glass-tool-card {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          
          .glass-tool-card:hover {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
          
          .glass-popular {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            animation: pulse-soft 2s ease-in-out infinite;
          }
          
          .glass-premium-card {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
          
          .glass-premium-chip {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: all 0.3s ease;
          }
          
          .glass-premium-chip:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.2) !important;
          }
          
          .glass-trust {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: all 0.3s ease;
          }
          
          .glass-trust:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          }
          
          /* ========================================== */
          /* ANIMATIONS */
          /* ========================================== */
          @keyframes pulse-soft {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(-5deg); }
          }
          
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-soft 3s ease-in-out infinite; }
          
          .animate-ping-slow {
            animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          
          .delay-1000 { animation-delay: 1000ms; }
          .delay-2000 { animation-delay: 2000ms; }
          
          .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
            background-size: 50px 50px;
          }
          
          .dark .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
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
        `}} />
      </div>
    </>
  );
};

export default Tools;