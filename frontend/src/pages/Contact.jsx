// frontend/src/pages/Contact.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  FaFileAlt, FaVideo, FaPhoneAlt
} from 'react-icons/fa';
import { api } from '../utils/api';
import { 
  sanitizeInput, 
  isValidEmail, 
  isValidPhone, 
  isValidName
} from '../utils/security';

// ============================================
// COMPONENTS
// ============================================

const ServiceProductCard = ({ icon: Icon, label, description, onSelect, selected }) => (
  <button
    onClick={() => onSelect(label)}
    className={`group p-3 rounded-xl border-2 text-left transition-all duration-300 ${
      selected 
        ? 'border-blue-600 bg-blue-50 shadow-md' 
        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-start gap-2.5">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${
        selected 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
      }`}>
        <Icon />
      </div>
      <div>
        <p className={`font-semibold text-sm ${selected ? 'text-blue-600' : 'text-gray-700'}`}>
          {label}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  </button>
);

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
        <button
          key={budget.value}
          type="button"
          onClick={() => onChange(budget.value)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            value === budget.value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {budget.label}
        </button>
      ))}
    </div>
  );
};

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
        <button
          key={timeline.value}
          type="button"
          onClick={() => onChange(timeline.value)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            value === timeline.value
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {timeline.label}
        </button>
      ))}
    </div>
  );
};

