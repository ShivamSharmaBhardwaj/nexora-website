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
  FaRegSmile
} from 'react-icons/fa';
import { api } from '../utils/api';
import { 
  sanitizeInput, 
  isValidEmail, 
  isValidPhone, 
  isValidName
} from '../utils/security';

// Contact Info Card Component
const ContactInfoCard = ({ icon: Icon, title, content, link, isLink = false }) => (
  <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-300 flex-shrink-0">
        <Icon />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        {isLink ? (
          <a href={link} className="text-gray-900 font-semibold hover:text-blue-600 transition-colors">
            {content}
          </a>
        ) : (
          <p className="text-gray-900 font-semibold">{content}</p>
        )}
      </div>
    </div>
  </div>
);

// Service Tag Component
const ServiceTag = ({ label }) => (
  <span className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-full text-sm border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-default">
    <FaCheckCircle className="text-green-500 text-xs" />
    {label}
  </span>
);

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const formRef = useRef(null);

  // Character count effect
  useEffect(() => {
    setCharacterCount(form.message.length);
  }, [form.message]);

  // Auto-scroll to form on error
  useEffect(() => {
    if (Object.keys(errors).length > 0 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [errors]);

  // Validation functions
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
        type: form.type
      };
      
      await api.submitContact(sanitizedData);
      toast.success('🎉 Message sent successfully! We\'ll get back to you within 24 hours.');
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '', type: 'general' });
      setErrors({});
    } catch (error) {
      console.error('Contact submission error:', error);
      const message = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const quickReplies = [
    { label: 'HRMS Demo', value: 'I would like to see a demo of the HRMS system.' },
    { label: 'TODO Demo', value: 'I am interested in the TODO management system.' },
    { label: 'Estate Demo', value: 'Can you show me the property management solution?' },
    { label: 'WhatsApp Bot', value: 'I want to know more about the WhatsApp automation bot.' },
    { label: 'Custom Solution', value: 'I need a custom web solution for my business.' },
  ];

  const setQuickReply = (message) => {
    setForm(prev => ({ ...prev, message }));
    setErrors(prev => ({ ...prev, message: null }));
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <title>Contact Krynova Technologies | Free Consultation & Demo Request</title>
      <meta name="description" content="Contact Krynova Technologies - India's leading web development company. Get free consultation, request a demo, or ask about our custom web solutions. We respond within 24 hours." />
      <meta name="keywords" content="contact Krynova, web development consultation, free consultation, HRMS demo, web development company Agra, request demo, contact web developer India" />
      <meta property="og:title" content="Contact Krynova Technologies | Free Consultation & Demo Request" />
      <meta property="og:description" content="Get in touch with Krynova Technologies for custom web solutions, free consultation, and product demos." />
      
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-blue-800/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-blue-700/50 mb-6">
                <FaHeadset className="text-yellow-400" />
                <span>We'd love to hear from you!</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Let's Build Something
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"> Amazing Together</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Whether you need a custom solution, a product demo, or just want to say hello — we're here for you.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {/* Left Sidebar - Contact Info & Quick Links */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info Cards */}
              <div className="space-y-4">
                <ContactInfoCard 
                  icon={FaEnvelope}
                  title="Email"
                  content="princeb744@gmail.com"
                  link="mailto:princeb744@gmail.com"
                  isLink={true}
                />
                <ContactInfoCard 
                  icon={FaPhone}
                  title="Phone"
                  content="+91 86305 19082"
                  link="tel:+918630519082"
                  isLink={true}
                />
                <ContactInfoCard 
                  icon={FaMapMarkerAlt}
                  title="Location"
                  content="Agra, Uttar Pradesh, India"
                />
                <ContactInfoCard 
                  icon={FaClock}
                  title="Working Hours"
                  content="Mon-Fri: 9:00 AM - 6:00 PM IST"
                />
              </div>

              {/* Quick Response Stats */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-up">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">24</div>
                    <p className="text-xs text-gray-500">Hour Response</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <p className="text-xs text-gray-500">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">50+</div>
                    <p className="text-xs text-gray-500">Happy Clients</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">24/7</div>
                    <p className="text-xs text-gray-500">Support</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-up">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Connect With Us</h4>
                <div className="flex gap-3 flex-wrap">
                  <a href="#" className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                    <FaLinkedinIn />
                  </a>
                  <a href="#" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-800 hover:text-white transition-all duration-300">
                    <FaGithub />
                  </a>
                  <a href="#" className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                    <FaTwitter />
                  </a>
                  <a href="#" className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300">
                    <FaWhatsapp />
                  </a>
                  <a href="#" className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300">
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div 
              ref={formRef}
              className="lg:col-span-3 animate-slide-right"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                {submitted ? (
                  <div className="text-center py-12 animate-scale-in">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-6 shadow-lg shadow-green-500/30">
                      <FaCheckCircle />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">🎉 Thank You!</h3>
                    <p className="text-gray-600 text-lg max-w-md mx-auto">
                      Your message has been sent successfully. We'll get back to you within 24 hours.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Check your email for a confirmation message.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                    >
                      Send another message <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                        <FaPaperPlane className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Send a Message</h2>
                        <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    {/* Quick Reply Options */}
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setQuickReply(reply.value)}
                          className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5 rounded-full transition-colors border border-gray-200"
                        >
                          {reply.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                              errors.name ? 'border-red-500 ring-2 ring-red-500' : 
                              focusedField === 'name' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1 animate-slide-down">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                              errors.email ? 'border-red-500 ring-2 ring-red-500' : 
                              focusedField === 'email' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1 animate-slide-down">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaPhone />
                          </div>
                          <input
                            type="text"
                            name="phone"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={() => handleFocus('phone')}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                              errors.phone ? 'border-red-500 ring-2 ring-red-500' : 
                              focusedField === 'phone' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1 animate-slide-down">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Inquiry Type
                        </label>
                        <select
                          name="type"
                          value={form.type}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition bg-white"
                        >
                          <option value="general">General Enquiry</option>
                          <option value="demo_request">📱 Demo Request</option>
                          <option value="feedback">💬 Feedback</option>
                          <option value="support">🛠️ Technical Support</option>
                          <option value="career">💼 Career Opportunity</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="Brief subject line"
                        value={form.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={() => handleFocus('subject')}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                          errors.subject ? 'border-red-500 ring-2 ring-red-500' : 
                          focusedField === 'subject' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300'
                        }`}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1 animate-slide-down">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <FaComment />
                        </div>
                        <textarea
                          name="message"
                          placeholder="Tell us about your project, requirements, or any questions..."
                          value={form.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onFocus={() => handleFocus('message')}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition resize-y min-h-[120px] ${
                            errors.message ? 'border-red-500 ring-2 ring-red-500' : 
                            focusedField === 'message' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        {errors.message && (
                          <p className="text-red-500 text-sm animate-slide-down">{errors.message}</p>
                        )}
                        <p className={`text-xs ${characterCount > 4500 ? 'text-orange-500' : 'text-gray-400'}`}>
                          {characterCount}/5000 characters
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane /> Send Message
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4">
                      <FaShieldAlt className="inline mr-1" />
                      Your information is secure. We'll never share your data with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Services/Products Section */}
          <div className="mt-16 max-w-5xl mx-auto animate-slide-up">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Our Solutions</h3>
              <div className="flex flex-wrap justify-center gap-3">
                <ServiceTag label="HRMS System" />
                <ServiceTag label="Task Management" />
                <ServiceTag label="Property Management" />
                <ServiceTag label="WhatsApp Bot" />
                <ServiceTag label="E-Commerce" />
                <ServiceTag label="Custom Web Apps" />
                <ServiceTag label="Data Analytics" />
                <ServiceTag label="Cloud Solutions" />
                <ServiceTag label="Mobile Apps" />
                <ServiceTag label="AI Integration" />
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 animate-fade-in">
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> 50+ Happy Clients
            </span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> 8+ Years Experience
            </span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> 24/7 Support
            </span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> 100% Satisfaction
            </span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-slide-up { animation: slideUp 0.6s ease-out; }
        .animate-slide-down { animation: slideDown 0.3s ease-out; }
        .animate-slide-right { animation: slideRight 0.6s ease-out; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out; }
      `}} />
    </>
  );
};

export default Contact;