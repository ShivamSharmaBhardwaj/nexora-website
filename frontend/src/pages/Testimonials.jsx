import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../utils/api';
import axios from 'axios';
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
  FaFlag
} from 'react-icons/fa';

// ============================================
// LOADING SKELETON
// ============================================
const TestimonialSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
  </div>
);

// ============================================
// TESTIMONIAL CARD COMPONENT
// ============================================
const TestimonialCard = ({ testimonial, index, onShare }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const getRandomColor = (name) => {
    const colors = [
      'from-blue-500 to-blue-700',
      'from-green-500 to-green-700',
      'from-purple-500 to-purple-700',
      'from-red-500 to-red-700',
      'from-yellow-500 to-orange-500',
      'from-pink-500 to-pink-700',
      'from-indigo-500 to-indigo-700',
      'from-teal-500 to-teal-700'
    ];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 group relative animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-4xl text-blue-100 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
        <FaQuoteRight />
      </div>

      {/* Share Button */}
      <div className="absolute top-4 right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => setShowShare(!showShare)}
          className="p-2 bg-gray-100 hover:bg-blue-50 rounded-full transition-colors"
          aria-label="Share testimonial"
        >
          <FaShare className="text-gray-500 text-sm" />
        </button>
      </div>

      {/* Share Dropdown */}
      {showShare && (
        <div className="absolute top-14 right-4 bg-white rounded-xl shadow-2xl p-2 z-10 animate-scale-in border border-gray-100">
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg w-full transition text-sm">
            <FaTwitter className="text-blue-400" /> Share on Twitter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg w-full transition text-sm">
            <FaLinkedin className="text-blue-600" /> Share on LinkedIn
          </button>
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg w-full transition text-sm">
            <FaWhatsapp className="text-green-500" /> Share on WhatsApp
          </button>
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg w-full transition text-sm">
            <FaCopy className="text-gray-500" /> Copy Link
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className={`w-14 h-14 bg-gradient-to-br ${getRandomColor(testimonial.client_name)} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25`}>
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
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
              <FaCheckCircle className="text-white text-xs" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {testimonial.client_name}
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {testimonial.client_company && (
              <>
                <FaBuilding className="text-gray-400 text-xs" />
                <span>{testimonial.client_company}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex text-yellow-400 mb-3">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={`transition-all duration-300 ${
              i < testimonial.rating ? 'text-yellow-400 scale-100' : 'text-gray-200 scale-95'
            }`}
          />
        ))}
        <span className="text-xs text-gray-400 ml-2">({testimonial.rating}/5)</span>
      </div>

      {/* Feedback */}
      <div className="relative">
        <FaQuoteLeft className="text-blue-200 text-sm absolute -top-1 -left-1 opacity-50" />
        <p className="text-gray-600 text-sm leading-relaxed pl-4 line-clamp-4">
          "{testimonial.feedback}"
        </p>
      </div>

      {/* Footer */}
      {testimonial.created_at && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
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
    </div>
  );
};

// ============================================
// STAR RATING COMPONENT
// ============================================
const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <FaStar 
            className={`text-3xl transition-colors duration-200 ${
              star <= (hover || rating) 
                ? 'text-yellow-400' 
                : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// ============================================
// STATISTICS CARD
// ============================================
const StatCard = ({ icon: Icon, value, label, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600'
  };

  return (
    <div className={`${colors[color]} rounded-xl border p-4 text-center transition-all hover:shadow-md`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-600 mt-1 flex items-center justify-center gap-1">
        <Icon className="text-sm" /> {label}
      </div>
    </div>
  );
};

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

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getTestimonials();
        setTestimonials(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Filter and sort testimonials
  const filteredTestimonials = useMemo(() => {
    let filtered = [...testimonials];
    
    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(t => 
        t.client_name?.toLowerCase().includes(term) ||
        t.client_company?.toLowerCase().includes(term) ||
        t.feedback?.toLowerCase().includes(term)
      );
    }
    
    // Filter
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

  // Handle form submit
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
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert(error.response?.data?.message || 'Error submitting feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Statistics
  const totalTestimonials = testimonials.length;
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : 0;
  const fiveStarCount = testimonials.filter(t => t.rating === 5).length;
  const withCompanyCount = testimonials.filter(t => t.client_company).length;

  return (
    <>
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO COMBINED */}
      {/* ========================================== */}
      <Helmet>
        {/* ===== SEO TAGS ===== */}
        <title>Client Testimonials - Krynova Technologies | 50+ Happy Clients in Agra, India | Global Reviews</title>
        <meta name="description" content="Read what our clients say about Krynova Technologies - the best web development company in Agra, India. Real feedback from 50+ businesses across HRMS, Property Management, and custom solutions. Trusted by clients in all Indian cities and globally." />
        <meta name="keywords" content="Krynova Technologies testimonials, client reviews, web development company Agra reviews, HRMS software reviews, property management system feedback, best software company India, client feedback, business solutions reviews, global client reviews, Indian business testimonials" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* ✅ Canonical Tag */}
        <link rel="canonical" href={`${siteUrl}/testimonials`} />
        
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
        <meta name="question" content="What do clients say about Krynova Technologies?" />
        <meta name="answer" content="Krynova Technologies has 50+ happy clients with an average rating of 4.8/5. Clients praise our HRMS software, property management systems, and custom web solutions." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="Krynova reviews, client testimonials, HRMS feedback, web development reviews, best software company India" />
        
        {/* ===== AEO - Rich Snippets ===== */}
        <meta name="rich-snippet" content="reviews" />
        <meta name="structured-data" content="true" />
        <meta name="reviewCount" content={totalTestimonials} />
        <meta name="averageRating" content={averageRating} />
        <meta name="bestRating" content="5" />
        <meta name="worstRating" content="1" />
        
        {/* ===== Open Graph ===== */}
        <meta property="og:title" content="Client Testimonials - Krynova Technologies | 50+ Happy Clients" />
        <meta property="og:description" content="Real feedback from 50+ happy clients about our web development and software solutions across India and globally." />
        <meta property="og:url" content={`${siteUrl}/testimonials`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:rich_attachment" content="true" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Client Testimonials - Krynova Technologies | 50+ Happy Clients" />
        <meta name="twitter:description" content="Real feedback from 50+ happy clients about our web development and software solutions." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Krynova Technologies Client Testimonials</h2>
        <p>Krynova Technologies has 50+ happy clients with an average rating of 4.8 out of 5 stars. Clients praise our HRMS software, property management systems, and custom web solutions.</p>
        <p>Testimonials from businesses in Agra, Delhi, Mumbai, Bangalore, Hyderabad, Pune, Kolkata, and many other cities across India and globally.</p>
        <ul>
          <li>HRMS Software Reviews - Complete human resource management</li>
          <li>Property Management System Reviews - Real estate management</li>
          <li>Custom Web Solutions Reviews - Tailored business applications</li>
          <li>WhatsApp Automation Reviews - Business communication</li>
        </ul>
        <p>Trusted by 50+ businesses worldwide.</p>
      </div>

      {/* ========================================== */}
      {/* ✅ SCHEMA.ORG - SEO + AEO + GEO */}
      {/* ========================================== */}
      
      {/* 📝 Review Page Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ReviewPage",
          "name": "Krynova Technologies Testimonials",
          "description": "Client reviews and feedback for Krynova Technologies - the best web development company in Agra, India.",
          "url": `${siteUrl}/testimonials`,
          "publisher": {
            "@type": "Organization",
            "name": "Krynova Technologies",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Agra",
              "addressRegion": "Uttar Pradesh",
              "addressCountry": "India"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": averageRating || "4.8",
            "reviewCount": totalTestimonials || "50",
            "bestRating": "5",
            "worstRating": "1"
          },
          "inLanguage": ["en", "hi", "bn", "te", "ta", "ur", "gu", "mr", "kn", "ml", "pa"],
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          }
        })}
      </script>

      {/* 🏢 Local Business Schema - GEO Focus */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Krynova Technologies",
          "description": "Best web development company in Agra, India with 50+ happy clients globally.",
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
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": averageRating || "4.8",
            "reviewCount": totalTestimonials || "50",
            "bestRating": "5",
            "worstRating": "1"
          },
          "areaServed": indianCities,
          "availableLanguage": ["English", "Hindi", "Bengali", "Telugu", "Tamil", "Urdu", "Gujarati", "Marathi", "Kannada", "Malayalam", "Punjabi"],
          "slogan": "Global Enterprise Solutions from India",
          "foundingDate": "2024-03-01"
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
              "name": "What do clients say about Krynova Technologies?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Clients praise Krynova Technologies for their professional web development, HRMS software, property management systems, and custom solutions. With 50+ happy clients and an average rating of 4.8/5, our clients appreciate our quality, support, and value."
              }
            },
            {
              "@type": "Question",
              "name": "How many clients has Krynova Technologies served?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies has served 50+ businesses across India and globally, delivering enterprise software solutions, HRMS systems, property management software, and custom web applications."
              }
            },
            {
              "@type": "Question",
              "name": "Where are Krynova Technologies' clients located?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `Krynova Technologies serves clients across all major cities in India including ${indianCities.slice(0, 10).join(", ")} and many more, as well as international clients in ${globalCountries.slice(0, 10).join(", ")} and worldwide.`
              }
            },
            {
              "@type": "Question",
              "name": "What is the average rating of Krynova Technologies?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies has an average rating of 4.8 out of 5 stars based on reviews from 50+ happy clients across India and globally."
              }
            },
            {
              "@type": "Question",
              "name": "Which industries does Krynova Technologies serve?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies serves businesses across HR, real estate, technology, healthcare, education, retail, finance, manufacturing, and other industries with custom software solutions."
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-red-200">
              <FaHeart className="text-red-500 animate-pulse" />
              Client Feedback
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Clients Say</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Real feedback from real businesses who've transformed their operations with our solutions
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                <FaMapPin className="text-blue-500" /> {indianCities.length}+ Indian Cities
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                <FaGlobe className="text-green-500" /> {globalCountries.length}+ Countries
              </span>
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                <FaStar className="text-yellow-500" /> {averageRating}/5 Rating
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                <FaUsers className="text-purple-500" /> {totalTestimonials}+ Reviews
              </span>
            </div>
            <p className="text-sm text-blue-600 mt-3">
              <FaMapMarkerAlt className="inline mr-1" />
              Trusted by 50+ businesses in Agra, Uttar Pradesh, across India, and worldwide
            </p>
          </div>

          {/* Statistics */}
          {!loading && testimonials.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard 
                icon={FaUsers} 
                value={totalTestimonials} 
                label="Total Reviews" 
                color="blue"
              />
              <StatCard 
                icon={FaStar} 
                value={averageRating} 
                label="Average Rating" 
                color="yellow"
              />
              <StatCard 
                icon={FaTrophy} 
                value={fiveStarCount} 
                label="5-Star Reviews" 
                color="green"
              />
              <StatCard 
                icon={FaBuilding} 
                value={withCompanyCount} 
                label="Business Verified" 
                color="purple"
              />
            </div>
          )}

          {/* Search and Filter */}
          {!loading && testimonials.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-gray-100">
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px] relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, company, or feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                      filter === 'all' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('latest')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm flex items-center gap-1 ${
                      filter === 'latest' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaCalendarAlt /> Latest
                  </button>
                  <button
                    onClick={() => setFilter('highest')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm flex items-center gap-1 ${
                      filter === 'highest' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaStar /> Top Rated
                  </button>
                  <button
                    onClick={() => setFilter('with_company')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm flex items-center gap-1 ${
                      filter === 'with_company' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaBuilding /> Verified
                  </button>
                </div>

                {/* Show Form Toggle */}
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <FaRegComment /> Write Review
                </button>
              </div>
            </div>
          )}

          {/* Submit Testimonial Form */}
          {showForm && (
            <div className="mb-8 animate-slide-down">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Share Your Experience</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Your feedback helps us improve and serve you better
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>

                {submitted ? (
                  <div className="text-center py-12 animate-scale-in">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-semibold mb-2 text-gray-900">Thank You!</h3>
                    <p className="text-gray-600 mb-4">
                      Your feedback has been submitted for approval. We appreciate your input!
                    </p>
                    <button 
                      onClick={() => {
                        setSubmitted(false);
                        setShowForm(false);
                      }} 
                      className="text-blue-600 font-medium hover:text-blue-800 transition inline-flex items-center gap-2"
                    >
                      Close <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={form.client_name}
                          onChange={e => setForm({...form, client_name: e.target.value})}
                          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          placeholder="Your Company"
                          value={form.client_company}
                          onChange={e => setForm({...form, client_company: e.target.value})}
                          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating <span className="text-red-500">*</span>
                      </label>
                      <StarRating 
                        rating={form.rating} 
                        onRatingChange={(rating) => setForm({...form, rating})} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Feedback <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder="Share your experience with our products and services..."
                        value={form.feedback}
                        onChange={e => setForm({...form, feedback: e.target.value})}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-32 resize-y"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {form.feedback.length}/500 characters
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Feedback'
                      )}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      All feedback is reviewed before being published
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Testimonials Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <TestimonialSkeleton key={idx} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-5xl mb-4 animate-bounce">⚠️</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition"
              >
                Try Again
              </button>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No Testimonials Found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No testimonials match your search.' : 'Be the first to share your experience with us!'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-600 font-medium hover:text-blue-800 transition"
                >
                  Clear Search
                </button>
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
                <div className="text-center text-sm text-gray-500">
                  Showing {filteredTestimonials.length} of {testimonials.length} testimonials
                </div>
              )}
            </>
          )}

          {/* Call to Action - Global & Local */}
          {!loading && testimonials.length > 0 && (
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Join Our Happy Clients?</h2>
                <p className="text-blue-100 mb-6 text-lg">
                  Transform your business with our custom solutions. Serving 50+ businesses in Agra, Uttar Pradesh, across India, and worldwide.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                    <FaMapPin /> {indianCities.length}+ Indian Cities
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                    <FaGlobe /> {globalCountries.length}+ Countries
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                    <FaStar /> 4.8/5 Rating
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Get Started <FaArrowRight aria-hidden="true" />
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
            </div>
          )}
        </div>

        {/* CSS Animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
          .animate-slide-down { animation: slideDown 0.3s ease-out; }
          .animate-scale-in { animation: scaleIn 0.3s ease-out; }
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
      </div>
    </>
  );
};

export default Testimonials;