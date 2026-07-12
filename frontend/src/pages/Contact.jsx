// frontend/src/pages/Contact.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaSpinner, 
  FaCheckCircle, FaClock, FaShieldAlt,
  FaBuilding, FaWhatsapp, FaLinkedin, FaGithub,
  FaTwitter, FaArrowRight, FaPaperPlane,
  FaUser, FaMailBulk, FaComment,
  FaHeadset, FaGlobe, FaLinkedinIn, FaYoutube,
  FaRegSmile, FaRocket, FaBriefcase, FaMoneyBillWave,
  FaCalendarAlt, FaStar, FaLightbulb, FaHandshake,
  FaChartLine, FaUsers, FaCrown, FaBullseye,
  FaFileAlt, FaVideo, FaPhoneAlt,
  FaMicrophone, FaHeadphones, FaQuestionCircle,
  FaComments, FaSearchLocation, FaMapPin, FaCity, FaFlag,
  FaMoon, FaSun, FaBars, FaTimes, FaTextHeight,
  FaPalette, FaBorderAll, FaLayerGroup,
  FaCubes, FaCube, FaGem, FaTools
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { 
  sanitizeInput, 
  isValidEmail, 
  isValidPhone, 
  isValidName
} from '../utils/security';

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
// UI COMPONENTS - Glassmorphism & Neumorphism
// ============================================

// Glass Card
const GlassCard = ({ children, className = '' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`relative backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-white/5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 ${className}`}
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
    <div className="relative p-6">{children}</div>
  </motion.div>
);

// Neumorphic Input
const NeoInput = ({ icon: Icon, label, name, value, onChange, onBlur, error, focused, placeholder, type = 'text', required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
        <Icon />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all duration-300 ${
          error 
            ? 'border-red-500 ring-2 ring-red-500 bg-red-50/30 dark:bg-red-900/20' 
            : focused === name 
              ? 'border-blue-500 ring-2 ring-blue-500/50 bg-white/80 dark:bg-gray-800/80' 
              : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80'
        } bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border focus:outline-none shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0f1520,_inset_-4px_-4px_8px_#2d3748]`}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1 flex items-center gap-1"
        >
          <span>⚠️</span> {error}
        </motion.p>
      )}
    </div>
  </div>
);

// Glass Textarea
const NeoTextarea = ({ icon: Icon, label, name, value, onChange, onBlur, error, focused, placeholder, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 text-sm group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
        <Icon />
      </div>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={4}
        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all duration-300 resize-y min-h-[100px] ${
          error 
            ? 'border-red-500 ring-2 ring-red-500 bg-red-50/30 dark:bg-red-900/20' 
            : focused === name 
              ? 'border-blue-500 ring-2 ring-blue-500/50 bg-white/80 dark:bg-gray-800/80' 
              : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80'
        } bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border focus:outline-none shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0f1520,_inset_-4px_-4px_8px_#2d3748]`}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1 flex items-center gap-1"
        >
          <span>⚠️</span> {error}
        </motion.p>
      )}
    </div>
  </div>
);

// Glass Button
const GlassButton = ({ children, onClick, loading, type = 'button', className = '' }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    type={type}
    onClick={onClick}
    disabled={loading}
    className={`relative w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden group ${
      loading 
        ? 'bg-gray-400 cursor-not-allowed' 
        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
    } ${className}`}
  >
    {/* Shimmer Effect */}
    {!loading && (
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    )}
    <span className="relative flex items-center justify-center gap-2">
      {loading ? (
        <>
          <FaSpinner className="animate-spin" />
          Sending...
        </>
      ) : (
        children
      )}
    </span>
  </motion.button>
);

