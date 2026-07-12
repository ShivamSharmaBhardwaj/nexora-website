// frontend/src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FaCheckCircle,
  FaCode,
  FaUsers,
  FaBuilding,
  FaMobileAlt,
  FaServer,
  FaCog,
  FaProjectDiagram,
  FaTools,
  FaComments,
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
  FaMapPin,
  FaMicrophone,
  FaStar,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaTextHeight,
  FaPalette,
  FaBorderAll,
  FaLayerGroup,
  FaCubes,
  FaGem,
  FaHeadset,
  FaRegSmile
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// ============================================
// FOOTER COMPONENT - Enhanced with Morphism
// ============================================

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? saved === 'true' : false;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  // Services data
  const services = [
    { path: '/services/web-development-agra', label: 'Web Development', icon: FaCode, gradient: 'from-blue-500 to-cyan-500' },
    { path: '/services/hrms-software', label: 'HRMS Software', icon: FaUsers, gradient: 'from-green-500 to-emerald-500' },
    { path: '/services/property-management', label: 'Property Management', icon: FaBuilding, gradient: 'from-purple-500 to-pink-500' },
    { path: '/services/whatsapp-automation', label: 'WhatsApp Automation', icon: FaMobileAlt, gradient: 'from-orange-500 to-red-500' },
    { path: '/services/enterprise-software', label: 'Enterprise Software', icon: FaServer, gradient: 'from-indigo-500 to-purple-500' },
  ];

  // Products data
  const products = [
    { path: '/products/category/HRMS', label: 'HRMS System', icon: FaUsers, gradient: 'from-blue-500 to-cyan-500' },
    { path: '/products/category/TODO', label: 'TODO System', icon: FaCheckCircle, gradient: 'from-green-500 to-emerald-500' },
    { path: '/products/category/Estate', label: 'Estate Management', icon: FaBuilding, gradient: 'from-purple-500 to-pink-500' },
    { path: '/products/category/WhatsApp', label: 'WhatsApp Bot', icon: FaMobileAlt, gradient: 'from-orange-500 to-red-500' },
    { path: '/products', label: 'View All Products', icon: FaProjectDiagram, gradient: 'from-indigo-500 to-purple-500' },
  ];

  // Tools data (top 6)
  const tools = [
    { path: '/tools/resume-builder', label: 'Resume Builder', icon: FaFileAlt, gradient: 'from-blue-500 to-cyan-500' },
    { path: '/tools/cover-letter', label: 'Cover Letter', icon: FaPenFancy, gradient: 'from-purple-500 to-pink-500' },
    { path: '/tools/qr-generator', label: 'QR Generator', icon: FaQrcode, gradient: 'from-green-500 to-emerald-500' },
    { path: '/tools/pdf-to-image', label: 'PDF to Image', icon: FaFilePdf, gradient: 'from-orange-500 to-red-500' },
    { path: '/tools/pdf-compressor', label: 'PDF Compressor', icon: FaFileArchive, gradient: 'from-blue-500 to-indigo-500' },
    { path: '/tools/merge-pdf', label: 'Merge PDF', icon: FaExchangeAlt, gradient: 'from-purple-500 to-pink-500' },
  ];

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/testimonials', label: 'Testimonials' },
    { path: '/contact', label: 'Contact' },
    { path: '/tools', label: 'Free Tools' },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      {/* ========================================== */}
      {/* SCHEMA.ORG - SEO + AEO + GEO */}
      {/* ========================================== */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Krynova Technologies",
          "description": "Leading web development company in Agra, India offering custom web solutions, HRMS software, property management systems, and enterprise applications.",
          "url": "https://krynovatechnology.pythonanywhere.com",
          "logo": "https://krynovatechnology.pythonanywhere.com/logo.png",
          "foundingDate": "2024-03-01",
          "founders": [
            {
              "@type": "Person",
              "name": "Shivam Sharma",
              "jobTitle": "Founder & CEO"
            }
          ],
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+918630519082",
              "contactType": "sales",
              "email": "princeb744@gmail.com",
              "availableLanguage": ["English", "Hindi"]
            }
          ],
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
          "areaServed": [
            "Agra", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad",
            "Pune", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Lucknow",
            "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
            "Patna", "Vadodara", "Ludhiana", "Nashik", "Faridabad", "Meerut",
            "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar",
            "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
            "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota",
            "Chandigarh", "Guwahati", "Solapur", "Hubballi-Dharwad", "Mysore",
            "Tiruchirappalli", "Bareilly", "Aligarh", "Moradabad", "Saharanpur",
            "Dehradun", "Noida", "Gurugram", "Ghaziabad", "Faridabad",
            "Worldwide"
          ],
          "availableLanguage": [
            "English", "Hindi", "Bengali", "Telugu", "Tamil", 
            "Urdu", "Gujarati", "Marathi", "Kannada", "Malayalam", "Punjabi"
          ],
          "sameAs": [
            "https://www.facebook.com/krynovatechnology",
            "https://www.twitter.com/krynovatechnology",
            "https://www.linkedin.com/company/krynovatechnology",
            "https://www.github.com/krynovatechnology",
            "https://www.instagram.com/krynovatechnology",
            "https://www.youtube.com/krynovatechnology"
          ]
        })}
      </script>

      <footer className={`relative mt-16 overflow-hidden transition-colors duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      }`}>
        {/* ========================================== */}
        {/* ANIMATED BACKGROUND EFFECTS */}
        {/* ========================================== */}
        <div className="absolute inset-0 opacity-30">
          {/* Aurora Background */}
          <motion.div 
            animate={{ 
              x: [0, 100, -100, 0],
              y: [0, -50, 50, 0],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 -left-40 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20"
          />
          <motion.div 
            animate={{ 
              x: [0, -100, 100, 0],
              y: [0, 50, -50, 0],
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-10"
          />
        </div>

        {/* ========================================== */}
        {/* FLOATING PARTICLES */}
        {/* ========================================== */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { icon: FaCube, delay: '0s', duration: '8s', x: '10%', y: '20%', size: 'text-4xl' },
            { icon: FaRocket, delay: '2s', duration: '10s', x: '85%', y: '15%', size: 'text-3xl' },
            { icon: FaShieldAlt, delay: '4s', duration: '9s', x: '5%', y: '80%', size: 'text-4xl' },
            { icon: FaGem, delay: '1s', duration: '7s', x: '90%', y: '70%', size: 'text-3xl' },
            { icon: FaCode, delay: '3s', duration: '11s', x: '15%', y: '90%', size: 'text-4xl' },
            { icon: FaServer, delay: '5s', duration: '8s', x: '80%', y: '30%', size: 'text-3xl' },
          ].map((particle, index) => {
            const Icon = particle.icon;
            return (
              <motion.div
                key={index}
                className={`absolute ${particle.size} text-white/5`}
                style={{
                  left: particle.x,
                  top: particle.y,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 20, -20, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: parseFloat(particle.duration),
                  repeat: Infinity,
                  delay: parseFloat(particle.delay),
                  ease: "easeInOut"
                }}
              >
                <Icon />
              </motion.div>
            );
          })}
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* ========================================== */}
          {/* MAIN GRID - Glassmorphism Cards */}
          {/* ========================================== */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8"
          >
            {/* Brand Column */}
            <motion.div variants={fadeInUp} className="lg:col-span-1">
              <div className="glass-footer-card p-6 rounded-2xl border border-white/10">
                <Link to="/" className="flex items-center gap-3 mb-4 group" aria-label="Krynova Technologies Home">
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 glass-logo-icon rounded-xl flex items-center justify-center text-white text-2xl shadow-2xl shadow-blue-500/30"
                  >
                    <FaCube />
                  </motion.div>
                  <div>
                    <span className="text-xl font-bold gradient-text">
                      Krynova
                    </span>
                    <span className="block text-[10px] font-medium text-gray-400 tracking-wider uppercase">
                      Technologies
                    </span>
                  </div>
                </Link>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Custom web solutions for any industry. Founded March 2024. 
                  We deliver enterprise-grade solutions with cutting-edge technology.
                </p>
                
                {/* Trust Badges - Glassmorphism */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: FaCheckCircle, label: 'Secure & Trusted', color: 'text-green-400', border: 'border-green-500/20' },
                    { icon: FaRocket, label: '50+ Systems', color: 'text-blue-400', border: 'border-blue-500/20' },
                    { icon: FaHeart, label: '8+ Years', color: 'text-yellow-400', border: 'border-yellow-500/20' },
                    { icon: FaStar, label: '4.8/5 Rating', color: 'text-purple-400', border: 'border-purple-500/20' }
                  ].map((badge, idx) => (
                    <motion.span 
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className={`glass-tag inline-flex items-center gap-1.5 ${badge.color} px-3 py-1.5 rounded-full text-xs border ${badge.border}`}
                    >
                      <badge.icon className={badge.color} />
                      {badge.label}
                    </motion.span>
                  ))}
                </div>

                {/* Location */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                      }}
                    >
                      <FaMapMarkerAlt className="text-blue-400" />
                    </motion.div>
                    <span>Agra, Uttar Pradesh, India</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <FaGlobe className="text-blue-400" />
                    <span>Serving 60+ Indian Cities & 30+ Countries</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={fadeInUp}>
              <div className="glass-footer-card p-6 rounded-2xl border border-white/10">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2">
                  <FaRocket className="text-blue-400" />
                  Quick Links
                </h4>
                <ul className="space-y-2.5">
                  {quickLinks.map((link) => (
                    <motion.li 
                      key={link.path}
                      whileHover={{ x: 5 }}
                    >
                      <Link 
                        to={link.path} 
                        className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                        {link.label}
                        <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div variants={fadeInUp}>
              <div className="glass-footer-card p-6 rounded-2xl border border-white/10">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2">
                  <FaCog className="text-blue-400" /> Services
                </h4>
                <ul className="space-y-2.5">
                  {services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <motion.li 
                        key={service.path}
                        whileHover={{ x: 5 }}
                      >
                        <Link 
                          to={service.path} 
                          className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                        >
                          <div className={`w-5 h-5 rounded-lg bg-gradient-to-r ${service.gradient} flex items-center justify-center text-white text-[10px] flex-shrink-0`}>
                            <Icon />
                          </div>
                          {service.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>

            {/* Products */}
            <motion.div variants={fadeInUp}>
              <div className="glass-footer-card p-6 rounded-2xl border border-white/10">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2">
                  <FaProjectDiagram className="text-blue-400" /> Products
                </h4>
                <ul className="space-y-2.5">
                  {products.map((product) => {
                    const Icon = product.icon;
                    return (
                      <motion.li 
                        key={product.path}
                        whileHover={{ x: 5 }}
                      >
                        <Link 
                          to={product.path} 
                          className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                        >
                          <div className={`w-5 h-5 rounded-lg bg-gradient-to-r ${product.gradient} flex items-center justify-center text-white text-[10px] flex-shrink-0`}>
                            <Icon />
                          </div>
                          {product.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>

            {/* Free Tools */}
            <motion.div variants={fadeInUp}>
              <div className="glass-footer-card p-6 rounded-2xl border border-white/10">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2">
                  <FaTools className="text-blue-400" /> Free Tools
                </h4>
                <ul className="space-y-2.5">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <motion.li 
                        key={tool.path}
                        whileHover={{ x: 5 }}
                      >
                        <Link 
                          to={tool.path} 
                          className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                        >
                          <div className={`w-5 h-5 rounded-lg bg-gradient-to-r ${tool.gradient} flex items-center justify-center text-white text-[10px] flex-shrink-0`}>
                            <Icon />
                          </div>
                          {tool.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                  <motion.li whileHover={{ x: 5 }}>
                    <Link 
                      to="/tools" 
                      className="text-blue-400 hover:text-white transition-all duration-300 flex items-center gap-2 group text-sm font-medium"
                    >
                      <FaArrowRight className="text-xs" />
                      View All 12 Tools
                    </Link>
                  </motion.li>
                </ul>
              </div>
            </motion.div>

            {/* Contact & Social */}
            <motion.div variants={fadeInUp}>
              <div className="glass-footer-card p-6 rounded-2xl border border-white/10">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                  <FaHeadset className="inline mr-2 text-blue-400" /> Contact Us
                </h4>
                <ul className="space-y-3">
                  <motion.li whileHover={{ x: 5 }}>
                    <a 
                      href="mailto:princeb744@gmail.com" 
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group"
                    >
                      <div className="neo-icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-blue-400 text-sm">
                        <FaEnvelope />
                      </div>
                      <span>princeb744@gmail.com</span>
                    </a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <a 
                      href="tel:+918630519082" 
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group"
                    >
                      <div className="neo-icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-green-400 text-sm">
                        <FaPhone />
                      </div>
                      <span>+91 86305 19082</span>
                    </a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <a 
                      href="https://wa.me/918630519082" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group"
                    >
                      <div className="neo-icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-green-400 text-sm">
                        <FaWhatsapp />
                      </div>
                      <span>WhatsApp</span>
                    </a>
                  </motion.li>
                </ul>

                {/* Social Links - Glassmorphism */}
                <div className="mt-4">
                  <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                    Follow Us
                  </h5>
                  <div className="flex gap-2.5 flex-wrap">
                    {[
                      { icon: FaFacebook, color: 'hover:bg-blue-600', label: 'Facebook' },
                      { icon: FaXTwitter, color: 'hover:bg-black', label: 'Twitter' },
                      { icon: FaLinkedin, color: 'hover:bg-blue-700', label: 'LinkedIn' },
                      { icon: FaGithub, color: 'hover:bg-gray-700', label: 'GitHub' },
                      { icon: FaInstagram, color: 'hover:bg-pink-600', label: 'Instagram' },
                      { icon: FaYoutube, color: 'hover:bg-red-600', label: 'YouTube' }
                    ].map((social, idx) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={idx}
                          whileHover={{ scale: 1.15, rotate: 360 }}
                          whileTap={{ scale: 0.9 }}
                          href="#"
                          className={`w-10 h-10 glass-social-btn rounded-lg flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color}`}
                          aria-label={social.label}
                        >
                          <Icon />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                {/* Subscribe Newsletter - Glassmorphism */}
                <div className="mt-4">
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Subscribe to newsletter"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass-input flex-1 px-3 py-2 rounded-lg text-sm"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="glass-subscribe-btn px-4 py-2 rounded-lg text-sm font-medium text-white shadow-lg transition-all duration-300"
                    >
                      {subscribed ? <FaCheckCircle /> : 'Subscribe'}
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ========================================== */}
          {/* DIVIDER - Glassmorphism */}
          {/* ========================================== */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-white/10 mt-10 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <FaRegCopyright className="inline" />
                  {currentYear} Krynova Technologies. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1 flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  <span>Enterprise Software Solutions</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>Agra, India</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <FaGlobe className="text-blue-400" />
                  <span>Serving 60+ Cities, 30+ Countries</span>
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

            {/* Security Badge - Glassmorphism */}
            <div className="flex justify-center mt-4">
              <div className="glass-security-badge inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 flex-wrap justify-center">
                <FaShieldAlt className="text-green-400 text-sm" />
                <span className="text-xs text-gray-400">256-bit SSL Encrypted</span>
                <span className="w-px h-4 bg-white/10 hidden sm:block"></span>
                <FaClock className="text-blue-400 text-sm" />
                <span className="text-xs text-gray-400">24/7 Support</span>
                <span className="w-px h-4 bg-white/10 hidden sm:block"></span>
                <FaMicrophone className="text-purple-400 text-sm" />
                <span className="text-xs text-gray-400">Voice Search Ready</span>
                <span className="w-px h-4 bg-white/10 hidden sm:block"></span>
                <FaGem className="text-yellow-400 text-sm" />
                <span className="text-xs text-gray-400">12 Free Tools</span>
              </div>
            </div>

            {/* Geo Location Badge - Glassmorphism */}
            <div className="flex justify-center mt-3">
              <div className="glass-geo-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                  }}
                >
                  <FaMapPin className="text-blue-400 text-xs" />
                </motion.div>
                <span className="text-xs text-gray-400">Based in Agra, Uttar Pradesh, India • Serving Worldwide</span>
              </div>
            </div>

            {/* Made with Love */}
            <div className="flex justify-center mt-4">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-1 text-xs text-gray-500"
              >
                Made with 
                <motion.span
                  animate={{ 
                    scale: [1, 1.3, 1],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                  }}
                >
                  <FaHeart className="text-red-500 text-xs" />
                </motion.span>
                in India • 
                <FaGlobe className="text-blue-400 text-xs ml-1" />
                <span className="ml-1">Global Reach</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ========================================== */}
        {/* CSS - Glassmorphism + Neumorphism */}
        {/* ========================================== */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* ========================================== */
          /* GLASSMORPHISM - Footer Cards */
          /* ========================================== */
          .glass-footer-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px) saturate(1.2);
            -webkit-backdrop-filter: blur(12px) saturate(1.2);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.4s ease;
            height: 100%;
          }
          
          .glass-footer-card:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(59, 130, 246, 0.15);
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          }
          
          .glass-logo-icon {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3));
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 24px rgba(59, 130, 246, 0.2);
          }
          
          .glass-tag {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
          }
          
          .glass-tag:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(59, 130, 246, 0.2);
          }
          
          .glass-social-btn {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
          }
          
          .glass-social-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.1);
            color: white !important;
            transform: translateY(-2px);
          }
          
          .glass-input {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            color: #d1d5db;
            transition: all 0.3s ease;
          }
          
          .glass-input:focus {
            outline: none;
            border-color: rgba(59, 130, 246, 0.3);
            background: rgba(255, 255, 255, 0.06);
          }
          
          .glass-input::placeholder {
            color: #6b7280;
          }
          
          .glass-subscribe-btn {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3));
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(59, 130, 246, 0.2);
            transition: all 0.3s ease;
          }
          
          .glass-subscribe-btn:hover {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(99, 102, 241, 0.4));
            border-color: rgba(59, 130, 246, 0.3);
          }
          
          .glass-security-badge {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          
          .glass-geo-badge {
            background: rgba(59, 130, 246, 0.05);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(59, 130, 246, 0.1);
            transition: all 0.3s ease;
          }
          
          .glass-geo-badge:hover {
            background: rgba(59, 130, 246, 0.08);
            border-color: rgba(59, 130, 246, 0.15);
          }

          /* ========================================== */
          /* NEUMORPHISM */
          /* ========================================== */
          .neo-icon-btn {
            background: rgba(255, 255, 255, 0.03);
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.02);
            transition: all 0.3s ease;
          }
          
          .neo-icon-btn:hover {
            background: rgba(255, 255, 255, 0.06);
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), -1px -1px 2px rgba(255, 255, 255, 0.02);
            transform: scale(0.95);
          }

          /* ========================================== */
          /* GRADIENT TEXT */
          /* ========================================== */
          .gradient-text {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          /* ========================================== */
          /* GRID PATTERN */
          /* ========================================== */
          .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 30px 30px;
          }

          /* ========================================== */
          /* SCROLLBAR */
          /* ========================================== */
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.3);
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.5);
          }
        `}} />
      </footer>
    </>
  );
};

export default Footer;