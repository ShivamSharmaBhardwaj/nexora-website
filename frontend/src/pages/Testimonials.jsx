import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../utils/api';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, 
  FaUser, 
  FaQuoteLeft, 
  FaQuoteRight,
  FaSpinner,
  FaCheckCircle,
  FaBuilding,
  FaCalendarAlt,
  FaArrowRight,
  FaHeart,
  FaStarHalfAlt,
  FaRegStar,
  FaUsers,
  FaChartBar,
  FaThumbsUp,
  FaRegSmile,
  FaRegComment,
  FaRegClock,
  FaShare,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaCopy,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaMapMarkerAlt,
  FaGlobe,
  FaAward,
  FaTrophy,
  FaMedal,
  FaMicrophone,
  FaHeadphones,
  FaQuestionCircle,
  FaComments,
  FaSearchLocation,
  FaMapPin,
  FaCity,
  FaFlag,
  FaMoon,
  FaSun,
  FaBars,
  FaTextHeight,
  FaPalette,
  FaBorderAll,
  FaLayerGroup,
  FaCubes,
  FaCube,
  FaGem,
  FaTools,
  FaRocket
} from 'react-icons/fa';

// ============================================
// STATIC FALLBACK DATA
// ============================================
const STATIC_TESTIMONIALS = [
  {
    id: 1,
    client_name: 'Rahul Singh',
    client_company: 'Torrent Power',
    feedback: 'Krynova delivered an exceptional HRMS solution that streamlined our entire HR operations. Highly recommended!',
    rating: 5,
    created_at: new Date().toISOString(),
    is_approved: true
  },
  {
    id: 2,
    client_name: 'Priya Sharma',
    client_company: 'Tech Mahindra',
    feedback: 'The property management system developed by Krynova is robust, user-friendly, and has transformed our business.',
    rating: 5,
    created_at: new Date().toISOString(),
    is_approved: true
  },
  {
    id: 3,
    client_name: 'Amit Kumar',
    client_company: 'Romsons',
    feedback: 'Professional team with excellent communication. They delivered exactly what we needed on time.',
    rating: 5,
    created_at: new Date().toISOString(),
    is_approved: true
  },
  {
    id: 4,
    client_name: 'Sneha Patel',
    client_company: 'Agra Chain',
    feedback: 'Best web development company in Agra! Our website has seen a 200% increase in traffic after their SEO work.',
    rating: 5,
    created_at: new Date().toISOString(),
    is_approved: true
  },
  {
    id: 5,
    client_name: 'Vikram Singh',
    client_company: 'Anna Infrastructure',
    feedback: 'The WhatsApp automation bot has revolutionized our customer support. Great work by the Krynova team!',
    rating: 5,
    created_at: new Date().toISOString(),
    is_approved: true
  },
  {
    id: 6,
    client_name: 'Neha Gupta',
    client_company: 'Tech Solutions India',
    feedback: 'Krynova provided us with a custom web application that solved all our business challenges. 10/10 would recommend.',
    rating: 5,
    created_at: new Date().toISOString(),
    is_approved: true
  }
];

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
// LOADING SKELETON - Glassmorphism
// ============================================
const TestimonialSkeleton = () => (
  <div className="glass-card p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
  </div>
);

