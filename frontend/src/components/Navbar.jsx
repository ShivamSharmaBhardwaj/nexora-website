// frontend/src/components/Navbar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaCube, 
  FaHome, 
  FaProjectDiagram, 
  FaComments, 
  FaEnvelope, 
  FaSignOutAlt, 
  FaUserShield,
  FaTools,
  FaPhone,
  FaWhatsapp,
  FaChevronDown,
  FaBuilding,
  FaCode,
  FaServer,
  FaUsers,
  FaMobileAlt,
  FaCog,
  FaFileAlt,
  FaPenFancy,
  FaQrcode,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaImage,
  FaFileArchive,
  FaExchangeAlt,
  FaFileExport,
  FaMagic,
  FaCheckCircle,
  FaMapPin,
  FaGlobe,
  FaMicrophone,
  FaStar,
  FaMoon,
  FaSun,
  FaUser,
  FaUserCircle,
  FaSignInAlt,
  FaRocket,
  FaShieldAlt,
  FaHeadset,
  FaRegSmile
} from 'react-icons/fa';
import { secureStorage } from '../utils/security';

// ✅ Site Navigation Schema
const NavbarSchema = () => {
  const siteUrl = window.location.origin;
  
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Krynova Technologies",
        "description": "Leading web development company in Agra, India offering custom web solutions, HRMS software, property management systems, and enterprise applications.",
        "url": siteUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/products?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      })}
    </script>
  );
};

// ✅ Breadcrumb Schema
const BreadcrumbSchema = () => {
  const siteUrl = window.location.origin;
  const location = window.location.pathname;
  
  const items = [
    { position: 1, name: "Home", item: siteUrl }
  ];
  
  const pathSegments = location.split('/').filter(Boolean);
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += '/' + segment;
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    items.push({
      position: index + 2,
      name: name,
      item: siteUrl + currentPath
    });
  });
  
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
      })}
    </script>
  );
};