const DemoOptions = ({ onSelect }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
    {[
      { label: 'HRMS Demo', icon: FaUsers, time: '15 min' },
      { label: 'Task Manager', icon: FaBullseye, time: '10 min' },
      { label: 'Property System', icon: FaBuilding, time: '20 min' },
      { label: 'WhatsApp Bot', icon: FaWhatsapp, time: '10 min' },
    ].map((demo, idx) => (
      <button
        key={idx}
        onClick={() => onSelect(`I want to see a demo of the ${demo.label} (${demo.time} demo)`)}
        className="p-2.5 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-300 border border-gray-200 transition text-center group"
      >
        <demo.icon className="text-lg text-blue-500 mx-auto mb-0.5 group-hover:scale-110 transition" />
        <p className="text-xs font-medium text-gray-700">{demo.label}</p>
        <p className="text-xs text-gray-400">{demo.time}</p>
      </button>
    ))}
  </div>
);

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
    <div className="flex flex-wrap gap-1">
      {requirements.map((req, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onToggle(req)}
          className={`text-xs px-2 py-0.5 rounded-full transition-all ${
            selected.includes(req)
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          {req}
        </button>
      ))}
    </div>
  );
};

// ============================================
// CONTACT PAGE
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
    { icon: FaRocket, label: 'Web Development', desc: 'Custom websites & web apps' },
    { icon: FaChartLine, label: 'Digital Marketing', desc: 'SEO, PPC, social media' },
    { icon: FaUsers, label: 'HRMS Solutions', desc: 'HR management systems' },
    { icon: FaWhatsapp, label: 'WhatsApp Automation', desc: 'Bot & automation' },
    { icon: FaBuilding, label: 'Property Management', desc: 'Real estate solutions' },
    { icon: FaBullseye, label: 'Business Analytics', desc: 'Data & analytics' },
  ];

  const productTypes = [
    { icon: FaUsers, label: 'HRMS Pro', desc: 'Complete HR management' },
    { icon: FaBullseye, label: 'Task Manager', desc: 'Project & task management' },
    { icon: FaBuilding, label: 'Estate Manager', desc: 'Property management' },
    { icon: FaWhatsapp, label: 'WhatsApp Bot Pro', desc: 'Automation bot' },
    { icon: FaChartLine, label: 'Analytics Dashboard', desc: 'Data insights' },
    { icon: FaCrown, label: 'Enterprise Suite', desc: 'All-in-one solution' },
  ];

  return (
    <>
     <link rel="canonical" href={`${siteUrl}/contact`} />
      <title>Contact Krynova Technologies | Free Consultation & Demo Request</title>
      <meta name="description" content="Contact Krynova Technologies - India's leading web development company. Get free consultation, request a demo, or ask about our custom web solutions. We respond within 24 hours." />
      
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* ✅ Spacer for fixed navbar */}
        <div className="h-14 md:h-16 lg:h-20"></div>
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-10 md:py-14 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-blue-800/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-blue-700/50 mb-4">
                <FaHeadset className="text-yellow-400" />
                <span>Free Consultation & Demo Request</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                Let's Build Something
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"> Amazing Together</span>
              </h1>
              <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto">
                Tell us about your project, request a demo, or just say hello. We'll respond within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {/* Left Sidebar - Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Contact Info Cards */}
              <div className="space-y-3">
                <div className="group bg-white rounded-xl p-3 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <FaEnvelope />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <a href="mailto:princeb744@gmail.com" className="text-gray-900 font-semibold hover:text-blue-600 transition-colors text-sm">
                        princeb744@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-xl p-3 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-gradient-to-br group-hover:from-green-600 group-hover:to-green-700 group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <FaPhone />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <a href="tel:+918630519082" className="text-gray-900 font-semibold hover:text-green-600 transition-colors text-sm">
                        +91 86305 19082
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-xl p-3 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-purple-700 group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Location</p>
                      <p className="text-gray-900 font-semibold text-sm">Agra, Uttar Pradesh, India</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-xl p-3 border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 group-hover:bg-gradient-to-br group-hover:from-yellow-600 group-hover:to-yellow-700 group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <FaClock />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Working Hours</p>
                      <p className="text-gray-900 font-semibold text-sm">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">24</div>
                    <p className="text-xs text-gray-500">Hour Response</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">100%</div>
                    <p className="text-xs text-gray-500">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">50+</div>
                    <p className="text-xs text-gray-500">Happy Clients</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">24/7</div>
                    <p className="text-xs text-gray-500">Support</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Connect With Us</h4>
                <div className="flex gap-1.5 flex-wrap">
                  <a href="#" className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm">
                    <FaLinkedinIn />
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-800 hover:text-white transition-all duration-300 text-sm">
                    <FaGithub />
                  </a>
                  <a href="#" className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300 text-sm">
                    <FaTwitter />
                  </a>
                  <a href="#" className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 text-sm">
                    <FaWhatsapp />
                  </a>
                  <a href="#" className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 text-sm">
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div ref={formRef} className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg shadow-green-500/30">
                      <FaCheckCircle />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 Thank You!</h3>
                    <p className="text-gray-600 text-sm max-w-md mx-auto">
                      Your message has been sent successfully. We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all text-sm"
                    >
                      Send another message <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                        <FaPaperPlane className="text-white text-sm" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Send a Message</h2>
                        <p className="text-xs text-gray-500">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    {/* Quick Reply Options */}
                    <div className="flex flex-wrap gap-1">
                      {quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setQuickReply(reply.value)}
                          className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 px-2 py-0.5 rounded-full transition-colors border border-gray-200"
                        >
                          {reply.label}
                        </button>
                      ))}
                    </div>

                    {/* Interest Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        I'm interested in <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, interestType: 'service', serviceType: '', productType: '' }))}
                          className={`p-2 rounded-xl border-2 text-center transition-all ${
                            form.interestType === 'service'
                              ? 'border-blue-600 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <FaRocket className={`text-lg mx-auto mb-0.5 ${form.interestType === 'service' ? 'text-blue-600' : 'text-gray-400'}`} />
                          <p className={`font-semibold text-sm ${form.interestType === 'service' ? 'text-blue-600' : 'text-gray-700'}`}>Service</p>
                          <p className="text-xs text-gray-500">Custom development</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, interestType: 'product', serviceType: '', productType: '' }))}
                          className={`p-2 rounded-xl border-2 text-center transition-all ${
                            form.interestType === 'product'
                              ? 'border-blue-600 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <FaCrown className={`text-lg mx-auto mb-0.5 ${form.interestType === 'product' ? 'text-blue-600' : 'text-gray-400'}`} />
                          <p className={`font-semibold text-sm ${form.interestType === 'product' ? 'text-blue-600' : 'text-gray-700'}`}>Product</p>
                          <p className="text-xs text-gray-500">Ready-made solutions</p>
                        </button>
                      </div>
                    </div>

                    {/* Service/Product Type */}
                    {form.interestType === 'service' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          What service do you need? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                          {serviceTypes.map((service, idx) => (
                            <ServiceProductCard
                              key={idx}
                              icon={service.icon}
                              label={service.label}
                              description={service.desc}
                              selected={form.serviceType === service.label}
                              onSelect={(label) => setForm(prev => ({ ...prev, serviceType: label }))}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {form.interestType === 'product' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Which product are you interested in? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                          {productTypes.map((product, idx) => (
                            <ServiceProductCard
                              key={idx}
                              icon={product.icon}
                              label={product.label}
                              description={product.desc}
                              selected={form.productType === product.label}
                              onSelect={(label) => setForm(prev => ({ ...prev, productType: label }))}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Personal Details */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            <FaUser />
                          </div>
                          <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={() => handleFocus('name')}
                            className={`w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition ${
                              errors.name ? 'border-red-500 ring-2 ring-red-500' : 
                              focusedField === 'name' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            <FaMailBulk />
                          </div>
                          <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={() => handleFocus('email')}
                            className={`w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition ${
                              errors.email ? 'border-red-500 ring-2 ring-red-500' : 
                              focusedField === 'email' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            <FaPhone />
                          </div>
                          <input
                            type="text"
                            name="phone"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            <FaBuilding />
                          </div>
                          <input
                            type="text"
                            name="companyName"
                            placeholder="Your Company"
                            value={form.companyName}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Budget & Timeline */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          <FaMoneyBillWave className="inline mr-1 text-green-500" />
                          Budget
                        </label>
                        <BudgetRange value={form.budget} onChange={(val) => setForm(prev => ({ ...prev, budget: val }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          <FaCalendarAlt className="inline mr-1 text-purple-500" />
                          Timeline
                        </label>
                        <TimelineSelector value={form.timeline} onChange={(val) => setForm(prev => ({ ...prev, timeline: val }))} />
                      </div>
                    </div>

                    {/* Demo Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <FaVideo className="inline mr-1 text-blue-500" />
                        Quick Demo
                      </label>
                      <DemoOptions onSelect={setQuickReply} />
                    </div>

                    {/* Requirements */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <FaLightbulb className="inline mr-1 text-yellow-500" />
                        Requirements
                      </label>
                      <RequirementChecklist 
                        selected={selectedRequirements}
                        onToggle={toggleRequirement}
                      />
                      {selectedRequirements.length > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">{selectedRequirements.length} selected</p>
                      )}
                    </div>

                    {/* Advanced Options Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-xs text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                    >
                      {showAdvanced ? 'Hide' : 'Show'} Advanced
                      <FaArrowRight className={`text-xs transition ${showAdvanced ? 'rotate-90' : ''}`} />
                    </button>

                    {showAdvanced && (
                      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Industry</label>
                            <select
                              name="industry"
                              value={form.industry}
                              onChange={handleChange}
                              className="w-full px-2.5 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Team Size</label>
                            <select
                              name="teamSize"
                              value={form.teamSize}
                              onChange={handleChange}
                              className="w-full px-2.5 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                          <label className="block text-xs font-medium text-gray-700 mb-0.5">How did you hear about us?</label>
                          <select
                            name="hearAbout"
                            value={form.hearAbout}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                      </div>
                    )}

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-2.5 text-gray-400 text-sm">
                          <FaComment />
                        </div>
                        <textarea
                          name="message"
                          placeholder="Tell us about your project..."
                          value={form.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onFocus={() => handleFocus('message')}
                          className={`w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition resize-y min-h-[80px] ${
                            errors.message ? 'border-red-500 ring-2 ring-red-500' : 
                            focusedField === 'message' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between mt-0.5">
                        {errors.message && (
                          <p className="text-red-500 text-xs">{errors.message}</p>
                        )}
                        <p className={`text-xs ${characterCount > 4500 ? 'text-orange-500' : 'text-gray-400'}`}>
                          {characterCount}/5000
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      {submitting ? (
                        <><FaSpinner className="animate-spin" /> Sending...</>
                      ) : (
                        <><FaPaperPlane /> Send Message</>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      <FaShieldAlt className="inline mr-1" />
                      Your information is secure.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Solutions Tags */}
          <div className="mt-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">Our Solutions</h3>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['HRMS', 'Task Manager', 'Property Management', 'WhatsApp Bot', 'E-Commerce', 'Custom Web Apps', 'Data Analytics', 'Cloud Solutions', 'Mobile Apps', 'AI Integration'].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-0.5 rounded-full text-xs border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                    <FaCheckCircle className="text-green-500 text-xs" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500 text-sm" /> 50+ Happy Clients</span>
            <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500 text-sm" /> 8+ Years Experience</span>
            <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500 text-sm" /> 24/7 Support</span>
            <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500 text-sm" /> 100% Satisfaction</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
      `}} />
    </>
  );
};

export default Contact;