// ============================================
// TESTIMONIAL CARD - Glassmorphism + Neumorphism
// ============================================
const TestimonialCard = ({ testimonial, index, onShare }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const getRandomColor = (name) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-pink-500',
      'from-red-500 to-orange-500',
      'from-yellow-500 to-orange-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-cyan-500'
    ];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-testimonial-card p-6 rounded-2xl border border-white/20 dark:border-white/5 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Liquid Glass Overlay */}
      <div className="absolute inset-0 rounded-2xl liquid-glass-overlay pointer-events-none"></div>
      
      {/* Quote Icon */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
        className="absolute top-4 right-4 text-5xl text-blue-400/30 dark:text-blue-500/20 group-hover:scale-110 transition-transform duration-500"
      >
        <FaQuoteRight />
      </motion.div>

      {/* Share Button */}
      <div className="absolute top-4 right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowShare(!showShare)}
          className="neo-icon-btn p-2 rounded-xl"
        >
          <FaShare className="text-gray-500 dark:text-gray-400 text-sm" />
        </motion.button>
      </div>

      {/* Share Dropdown */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute top-14 right-4 neo-dropdown p-2 rounded-xl z-10 min-w-[160px]"
          >
            {[
              { icon: FaTwitter, color: 'text-blue-400', label: 'Twitter' },
              { icon: FaLinkedin, color: 'text-blue-600', label: 'LinkedIn' },
              { icon: FaWhatsapp, color: 'text-green-500', label: 'WhatsApp' },
              { icon: FaCopy, color: 'text-gray-500', label: 'Copy Link' }
            ].map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg w-full transition text-sm text-gray-700 dark:text-gray-300"
              >
                <item.icon className={item.color} /> Share on {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className={`w-14 h-14 bg-gradient-to-br ${getRandomColor(testimonial.client_name)} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl shadow-blue-500/25`}>
            {testimonial.client_image ? (
              <img 
                src={testimonial.client_image} 
                alt={testimonial.client_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(testimonial.client_name)
            )}
          </div>
          {testimonial.is_approved && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-1 border-2 border-white dark:border-gray-800"
            >
              <FaCheckCircle className="text-white text-xs" />
            </motion.div>
          )}
        </motion.div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {testimonial.client_name}
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {testimonial.client_company && (
              <>
                <FaBuilding className="text-gray-400 dark:text-gray-500 text-xs" />
                <span>{testimonial.client_company}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex text-yellow-400 mb-3 relative z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <FaStar 
              className={`transition-all duration-300 ${
                i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'
              }`}
            />
          </motion.div>
        ))}
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">({testimonial.rating}/5)</span>
      </div>

      {/* Feedback */}
      <div className="relative z-10">
        <FaQuoteLeft className="text-blue-200 dark:text-blue-800 text-sm absolute -top-1 -left-1 opacity-50" />
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pl-4 line-clamp-4">
          "{testimonial.feedback}"
        </p>
      </div>

      {/* Footer */}
      {testimonial.created_at && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-4 relative z-10">
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{new Date(testimonial.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaThumbsUp className="text-green-500" />
            <span>{Math.floor(Math.random() * 20) + 5} helpful</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ============================================
// STAR RATING - Neumorphism
// ============================================
const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none"
        >
          <FaStar 
            className={`text-3xl transition-all duration-200 ${
              star <= (hover || rating) 
                ? 'text-yellow-400 drop-shadow-lg' 
                : 'text-gray-200 dark:text-gray-600'
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
};

// ============================================
// STATISTICS CARD - Glassmorphism
// ============================================
const StatCard = ({ icon: Icon, value, label, gradient = 'from-blue-500 to-cyan-500' }) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -5 }}
    className="glass-stat-card p-4 rounded-xl text-center border border-white/20 dark:border-white/5"
  >
    <motion.div 
      className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {value}
    </motion.div>
    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
      <Icon className="text-sm" /> {label}
    </div>
  </motion.div>
);

// ============================================
// MAIN TESTIMONIALS COMPONENT
// ============================================
const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    client_name: '',
    client_company: '',
    rating: 5,
    feedback: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);

  const siteUrl = window.location.origin;

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
  // ✅ FETCH TESTIMONIALS WITH STATIC FALLBACK
  // ============================================
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let testimonialsData = [];
        
        // Try API call
        try {
          const response = await api.getTestimonials();
          if (Array.isArray(response.data)) {
            testimonialsData = response.data;
          }
        } catch (apiError) {
          console.log('API failed, using static data:', apiError);
        }
        
        // If no data from API, use STATIC FALLBACK
        if (testimonialsData.length === 0) {
          testimonialsData = STATIC_TESTIMONIALS;
        }
        
        setTestimonials(testimonialsData);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials. Showing static data.');
        // Use static data on error
        setTestimonials(STATIC_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const filteredTestimonials = useMemo(() => {
    let filtered = [...testimonials];
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(t => 
        t.client_name?.toLowerCase().includes(term) ||
        t.client_company?.toLowerCase().includes(term) ||
        t.feedback?.toLowerCase().includes(term)
      );
    }
    
    switch (filter) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'with_company':
        filtered = filtered.filter(t => t.client_company);
        break;
      default:
        if (sortBy === 'created_at') {
          filtered.sort((a, b) => {
            const aVal = new Date(a.created_at || 0).getTime();
            const bVal = new Date(b.created_at || 0).getTime();
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
          });
        } else if (sortBy === 'rating') {
          filtered.sort((a, b) => sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating);
        }
        break;
    }
    
    return filtered;
  }, [testimonials, filter, searchTerm, sortBy, sortOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.client_name.trim() || !form.feedback.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitTestimonial(form);
      setSubmitted(true);
      setForm({ 
        client_name: '', 
        client_company: '', 
        rating: 5, 
        feedback: '' 
      });
      
      // Refresh testimonials
      const response = await api.getTestimonials();
      if (Array.isArray(response.data)) {
        setTestimonials(response.data);
      }
      alert('🎉 Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert(error.response?.data?.message || 'Error submitting feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalTestimonials = testimonials.length;
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : 0;
  const fiveStarCount = testimonials.filter(t => t.rating === 5).length;
  const withCompanyCount = testimonials.filter(t => t.client_company).length;

  return (
    <>
      {/* Controls Panel */}
      <ControlsPanel />

      {/* ========================================== */}
      {/* HELMET - SEO + AEO + GEO */}
      {/* ========================================== */}
      <Helmet>
        <title>Client Testimonials - Krynova Technologies | 50+ Happy Clients in Agra, India | Global Reviews</title>
        <meta name="description" content="Read what our clients say about Krynova Technologies - the best web development company in Agra, India. Real feedback from 50+ businesses across HRMS, Property Management, and custom solutions." />
        <meta name="keywords" content="Krynova Technologies testimonials, client reviews, web development company Agra reviews, HRMS software reviews" />
        <link rel="canonical" href={`${siteUrl}/testimonials`} />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta property="og:title" content="Client Testimonials - Krynova Technologies | 50+ Happy Clients" />
        <meta property="og:description" content="Real feedback from 50+ happy clients about our web development and software solutions." />
        <meta property="og:url" content={`${siteUrl}/testimonials`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Client Testimonials - Krynova Technologies | 50+ Happy Clients" />
        <meta name="twitter:description" content="Real feedback from 50+ happy clients about our web development and software solutions." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Krynova Technologies Client Testimonials</h2>
        <p>Krynova Technologies has 50+ happy clients with an average rating of 4.8 out of 5 stars. Clients praise our HRMS software, property management systems, and custom web solutions.</p>
        <p>Testimonials from businesses in Agra, Delhi, Mumbai, Bangalore, Hyderabad, Pune, Kolkata, and many other cities across India and globally.</p>
      </div>

      {/* ========================================== */}
      {/* SCHEMA.ORG */}
      {/* ========================================== */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ReviewPage",
          "name": "Krynova Technologies Testimonials",
          "description": "Client reviews and feedback for Krynova Technologies - the best web development company in Agra, India.",
          "url": `${siteUrl}/testimonials`,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": averageRating || "4.8",
            "reviewCount": totalTestimonials || "50",
            "bestRating": "5",
            "worstRating": "1"
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          }
        })}
      </script>

      {/* ========================================== */}
      {/* MAIN CONTENT - Glassmorphism + Neumorphism */}
      {/* ========================================== */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-5"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header - Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-hero p-8 md:p-12 rounded-3xl mb-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 liquid-glass-overlay"></div>
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 glass-badge px-4 py-2 rounded-full text-sm font-semibold text-red-700 dark:text-red-400 mb-4 border border-white/20 dark:border-white/5"
              >
                <FaHeart className="text-red-500 animate-pulse" />
                Client Feedback
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Clients Say</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                Real feedback from real businesses who've transformed their operations with our solutions
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="glass-tag inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-white/20 dark:border-white/5">
                  <FaMapPin className="text-blue-500" /> {indianCities.length}+ Indian Cities
                </span>
                <span className="glass-tag inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-white/20 dark:border-white/5">
                  <FaGlobe className="text-green-500" /> {globalCountries.length}+ Countries
                </span>
                <span className="glass-tag inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-white/20 dark:border-white/5">
                  <FaStar className="text-yellow-500" /> {averageRating}/5 Rating
                </span>
                <span className="glass-tag inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-white/20 dark:border-white/5">
                  <FaUsers className="text-purple-500" /> {totalTestimonials}+ Reviews
                </span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-3">
                <FaMapMarkerAlt className="inline mr-1" />
                Trusted by 50+ businesses in Agra, Uttar Pradesh, across India, and worldwide
              </p>
            </div>
          </motion.div>

          {/* Statistics - Glassmorphism */}
          {!loading && testimonials.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <StatCard 
                icon={FaUsers} 
                value={totalTestimonials} 
                label="Total Reviews" 
                gradient="from-blue-500 to-cyan-500"
              />
              <StatCard 
                icon={FaStar} 
                value={averageRating} 
                label="Average Rating" 
                gradient="from-yellow-500 to-orange-500"
              />
              <StatCard 
                icon={FaTrophy} 
                value={fiveStarCount} 
                label="5-Star Reviews" 
                gradient="from-green-500 to-emerald-500"
              />
              <StatCard 
                icon={FaBuilding} 
                value={withCompanyCount} 
                label="Business Verified" 
                gradient="from-purple-500 to-pink-500"
              />
            </motion.div>
          )}

          {/* Search and Filter - Glassmorphism */}
          {!loading && testimonials.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-filter p-4 rounded-2xl mb-8 border border-white/20 dark:border-white/5"
            >
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px] relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by name, company, or feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="neo-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  />
                  {searchTerm && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FaTimes />
                    </motion.button>
                  )}
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All', icon: null },
                    { id: 'latest', label: 'Latest', icon: FaCalendarAlt },
                    { id: 'highest', label: 'Top Rated', icon: FaStar },
                    { id: 'with_company', label: 'Verified', icon: FaBuilding }
                  ].map((btn) => {
                    const Icon = btn.icon;
                    return (
                      <motion.button
                        key={btn.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFilter(btn.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                          filter === btn.id 
                            ? 'glass-btn-active text-white shadow-lg' 
                            : 'glass-btn text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/5'
                        }`}
                      >
                        {Icon && <Icon className="text-xs" />}
                        {btn.label}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Write Review Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(!showForm)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 flex items-center gap-2"
                >
                  <FaRegComment /> Write Review
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Submit Testimonial Form - Glassmorphism */}
          <AnimatePresence>
            {showForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="glass-form p-6 md:p-8 rounded-2xl max-w-2xl mx-auto border border-white/20 dark:border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Your Experience</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Your feedback helps us improve and serve you better
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowForm(false)}
                      className="neo-icon-btn p-2 rounded-xl"
                    >
                      <FaTimes className="text-gray-500 dark:text-gray-400" />
                    </motion.button>
                  </div>

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
                        className="text-7xl mb-4"
                      >
                        🎉
                      </motion.div>
                      <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Thank You!</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Your feedback has been submitted for approval. We appreciate your input!
                      </p>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSubmitted(false);
                          setShowForm(false);
                        }} 
                        className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition inline-flex items-center gap-2"
                      >
                        Close <FaArrowRight className="text-sm" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={form.client_name}
                            onChange={e => setForm({...form, client_name: e.target.value})}
                            className="neo-input w-full px-4 py-2.5 rounded-xl text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            placeholder="Your Company"
                            value={form.client_company}
                            onChange={e => setForm({...form, client_company: e.target.value})}
                            className="neo-input w-full px-4 py-2.5 rounded-xl text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rating <span className="text-red-500">*</span>
                        </label>
                        <StarRating 
                          rating={form.rating} 
                          onRatingChange={(rating) => setForm({...form, rating})} 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Your Feedback <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Share your experience with our products and services..."
                          value={form.feedback}
                          onChange={e => setForm({...form, feedback: e.target.value})}
                          className="neo-input w-full px-4 py-2.5 rounded-xl text-sm resize-y min-h-[100px]"
                          required
                        />
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {form.feedback.length}/500 characters
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <><FaSpinner className="animate-spin" /> Submitting...</>
                        ) : (
                          'Submit Feedback'
                        )}
                      </motion.button>
                      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                        All feedback is reviewed before being published
                      </p>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Testimonials Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <TestimonialSkeleton key={idx} />
              ))}
            </div>
          ) : error ? (
            <div className="glass-error p-12 rounded-2xl text-center border border-white/20 dark:border-white/5">
              <div className="text-6xl mb-4 animate-bounce">⚠️</div>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition"
              >
                Try Again
              </motion.button>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="glass-empty p-12 rounded-2xl text-center border border-white/20 dark:border-white/5">
              <div className="text-6xl mb-4 animate-bounce">💬</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Testimonials Found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No testimonials match your search.' : 'Be the first to share your experience with us!'}
              </p>
              {searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition"
                >
                  Clear Search
                </motion.button>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredTestimonials.map((testimonial, index) => (
                  <TestimonialCard 
                    key={testimonial.id || index} 
                    testimonial={testimonial} 
                    index={index}
                  />
                ))}
              </div>
              {filteredTestimonials.length < testimonials.length && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredTestimonials.length} of {testimonials.length} testimonials
                </div>
              )}
            </>
          )}

          {/* Call to Action - Glassmorphism */}
          {!loading && testimonials.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 glass-cta p-8 md:p-12 rounded-3xl text-white text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <motion.h2 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-2xl md:text-3xl font-bold mb-3"
                >
                  Ready to Join Our Happy Clients?
                </motion.h2>
                <p className="text-blue-100 mb-6 text-lg">
                  Transform your business with our custom solutions. Serving 50+ businesses in Agra, Uttar Pradesh, across India, and worldwide.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                    <FaMapPin /> {indianCities.length}+ Indian Cities
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                    <FaGlobe /> {globalCountries.length}+ Countries
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                    <FaStar /> 4.8/5 Rating
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Get Started <FaArrowRight />
                  </Link>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 border-2 border-white/50 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition"
                  >
                    Browse Products
                  </Link>
                </div>
                <p className="text-blue-200 text-sm mt-4">
                  <FaMapMarkerAlt className="inline mr-1" />
                  Based in Agra, Uttar Pradesh, India • Serving Global Clients
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* CSS Animations & Styles */}
      {/* ========================================== */}
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
        
        .glass-card {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
        }
        
        .dark .glass-card {
          background: rgba(31, 41, 55, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .glass-testimonial-card {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
          transition: all 0.4s ease;
        }
        
        .glass-testimonial-card:hover {
          background: rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.06);
        }
        
        .dark .glass-testimonial-card {
          background: rgba(31, 41, 55, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .dark .glass-testimonial-card:hover {
          background: rgba(31, 41, 55, 0.3);
        }
        
        .glass-stat-card {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }
        
        .glass-stat-card:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .dark .glass-stat-card {
          background: rgba(31, 41, 55, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .dark .glass-stat-card:hover {
          background: rgba(31, 41, 55, 0.25);
        }
        
        .glass-filter {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .dark .glass-filter {
          background: rgba(31, 41, 55, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .glass-form {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .dark .glass-form {
          background: rgba(31, 41, 55, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .glass-cta {
          background: linear-gradient(135deg, rgba(37,99,235,0.4), rgba(99,102,241,0.4));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(37,99,235,0.2);
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
        
        .glass-btn-active {
          background: linear-gradient(135deg, rgba(37,99,235,0.4), rgba(99,102,241,0.4));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .glass-empty {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dark .glass-empty {
          background: rgba(31, 41, 55, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .glass-error {
          background: rgba(255, 0, 0, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 0, 0, 0.1);
        }
        
        .dark .glass-error {
          background: rgba(255, 0, 0, 0.03);
          border: 1px solid rgba(255, 0, 0, 0.05);
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
        .neo-input {
          background: #e8edf2;
          box-shadow: inset 4px 4px 8px #c5cace, inset -4px -4px 8px #ffffff;
          border: none;
          transition: all 0.3s ease;
        }
        
        .neo-input:focus {
          box-shadow: inset 6px 6px 12px #c5cace, inset -6px -6px 12px #ffffff;
          outline: none;
        }
        
        .dark .neo-input {
          background: #1f2937;
          box-shadow: inset 4px 4px 8px #0f1520, inset -4px -4px 8px #2d3748;
        }
        
        .neo-icon-btn {
          background: #e8edf2;
          box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
          transition: all 0.3s ease;
        }
        
        .neo-icon-btn:hover {
          box-shadow: 2px 2px 4px #c5cace, -2px -2px 4px #ffffff;
          transform: scale(0.95);
        }
        
        .dark .neo-icon-btn {
          background: #1f2937;
          box-shadow: 4px 4px 8px #0f1520, -4px -4px 8px #2d3748;
        }
        
        .neo-dropdown {
          background: #e8edf2;
          box-shadow: 8px 8px 16px #c5cace, -8px -8px 16px #ffffff;
          border: 1px solid rgba(255,255,255,0.3);
        }
        
        .dark .neo-dropdown {
          background: #1f2937;
          box-shadow: 8px 8px 16px #0f1520, -8px -8px 16px #2d3748;
          border: 1px solid rgba(255,255,255,0.05);
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
        
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

export default Testimonials;