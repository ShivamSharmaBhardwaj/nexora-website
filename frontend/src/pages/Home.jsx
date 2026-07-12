// frontend/src/pages/Home.jsx
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../utils/api';
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
  FaTextHeight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// CONSTANTS
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL;
const PROJECTS_LIMIT = 4;
const TESTIMONIALS_LIMIT = 3;

// ============================================
// CONTROLS COMPONENT - Bottom Right with Full Controls
// ============================================

const ControlsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Language
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  // Font Size
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved || 'medium';
  });

  // Apply Dark Mode
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Apply Language
  useEffect(() => {
    localStorage.setItem('language', language);
    // You can add i18n or translation logic here
    console.log('Language changed to:', language);
  }, [language]);

  // Apply Font Size
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.fontSize = sizes[fontSize] || '16px';
  }, [fontSize]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center backdrop-blur-xl border border-white/20"
      >
        {isOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <FaBars className="text-2xl" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-20 right-0 p-4 rounded-2xl min-w-[240px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl"
          >
            <div className="space-y-4">
              {/* Dark Mode Toggle */}
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

              {/* Language Switcher */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
                <div className="flex items-center gap-1 p-1 rounded-full bg-gray-100 dark:bg-gray-700 shadow-inner">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      language === 'en' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      language === 'hi' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    हिं
                  </button>
                </div>
              </div>

              {/* Font Size Controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</span>
                <div className="flex items-center gap-1 p-1 rounded-full bg-gray-100 dark:bg-gray-700 shadow-inner">
                  {[
                    { size: 'small', label: 'S', icon: FaTextHeight },
                    { size: 'medium', label: 'M', icon: FaTextHeight },
                    { size: 'large', label: 'L', icon: FaTextHeight }
                  ].map(({ size, label, icon: Icon }) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`p-1.5 rounded-full transition-all duration-300 ${
                        fontSize === size 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-110' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className={size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-sm'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Settings Display */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
                  <p>Theme: <span className="font-medium text-gray-700 dark:text-gray-300">{darkMode ? 'Dark' : 'Light'}</span></p>
                  <p>Language: <span className="font-medium text-gray-700 dark:text-gray-300">{language === 'en' ? 'English' : 'हिंदी'}</span></p>
                  <p>Font: <span className="font-medium text-gray-700 dark:text-gray-300">{fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}</span></p>
                </div>
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
// UI COMPONENTS - COLORFUL & ELEGANT
// ============================================

// Loading Skeleton
const LoadingSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <motion.div 
      animate={{ 
        scale: [1, 1.05, 1],
      }}
      transition={{ 
        scale: { duration: 2, repeat: Infinity },
      }}
      className="p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-blue-200/50 dark:border-blue-500/20 shadow-2xl shadow-blue-500/10"
    >
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-5xl text-blue-600 dark:text-blue-400"
        >
          <FaSpinner />
        </motion.div>
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading...</p>
        <div className="flex gap-2">
          {[0, 0.2, 0.4].map((delay) => (
            <motion.div 
              key={delay}
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Feature Item with Color
const FeatureItem = ({ icon: Icon, title, description, color = 'blue', delay = 0 }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay / 1000 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className="flex items-start gap-3 p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className={`p-2.5 rounded-lg flex-shrink-0 ${colorClasses[color]}`}>
        <Icon className="text-lg" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

// Pricing Card
const PricingCard = ({ 
  title, 
  price, 
  currency = '₹', 
  features, 
  isPopular = false, 
  icon: Icon, 
  period = 'project',
  tag = '',
  delay = 0,
  gradient = 'from-blue-500 to-indigo-500'
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay / 1000, duration: 0.5, type: "spring", stiffness: 100 }}
    whileHover={{ y: -15, scale: 1.02 }}
    className={`relative p-8 rounded-2xl transition-all duration-300 ${
      isPopular 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-500/50 dark:border-blue-400/50 shadow-2xl shadow-blue-500/20' 
        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl'
    }`}
  >
    {isPopular && (
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay / 1000 + 0.3, type: "spring", stiffness: 200 }}
        className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/25"
      >
        <FaStar className="inline mr-1 text-yellow-300" /> Most Popular
      </motion.div>
    )}
    {tag && (
      <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
        {tag}
      </div>
    )}
    <div className="text-center">
      <motion.div 
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className={`text-5xl mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
      >
        {Icon && <Icon />}
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <div className="mt-4">
        <span className={`text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {currency}{price}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/{period}</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{period === 'project' ? 'One-time payment' : 'Starting price'}</p>
    </div>
    <ul className="mt-6 space-y-3">
      {features.map((feature, index) => (
        <motion.li 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay / 1000 + index * 0.05 }}
          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
        >
          <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
          <span>{feature}</span>
        </motion.li>
      ))}
    </ul>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to="/contact"
        className={`mt-8 w-full py-3.5 rounded-xl font-semibold transition-all duration-300 block text-center ${
          isPopular
            ? `bg-gradient-to-r ${gradient} text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5`
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 hover:-translate-y-0.5'
        }`}
      >
        Get Started
      </Link>
    </motion.div>
  </motion.div>
);

// Tool Card
const ToolCard = ({ icon: Icon, title, description, link, isPopular = false, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: delay / 1000, duration: 0.4, type: "spring", stiffness: 200 }}
    whileHover={{ y: -10, scale: 1.03 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link 
      to={link}
      className={`group block p-6 rounded-2xl transition-all duration-300 relative ${
        isPopular 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500/50 dark:border-green-400/50 shadow-xl shadow-green-500/20' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg shadow-green-500/30">
          <FaGem className="inline mr-1 text-yellow-300 text-[10px]" /> Free
        </div>
      )}
      <div className="text-4xl text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
        <Icon />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{description}</p>
      <div className="inline-flex items-center gap-1 mt-4 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
        Use Tool <FaArrowRight className="text-xs" />
      </div>
    </Link>
  </motion.div>
);

// Project Card
const ProjectCard = ({ project }) => {
  const IconComponent = useMemo(() => {
    try {
      const iconName = project.icon?.charAt(0).toUpperCase() + project.icon?.slice(1);
      if (iconName) {
        const Icon = require(`react-icons/fa`)[`Fa${iconName}`];
        return Icon || FaCode;
      }
      return FaCode;
    } catch {
      return FaCode;
    }
  }, [project.icon]);

  const gradients = [
    'from-blue-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-teal-500 to-cyan-500',
    'from-pink-500 to-rose-500',
  ];

  const gradient = gradients[project.id % gradients.length] || gradients[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <Link 
        to={`/products/${project.id}`} 
        className="block p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`text-4xl mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          <IconComponent />
        </motion.div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
          {project.short_desc || project.description?.substring(0, 60) || ''}
        </p>
        {project.is_upcoming && (
          <span className="inline-block mt-2 bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs px-2 py-1 rounded-full">
            🚀 Upcoming
          </span>
        )}
        <div className="inline-block mt-4 text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
          View Details →
        </div>
      </Link>
    </motion.div>
  );
};

// Testimonial Card
const TestimonialCard = ({ testimonial, index }) => {
  const colors = [
    'from-blue-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`w-12 h-12 bg-gradient-to-r ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}
        >
          {testimonial.client_name?.charAt(0) || '?'}
        </motion.div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.client_name}</h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.client_company || 'Client'}</p>
        </div>
      </div>
      <div className="flex text-yellow-400 mb-2">
        {[...Array(5)].map((_, i) => (
          <motion.span 
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="text-lg"
          >
            {i < (testimonial.rating || 0) ? '★' : '☆'}
          </motion.span>
        ))}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm italic">"{testimonial.feedback}"</p>
    </motion.div>
  );
};

// Counter Animation
const Counter = ({ target, label, icon: Icon, suffix = '', color = 'from-blue-500 to-indigo-500' }) => {
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
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <motion.div 
        className={`text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
        animate={{ scale: isVisible ? [0.5, 1.2, 1] : 1 }}
        transition={{ duration: 0.8 }}
      >
        {count}{suffix}
      </motion.div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
      {Icon && <Icon className="text-2xl text-gray-400 dark:text-gray-500 mt-2 mx-auto" />}
    </motion.div>
  );
};

// FAQ Item
const FAQItem = ({ faq, index, activeFaq, setActiveFaq }) => {
  const isOpen = activeFaq === index;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl overflow-hidden border transition-all duration-300 ${
        isOpen 
          ? 'border-blue-500/50 dark:border-blue-400/50 shadow-xl shadow-blue-500/10 bg-blue-50/50 dark:bg-blue-900/10' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30 bg-white dark:bg-gray-800'
      }`}
    >
      <motion.button
        onClick={() => setActiveFaq(isOpen ? null : index)}
        className="w-full p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between text-left"
        whileHover={{ x: 5 }}
      >
        <span className="pr-4">{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <FaChevronDown className={`text-blue-600 dark:text-blue-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-4 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================
// INDIAN CITIES & COUNTRIES
// ============================================

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
      setLoading(true);
      
      const [projectsRes, testimonialsRes] = await Promise.all([
        api.getProjects(),
        api.getTestimonials()
      ]);

      let testimonialsData = [];
      if (Array.isArray(testimonialsRes.data)) {
        testimonialsData = testimonialsRes.data;
      } else if (testimonialsRes.data && typeof testimonialsRes.data === 'object') {
        if (Array.isArray(testimonialsRes.data.data)) {
          testimonialsData = testimonialsRes.data.data;
        } else if (Array.isArray(testimonialsRes.data.testimonials)) {
          testimonialsData = testimonialsRes.data.testimonials;
        }
      }
      
      const approvedTestimonials = testimonialsData.filter(t => t.is_approved);
      
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
      tag: 'Best for Startups',
      gradient: 'from-blue-500 to-cyan-500'
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
        'API Integration',
        'Payment Gateway',
        'User Authentication',
        'Real-time Features',
        'Mobile App Ready',
        '6 Months Support',
        'Free Hosting 1 Year'
      ],
      tag: 'For Growing Businesses',
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
        'Advanced Analytics',
        'Multiple Integrations',
        'Team Collaboration',
        '24/7 Premium Support',
        'SLA Guaranteed',
        'Dedicated Team',
        'Custom Quote'
      ],
      tag: 'For Large Enterprises',
      gradient: 'from-orange-500 to-red-500'
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

  // FAQ Data
  const faqs = [
    {
      q: "What services does Krynova Technologies offer?",
      a: "We provide custom web solutions including website creation (basic to advanced), HRMS software, property management systems, task management tools, WhatsApp automation bots, and enterprise-grade business applications."
    },
    {
      q: "How much does a website cost?",
      a: "Our website creation pricing starts from ₹15,000 for a basic website (up to 5 pages). Professional websites with advanced features start from ₹35,000. Advanced web applications with custom functionality start from ₹75,000."
    },
    {
      q: "What is included in a basic website package?",
      a: "Our basic website package includes up to 5 pages, responsive design, basic SEO setup, contact form, social media integration, 1 month support, and free domain for the first year."
    },
    {
      q: "Where is Krynova Technologies located?",
      a: "We are based in Agra, Uttar Pradesh, India. We serve clients nationwide and internationally."
    },
    {
      q: "How long does it take to create a website?",
      a: "Simple websites take 1-2 weeks. Professional websites take 2-4 weeks. Advanced web applications typically take 1-3 months."
    },
    {
      q: "Do you provide free online tools?",
      a: "Yes! We offer 12+ free online tools including ATS-friendly Resume Builder, Cover Letter Generator, QR Code Generator, PDF converters, and more."
    }
  ];

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="p-8 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-red-200/50 dark:border-red-500/20 shadow-2xl max-w-md mx-auto text-center">
          <div className="text-5xl mb-4 animate-bounce">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Controls Panel with Full Features */}
      <ControlsPanel />

      {/* ========================================== */}
      {/* HELMET - SEO + AEO + GEO */}
      {/* ========================================== */}
      <Helmet>
        <title>Krynova Technologies - Best Web Development Company in India | Website Design & Development</title>
        <meta name="description" content="Krynova Technologies - India's leading web development company in Agra. We create custom websites, web applications, and enterprise solutions. Trusted by 50+ businesses. Starting from ₹15,000." />
        <meta name="keywords" content="Krynova Technologies, web development company India, website design company, custom web development" />
        <link rel="canonical" href={siteUrl} />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content="Krynova Technologies - Best Web Development Company in India" />
        <meta property="og:description" content="Custom websites, web applications, and enterprise solutions. Trusted by 50+ businesses. Starting from ₹15,000." />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Krynova Technologies - Best Web Development Company in India" />
        <meta name="twitter:description" content="Custom websites, web applications, and enterprise solutions." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h1>Krynova Technologies - Best Web Development Company in India</h1>
        <p>Krynova Technologies is India's leading web development company based in Agra, offering custom websites, web applications, and enterprise solutions. Trusted by 50+ businesses with 8+ years of experience.</p>
        <p>We serve clients in Agra, Delhi, Mumbai, Bangalore, Hyderabad, Pune, Kolkata, and all major cities in India, as well as international clients in USA, UK, Canada, Australia, UAE, and worldwide.</p>
      </div>

      {/* ========================================== */}
      {/* SCHEMA.ORG - Organization Schema */}
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
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+918630519082",
            "contactType": "sales",
            "email": "princeb744@gmail.com"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Agra",
            "addressRegion": "Uttar Pradesh",
            "addressCountry": "India"
          },
          "areaServed": indianCities
        })}
      </script>

      {/* ========================================== */}
      {/* HERO SECTION */}
      {/* ========================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white py-20 min-h-[600px] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <img 
                src="/logo.png" 
                alt="Krynova Technologies Logo" 
                className="h-20 w-auto md:h-24 hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-2 mb-6"
            >
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg">
                <FaStar className="inline mr-2 text-yellow-400" />
                India's Leading Web Development Company
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg">
                <FaTools className="inline mr-2 text-yellow-400" />
                12 Free Online Tools
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Web Solutions</span>
              <br />
              <span className="text-blue-200">for Every Business Need</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
            >
              From basic websites to advanced web applications — we build custom solutions with SEO, animations, and enterprise-grade security. <strong className="text-yellow-400">Starting from ₹15,000</strong>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link 
                to="/contact" 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 group"
              >
                Get Free Quote <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#pricing"
                className="border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                View Pricing
              </a>
              <Link 
                to="/products"
                className="border border-green-400/30 text-green-400 px-8 py-3 rounded-xl font-semibold hover:bg-green-400/10 transition-all duration-300"
              >
                Our Products
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {[
                { value: '8+', label: 'Years Experience', icon: FaAward },
                { value: '50+', label: 'Systems Built', icon: FaServer },
                { value: '100%', label: 'Client Satisfaction', icon: FaStar },
                { value: '24/7', label: 'Premium Support', icon: FaHeadset }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg"
                >
                  <div className="text-2xl font-bold text-yellow-400">{stat.value}</div>
                  <div className="text-sm text-blue-200 flex items-center gap-1 justify-center">
                    <stat.icon className="text-xs" /> {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* WEBSITE CREATION PRICING SECTION */}
      {/* ========================================== */}
      <section id="pricing" className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-sm font-semibold text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20">
              <FaRocket className="animate-spin-slow" />
              Website Creation Plans
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your <span className="gradient-text">Website Plan</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From simple business websites to complex web applications — we have a plan for every budget and requirement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {websitePlans.map((plan, index) => (
              <PricingCard
                key={index}
                {...plan}
                delay={index * 100}
              />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-10"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              * All prices are inclusive of GST. Custom quotes available for enterprise solutions.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Free Consultation <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* TRUST & CREDIBILITY */}
      {/* ========================================== */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
          >
            {[
              { icon: FaAward, text: 'Trusted by 50+ Businesses', color: 'text-blue-600' },
              { icon: FaTrophy, text: '50+ Enterprise Systems', color: 'text-purple-600' },
              { icon: FaMedal, text: '24/7 Premium Support', color: 'text-green-600' },
              { icon: FaTools, text: '12 Free Tools', color: 'text-orange-600' },
              { icon: FaGlobe, text: 'Global Presence', color: 'text-teal-600' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
              >
                <item.icon className={`${item.color} text-xl`} />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* ABOUT SECTION */}
      {/* ========================================== */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl font-bold mb-4 mt-2 text-gray-900 dark:text-white">Why Choose Krynova?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Founded in March 2024, Krynova Technologies is a cutting-edge technology company dedicated to providing 
                custom web solutions for businesses of all sizes and industries. We also offer <strong>12 FREE online tools</strong> 
                to help professionals and businesses boost their productivity.
              </p>
              <div className="space-y-4">
                <FeatureItem 
                  icon={FaRocket}
                  title="Our Vision"
                  description="To become the go-to partner for businesses seeking innovative, scalable, and secure web solutions."
                  color="blue"
                  delay={0}
                />
                <FeatureItem 
                  icon={FaShieldAlt}
                  title="Our Mission"
                  description="Empower businesses with custom software that drives growth, efficiency, and customer satisfaction."
                  color="purple"
                  delay={100}
                />
                <FeatureItem 
                  icon={FaUsers}
                  title="Our Commitment"
                  description="Deliver excellence with 100% client satisfaction, transparent communication, and long-term support."
                  color="green"
                  delay={200}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-500/20 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-400">Why Choose Krynova?</h3>
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
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 group hover:translate-x-1 transition-transform"
                    >
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1 rounded-full flex-shrink-0">
                        <FaCheckCircle />
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* EXPERIENCE & CLIENTS */}
      {/* ========================================== */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Experience</span>
            <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">Trusted By Leading Enterprises</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">8+ years of experience building solutions for industry leaders</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Counter 
              target={8} 
              label="Years Experience" 
              icon={FaAward} 
              suffix="+" 
              color="from-blue-500 to-cyan-500"
            />
            <Counter 
              target={50} 
              label="Systems Built" 
              icon={FaServer} 
              suffix="+" 
              color="from-purple-500 to-pink-500"
            />
            <Counter 
              target={100} 
              label="Websites Created" 
              icon={FaGlobe} 
              suffix="+" 
              color="from-green-500 to-emerald-500"
            />
            <Counter 
              target={100} 
              label="Client Satisfaction" 
              icon={FaStar} 
              suffix="%" 
              color="from-orange-500 to-red-500"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {[
              { name: 'Torrent Power', gradient: 'from-red-500 to-red-700' },
              { name: 'Tech Mahindra', gradient: 'from-blue-500 to-blue-700' },
              { name: 'Romsons', gradient: 'from-green-500 to-green-700' },
              { name: 'Agra Chain', gradient: 'from-purple-500 to-purple-700' },
              { name: 'Anna Infra', gradient: 'from-orange-500 to-orange-700' }
            ].map((client, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className={`p-4 rounded-xl text-center shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r ${client.gradient}`}
              >
                <FaBuilding className="text-2xl mx-auto mb-2 text-white/80" />
                <p className="font-semibold text-sm text-white">{client.name}</p>
                <p className="text-xs text-white/70">Enterprise Client</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SERVICES SECTION */}
      {/* ========================================== */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Services</span>
            <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">What We Offer</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Comprehensive web solutions for every business need</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FaServer, title: 'Custom Web Development', desc: 'Tailored web applications built with modern technologies for your specific business needs.', color: 'blue' },
              { icon: FaPalette, title: 'Website Design', desc: 'Beautiful, responsive, and user-friendly website designs that convert visitors into customers.', color: 'purple' },
              { icon: FaDatabase, title: 'HRMS Solutions', desc: 'Complete human resource management systems with payroll, attendance, and performance tracking.', color: 'green' },
              { icon: FaBuilding, title: 'Property Management', desc: 'Advanced property management systems for real estate businesses with tenant management and rent collection.', color: 'orange' },
              { icon: FaMobile, title: 'WhatsApp Automation', desc: 'AI-powered WhatsApp bots for lead generation, customer support, and automated communication.', color: 'teal' },
              { icon: FaChartLine, title: 'Data Analytics', desc: 'Comprehensive data analytics solutions with real-time dashboards and business intelligence.', color: 'pink' },
            ].map((service, index) => {
              const colorClasses = {
                blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
                teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
                pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
              };
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className={`${colorClasses[service.color]} w-14 h-14 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    <service.icon />
                  </div>
                  <h3 className="text-lg font-bold mt-4 text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{service.desc}</p>
                  <Link to="/contact" className="text-blue-600 dark:text-blue-400 font-semibold text-sm mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn More <FaArrowRight className="text-xs" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FEATURED PRODUCTS SECTION */}
      {/* ========================================== */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-sm font-semibold text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-500/20">
              <FaCube className="animate-spin-slow" />
              Our Products
            </div>
            <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">Featured Solutions</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Explore our ready-to-deploy enterprise solutions</p>
          </motion.div>

          {projects.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
              <p className="text-gray-500 dark:text-gray-400">No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors group"
            >
              View All Products 
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* TESTIMONIALS SECTION */}
      {/* ========================================== */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-sm font-semibold text-yellow-700 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-500/20">
              <FaStar className="animate-pulse" />
              Testimonials
            </div>
            <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">What Our Clients Say</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Real feedback from real businesses</p>
          </motion.div>

          {testimonials.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
              <p className="text-gray-500 dark:text-gray-400">No testimonials yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} index={index} />
              ))}
            </div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link 
              to="/testimonials" 
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors group"
            >
              Read All Testimonials 
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FREE TOOLS SECTION */}
      {/* ========================================== */}
      <section id="free-tools" className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-sm font-semibold text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-500/20">
              <FaTools className="animate-spin-slow" />
              Free Tools
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Free Online Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Boost your productivity with our completely free online tools. No sign-up required, unlimited usage!
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {freeTools.map((tool, index) => (
              <ToolCard key={index} {...tool} delay={index * 50} />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link 
              to="/tools" 
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore All Tools <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FAQ SECTION */}
      {/* ========================================== */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-sm font-semibold text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20">
              <FaQuestionCircle />
              FAQ
            </div>
            <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Quick answers about our services and free tools</p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                faq={faq}
                index={index}
                activeFaq={activeFaq}
                setActiveFaq={setActiveFaq}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FINAL CTA SECTION */}
      {/* ========================================== */}
      <section className="py-16 relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg mb-4">
              <FaRocket className="inline mr-2 text-yellow-400" />
              <span className="font-medium">Ready to Build Your Website?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Website?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Get a free consultation and discover how our custom solutions can help your business grow online.
              <br />
              <span className="text-yellow-300 text-lg">From basic websites to advanced web applications — we've got you covered!</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs shadow-lg">
                <FaMapPin /> {indianCities.length}+ Indian Cities
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs shadow-lg">
                <FaGlobe /> {globalCountries.length}+ Countries
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs shadow-lg">
                <FaTrophy /> 50+ Systems Built
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2 transform hover:-translate-y-1"
              >
                Get Free Quote <FaArrowRight />
              </Link>
              <a 
                href="#pricing"
                className="border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                View Pricing Plans
              </a>
              <Link 
                to="/tools"
                className="border border-green-400/30 text-green-400 px-8 py-3 rounded-xl font-semibold hover:bg-green-400/10 transition-all duration-300"
              >
                Try Free Tools
              </Link>
            </div>
            <p className="mt-6 text-blue-200 text-sm">
              Join 50+ satisfied businesses already using our solutions | Trusted by enterprises across India and globally
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* CSS Animations */}
      {/* ========================================== */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradient-shift 4s ease-in-out infinite;
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
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