// ============================================
// NAVBAR COMPONENT - Enhanced with Morphism
// ============================================

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMobileServices, setShowMobileServices] = useState(false);
  const [showMobileProducts, setShowMobileProducts] = useState(false);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Apply dark mode to html element
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Check authentication
  useEffect(() => {
    const token = secureStorage.get('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
    setShowMobileServices(false);
    setShowMobileProducts(false);
    setShowMobileTools(false);
  }, [location]);

  const handleLogout = () => {
    secureStorage.remove('auth_token');
    secureStorage.remove('user');
    setIsLoggedIn(false);
    navigate('/');
    setIsOpen(false);
    setShowDropdown(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Services Dropdown Items
  const services = [
    { path: '/services/web-development-agra', label: 'Web Development', icon: FaCode, description: 'Custom websites & web apps', gradient: 'from-blue-500 to-cyan-500' },
    { path: '/services/hrms-software', label: 'HRMS Software', icon: FaUsers, description: 'Human resource management', gradient: 'from-green-500 to-emerald-500' },
    { path: '/services/property-management', label: 'Property Management', icon: FaBuilding, description: 'Real estate solutions', gradient: 'from-purple-500 to-pink-500' },
    { path: '/services/whatsapp-automation', label: 'WhatsApp Automation', icon: FaMobileAlt, description: 'AI-powered chatbots', gradient: 'from-orange-500 to-red-500' },
    { path: '/services/enterprise-software', label: 'Enterprise Software', icon: FaServer, description: 'Scalable enterprise solutions', gradient: 'from-indigo-500 to-purple-500' },
  ];

  // Products Dropdown Items
  const products = [
    { path: '/products/category/HRMS', label: 'HRMS System', icon: FaUsers, description: 'Complete HR management', gradient: 'from-blue-500 to-cyan-500' },
    { path: '/products/category/TODO', label: 'TODO System', icon: FaCheckCircle, description: 'Task management', gradient: 'from-green-500 to-emerald-500' },
    { path: '/products/category/Estate', label: 'Estate Management', icon: FaBuilding, description: 'Property management', gradient: 'from-purple-500 to-pink-500' },
    { path: '/products/category/WhatsApp', label: 'WhatsApp Bot', icon: FaMobileAlt, description: 'WhatsApp automation', gradient: 'from-orange-500 to-red-500' },
    { path: '/products', label: 'View All Products', icon: FaProjectDiagram, description: 'Browse all products', gradient: 'from-indigo-500 to-purple-500' },
  ];

  // Tools Dropdown Items
  const tools = [
    { path: '/tools/resume-builder', label: 'Resume Builder', icon: FaFileAlt, description: 'ATS-friendly resumes', gradient: 'from-blue-500 to-cyan-500' },
    { path: '/tools/cover-letter', label: 'Cover Letter', icon: FaPenFancy, description: 'Professional cover letters', gradient: 'from-purple-500 to-pink-500' },
    { path: '/tools/qr-generator', label: 'QR Generator', icon: FaQrcode, description: 'Custom QR codes', gradient: 'from-green-500 to-emerald-500' },
    { path: '/tools/pdf-to-image', label: 'PDF to Image', icon: FaFilePdf, description: 'Convert PDF to images', gradient: 'from-orange-500 to-red-500' },
    { path: '/tools/pdf-to-word', label: 'PDF to Word', icon: FaFileWord, description: 'Convert PDF to Word', gradient: 'from-blue-500 to-indigo-500' },
    { path: '/tools/pdf-to-excel', label: 'PDF to Excel', icon: FaFileExcel, description: 'Extract tables from PDF', gradient: 'from-green-500 to-emerald-500' },
    { path: '/tools/image-to-pdf', label: 'Image to PDF', icon: FaImage, description: 'Convert images to PDF', gradient: 'from-purple-500 to-pink-500' },
    { path: '/tools/pdf-compressor', label: 'PDF Compressor', icon: FaFileArchive, description: 'Compress PDF files', gradient: 'from-orange-500 to-red-500' },
    { path: '/tools/merge-pdf', label: 'Merge PDF', icon: FaExchangeAlt, description: 'Merge multiple PDFs', gradient: 'from-blue-500 to-cyan-500' },
    { path: '/tools/split-pdf', label: 'Split PDF', icon: FaFileExport, description: 'Split PDF pages', gradient: 'from-purple-500 to-pink-500' },
    { path: '/tools/image-resizer', label: 'Image Resizer', icon: FaImage, description: 'Resize & optimize images', gradient: 'from-green-500 to-emerald-500' },
    { path: '/tools/text-to-pdf', label: 'Text to PDF', icon: FaMagic, description: 'Convert text to PDF', gradient: 'from-orange-500 to-red-500' },
  ];

  const mainNavLinks = [
    { path: '/', label: 'Home', icon: FaHome },
    { 
      label: 'Services', 
      icon: FaCog,
      isDropdown: true,
      dropdownItems: services,
      dropdownKey: 'services'
    },
    { 
      label: 'Products', 
      icon: FaProjectDiagram,
      isDropdown: true,
      dropdownItems: products,
      dropdownKey: 'products'
    },
    { 
      label: 'Free Tools', 
      icon: FaTools,
      isDropdown: true,
      dropdownItems: tools,
      dropdownKey: 'tools'
    },
    { path: '/testimonials', label: 'Testimonials', icon: FaComments },
    { path: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  const isActive = (path) => location.pathname === path;
  const isServiceActive = () => location.pathname.startsWith('/services/');
  const isProductActive = () => location.pathname.startsWith('/products/');
  const isToolActive = () => location.pathname.startsWith('/tools/');
  const isDropdownActive = (items) => items.some(item => location.pathname === item.path);

  // ✅ Navbar classes with morphism
  const getNavbarClasses = () => {
    const base = 'fixed top-0 left-0 right-0 z-50 transition-all duration-500';
    if (darkMode) {
      return scrolled 
        ? `${base} glass-navbar-dark shadow-2xl border-b border-white/10`
        : `${base} glass-navbar-dark border-b border-white/5`;
    }
    return scrolled 
      ? `${base} glass-navbar-light shadow-2xl border-b border-white/20`
      : `${base} glass-navbar-light border-b border-white/10`;
  };

  // ✅ Dropdown menu classes with morphism
  const getDropdownClasses = () => {
    return darkMode
      ? 'glass-dropdown-dark shadow-2xl border border-white/10'
      : 'glass-dropdown-light shadow-2xl border border-white/20';
  };

  // ✅ Dropdown item classes with morphism
  const getDropdownItemClasses = (active) => {
    if (darkMode) {
      return active
        ? 'neo-dropdown-item-active flex items-center gap-3 px-4 py-2.5 text-sm text-blue-400 rounded-xl'
        : 'neo-dropdown-item flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 rounded-xl';
    }
    return active
      ? 'neo-dropdown-item-active flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 rounded-xl'
      : 'neo-dropdown-item flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 rounded-xl';
  };

  // ✅ Mobile menu classes with morphism
  const getMobileMenuClasses = () => {
    return darkMode
      ? 'glass-mobile-dark border border-white/10'
      : 'glass-mobile-light border border-white/20';
  };

  return (
    <>
      <NavbarSchema />
      <BreadcrumbSchema />

      <nav className={getNavbarClasses()}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo - Glassmorphism */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group flex-shrink-0"
              aria-label="Krynova Technologies Home"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {!logoError ? (
                  <img 
                    src="/logo.png" 
                    alt="Krynova Technologies Logo" 
                    className="h-8 w-auto md:h-10 transition-transform duration-300 group-hover:scale-105"
                    onError={() => setLogoError(true)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 neo-logo-icon rounded-xl flex items-center justify-center text-white text-lg md:text-xl shadow-2xl shadow-blue-500/30">
                    <FaCube />
                  </div>
                )}
                <div className="absolute -inset-1 bg-blue-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold gradient-text">
                  Krynova
                </span>
                <span className="text-[8px] md:text-[10px] font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                  Technologies
                </span>
              </div>
            </Link>

            {/* GEO Location Badge - Glassmorphism */}
            <div className="hidden xl:flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="geo-badge glass-tag px-3 py-1.5 rounded-full"
              >
                <FaMapPin className="text-blue-500 text-xs" />
                <span className="text-xs font-medium">Agra, India</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="geo-badge glass-tag px-3 py-1.5 rounded-full"
              >
                <FaGlobe className="text-green-500 text-xs" />
                <span className="text-xs font-medium">Global</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="geo-badge glass-tag px-3 py-1.5 rounded-full"
              >
                <FaStar className="text-yellow-400 text-xs" />
                <span className="text-xs font-medium">4.8/5</span>
              </motion.div>
            </div>

            {/* Desktop Menu - Glassmorphism */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNavLinks.map((link, index) => {
                if (link.isDropdown) {
                  const isActiveDropdown = isDropdownActive(link.dropdownItems);
                  const isOpen = openDropdown === link.dropdownKey;
                  
                  return (
                    <div 
                      key={index}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(link.dropdownKey)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                          isActiveDropdown || isOpen
                            ? 'glass-nav-link-active text-white shadow-lg'
                            : 'glass-nav-link text-gray-600 dark:text-gray-300'
                        }`}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                      >
                        <link.icon className="text-sm" />
                        {link.label}
                        <FaChevronDown className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </motion.button>
                      
                      {/* Dropdown Menu - Glassmorphism */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute left-0 mt-1 w-64 py-2 max-h-[80vh] overflow-y-auto ${getDropdownClasses()}`}
                          >
                            {link.dropdownItems.map((item, idx) => {
                              const Icon = item.icon;
                              const active = location.pathname === item.path;
                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                >
                                  <Link
                                    to={item.path}
                                    className={getDropdownItemClasses(active)}
                                  >
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.gradient || 'from-blue-500 to-cyan-500'} flex items-center justify-center text-white text-sm flex-shrink-0 shadow-lg`}>
                                      <Icon />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">{item.label}</div>
                                      {item.description && (
                                        <div className="text-xs text-gray-400 dark:text-gray-500">{item.description}</div>
                                      )}
                                    </div>
                                    {active && (
                                      <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                      >
                                        Active
                                      </motion.span>
                                    )}
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <motion.div
                    key={link.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to={link.path} 
                      className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                        active 
                          ? 'glass-nav-link-active text-white shadow-lg'
                          : 'glass-nav-link text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="text-sm" />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Dark Mode Toggle - Neumorphism */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="neo-toggle-btn p-2.5 rounded-xl transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun className="text-yellow-400 text-lg" /> : <FaMoon className="text-blue-600 dark:text-blue-400 text-lg" />}
              </motion.button>

              {/* Quick Contact - Glassmorphism */}
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:+918630519082" 
                className="glass-contact-btn flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                aria-label="Call us"
              >
                <FaPhone className="text-sm text-green-500" />
                <span className="text-sm font-medium hidden xl:inline">+91 86305 19082</span>
              </motion.a>
              
              <motion.a 
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href="https://wa.me/918630519082" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-lg" />
              </motion.a>

              {/* Admin/User Button - Glassmorphism */}
              {isLoggedIn ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 glass-admin-btn px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg"
                    aria-expanded={showDropdown}
                    aria-haspopup="true"
                  >
                    <FaUserShield />
                    <span className="hidden xl:inline">Admin</span>
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  {/* Admin Dropdown */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={`absolute right-0 mt-2 w-48 py-2 ${getDropdownClasses()}`}
                      >
                        <Link 
                          to="/admin" 
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition"
                          onClick={() => setShowDropdown(false)}
                        >
                          <FaUserShield className="text-sm" />
                          Dashboard
                        </Link>
                        <hr className="my-1 border-gray-200 dark:border-white/10" />
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-red-500 dark:text-red-400 hover:bg-red-50/10 rounded-xl transition"
                        >
                          <FaSignOutAlt className="text-sm" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/login" 
                    className="glass-login-btn px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <FaSignInAlt />
                    <span className="hidden xl:inline">Login</span>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button - Neumorphism */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden text-2xl neo-mobile-btn p-2.5 rounded-xl transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>

          {/* Mobile Menu - Glassmorphism */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`lg:hidden overflow-hidden rounded-2xl ${getMobileMenuClasses()}`}
              >
                <div className="p-4 space-y-1">
                  {/* Mobile Dark Mode Toggle */}
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl glass-mobile-item">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleDarkMode}
                      className="p-2 rounded-xl neo-toggle-small"
                    >
                      {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-600" />}
                    </motion.button>
                  </div>

                  {/* Mobile GEO Badge */}
                  <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-xl glass-mobile-item text-xs">
                    <FaMapPin className="text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300">Agra, India</span>
                    <span className="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>
                    <FaGlobe className="text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Global</span>
                    <span className="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>
                    <FaStar className="text-yellow-400" />
                    <span className="text-gray-600 dark:text-gray-300">4.8/5</span>
                  </div>

                  {/* Home */}
                  <Link 
                    to="/" 
                    className={`flex items-center gap-3 py-3 px-3 rounded-xl transition-all duration-300 ${
                      location.pathname === '/' 
                        ? 'glass-mobile-active text-white' 
                        : 'glass-mobile-link text-gray-600 dark:text-gray-300'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaHome className="text-lg" />
                    <span className="font-medium">Home</span>
                    {location.pathname === '/' && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">Current</span>
                    )}
                  </Link>

                  {/* Services - Mobile Dropdown */}
                  <div>
                    <button
                      onClick={() => setShowMobileServices(!showMobileServices)}
                      className={`flex items-center justify-between w-full py-3 px-3 rounded-xl transition-all duration-300 ${
                        isServiceActive() 
                          ? 'glass-mobile-active text-white' 
                          : 'glass-mobile-link text-gray-600 dark:text-gray-300'
                      }`}
                      aria-expanded={showMobileServices}
                    >
                      <span className="flex items-center gap-3">
                        <FaCog className="text-lg" />
                        <span className="font-medium">Services</span>
                      </span>
                      <motion.div
                        animate={{ rotate: showMobileServices ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronDown className="text-sm" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {showMobileServices && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-8 space-y-1 border-l-2 border-white/10 ml-4 overflow-hidden"
                        >
                          {services.map((service, idx) => {
                            const Icon = service.icon;
                            const active = location.pathname === service.path;
                            return (
                              <Link
                                key={idx}
                                to={service.path}
                                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 text-sm ${
                                  active 
                                    ? 'glass-mobile-active text-white' 
                                    : 'glass-mobile-link text-gray-600 dark:text-gray-300'
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                <Icon className="text-base" />
                                <span>{service.label}</span>
                                {active && (
                                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">Active</span>
                                )}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Products - Mobile Dropdown */}
                  <div>
                    <button
                      onClick={() => setShowMobileProducts(!showMobileProducts)}
                      className={`flex items-center justify-between w-full py-3 px-3 rounded-xl transition-all duration-300 ${
                        isProductActive() 
                          ? 'glass-mobile-active text-white' 
                          : 'glass-mobile-link text-gray-600 dark:text-gray-300'
                      }`}
                      aria-expanded={showMobileProducts}
                    >
                      <span className="flex items-center gap-3">
                        <FaProjectDiagram className="text-lg" />
                        <span className="font-medium">Products</span>
                      </span>
                      <motion.div
                        animate={{ rotate: showMobileProducts ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronDown className="text-sm" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {showMobileProducts && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-8 space-y-1 border-l-2 border-white/10 ml-4 overflow-hidden"
                        >
                          {products.map((product, idx) => {
                            const Icon = product.icon;
                            const active = location.pathname === product.path;
                            return (
                              <Link
                                key={idx}
                                to={product.path}
                                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 text-sm ${
                                  active 
                                    ? 'glass-mobile-active text-white' 
                                    : 'glass-mobile-link text-gray-600 dark:text-gray-300'
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                <Icon className="text-base" />
                                <span>{product.label}</span>
                                {active && (
                                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">Active</span>
                                )}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Free Tools - Mobile Dropdown */}
                  <div>
                    <button
                      onClick={() => setShowMobileTools(!showMobileTools)}
                      className={`flex items-center justify-between w-full py-3 px-3 rounded-xl transition-all duration-300 ${
                        isToolActive() 
                          ? 'glass-mobile-active text-white' 
                          : 'glass-mobile-link text-gray-600 dark:text-gray-300'
                      }`}
                      aria-expanded={showMobileTools}
                    >
                      <span className="flex items-center gap-3">
                        <FaTools className="text-lg" />
                        <span className="font-medium">Free Tools</span>
                      </span>
                      <motion.div
                        animate={{ rotate: showMobileTools ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronDown className="text-sm" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {showMobileTools && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-8 space-y-1 border-l-2 border-white/10 ml-4 overflow-hidden max-h-60 overflow-y-auto"
                        >
                          {tools.map((tool, idx) => {
                            const Icon = tool.icon;
                            const active = location.pathname === tool.path;
                            return (
                              <Link
                                key={idx}
                                to={tool.path}
                                className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-300 text-sm ${
                                  active 
                                    ? 'glass-mobile-active text-white' 
                                    : 'glass-mobile-link text-gray-600 dark:text-gray-300'
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                <Icon className="text-base" />
                                <span>{tool.label}</span>
                                {active && (
                                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">Active</span>
                                )}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Testimonials */}
                  <Link 
                    to="/testimonials" 
                    className={`flex items-center gap-3 py-3 px-3 rounded-xl transition-all duration-300 ${
                      location.pathname === '/testimonials' 
                        ? 'glass-mobile-active text-white' 
                        : 'glass-mobile-link text-gray-600 dark:text-gray-300'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaComments className="text-lg" />
                    <span className="font-medium">Testimonials</span>
                    {location.pathname === '/testimonials' && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">Current</span>
                    )}
                  </Link>

                  {/* Contact */}
                  <Link 
                    to="/contact" 
                    className={`flex items-center gap-3 py-3 px-3 rounded-xl transition-all duration-300 ${
                      location.pathname === '/contact' 
                        ? 'glass-mobile-active text-white' 
                        : 'glass-mobile-link text-gray-600 dark:text-gray-300'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaEnvelope className="text-lg" />
                    <span className="font-medium">Contact</span>
                    {location.pathname === '/contact' && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">Current</span>
                    )}
                  </Link>

                  <hr className="my-2 border-white/10" />

                  {/* Mobile Quick Contact */}
                  <div className="px-3 py-2 space-y-2">
                    <a 
                      href="tel:+918630519082" 
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition py-2"
                    >
                      <FaPhone className="text-lg text-green-500" />
                      <span className="text-sm">+91 86305 19082</span>
                    </a>
                    <a 
                      href="https://wa.me/918630519082" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition py-2"
                    >
                      <FaWhatsapp className="text-lg" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
                  </div>

                  <hr className="my-2 border-white/10" />

                  {/* Mobile Auth */}
                  {isLoggedIn ? (
                    <>
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-3 py-3 px-3 rounded-xl glass-mobile-link text-blue-600 dark:text-blue-400"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaUserShield className="text-lg" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 w-full text-left py-3 px-3 rounded-xl glass-mobile-link text-red-500 dark:text-red-400"
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      className="flex items-center gap-3 py-3 px-3 rounded-xl glass-mobile-link text-blue-600 dark:text-blue-400 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaSignInAlt className="text-lg" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ========================================== */}
      {/* CSS - All Morphism Effects */}
      {/* ========================================== */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ========================================== */
        /* GLASSMORPHISM - Navbar */
        /* ========================================== */
        .glass-navbar-light {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
        
        .glass-navbar-dark {
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }
        
        .glass-nav-link {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        
        .glass-nav-link:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
          color: #2563eb;
          transform: translateY(-2px);
        }
        
        .dark .glass-nav-link {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }
        
        .dark .glass-nav-link:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.3);
          color: #60a5fa;
        }
        
        .glass-nav-link-active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
          color: white;
        }
        
        .dark .glass-nav-link-active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2));
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }
        
        .glass-dropdown-light {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
        }
        
        .glass-dropdown-dark {
          background: rgba(17, 24, 39, 0.85);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
        }
        
        .glass-tag {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .glass-tag:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(59, 130, 246, 0.3);
        }
        
        .dark .glass-tag {
          background: rgba(31, 41, 55, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .dark .glass-tag:hover {
          background: rgba(31, 41, 55, 0.5);
          border-color: rgba(59, 130, 246, 0.2);
        }
        
        .glass-contact-btn {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }
        
        .glass-contact-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
        }
        
        .dark .glass-contact-btn {
          background: rgba(31, 41, 55, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .dark .glass-contact-btn:hover {
          background: rgba(31, 41, 55, 0.5);
        }
        
        .glass-admin-btn {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: white;
          transition: all 0.3s ease;
        }
        
        .glass-admin-btn:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3));
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }
        
        .dark .glass-admin-btn {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15));
          border: 1px solid rgba(59, 130, 246, 0.15);
        }
        
        .glass-login-btn {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
          border: none;
        }
        
        .glass-login-btn:hover {
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }
        
        /* Mobile Glass Styles */
        .glass-mobile-light {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
        }
        
        .glass-mobile-dark {
          background: rgba(17, 24, 39, 0.92);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
        }
        
        .glass-mobile-item {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .dark .glass-mobile-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }
        
        .glass-mobile-link {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid transparent;
          transition: all 0.3s ease;
        }
        
        .glass-mobile-link:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(59, 130, 246, 0.2);
          transform: translateX(4px);
        }
        
        .dark .glass-mobile-link {
          background: rgba(255, 255, 255, 0.03);
        }
        
        .dark .glass-mobile-link:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.15);
        }
        
        .glass-mobile-active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(99, 102, 241, 0.25));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: white;
        }
        
        .dark .glass-mobile-active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15));
          border: 1px solid rgba(59, 130, 246, 0.15);
          color: #93c5fd;
        }

        /* ========================================== */
        /* NEUMORPHISM */
        /* ========================================== */
        .neo-logo-icon {
          background: linear-gradient(145deg, #3b82f6, #8b5cf6);
          box-shadow: 
            8px 8px 16px rgba(59, 130, 246, 0.3),
            -8px -8px 16px rgba(99, 102, 241, 0.1),
            inset 0 2px 4px rgba(255,255,255,0.2);
        }
        
        .neo-toggle-btn {
          background: #e8edf2;
          box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
          transition: all 0.3s ease;
        }
        
        .neo-toggle-btn:hover {
          box-shadow: 2px 2px 4px #c5cace, -2px -2px 4px #ffffff;
          transform: scale(0.95);
        }
        
        .dark .neo-toggle-btn {
          background: #1f2937;
          box-shadow: 4px 4px 8px #0f1520, -4px -4px 8px #2d3748;
        }
        
        .dark .neo-toggle-btn:hover {
          box-shadow: 2px 2px 4px #0f1520, -2px -2px 4px #2d3748;
        }
        
        .neo-mobile-btn {
          background: #e8edf2;
          box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
          transition: all 0.3s ease;
        }
        
        .neo-mobile-btn:hover {
          box-shadow: 2px 2px 4px #c5cace, -2px -2px 4px #ffffff;
          transform: scale(0.95);
        }
        
        .dark .neo-mobile-btn {
          background: #1f2937;
          box-shadow: 4px 4px 8px #0f1520, -4px -4px 8px #2d3748;
        }
        
        .neo-toggle-small {
          background: #e8edf2;
          box-shadow: 2px 2px 4px #c5cace, -2px -2px 4px #ffffff;
          transition: all 0.3s ease;
        }
        
        .neo-toggle-small:hover {
          box-shadow: 1px 1px 2px #c5cace, -1px -1px 2px #ffffff;
        }
        
        .dark .neo-toggle-small {
          background: #1f2937;
          box-shadow: 2px 2px 4px #0f1520, -2px -2px 4px #2d3748;
        }
        
        .neo-dropdown-item {
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.3s ease;
        }
        
        .neo-dropdown-item:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(4px);
          color: #2563eb;
        }
        
        .dark .neo-dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #60a5fa;
        }
        
        .neo-dropdown-item-active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15));
          border-left: 3px solid #3b82f6;
        }
        
        .dark .neo-dropdown-item-active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.08));
          border-left: 3px solid #60a5fa;
        }
        
        /* ========================================== */
        /* ANIMATIONS */
        /* ========================================== */
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Liquid Glass Shimmer Effect */
        .glass-navbar-light::before,
        .glass-navbar-dark::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(59, 130, 246, 0.3), 
            rgba(99, 102, 241, 0.3), 
            transparent
          );
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Smooth scroll for mobile menu */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
      `}} />
    </>
  );
};

export default Navbar;