import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../utils/api';
import axios from 'axios';
import { 
  FaPlay, 
  FaVideo, 
  FaExternalLinkAlt, 
  FaArrowLeft, 
  FaSpinner,
  FaCheckCircle,
  FaRocket,
  FaUsers,
  FaBuilding,
  FaMobileAlt,
  FaCode,
  FaShieldAlt,
  FaChartLine,
  FaArrowRight,
  FaStar,
  FaClock,
  FaTag,
  FaCalendarAlt,
  FaGithub,
  FaLink,
  FaDownload,
  FaShare,
  FaHeart,
  FaBookmark,
  FaEye,
  FaThumbsUp,
  FaComment,
  FaList,
  FaInfoCircle,
  FaCrown,
  FaAward,
  FaMedal,
  FaTrophy,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaMapPin,
  FaGlobe,
  FaMicrophone,
  FaComments,
  FaPalette,
  FaBorderAll,
  FaLayerGroup
} from 'react-icons/fa';

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
// UI COMPONENTS - NEUMORPHIC + LIQUID GLASS
// ============================================

// Neumorphic Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
    <div className="neumorphic-card p-12 text-center relative overflow-hidden">
      <div className="absolute inset-0 liquid-glass-overlay"></div>
      <div className="relative z-10">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 neumorphic-spinner"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaSpinner className="text-blue-600 text-4xl animate-spin" />
          </div>
        </div>
        <p className="text-gray-600 mt-6 animate-pulse font-medium">Loading product details...</p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  </div>
);

