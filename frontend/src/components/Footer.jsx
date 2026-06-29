import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaCube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
  FaShieldAlt,
  FaRocket,
  FaHeart,
  FaRegCopyright,
  FaGlobe,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 -left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <FaCube />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Krynova
                </span>
                <span className="block text-[10px] font-medium text-gray-400 tracking-wider uppercase">
                  Technologies
                </span>
              </div>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Custom web solutions for any industry. Founded March 2026. 
              We deliver enterprise-grade solutions with cutting-edge technology.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-xs border border-green-500/20">
                <FaCheckCircle className="text-green-400" />
                Secure & Trusted
              </span>
              <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full text-xs border border-blue-500/20">
                <FaRocket className="text-blue-400" />
                50+ Systems
              </span>
              <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-full text-xs border border-yellow-500/20">
                <FaHeart className="text-yellow-400" />
                8+ Years
              </span>
            </div>

            {/* Location */}
            <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm">
              <FaMapMarkerAlt className="text-blue-400" />
              <span>Agra, Uttar Pradesh, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { path: '/', label: 'Home' },
                { path: '/products', label: 'Products' },
                { path: '/testimonials', label: 'Testimonials' },
                { path: '/tools', label: 'Free Tools' },
                { path: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                    {link.label}
                    <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Our Products
            </h4>
            <ul className="space-y-2.5">
              {[
                { path: '/products/category/HRMS', label: 'HRMS System' },
                { path: '/products/category/TODO', label: 'TODO System' },
                { path: '/products/category/Estate', label: 'Estate Management' },
                { path: '/products/category/WhatsApp', label: 'WhatsApp Bot' },
                { path: '/products', label: 'View All Products' },
              ].map((product) => (
                <li key={product.path}>
                  <Link 
                    to={product.path} 
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                    {product.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:princeb744@gmail.com" 
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300">
                    <FaEnvelope className="text-blue-400 text-sm" />
                  </div>
                  <span>princeb744@gmail.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+918630519082" 
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-all duration-300">
                    <FaPhone className="text-green-400 text-sm" />
                  </div>
                  <span>+91 86305 19082</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/918630519082" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-all duration-300">
                    <FaWhatsapp className="text-green-400 text-sm" />
                  </div>
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Stay Updated
            </h4>
            
            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm font-medium whitespace-nowrap"
                >
                  {subscribed ? '✅' : 'Subscribe'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Get updates on new products & features
              </p>
            </form>

            {/* Social Links */}
            <div>
              <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Follow Us
              </h5>
              <div className="flex gap-2.5">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaXTwitter />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                <FaRegCopyright className="inline mr-1" />
                {currentYear} Krynova Technologies. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1 flex items-center justify-center md:justify-start gap-2">
                <span>Enterprise Software Solutions</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>Agra, India</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <FaGlobe className="text-blue-400" />
                <span>Serving Worldwide</span>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/sitemap" className="text-gray-500 hover:text-white transition-colors">
                Sitemap
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/contact" className="text-gray-500 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex justify-center mt-4">
            <div className="inline-flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50">
              <FaShieldAlt className="text-green-400 text-sm" />
              <span className="text-xs text-gray-400">256-bit SSL Encrypted</span>
              <span className="w-px h-4 bg-gray-700"></span>
              <FaClock className="text-blue-400 text-sm" />
              <span className="text-xs text-gray-400">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}} />
    </footer>
  );
};

export default Footer;