// Quick Reply Button
const QuickReplyButton = ({ label, onClick, isActive = false }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30' 
        : 'glass-btn text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-white/20 dark:border-white/5'
    }`}
  >
    {label}
  </motion.button>
);

// Selection Card
const SelectionCard = ({ icon: Icon, label, description, selected, onSelect, gradient = 'from-blue-500 to-indigo-500' }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={onSelect}
    className={`group p-4 rounded-xl border-2 text-left transition-all duration-300 ${
      selected 
        ? 'border-blue-500/50 dark:border-blue-400/50 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-xl shadow-blue-500/20' 
        : 'border-white/20 dark:border-white/5 hover:border-blue-300/50 dark:hover:border-blue-500/30 bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60'
    } backdrop-blur-sm`}
  >
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all duration-300 ${
        selected 
          ? `bg-gradient-to-r ${gradient} text-white shadow-lg` 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400'
      }`}>
        <Icon />
      </div>
      <div>
        <p className={`font-semibold text-sm ${selected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  </motion.button>
);

// Budget Selector
const BudgetRange = ({ value, onChange }) => {
  const budgets = [
    { label: '₹15K - ₹50K', value: '15k-50k' },
    { label: '₹50K - ₹1L', value: '50k-1l' },
    { label: '₹1L - ₹5L', value: '1l-5l' },
    { label: '₹5L - ₹10L', value: '5l-10l' },
    { label: '₹10L+', value: '10l+' },
    { label: 'Not Sure', value: 'not-sure' },
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {budgets.map((budget) => (
        <motion.button
          key={budget.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => onChange(budget.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
            value === budget.value
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
              : 'glass-btn text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/5 hover:border-green-300/50 dark:hover:border-green-500/30'
          }`}
        >
          {budget.label}
        </motion.button>
      ))}
    </div>
  );
};

