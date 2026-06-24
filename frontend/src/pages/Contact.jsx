// frontend/src/pages/Contact.jsx (or wherever your Contact component is)
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { api } from '../utils/api';
import { 
  sanitizeInput, 
  isValidEmail, 
  isValidPhone, 
  isValidName, 
  isValidMessage 
} from '../utils/security';

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

  // ✅ FIXED: Don't sanitize during input - preserve spaces
  const validateField = (name, value) => {
    // Only sanitize for validation, but keep original value
    const sanitized = typeof value === 'string' ? sanitizeInput(value) : value;
    
    switch (name) {
      case 'name':
        if (!sanitized || sanitized.trim().length < 2) return 'Name is required';
        if (!isValidName(sanitized)) return 'Name contains invalid characters';
        return null;
      case 'email':
        if (!sanitized) return 'Email is required';
        if (!isValidEmail(sanitized)) return 'Please enter a valid email';
        return null;
      case 'phone':
        if (sanitized && !isValidPhone(sanitized)) return 'Invalid phone number';
        return null;
      case 'message':
        if (!sanitized || sanitized.trim().length < 10) return 'Message must be at least 10 characters';
        if (sanitized.length > 5000) return 'Message is too long (max 5000 characters)';
        return null;
      case 'subject':
        if (sanitized && sanitized.length > 200) return 'Subject is too long (max 200 characters)';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // ✅ FIXED: Store raw value without sanitizing
    setForm(prev => ({
      ...prev,
      [name]: value // ✅ Keep original value with spaces
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = ['name', 'email', 'message'];
    
    fields.forEach(field => {
      const error = validateField(field, form[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    const phoneError = validateField('phone', form.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }
    
    const subjectError = validateField('subject', form.subject);
    if (subjectError) {
      newErrors.subject = subjectError;
    }
    
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
      // ✅ Sanitize only on submission
      const sanitizedData = {
        name: sanitizeInput(form.name),
        email: sanitizeInput(form.email),
        phone: sanitizeInput(form.phone),
        subject: sanitizeInput(form.subject),
        message: sanitizeInput(form.message),
        type: form.type
      };
      
      await api.submitContact(sanitizedData);
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      setSubmitted(true);
      setForm({ 
        name: '', 
        email: '', 
        phone: '', 
        subject: '', 
        message: '', 
        type: 'general' 
      });
      setErrors({});
    } catch (error) {
      console.error('Contact submission error:', error);
      const message = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Contact Us</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get in touch for demos, enquiries, or feedback. We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <a href="mailto:princeb744@gmail.com" className="text-blue-600 hover:underline font-medium">
                      princeb744@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FaPhone />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <a href="tel:+919999999999" className="text-blue-600 hover:underline font-medium">
                      +91 86305 19082
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Location</p>
                    <p className="text-gray-700 font-medium">Agra, Uttar Pradesh, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Request a Demo</h3>
              <p className="text-gray-600 mb-4">
                See our products in action with a personalized walkthrough tailored to your business needs.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm">HRMS</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm">TODO</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm">Estate</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm">WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Send a Message</h2>
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">Message Sent!</h3>
                <p className="text-gray-600 mb-4">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        errors.name ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email *"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        errors.email ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        errors.phone ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="general">General Enquiry</option>
                      <option value="demo_request">Demo Request</option>
                      <option value="feedback">Feedback</option>
                      <option value="support">Technical Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.subject ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message *"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-32 resize-y ${
                      errors.message ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {form.message.length}/5000 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;