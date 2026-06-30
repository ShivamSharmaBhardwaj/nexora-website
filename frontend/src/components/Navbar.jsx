// frontend/src/components/Navbar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Find this line in your Navbar.jsx
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
  FaCheckCircle  // ← ADD THIS LINE
} from 'react-icons/fa';
import { secureStorage } from '../utils/security';

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
  const navigate = useNavigate();
  const location = useLocation();

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
  };

  // Services Dropdown Items
  const services = [
    { path: '/services/web-development-agra', label: 'Web Development', icon: FaCode, description: 'Custom websites & web apps' },
    { path: '/services/hrms-software', label: 'HRMS Software', icon: FaUsers, description: 'Human resource management' },
    { path: '/services/property-management', label: 'Property Management', icon: FaBuilding, description: 'Real estate solutions' },
    { path: '/services/whatsapp-automation', label: 'WhatsApp Automation', icon: FaMobileAlt, description: 'AI-powered chatbots' },
    { path: '/services/enterprise-software', label: 'Enterprise Software', icon: FaServer, description: 'Scalable enterprise solutions' },
  ];

  // Products Dropdown Items
  const products = [
    { path: '/products/category/HRMS', label: 'HRMS System', icon: FaUsers, description: 'Complete HR management' },
    { path: '/products/category/TODO', label: 'TODO System', icon: FaCheckCircle, description: 'Task management' },
    { path: '/products/category/Estate', label: 'Estate Management', icon: FaBuilding, description: 'Property management' },
    { path: '/products/category/WhatsApp', label: 'WhatsApp Bot', icon: FaMobileAlt, description: 'WhatsApp automation' },
    { path: '/products', label: 'View All Products', icon: FaProjectDiagram, description: 'Browse all products' },
  ];

  // Tools Dropdown Items
  const tools = [
    { path: '/tools/resume-builder', label: 'Resume Builder', icon: FaFileAlt, description: 'ATS-friendly resumes' },
    { path: '/tools/cover-letter', label: 'Cover Letter', icon: FaPenFancy, description: 'Professional cover letters' },
    { path: '/tools/qr-generator', label: 'QR Generator', icon: FaQrcode, description: 'Custom QR codes' },
    { path: '/tools/pdf-to-image', label: 'PDF to Image', icon: FaFilePdf, description: 'Convert PDF to images' },
    { path: '/tools/pdf-to-word', label: 'PDF to Word', icon: FaFileWord, description: 'Convert PDF to Word' },
    { path: '/tools/pdf-to-excel', label: 'PDF to Excel', icon: FaFileExcel, description: 'Extract tables from PDF' },
    { path: '/tools/image-to-pdf', label: 'Image to PDF', icon: FaImage, description: 'Convert images to PDF' },
    { path: '/tools/pdf-compressor', label: 'PDF Compressor', icon: FaFileArchive, description: 'Compress PDF files' },
    { path: '/tools/merge-pdf', label: 'Merge PDF', icon: FaExchangeAlt, description: 'Merge multiple PDFs' },
    { path: '/tools/split-pdf', label: 'Split PDF', icon: FaFileExport, description: 'Split PDF pages' },
    { path: '/tools/image-resizer', label: 'Image Resizer', icon: FaImage, description: 'Resize & optimize images' },
    { path: '/tools/text-to-pdf', label: 'Text to PDF', icon: FaMagic, description: 'Convert text to PDF' },
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

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isServiceActive = () => {
    return location.pathname.startsWith('/services/');
  };

  const isProductActive = () => {
    return location.pathname.startsWith('/products/');
  };

  const isToolActive = () => {
    return location.pathname.startsWith('/tools/');
  };

  // Handle dropdown toggle
  const toggleDropdown = (key) => {
    if (openDropdown === key) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(key);
    }
  };

  // Check if any dropdown item is active
  const isDropdownActive = (items) => {
    return items.some(item => location.pathname === item.path);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group flex-shrink-0"
            aria-label="Krynova Technologies Home"
          >
            <div className="relative">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="Krynova Technologies Logo" 
                  className="h-8 w-auto md:h-10 transition-transform duration-300 group-hover:scale-105"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-blue-500/25">
                  <FaCube />
                </div>
              )}
              <div className="absolute -inset-1 bg-blue-600/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Krynova
              </span>
              <span className="text-[8px] md:text-[10px] font-medium text-gray-400 tracking-wider uppercase">
                Technologies
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavLinks.map((link, index) => {
              if (link.isDropdown) {
                // Dropdown Menu
                const isActiveDropdown = isDropdownActive(link.dropdownItems);
                const isOpen = openDropdown === link.dropdownKey;
                
                return (
                  <div 
                    key={index}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.dropdownKey)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        isActiveDropdown || isOpen
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                      }`}
                    >
                      <link.icon className={`text-sm ${isActiveDropdown || isOpen ? 'text-blue-600' : 'text-gray-400'}`} />
                      {link.label}
                      <FaChevronDown className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      {isActiveDropdown && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full"></span>
                      )}
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-scale-in max-h-[80vh] overflow-y-auto">
                        {link.dropdownItems.map((item, idx) => {
                          const Icon = item.icon;
                          const active = location.pathname === item.path;
                          return (
                            <Link
                              key={idx}
                              to={item.path}
                              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                                active 
                                  ? 'text-blue-600 bg-blue-50' 
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                              }`}
                            >
                              <Icon className={`text-lg ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                              <div>
                                <div className="font-medium">{item.label}</div>
                                {item.description && (
                                  <div className="text-xs text-gray-400">{item.description}</div>
                                )}
                              </div>
                              {active && <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Active</span>}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    active 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <Icon className={`text-sm ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Quick Contact */}
            <a 
              href="tel:+918630519082" 
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition px-2 py-2 rounded-lg hover:bg-blue-50 text-sm"
              aria-label="Call us"
            >
              <FaPhone className="text-sm" />
              <span className="text-sm font-medium hidden xl:inline">+91 86305 19082</span>
            </a>
            <a 
              href="https://wa.me/918630519082" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-green-600 hover:text-green-700 transition px-2 py-2 rounded-lg hover:bg-green-50"
              aria-label="WhatsApp us"
            >
              <FaWhatsapp className="text-lg" />
            </a>

            {/* Admin/User Button */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-sm"
                >
                  <FaUserShield />
                  <span className="hidden xl:inline">Admin</span>
                  <FaChevronDown className={`text-xs transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-scale-in">
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUserShield className="text-sm" />
                      Dashboard
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition w-full"
                    >
                      <FaSignOutAlt className="text-sm" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 text-sm"
              >
                <FaUserShield />
                <span className="hidden xl:inline">Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-2xl text-gray-700 hover:text-blue-600 transition p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-y-auto transition-all duration-300 ${
            isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-4 pt-2 border-t border-gray-100 space-y-1">
            {/* Home */}
            <Link 
              to="/" 
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                location.pathname === '/' 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaHome className={`text-lg ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`} />
              Home
              {location.pathname === '/' && <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Current</span>}
            </Link>

            {/* Services - Mobile Dropdown */}
            <div>
              <button
                onClick={() => setShowMobileServices(!showMobileServices)}
                className={`flex items-center justify-between w-full py-3 px-4 rounded-lg transition ${
                  isServiceActive() 
                    ? 'text-blue-600 bg-blue-50 font-medium' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaCog className={`text-lg ${isServiceActive() ? 'text-blue-600' : 'text-gray-400'}`} />
                  Services
                </span>
                <FaChevronDown className={`text-sm transition-transform duration-300 ${showMobileServices ? 'rotate-180' : ''}`} />
              </button>
              
              {showMobileServices && (
                <div className="pl-8 space-y-1 border-l-2 border-blue-200 ml-4">
                  {services.map((service, idx) => {
                    const Icon = service.icon;
                    const active = location.pathname === service.path;
                    return (
                      <Link
                        key={idx}
                        to={service.path}
                        className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition ${
                          active 
                            ? 'text-blue-600 bg-blue-50 font-medium' 
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className={`text-lg ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span>{service.label}</span>
                        {active && <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Active</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Products - Mobile Dropdown */}
            <div>
              <button
                onClick={() => setShowMobileProducts(!showMobileProducts)}
                className={`flex items-center justify-between w-full py-3 px-4 rounded-lg transition ${
                  isProductActive() 
                    ? 'text-blue-600 bg-blue-50 font-medium' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaProjectDiagram className={`text-lg ${isProductActive() ? 'text-blue-600' : 'text-gray-400'}`} />
                  Products
                </span>
                <FaChevronDown className={`text-sm transition-transform duration-300 ${showMobileProducts ? 'rotate-180' : ''}`} />
              </button>
              
              {showMobileProducts && (
                <div className="pl-8 space-y-1 border-l-2 border-blue-200 ml-4">
                  {products.map((product, idx) => {
                    const Icon = product.icon;
                    const active = location.pathname === product.path;
                    return (
                      <Link
                        key={idx}
                        to={product.path}
                        className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition ${
                          active 
                            ? 'text-blue-600 bg-blue-50 font-medium' 
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className={`text-lg ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span>{product.label}</span>
                        {active && <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Active</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Free Tools - Mobile Dropdown */}
            <div>
              <button
                onClick={() => setShowMobileTools(!showMobileTools)}
                className={`flex items-center justify-between w-full py-3 px-4 rounded-lg transition ${
                  isToolActive() 
                    ? 'text-blue-600 bg-blue-50 font-medium' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaTools className={`text-lg ${isToolActive() ? 'text-blue-600' : 'text-gray-400'}`} />
                  Free Tools
                </span>
                <FaChevronDown className={`text-sm transition-transform duration-300 ${showMobileTools ? 'rotate-180' : ''}`} />
              </button>
              
              {showMobileTools && (
                <div className="pl-8 space-y-1 border-l-2 border-blue-200 ml-4 max-h-60 overflow-y-auto">
                  {tools.map((tool, idx) => {
                    const Icon = tool.icon;
                    const active = location.pathname === tool.path;
                    return (
                      <Link
                        key={idx}
                        to={tool.path}
                        className={`flex items-center gap-3 py-2 px-4 rounded-lg transition text-sm ${
                          active 
                            ? 'text-blue-600 bg-blue-50 font-medium' 
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className={`text-base ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span>{tool.label}</span>
                        {active && <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Active</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Testimonials */}
            <Link 
              to="/testimonials" 
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                location.pathname === '/testimonials' 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaComments className={`text-lg ${location.pathname === '/testimonials' ? 'text-blue-600' : 'text-gray-400'}`} />
              Testimonials
              {location.pathname === '/testimonials' && <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Current</span>}
            </Link>

            {/* Contact */}
            <Link 
              to="/contact" 
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                location.pathname === '/contact' 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaEnvelope className={`text-lg ${location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-400'}`} />
              Contact
              {location.pathname === '/contact' && <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Current</span>}
            </Link>

            <hr className="my-2 border-gray-100" />

            {/* Mobile Quick Contact */}
            <div className="px-4 py-2">
              <a 
                href="tel:+918630519082" 
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition py-2"
              >
                <FaPhone className="text-lg" />
                <span>+91 86305 19082</span>
              </a>
              <a 
                href="https://wa.me/918630519082" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-green-600 hover:text-green-700 transition py-2"
              >
                <FaWhatsapp className="text-lg" />
                <span>WhatsApp</span>
              </a>
            </div>

            <hr className="my-2 border-gray-100" />

            {/* Mobile Auth */}
            {isLoggedIn ? (
              <>
                <Link 
                  to="/admin" 
                  className="flex items-center gap-3 py-3 px-4 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserShield className="text-lg" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <FaSignOutAlt className="text-lg" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-blue-600 hover:bg-blue-50 transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                <FaUserShield className="text-lg" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
        .max-h-80vh {
          max-height: 80vh;
        }
      `}} />
    </nav>
  );
};

export default Navbar;