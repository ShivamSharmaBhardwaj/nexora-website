import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // FIX: Added /api prefix to the URL
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact`, 
        form
      );
      
      console.log('Contact form submitted:', response.data);
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
    } catch (error) {
      console.error('Contact form error:', error);
      
      // Better error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.data?.errors) {
          // Validation errors
          const errorMessages = error.response.data.errors.map(e => e.msg).join(', ');
          toast.error(`Validation error: ${errorMessages}`);
        } else {
          toast.error(error.response.data?.message || 'Failed to send message. Please try again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Error sending message. Please try again.');
      }
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
                <span className="bg-white px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm">
                  HRMS
                </span>
                <span className="bg-white px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm">
                  TODO
                </span>
                <span className="bg-white px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm">
                  Estate
                </span>
                <span className="bg-white px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm">
                  WhatsApp
                </span>
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
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email *"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <select
                    value={form.type}
                    onChange={e => setForm({...form, type: e.target.value})}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="general">General Enquiry</option>
                    <option value="demo_request">Demo Request</option>
                    <option value="feedback">Feedback</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <textarea
                  placeholder="Your Message *"
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-32 resize-y"
                  required
                ></textarea>
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