// Timeline Selector
const TimelineSelector = ({ value, onChange }) => {
  const timelines = [
    { label: 'ASAP', value: 'asap' },
    { label: '1-2 Weeks', value: '1-2-weeks' },
    { label: '1 Month', value: '1-month' },
    { label: '1-3 Months', value: '1-3-months' },
    { label: '3-6 Months', value: '3-6-months' },
    { label: 'Planning', value: 'planning' },
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {timelines.map((timeline) => (
        <motion.button
          key={timeline.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => onChange(timeline.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
            value === timeline.value
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
              : 'glass-btn text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/5 hover:border-purple-300/50 dark:hover:border-purple-500/30'
          }`}
        >
          {timeline.label}
        </motion.button>
      ))}
    </div>
  );
};

// Demo Options
const DemoOptions = ({ onSelect }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
    {[
      { label: 'HRMS Demo', icon: FaUsers, time: '15 min', gradient: 'from-blue-500 to-cyan-500' },
      { label: 'Task Manager', icon: FaBullseye, time: '10 min', gradient: 'from-purple-500 to-pink-500' },
      { label: 'Property System', icon: FaBuilding, time: '20 min', gradient: 'from-green-500 to-emerald-500' },
      { label: 'WhatsApp Bot', icon: FaWhatsapp, time: '10 min', gradient: 'from-orange-500 to-red-500' },
    ].map((demo, idx) => (
      <motion.button
        key={idx}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(`I want to see a demo of the ${demo.label} (${demo.time} demo)`)}
        className="glass-btn p-3 rounded-xl text-center group border border-white/20 dark:border-white/5 hover:border-blue-300/50 dark:hover:border-blue-500/30 transition-all duration-300"
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${demo.gradient} flex items-center justify-center text-white text-lg mx-auto mb-1.5 group-hover:scale-110 transition-transform shadow-lg`}>
          <demo.icon />
        </div>
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{demo.label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{demo.time}</p>
      </motion.button>
    ))}
  </div>
);

// Requirement Checklist
const RequirementChecklist = ({ selected, onToggle }) => {
  const requirements = [
    '✅ Responsive Design',
    '✅ User Authentication',
    '✅ Dashboard & Analytics',
    '✅ Payment Integration',
    '✅ Email/SMS Notifications',
    '✅ API Integration',
    '✅ Admin Panel',
    '✅ SEO Optimization',
    '✅ Data Export',
    '✅ Multi-language',
    '✅ Mobile App',
    '✅ Third-party Integrations'
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {requirements.map((req, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => onToggle(req)}
          className={`text-xs px-3 py-1 rounded-full transition-all duration-300 ${
            selected.includes(req)
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
              : 'glass-btn text-gray-600 dark:text-gray-400 border border-white/20 dark:border-white/5 hover:border-blue-300/50 dark:hover:border-blue-500/30'
          }`}
        >
          {req}
        </motion.button>
      ))}
    </div>
  );
};

// Info Card with Glassmorphism
const InfoCard = ({ icon: Icon, title, value, gradient = 'from-blue-500 to-indigo-500', className = '' }) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -2 }}
    className={`glass-info-card p-4 rounded-xl border border-white/20 dark:border-white/5 ${className}`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-lg shadow-lg flex-shrink-0`}>
        <Icon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  </motion.div>
);

// ============================================
// CONSTANTS
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
// MAIN CONTACT COMPONENT
// ============================================

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
    interestType: 'service',
    serviceType: '',
    productType: '',
    budget: '',
    timeline: '',
    requirements: [],
    companyName: '',
    hearAbout: '',
    preferredContact: 'email',
    industry: '',
    teamSize: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const formRef = useRef(null);

  const siteUrl = window.location.origin;

  useEffect(() => {
    setCharacterCount(form.message.length);
  }, [form.message]);

  useEffect(() => {
    if (Object.keys(errors).length > 0 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [errors]);

  const validateField = (name, value) => {
    const sanitized = typeof value === 'string' ? sanitizeInput(value) : value;
    
    switch (name) {
      case 'name':
        if (!sanitized || sanitized.trim().length < 2) return 'Name is required (minimum 2 characters)';
        if (!isValidName(sanitized)) return 'Name contains invalid characters';
        if (sanitized.trim().length > 50) return 'Name is too long (max 50 characters)';
        return null;
      case 'email':
        if (!sanitized) return 'Email is required';
        if (!isValidEmail(sanitized)) return 'Please enter a valid email address';
        return null;
      case 'phone':
        if (sanitized && !isValidPhone(sanitized)) return 'Invalid phone number format';
        return null;
      case 'subject':
        if (sanitized && sanitized.length > 200) return 'Subject is too long (max 200 characters)';
        return null;
      case 'message':
        if (!sanitized || sanitized.trim().length < 10) return 'Message must be at least 10 characters';
        if (sanitized.length > 5000) return 'Message is too long (max 5000 characters)';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const toggleRequirement = (req) => {
    setSelectedRequirements(prev =>
      prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]
    );
    setForm(prev => ({ ...prev, requirements: selectedRequirements }));
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = ['name', 'email', 'message'];
    
    fields.forEach(field => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });
    
    ['phone', 'subject'].forEach(field => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const sanitizedData = {
        name: sanitizeInput(form.name.trim()),
        email: sanitizeInput(form.email.trim()),
        phone: sanitizeInput(form.phone.trim()),
        subject: sanitizeInput(form.subject.trim()),
        message: sanitizeInput(form.message.trim()),
        type: form.type,
        interestType: form.interestType,
        serviceType: form.serviceType,
        productType: form.productType,
        budget: form.budget,
        timeline: form.timeline,
        requirements: selectedRequirements,
        companyName: sanitizeInput(form.companyName.trim()),
        hearAbout: form.hearAbout,
        preferredContact: form.preferredContact,
        industry: form.industry,
        teamSize: form.teamSize
      };
      
      await api.submitContact(sanitizedData);
      toast.success('🎉 Message sent successfully! We\'ll get back to you within 24 hours.');
      setSubmitted(true);
      setForm({ 
        name: '', email: '', phone: '', subject: '', message: '', type: 'general',
        interestType: 'service', serviceType: '', productType: '', budget: '', 
        timeline: '', requirements: [], companyName: '', 
        hearAbout: '', preferredContact: 'email',
        industry: '', teamSize: ''
      });
      setSelectedRequirements([]);
      setErrors({});
    } catch (error) {
      console.error('Contact submission error:', error);
      const message = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const setQuickReply = (message) => {
    setForm(prev => ({ ...prev, message }));
    setErrors(prev => ({ ...prev, message: null }));
  };

  const quickReplies = [
    { label: '🚀 HRMS Demo', value: 'I want to see a live demo of the HRMS system for my company with 50+ employees. We need attendance tracking, payroll, and leave management.' },
    { label: '💼 Custom Web App', value: 'I need a custom web application for my business. We are looking for a solution that can handle inventory management, customer tracking, and reporting.' },
    { label: '📱 WhatsApp Bot', value: 'We want to implement a WhatsApp automation bot for our business to handle customer inquiries and order processing.' },
    { label: '🏢 Property Management', value: 'I am interested in the property management solution. We need to manage multiple properties, tenants, and payments.' },
    { label: '📊 Data Analytics', value: 'We need a data analytics dashboard for our business to track key metrics and generate insights.' },
    { label: '🔧 Custom Solution', value: 'I need a custom software solution for my specific business needs. Let\'s discuss the requirements.' },
  ];

  const serviceTypes = [
    { icon: FaRocket, label: 'Web Development', desc: 'Custom websites & web apps', gradient: 'from-blue-500 to-cyan-500' },
    { icon: FaChartLine, label: 'Digital Marketing', desc: 'SEO, PPC, social media', gradient: 'from-purple-500 to-pink-500' },
    { icon: FaUsers, label: 'HRMS Solutions', desc: 'HR management systems', gradient: 'from-green-500 to-emerald-500' },
    { icon: FaWhatsapp, label: 'WhatsApp Automation', desc: 'Bot & automation', gradient: 'from-orange-500 to-red-500' },
    { icon: FaBuilding, label: 'Property Management', desc: 'Real estate solutions', gradient: 'from-teal-500 to-cyan-500' },
    { icon: FaBullseye, label: 'Business Analytics', desc: 'Data & analytics', gradient: 'from-indigo-500 to-purple-500' },
  ];

  const productTypes = [
    { icon: FaUsers, label: 'HRMS Pro', desc: 'Complete HR management', gradient: 'from-blue-500 to-cyan-500' },
    { icon: FaBullseye, label: 'Task Manager', desc: 'Project & task management', gradient: 'from-purple-500 to-pink-500' },
    { icon: FaBuilding, label: 'Estate Manager', desc: 'Property management', gradient: 'from-green-500 to-emerald-500' },
    { icon: FaWhatsapp, label: 'WhatsApp Bot Pro', desc: 'Automation bot', gradient: 'from-orange-500 to-red-500' },
    { icon: FaChartLine, label: 'Analytics Dashboard', desc: 'Data insights', gradient: 'from-teal-500 to-cyan-500' },
    { icon: FaCrown, label: 'Enterprise Suite', desc: 'All-in-one solution', gradient: 'from-indigo-500 to-purple-500' },
  ];

  return (
    <>
      {/* Controls Panel */}
      <ControlsPanel />

      {/* ========================================== */}
      {/* HELMET - SEO + AEO + GEO */}
      {/* ========================================== */}
      <Helmet>
        <title>Contact Krynova Technologies | Free Consultation & Demo Request in Agra, India | Global Reach</title>
        <meta name="description" content="Contact Krynova Technologies - India's leading web development company in Agra. Get free consultation, request a demo for HRMS, Property Management, or custom web solutions. Serving businesses in all Indian cities and globally. We respond within 24 hours." />
        <meta name="keywords" content="contact web development company Agra, free consultation, HRMS demo, property management demo, web development quote, Krynova Technologies contact, software development inquiry, enterprise solutions India, global software company, contact for web development" />
        <link rel="canonical" href={`${siteUrl}/contact`} />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta property="og:title" content="Contact Krynova Technologies | Free Consultation & Demo Request | Global Reach" />
        <meta property="og:description" content="Get in touch with India's leading web development company. Free consultation available for HRMS, Property Management, and custom web solutions." />
        <meta property="og:url" content={`${siteUrl}/contact`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Krynova Technologies | Free Consultation & Demo Request" />
        <meta name="twitter:description" content="Get in touch with India's leading web development company. Free consultation available." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Contact Krynova Technologies</h2>
        <p>Krynova Technologies is a leading web development company based in Agra, India. We offer free consultation for HRMS software, property management systems, WhatsApp automation, and custom web solutions.</p>
        <p>Contact us via email at princeb744@gmail.com, phone at +91 86305 19082, or through our contact form. We respond within 24 hours.</p>
      </div>

      {/* ========================================== */}
      {/* SCHEMA.ORG */}
      {/* ========================================== */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Krynova Technologies",
          "description": "Contact page for Krynova Technologies - web development company in Agra, India with global reach.",
          "url": `${siteUrl}/contact`,
          "provider": {
            "@type": "Organization",
            "name": "Krynova Technologies",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Agra",
              "addressRegion": "Uttar Pradesh",
              "addressCountry": "India"
            },
            "telephone": "+918630519082",
            "email": "princeb744@gmail.com"
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          }
        })}
      </script>

      {/* ========================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================== */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-5"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Hero Section - Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-hero p-8 md:p-12 rounded-3xl mb-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 liquid-glass-overlay"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 glass-badge px-4 py-2 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-400 mb-4 border border-white/20 dark:border-white/5">
                <FaHeadset className="text-yellow-400" />
                Free Consultation & Demo Request
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Let's Build Something
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"> Amazing Together</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Tell us about your project, request a demo, or just say hello. We'll respond within 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="glass-tag inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-white/20 dark:border-white/5">
                  <FaMapPin className="text-blue-500" /> {indianCities.length}+ Indian Cities
                </span>
                <span className="glass-tag inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-white/20 dark:border-white/5">
                  <FaGlobe className="text-green-500" /> {globalCountries.length}+ Countries
                </span>
                <span className="glass-tag inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-white/20 dark:border-white/5">
                  <FaMicrophone className="text-purple-500" /> Voice Search Ready
                </span>
                <span className="glass-tag inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-white/20 dark:border-white/5">
                  <FaComments className="text-orange-500" /> 24/7 Support
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Sidebar - Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Contact Info Cards - Glassmorphism */}
              <GlassCard>
                <div className="space-y-3">
                  <InfoCard 
                    icon={FaEnvelope} 
                    title="Email" 
                    value="princeb744@gmail.com" 
                    gradient="from-blue-500 to-cyan-500"
                  />
                  <InfoCard 
                    icon={FaPhone} 
                    title="Phone" 
                    value="+91 86305 19082" 
                    gradient="from-green-500 to-emerald-500"
                  />
                  <InfoCard 
                    icon={FaMapMarkerAlt} 
                    title="Location" 
                    value="Agra, Uttar Pradesh, India" 
                    gradient="from-purple-500 to-pink-500"
                  />
                  <InfoCard 
                    icon={FaClock} 
                    title="Working Hours" 
                    value="Mon-Fri: 9:00 AM - 6:00 PM IST" 
                    gradient="from-orange-500 to-red-500"
                  />
                </div>
              </GlassCard>

              {/* Quick Stats - Neumorphism */}
              <GlassCard>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: '24', label: 'Hour Response', gradient: 'from-green-500 to-emerald-500' },
                    { value: '100%', label: 'Satisfaction', gradient: 'from-blue-500 to-cyan-500' },
                    { value: '50+', label: 'Happy Clients', gradient: 'from-purple-500 to-pink-500' },
                    { value: '24/7', label: 'Support', gradient: 'from-orange-500 to-red-500' }
                  ].map((stat, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="neo-stat p-3 rounded-xl text-center shadow-[inset_4px_4px_8px_#d1d1d1,_inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0f1520,_inset_-4px_-4px_8px_#2d3748]"
                    >
                      <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Social Links - Glassmorphism */}
              <GlassCard>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Connect With Us</h4>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { icon: FaLinkedinIn, color: 'from-blue-500 to-blue-700' },
                    { icon: FaGithub, color: 'from-gray-600 to-gray-800' },
                    { icon: FaTwitter, color: 'from-blue-400 to-cyan-500' },
                    { icon: FaWhatsapp, color: 'from-green-500 to-emerald-600' },
                    { icon: FaYoutube, color: 'from-red-500 to-red-700' }
                  ].map((social, idx) => (
                    <motion.a
                      key={idx}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                      href="#"
                      className={`w-10 h-10 rounded-xl bg-gradient-to-r ${social.color} flex items-center justify-center text-white text-sm shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <social.icon />
                    </motion.a>
                  ))}
                </div>
              </GlassCard>

              {/* Location Info - Glassmorphism */}
              <GlassCard>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <FaMapPin className="text-blue-500" /> Serving Locations
                </h4>
                <div className="flex flex-wrap gap-1">
                  {indianCities.slice(0, 8).map((city, idx) => (
                    <span key={idx} className="glass-tag text-xs px-2 py-0.5 rounded-full border border-white/20 dark:border-white/5">
                      {city}
                    </span>
                  ))}
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">+{indianCities.length - 8} more cities</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {globalCountries.slice(0, 6).map((country, idx) => (
                    <span key={idx} className="glass-tag text-xs px-2 py-0.5 rounded-full border border-white/20 dark:border-white/5">
                      {country}
                    </span>
                  ))}
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">+{globalCountries.length - 6} more countries</span>
                </div>
              </GlassCard>
            </div>

            {/* Right Side - Contact Form */}
            <div ref={formRef} className="lg:col-span-3">
              <GlassCard className="p-6 md:p-8">
                {submitted ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4 shadow-2xl shadow-green-500/30"
                    >
                      <FaCheckCircle />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🎉 Thank You!</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Your message has been sent successfully. We'll get back to you within 24 hours.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSubmitted(false)}
                      className="mt-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all text-sm"
                    >
                      Send another message <FaArrowRight className="text-xs" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                        <FaPaperPlane className="text-white text-lg" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send a Message</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    {/* Quick Reply Options */}
                    <div className="flex flex-wrap gap-1.5">
                      {quickReplies.map((reply, index) => (
                        <QuickReplyButton
                          key={index}
                          label={reply.label}
                          onClick={() => setQuickReply(reply.value)}
                        />
                      ))}
                    </div>

                    {/* Interest Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        I'm interested in <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <SelectionCard
                          icon={FaRocket}
                          label="Service"
                          description="Custom development"
                          selected={form.interestType === 'service'}
                          onSelect={() => setForm(prev => ({ ...prev, interestType: 'service', serviceType: '', productType: '' }))}
                          gradient="from-blue-500 to-cyan-500"
                        />
                        <SelectionCard
                          icon={FaCrown}
                          label="Product"
                          description="Ready-made solutions"
                          selected={form.interestType === 'product'}
                          onSelect={() => setForm(prev => ({ ...prev, interestType: 'product', serviceType: '', productType: '' }))}
                          gradient="from-purple-500 to-pink-500"
                        />
                      </div>
                    </div>

                    {/* Service/Product Type */}
                    {form.interestType === 'service' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          What service do you need? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {serviceTypes.map((service, idx) => (
                            <SelectionCard
                              key={idx}
                              icon={service.icon}
                              label={service.label}
                              description={service.desc}
                              selected={form.serviceType === service.label}
                              onSelect={() => setForm(prev => ({ ...prev, serviceType: service.label }))}
                              gradient={service.gradient}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {form.interestType === 'product' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Which product are you interested in? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {productTypes.map((product, idx) => (
                            <SelectionCard
                              key={idx}
                              icon={product.icon}
                              label={product.label}
                              description={product.desc}
                              selected={form.productType === product.label}
                              onSelect={() => setForm(prev => ({ ...prev, productType: product.label }))}
                              gradient={product.gradient}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Personal Details */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <NeoInput
                        icon={FaUser}
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.name}
                        focused={focusedField}
                        placeholder="John Doe"
                        required
                      />
                      <NeoInput
                        icon={FaMailBulk}
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        focused={focusedField}
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <NeoInput
                        icon={FaPhone}
                        label="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.phone}
                        focused={focusedField}
                        placeholder="+91 98765 43210"
                      />
                      <NeoInput
                        icon={FaBuilding}
                        label="Company Name"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Your Company"
                      />
                    </div>

                    {/* Budget & Timeline */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <FaMoneyBillWave className="inline mr-1 text-green-500" />
                          Budget
                        </label>
                        <BudgetRange value={form.budget} onChange={(val) => setForm(prev => ({ ...prev, budget: val }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <FaCalendarAlt className="inline mr-1 text-purple-500" />
                          Timeline
                        </label>
                        <TimelineSelector value={form.timeline} onChange={(val) => setForm(prev => ({ ...prev, timeline: val }))} />
                      </div>
                    </div>

                    {/* Demo Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        <FaVideo className="inline mr-1 text-blue-500" />
                        Quick Demo
                      </label>
                      <DemoOptions onSelect={setQuickReply} />
                    </div>

                    {/* Requirements */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        <FaLightbulb className="inline mr-1 text-yellow-500" />
                        Requirements
                      </label>
                      <RequirementChecklist 
                        selected={selectedRequirements}
                        onToggle={toggleRequirement}
                      />
                      {selectedRequirements.length > 0 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{selectedRequirements.length} selected</p>
                      )}
                    </div>

                    {/* Advanced Options Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition flex items-center gap-1"
                    >
                      {showAdvanced ? 'Hide' : 'Show'} Advanced
                      <FaArrowRight className={`text-xs transition ${showAdvanced ? 'rotate-90' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-white/5"
                        >
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">Industry</label>
                              <select
                                name="industry"
                                value={form.industry}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                              >
                                <option value="">Select</option>
                                <option value="technology">Technology</option>
                                <option value="real-estate">Real Estate</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="education">Education</option>
                                <option value="retail">Retail</option>
                                <option value="finance">Finance</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">Team Size</label>
                              <select
                                name="teamSize"
                                value={form.teamSize}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                              >
                                <option value="">Select</option>
                                <option value="1-5">1-5</option>
                                <option value="6-20">6-20</option>
                                <option value="21-50">21-50</option>
                                <option value="51-200">51-200</option>
                                <option value="200+">200+</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">How did you hear about us?</label>
                            <select
                              name="hearAbout"
                              value={form.hearAbout}
                              onChange={handleChange}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                            >
                              <option value="">Select...</option>
                              <option value="google">Google Search</option>
                              <option value="social">Social Media</option>
                              <option value="referral">Referral</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="youtube">YouTube</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Message */}
                    <NeoTextarea
                      icon={FaComment}
                      label="Message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.message}
                      focused={focusedField}
                      placeholder="Tell us about your project..."
                      required
                    />

                    <div className="flex justify-between mt-1">
                      <p className={`text-xs ${characterCount > 4500 ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`}>
                        {characterCount}/5000
                      </p>
                    </div>

                    <GlassButton
                      type="submit"
                      loading={submitting}
                    >
                      <FaPaperPlane /> Send Message
                    </GlassButton>

                    <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                      <FaShieldAlt className="inline mr-1" />
                      Your information is secure. We respond within 24 hours.
                    </p>
                  </form>
                )}
              </GlassCard>
            </div>
          </div>

          {/* Solutions Tags - Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <GlassCard>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 text-center">Our Solutions</h3>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['HRMS', 'Task Manager', 'Property Management', 'WhatsApp Bot', 'E-Commerce', 'Custom Web Apps', 'Data Analytics', 'Cloud Solutions', 'Mobile Apps', 'AI Integration'].map((tag) => (
                  <motion.span 
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    className="glass-tag inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border border-white/20 dark:border-white/5"
                  >
                    <FaCheckCircle className="text-green-500 text-xs" />
                    {tag}
                  </motion.span>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500 dark:text-gray-400"
          >
            <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500 text-sm" /> 50+ Happy Clients</span>
            <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500 text-sm" /> 8+ Years Experience</span>
            <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500 text-sm" /> 24/7 Support</span>
            <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500 text-sm" /> 100% Satisfaction</span>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* ========================================== */
        /* GLASSMORPHISM */
        /* ========================================== */
        .glass-hero {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
        }
        
        .dark .glass-hero {
          background: rgba(31, 41, 55, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        
        .glass-badge {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .dark .glass-badge {
          background: rgba(31, 41, 55, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .glass-btn {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }
        
        .glass-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .dark .glass-btn {
          background: rgba(31, 41, 55, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .dark .glass-btn:hover {
          background: rgba(31, 41, 55, 0.3);
        }
        
        .glass-tag {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dark .glass-tag {
          background: rgba(31, 41, 55, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .glass-info-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .glass-info-card:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        
        .dark .glass-info-card {
          background: rgba(31, 41, 55, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .dark .glass-info-card:hover {
          background: rgba(31, 41, 55, 0.25);
        }
        
        .liquid-glass-overlay {
          background: linear-gradient(135deg, 
            rgba(255,255,255,0.1) 0%,
            rgba(255,255,255,0) 50%,
            rgba(255,255,255,0.1) 100%
          );
          pointer-events: none;
        }

        /* ========================================== */
        /* NEUMORPHISM */
        /* ========================================== */
        .neo-stat {
          background: #e8edf2;
          transition: all 0.3s ease;
        }
        
        .dark .neo-stat {
          background: #1f2937;
        }

        /* ========================================== */
        /* ANIMATIONS */
        /* ========================================== */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: floatDelayed 7s ease-in-out infinite 1s; }
        
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
    </>
  );
};

export default Contact;