// Error State with Neumorphism
const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="neumorphic-card rounded-2xl p-12 text-center">
        <div className="liquid-glass-container p-8 rounded-2xl">
          <div className="text-7xl mb-4 animate-bounce">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Product not found'}
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            The product you're looking for might have been moved, is currently unavailable, or doesn't exist in our catalog.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/products" 
              className="neumorphic-btn-primary px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
            >
              <FaArrowLeft /> Browse All Products
            </Link>
            <Link 
              to="/contact" 
              className="neumorphic-btn-secondary px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 border-2 border-blue-600"
            >
              Contact Support
            </Link>
            {onRetry && (
              <button
                onClick={onRetry}
                className="neumorphic-btn px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
              >
                <FaSpinner className="animate-spin" /> Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Neumorphic Feature Card
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="neumorphic-card-feature p-4 group">
    <div className="flex items-start gap-3">
      <div className="neumorphic-icon-box w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
        <Icon className="text-xl" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

// Liquid Glass Stat Badge
const StatBadge = ({ icon: Icon, label, value }) => (
  <div className="liquid-glass-stat flex items-center gap-2 px-4 py-2 rounded-full">
    <Icon className="text-white text-sm" />
    <span className="text-sm font-medium text-white">{value}</span>
    <span className="text-xs text-white/70">{label}</span>
  </div>
);

// Neumorphic Tab Button
const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-xl font-medium transition-all duration-500 flex items-center justify-center gap-2 ${
      active === id
        ? 'neumorphic-tab-active text-white'
        : 'neumorphic-tab-inactive text-gray-600'
    }`}
  >
    <Icon className="text-sm" />
    {label}
  </button>
);

// ============================================
// MAIN PRODUCT DETAIL COMPONENT
// ============================================

const ProductDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const siteUrl = window.location.origin;

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const isNumeric = /^\d+$/.test(id);
      
      if (isNumeric) {
        const response = await api.getProject(id);
        setProject(response.data);
        
        if (response.data.category) {
          try {
            const relatedRes = await api.getProjectsByCategory(response.data.category);
            const related = relatedRes.data.filter(p => p.id !== response.data.id).slice(0, 4);
            setRelatedProjects(related);
          } catch (err) {
            console.log('No related projects found');
          }
        }
      } else {
        try {
          const response = await api.getProjectsByCategory(id);
          if (response.data && response.data.length > 0) {
            setProject(response.data[0]);
          } else {
            setError('Product not found');
          }
        } catch (err) {
          setError('Product not found');
        }
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      if (err.response?.status === 404) {
        setError('Product not found. It may have been removed or the URL is incorrect.');
      } else {
        setError('Failed to load product details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id, fetchProject]);

  const getCategoryIcon = (category) => {
    const icons = {
      'HRMS': <FaUsers />,
      'TODO': <FaCheckCircle />,
      'Estate': <FaBuilding />,
      'WhatsApp': <FaMobileAlt />
    };
    return icons[category] || <FaCode />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'HRMS': 'from-blue-500 to-blue-700',
      'TODO': 'from-green-500 to-emerald-700',
      'Estate': 'from-purple-500 to-indigo-700',
      'WhatsApp': 'from-teal-500 to-cyan-700'
    };
    return colors[category] || 'from-gray-500 to-gray-700';
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'HRMS': 'bg-blue-100 text-blue-700',
      'TODO': 'bg-green-100 text-green-700',
      'Estate': 'bg-purple-100 text-purple-700',
      'WhatsApp': 'bg-teal-100 text-teal-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const features = project?.features || [];
  const techStack = project?.tech_stack || [];

  if (loading) return <LoadingSkeleton />;
  if (error || !project) return <ErrorState error={error} onRetry={fetchProject} />;

  const productTitle = `${project.title} - Enterprise Software Solution | Krynova Technologies`;
  const productDescription = project.description || `Explore ${project.title} - an enterprise software solution for businesses. Trusted by 50+ businesses in India and globally.`;

  return (
    <>
      {/* ========================================== */}
      {/* HELMET - SEO + AEO + GEO COMBINED */}
      {/* ========================================== */}
      <Helmet>
        <title>{productTitle}</title>
        <meta name="description" content={productDescription} />
        <meta name="keywords" content={`${project.title}, ${project.category} software, enterprise software, business solution, software for businesses, ${project.category} system India, Krynova Technologies product`} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={`${siteUrl}/products/${project.id}`} />
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
        <meta name="targetedCities" content={indianCities.join(", ")} />
        <meta name="targetedStates" content="Uttar Pradesh, Delhi, Maharashtra, Karnataka, Tamil Nadu, Telangana, West Bengal, Gujarat, Rajasthan, Punjab, Haryana, Madhya Pradesh, Bihar, Odisha, Kerala, Andhra Pradesh, Jharkhand, Chhattisgarh, Uttarakhand, Himachal Pradesh, Goa, Assam, Jammu & Kashmir" />
        <meta name="targetedCountries" content={globalCountries.join(", ")} />
        <meta name="language" content="en, hi, bn, te, ta, ur, gu, mr, kn, ml, pa" />
        <meta name="locales" content="en_IN, hi_IN, bn_IN, te_IN, ta_IN, ur_IN, gu_IN, mr_IN, kn_IN, ml_IN, pa_IN" />
        <meta name="question" content={`What is ${project.title} software?`} />
        <meta name="answer" content={`${project.title} is an enterprise software solution by Krynova Technologies for ${project.category} management. It helps businesses streamline their operations and improve efficiency.`} />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content={`${project.title}, ${project.category} software, enterprise solution, business software, Krynova product`} />
        <meta name="rich-snippet" content="product" />
        <meta name="structured-data" content="true" />
        <meta name="product-category" content={project.category} />
        <meta name="product-status" content={project.is_upcoming ? 'Upcoming' : 'Active'} />
        <meta property="og:title" content={productTitle} />
        <meta property="og:description" content={productDescription} />
        <meta property="og:url" content={`${siteUrl}/products/${project.id}`} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={productTitle} />
        <meta name="twitter:description" content={productDescription} />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <p>Category: {project.category}</p>
        <p>Status: {project.is_upcoming ? 'Upcoming' : 'Active'}</p>
        <ul>
          {features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
        <p>Available in {indianCities.length}+ Indian cities and {globalCountries.length}+ countries worldwide.</p>
      </div>

      {/* ========================================== */}
      {/* SCHEMA.ORG - Product Schema */}
      {/* ========================================== */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": project.title,
          "description": project.description,
          "category": project.category,
          "brand": {
            "@type": "Brand",
            "name": "Krynova Technologies"
          },
          "manufacturer": {
            "@type": "Organization",
            "name": "Krynova Technologies",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Agra",
              "addressRegion": "Uttar Pradesh",
              "addressCountry": "India"
            }
          },
          "offers": {
            "@type": "Offer",
            "availability": project.is_upcoming ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "Contact for pricing",
              "priceCurrency": "INR"
            }
          },
          "audience": {
            "@type": "Audience",
            "name": "Businesses in India and Worldwide",
            "geographicArea": {
              "@type": "AdministrativeArea",
              "name": `India, ${globalCountries.join(", ")}, Worldwide`
            }
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          }
        })}
      </script>

      {/* ========================================== */}
      {/* MAIN CONTENT - NEUMORPHISM + LIQUID GLASS */}
      {/* ========================================== */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {/* Liquid Glass Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-5"></div>
        </div>

        {/* HERO BANNER - Liquid Glass */}
        <div 
          className={`bg-gradient-to-r ${getCategoryColor(project.category)} text-white relative overflow-hidden`}
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        >
          <div className="absolute inset-0 liquid-glass-hero"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Breadcrumb - Neumorphic */}
              <nav className="flex items-center gap-2 text-blue-200 text-sm mb-6 flex-wrap">
                <Link to="/" className="neumorphic-breadcrumb px-3 py-1.5 rounded-lg hover:text-white transition-colors">Home</Link>
                <span className="text-blue-300">/</span>
                <Link to="/products" className="neumorphic-breadcrumb px-3 py-1.5 rounded-lg hover:text-white transition-colors">Products</Link>
                <span className="text-blue-300">/</span>
                <span className="text-white font-medium neumorphic-breadcrumb-active px-3 py-1.5 rounded-lg">{project.title}</span>
              </nav>

              <div className="flex flex-wrap items-start gap-6">
                {/* Icon - Neumorphic */}
                <div className="neumorphic-icon-hero w-24 h-24 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 relative">
                  <div className="absolute inset-0 liquid-glass-overlay rounded-2xl"></div>
                  <i className={`fas fa-${project.icon || 'cube'} relative z-10`}></i>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`neumorphic-badge px-4 py-1.5 rounded-full text-sm font-medium ${getCategoryBadgeColor(project.category)}`}>
                      {getCategoryIcon(project.category)} {project.category}
                    </span>
                    {project.is_upcoming && (
                      <span className="liquid-glass-badge bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 animate-pulse">
                        <FaRocket /> Upcoming
                      </span>
                    )}
                    {project.is_featured && (
                      <span className="liquid-glass-badge-featured px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaStar /> Featured
                      </span>
                    )}
                    <span className="liquid-glass-badge-active px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                      <FaCheckCircle /> Active
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{project.title}</h1>
                  <p className="text-blue-100 text-lg mt-2 max-w-2xl opacity-90">
                    {project.short_desc || project.description?.substring(0, 150) + '...'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="liquid-glass-tag-small inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs">
                      <FaMapPin className="text-yellow-400" /> {indianCities.length}+ Indian Cities
                    </span>
                    <span className="liquid-glass-tag-small inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs">
                      <FaGlobe className="text-yellow-400" /> {globalCountries.length}+ Countries
                    </span>
                  </div>
                </div>

                {/* Action Buttons - Neumorphic */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`neumorphic-action-btn p-3 rounded-xl transition-all duration-300 ${
                      isLiked ? 'text-red-500' : 'text-white'
                    }`}
                  >
                    <FaHeart className={isLiked ? 'animate-pulse' : ''} />
                  </button>
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`neumorphic-action-btn p-3 rounded-xl transition-all duration-300 ${
                      isBookmarked ? 'text-blue-400' : 'text-white'
                    }`}
                  >
                    <FaBookmark />
                  </button>
                  <button className="neumorphic-action-btn p-3 rounded-xl transition-all duration-300 text-white">
                    <FaShare />
                  </button>
                </div>
              </div>

              {/* Stats - Liquid Glass */}
              <div className="flex flex-wrap gap-4 mt-6">
                <StatBadge icon={FaEye} label="Views" value="1.2K" />
                <StatBadge icon={FaThumbsUp} label="Likes" value="89" />
                <StatBadge icon={FaComment} label="Reviews" value="12" />
                <StatBadge icon={FaClock} label="Updated" value="2 weeks ago" />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs - Neumorphic */}
              <div className="neumorphic-tabs p-1.5 rounded-xl mb-6 flex flex-wrap gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: FaInfoCircle },
                  { id: 'features', label: 'Features', icon: FaList },
                  { id: 'tech', label: 'Tech Stack', icon: FaCode },
                  { id: 'reviews', label: 'Reviews', icon: FaComment }
                ].map((tab) => (
                  <TabButton
                    key={tab.id}
                    id={tab.id}
                    label={tab.label}
                    icon={tab.icon}
                    active={activeTab}
                    onClick={setActiveTab}
                  />
                ))}
              </div>

              {/* Tab Content - Liquid Glass */}
              <div className="liquid-glass-content rounded-xl p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">About This Product</h3>
                      <p className="text-gray-600 leading-relaxed">{project.description}</p>
                    </div>

                    {/* Video Section - Neumorphic */}
                    {project.video_url && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FaVideo className="text-blue-600" /> Product Demo
                        </h4>
                        <div className="neumorphic-video-container relative aspect-video rounded-xl overflow-hidden shadow-xl">
                          {showVideo ? (
                            <iframe 
                              src={project.video_url} 
                              className="w-full h-full"
                              allowFullScreen
                              title="Product Demo Video"
                              loading="lazy"
                            ></iframe>
                          ) : (
                            <div 
                              className="w-full h-full flex flex-col items-center justify-center text-white cursor-pointer group bg-gradient-to-br from-gray-800 to-gray-900"
                              onClick={() => setShowVideo(true)}
                            >
                              <div className="neumorphic-play-btn w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                                <FaPlay className="text-3xl group-hover:scale-110 transition-transform" />
                              </div>
                              <p className="text-sm opacity-70 mt-4">Click to play demo video</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions - Neumorphic */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                      {project.demo_url && (
                        <a 
                          href={project.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="neumorphic-btn-primary px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
                        >
                          <FaExternalLinkAlt /> Launch Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="neumorphic-btn-github px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
                        >
                          <FaGithub /> View on GitHub
                        </a>
                      )}
                      <Link 
                        to="/contact"
                        className="neumorphic-btn-secondary px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 border-2 border-blue-600"
                      >
                        Request Demo
                      </Link>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                    {features.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {features.map((feature, i) => (
                          <div key={i} className="neumorphic-feature-item p-3 rounded-lg group">
                            <div className="flex items-start gap-3">
                              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 neumorphic-empty-state p-6 rounded-lg text-center">
                        No features listed for this product.
                      </p>
                    )}
                  </div>
                )}

                {/* Tech Stack Tab */}
                {activeTab === 'tech' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Technology Stack</h3>
                    {techStack.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {techStack.map((tech, i) => (
                          <span key={i} className="neumorphic-tech-tag px-4 py-2 rounded-xl text-sm font-medium text-gray-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 neumorphic-empty-state p-6 rounded-lg text-center">
                        No tech stack information available.
                      </p>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">User Reviews</h3>
                    <div className="neumorphic-empty-state p-8 rounded-xl text-center">
                      <div className="text-6xl mb-4 animate-bounce">⭐</div>
                      <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                      <Link 
                        to="/contact"
                        className="inline-flex items-center gap-2 mt-4 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                      >
                        Leave a Review <FaArrowRight className="text-sm" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Related Projects - Neumorphic */}
              {relatedProjects.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaArrowRight className="text-blue-600" /> Related Products
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedProjects.map((related) => (
                      <Link 
                        key={related.id}
                        to={`/products/${related.id}`}
                        className="neumorphic-related-card p-4 rounded-xl group transition-all duration-500"
                      >
                        <div className="flex items-center gap-3">
                          <div className="neumorphic-related-icon w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 text-xl group-hover:scale-110 transition-transform">
                            <i className={`fas fa-${related.icon || 'cube'}`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {related.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{related.category}</span>
                              {related.is_upcoming && (
                                <span className="text-xs liquid-glass-tag-small px-2 py-0.5 rounded-full">Upcoming</span>
                              )}
                            </div>
                          </div>
                          <FaArrowRight className="text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Info - Neumorphic */}
              <div className="neumorphic-sidebar-card p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Info</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Category', value: project.category },
                    { label: 'Status', value: project.is_upcoming ? 'Upcoming' : 'Active', color: project.is_upcoming ? 'text-yellow-600' : 'text-green-600' },
                    { label: 'Priority', value: project.priority || 'Standard' },
                    { label: 'Created', value: project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A' },
                    { label: 'Service Area', value: `${indianCities.length}+ Cities` }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500">{item.label}</span>
                      <span className={`font-medium ${item.color || 'text-gray-900'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating - Liquid Glass */}
              <div className="liquid-glass-rating rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-4xl animate-pulse">⭐</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Based on 12 reviews</p>
                <Link 
                  to="/contact"
                  className="inline-flex items-center gap-2 mt-3 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors"
                >
                  Write a Review <FaArrowRight className="text-xs" />
                </Link>
              </div>

              {/* CTA - Liquid Glass Gradient */}
              <div className="liquid-glass-cta-card rounded-xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 liquid-glass-overlay"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-3 animate-bounce">🚀</div>
                  <h4 className="text-lg font-bold mb-2">Ready to Get Started?</h4>
                  <p className="text-blue-100 text-sm mb-4">
                    Schedule a personalized demo and see how this solution can transform your business.
                  </p>
                  <Link 
                    to="/contact"
                    className="block text-center neumorphic-cta-btn px-4 py-2.5 rounded-xl font-semibold transition-all duration-300"
                  >
                    Request Demo
                  </Link>
                </div>
              </div>

              {/* Share - Neumorphic */}
              <div className="neumorphic-sidebar-card p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Share This Product</h4>
                <div className="flex gap-2">
                  {[FaLink, FaTwitter, FaLinkedin, FaWhatsapp].map((Icon, i) => (
                    <button key={i} className="neumorphic-share-btn flex-1 p-2.5 rounded-xl transition-all duration-300">
                      <Icon />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animations & Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* ========================================== */
          /* NEUMORPHISM STYLES */
          /* ========================================== */
          .neumorphic-card {
            background: #e8edf2;
            box-shadow: 20px 20px 60px #c5cace, -20px -20px 60px #ffffff;
            border-radius: 2rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-card:hover {
            box-shadow: 25px 25px 70px #c5cace, -25px -25px 70px #ffffff;
          }

          .neumorphic-spinner {
            background: #e8edf2;
            box-shadow: 10px 10px 30px #c5cace, -10px -10px 30px #ffffff;
            border-radius: 50%;
            animation: spin 1.5s linear infinite;
          }

          .neumorphic-card-feature {
            background: #e8edf2;
            box-shadow: 8px 8px 16px #c5cace, -8px -8px 16px #ffffff;
            border-radius: 0.75rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-card-feature:hover {
            box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
            transform: scale(0.98);
          }

          .neumorphic-icon-box {
            background: #e8edf2;
            box-shadow: 6px 6px 12px #c5cace, -6px -6px 12px #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-icon-box:hover {
            box-shadow: 3px 3px 6px #c5cace, -3px -3px 6px #ffffff;
          }

          .neumorphic-tabs {
            background: #e8edf2;
            box-shadow: inset 4px 4px 8px #c5cace, inset -4px -4px 8px #ffffff;
          }

          .neumorphic-tab-active {
            background: linear-gradient(145deg, #2563eb, #1d4ed8);
            box-shadow: 8px 8px 16px #c5cace, -8px -8px 16px #ffffff,
                        inset 0 2px 4px rgba(255,255,255,0.2);
            color: white;
          }

          .neumorphic-tab-inactive {
            background: transparent;
            box-shadow: none;
          }

          .neumorphic-btn-primary {
            background: linear-gradient(145deg, #2563eb, #1d4ed8);
            box-shadow: 8px 8px 16px #c5cace, -8px -8px 16px #ffffff,
                        inset 0 2px 4px rgba(255,255,255,0.2);
            color: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 12px 12px 24px #c5cace, -12px -12px 24px #ffffff;
          }

          .neumorphic-btn-secondary {
            background: #e8edf2;
            box-shadow: 8px 8px 16px #c5cace, -8px -8px 16px #ffffff;
            color: #2563eb;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 12px 12px 24px #c5cace, -12px -12px 24px #ffffff;
          }

          .neumorphic-btn-github {
            background: #24292e;
            box-shadow: 8px 8px 16px #c5cace, -8px -8px 16px #ffffff;
            color: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-btn-github:hover {
            transform: translateY(-2px);
            box-shadow: 12px 12px 24px #c5cace, -12px -12px 24px #ffffff;
          }

          .neumorphic-action-btn {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            box-shadow: 4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-action-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.05);
          }

          .neumorphic-badge {
            background: #e8edf2;
            box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
          }

          .neumorphic-breadcrumb {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-breadcrumb:hover {
            background: rgba(255,255,255,0.2);
          }

          .neumorphic-breadcrumb-active {
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
          }

          .neumorphic-icon-hero {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3);
          }

          .neumorphic-feature-item {
            background: #e8edf2;
            box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-feature-item:hover {
            box-shadow: 2px 2px 4px #c5cace, -2px -2px 4px #ffffff;
            transform: scale(0.98);
          }

          .neumorphic-tech-tag {
            background: #e8edf2;
            box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-tech-tag:hover {
            box-shadow: 2px 2px 4px #c5cace, -2px -2px 4px #ffffff;
            transform: translateY(-2px);
          }

          .neumorphic-empty-state {
            background: #e8edf2;
            box-shadow: inset 4px 4px 8px #c5cace, inset -4px -4px 8px #ffffff;
          }

          .neumorphic-related-card {
            background: #e8edf2;
            box-shadow: 6px 6px 12px #c5cace, -6px -6px 12px #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-related-card:hover {
            box-shadow: 10px 10px 20px #c5cace, -10px -10px 20px #ffffff;
            transform: translateY(-2px);
          }

          .neumorphic-related-icon {
            background: #e8edf2;
            box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .neumorphic-sidebar-card {
            background: #e8edf2;
            box-shadow: 10px 10px 20px #c5cace, -10px -10px 20px #ffffff;
            border-radius: 1rem;
          }

          .neumorphic-share-btn {
            background: #e8edf2;
            box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
            color: #2563eb;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-share-btn:hover {
            box-shadow: 2px 2px 4px #c5cace, -2px -2px 4px #ffffff;
            transform: scale(0.95);
          }

          .neumorphic-play-btn {
            background: #e8edf2;
            box-shadow: 10px 10px 20px rgba(0,0,0,0.3), -10px -10px 20px rgba(255,255,255,0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-play-btn:hover {
            box-shadow: 15px 15px 30px rgba(0,0,0,0.4), -15px -15px 30px rgba(255,255,255,0.1);
          }

          .neumorphic-video-container {
            background: #1a1a2e;
            box-shadow: 10px 10px 20px #c5cace, -10px -10px 20px #ffffff;
          }

          .neumorphic-cta-btn {
            background: white;
            color: #2563eb;
            box-shadow: 6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-cta-btn:hover {
            box-shadow: 10px 10px 20px rgba(0,0,0,0.15), -10px -10px 20px rgba(255,255,255,0.15);
            transform: translateY(-2px);
          }

          /* ========================================== */
          /* LIQUID GLASS STYLES */
          /* ========================================== */
          .liquid-glass-hero {
            background: linear-gradient(135deg, 
              rgba(255,255,255,0.15) 0%,
              rgba(255,255,255,0.05) 50%,
              rgba(255,255,255,0.15) 100%
            );
            pointer-events: none;
          }

          .liquid-glass-stat {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.3);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          }

          .liquid-glass-content {
            background: rgba(255,255,255,0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.3);
            box-shadow: 0 8px 32px rgba(0,0,0,0.05);
          }

          .liquid-glass-badge {
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
          }

          .liquid-glass-badge-featured {
            background: linear-gradient(135deg, rgba(251,191,36,0.3), rgba(251,146,60,0.3));
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
          }

          .liquid-glass-badge-active {
            background: rgba(52,211,153,0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
          }

          .liquid-glass-tag-small {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
          }

          .liquid-glass-rating {
            background: rgba(255,255,255,0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.3);
            box-shadow: 0 8px 32px rgba(0,0,0,0.05);
          }

          .liquid-glass-cta-card {
            background: linear-gradient(135deg, rgba(37,99,235,0.4), rgba(99,102,241,0.4));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.3);
            box-shadow: 0 8px 32px rgba(37,99,235,0.2);
          }

          .liquid-glass-overlay {
            background: linear-gradient(135deg, 
              rgba(255,255,255,0.2) 0%,
              rgba(255,255,255,0) 50%,
              rgba(255,255,255,0.2) 100%
            );
            pointer-events: none;
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
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delayed { animation: floatDelayed 7s ease-in-out infinite 1s; }

          .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 50px 50px;
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

export default ProductDetail;