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
  FaComments, FaSearchLocation, FaMapPin, FaCity, FaFlag
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
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO COMBINED */}
      {/* ========================================== */}
      <Helmet>
        {/* ===== SEO TAGS ===== */}
        <title>Contact Krynova Technologies | Free Consultation & Demo Request in Agra, India | Global Reach</title>
        <meta name="description" content="Contact Krynova Technologies - India's leading web development company in Agra. Get free consultation, request a demo for HRMS, Property Management, or custom web solutions. Serving businesses in all Indian cities and globally. We respond within 24 hours." />
        <meta name="keywords" content="contact web development company Agra, free consultation, HRMS demo, property management demo, web development quote, Krynova Technologies contact, software development inquiry, enterprise solutions India, global software company, contact for web development" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* ✅ Canonical Tag */}
        <link rel="canonical" href={`${siteUrl}/contact`} />
        
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
        <meta name="question" content="How can I contact Krynova Technologies for a free consultation?" />
        <meta name="answer" content="You can contact Krynova Technologies via email at princeb744@gmail.com, phone at +91 86305 19082, WhatsApp, or through our contact form. We offer free consultation and respond within 24 hours." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="contact web development company, free consultation, software development quote, Krynova contact, HRMS demo request, property management inquiry" />
        
        {/* ===== AEO - Rich Snippets ===== */}
        <meta name="rich-snippet" content="contact" />
        <meta name="structured-data" content="true" />
        
        {/* ===== Open Graph ===== */}
        <meta property="og:title" content="Contact Krynova Technologies | Free Consultation & Demo Request | Global Reach" />
        <meta property="og:description" content="Get in touch with India's leading web development company. Free consultation available for HRMS, Property Management, and custom web solutions. Serving clients in all Indian cities and globally." />
        <meta property="og:url" content={`${siteUrl}/contact`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:rich_attachment" content="true" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Krynova Technologies | Free Consultation & Demo Request" />
        <meta name="twitter:description" content="Get in touch with India's leading web development company. Free consultation available." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Contact Krynova Technologies</h2>
        <p>Krynova Technologies is a leading web development company based in Agra, India. We offer free consultation for HRMS software, property management systems, WhatsApp automation, and custom web solutions.</p>
        <p>Contact us via email at princeb744@gmail.com, phone at +91 86305 19082, or through our contact form. We respond within 24 hours.</p>
        <p>Serving clients in Agra, Delhi, Mumbai, Bangalore, and all major cities in India, as well as international clients in USA, UK, Canada, Australia, UAE, and worldwide.</p>
        <ul>
          <li>Email: princeb744@gmail.com</li>
          <li>Phone: +91 86305 19082</li>
          <li>WhatsApp: +91 86305 19082</li>
          <li>Location: Agra, Uttar Pradesh, India</li>
        </ul>
        <p>We offer free consultation, quick demos, and 24/7 support for all our services.</p>
      </div>

      {/* ========================================== */}
      {/* ✅ SCHEMA.ORG - SEO + AEO + GEO */}
      {/* ========================================== */}
      
      {/* 📞 Contact Page Schema */}
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
          "inLanguage": ["en", "hi", "bn", "te", "ta", "ur", "gu", "mr", "kn", "ml", "pa"],
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          }
        })}
      </script>

      {/* 🏢 Organization Schema - Global Reach */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Krynova Technologies",
          "description": "Best web development company in Agra, India. We provide custom web solutions, HRMS software, property management systems, and enterprise applications globally.",
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
          "slogan": "Global Enterprise Solutions from India",
          "foundingDate": "2024-03-01",
          "founder": {
            "@type": "Person",
            "name": "Shivam Sharma"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+918630519082",
            "contactType": "sales",
            "email": "princeb744@gmail.com",
            "availableLanguage": ["English", "Hindi"],
            "hoursAvailable": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            }
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
              "name": "How can I contact Krynova Technologies?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can contact Krynova Technologies via email at princeb744@gmail.com, phone at +91 86305 19082, WhatsApp, or through our contact form. We respond within 24 hours."
              }
            },
            {
              "@type": "Question",
              "name": "Where is Krynova Technologies located?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies is based in Agra, Uttar Pradesh, India. We serve clients across all major cities in India including Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and many more, as well as international clients in USA, UK, Canada, Australia, UAE, and worldwide."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer free consultation?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! We offer free consultation for all our services including web development, HRMS software, property management systems, WhatsApp automation, and custom solutions. Contact us to discuss your project requirements."
              }
            },
            {
              "@type": "Question",
              "name": "How quickly do you respond to inquiries?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We respond to all inquiries within 24 hours. For urgent requests, you can reach us via phone at +91 86305 19082 or WhatsApp for immediate assistance."
              }
            },
            {
              "@type": "Question",
              "name": "What services can I get a demo for?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can request demos for our HRMS software, property management system, task management system, WhatsApp automation bot, and custom web applications. We provide personalized demos tailored to your business needs."
              }
            },
            {
              "@type": "Question",
              "name": "Do you serve international clients?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Krynova Technologies serves clients globally including USA, UK, Canada, Australia, UAE, Singapore, Germany, France, Japan, South Korea, and many other countries. We provide remote development and support services worldwide."
              }
            }
          ]
        })}
      </script>

      {/* 🗺️ Place Schema - GEO Targeting */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Place",
          "name": "Krynova Technologies",
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
          "areaServed": indianCities.map(city => ({
            "@type": "City",
            "name": city
          })),
          "globalLocationNumber": "IN-UP-AGRA"
        })}
      </script>

      {/* ========================================== */}
      {/* ✅ MAIN CONTENT */}
      {/* ========================================== */}
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
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
                  <FaMapPin className="text-yellow-400" /> {indianCities.length}+ Indian Cities
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
                  <FaGlobe className="text-yellow-400" /> {globalCountries.length}+ Countries
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
                  <FaMicrophone className="text-yellow-400" /> Voice Search Ready
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
                  <FaComments className="text-yellow-400" /> 24/7 Support
                </span>
              </div>
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

              {/* Location Info - GEO */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <FaMapPin className="text-blue-500" /> Serving Locations
                </h4>
                <div className="flex flex-wrap gap-1">
                  {indianCities.slice(0, 8).map((city, idx) => (
                    <span key={idx} className="text-xs bg-white/80 px-2 py-0.5 rounded-full border border-blue-200">
                      {city}
                    </span>
                  ))}
                  <span className="text-xs text-blue-600 font-medium">+{indianCities.length - 8} more cities</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {globalCountries.slice(0, 6).map((country, idx) => (
                    <span key={idx} className="text-xs bg-white/80 px-2 py-0.5 rounded-full border border-green-200">
                      {country}
                    </span>
                  ))}
                  <span className="text-xs text-green-600 font-medium">+{globalCountries.length - 6} more countries</span>
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
                      Your information is secure. We respond within 24 hours.
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