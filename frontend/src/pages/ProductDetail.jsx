import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
  FaComments
} from 'react-icons/fa';

// ============================================
// CONSTANTS
// ============================================

// ✅ Indian Cities for GEO Targeting
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

// ✅ Global Countries
const globalCountries = [
  "USA", "UK", "Canada", "Australia", "UAE", "Singapore", 
  "Germany", "France", "Japan", "South Korea", "Netherlands", 
  "Sweden", "Norway", "Denmark", "Finland", "New Zealand", 
  "Ireland", "Malaysia", "Thailand", "Vietnam", "Indonesia", 
  "Philippines", "South Africa", "Kenya", "Nigeria", "Egypt", 
  "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"
];

// ============================================
// UI COMPONENTS
// ============================================

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FaSpinner className="text-blue-600 text-3xl animate-pulse" />
        </div>
      </div>
      <p className="text-gray-600 mt-4 animate-pulse">Loading product details...</p>
    </div>
  </div>
);

// Error State Component
const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
        <div className="text-6xl mb-4 animate-bounce">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {error || 'Product not found'}
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          The product you're looking for might have been moved, is currently unavailable, or doesn't exist in our catalog.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl"
          >
            <FaArrowLeft /> Browse All Products
          </Link>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300"
          >
            Contact Support
          </Link>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300"
            >
              <FaSpinner className="animate-spin" /> Retry
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
        <Icon className="text-lg" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

// Stat Badge Component
const StatBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
    <Icon className="text-white text-sm" />
    <span className="text-sm font-medium text-white">{value}</span>
    <span className="text-xs text-white/70">{label}</span>
  </div>
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

  const siteUrl = window.location.origin;

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const isNumeric = /^\d+$/.test(id);
      const url = isNumeric 
        ? `${import.meta.env.VITE_API_URL}/api/projects/${id}`
        : `${import.meta.env.VITE_API_URL}/api/projects/category/${id}`;
      const response = await axios.get(url);
      setProject(response.data);
      
      if (response.data.category) {
        try {
          const relatedRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/projects/category/${response.data.category}`
          );
          const related = relatedRes.data.filter(p => p.id !== response.data.id).slice(0, 4);
          setRelatedProjects(related);
        } catch (err) {
          console.log('No related projects found');
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

  // Get category icon and color
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

  // Features array
  const features = project?.features || [];
  const techStack = project?.tech_stack || [];

  if (loading) return <LoadingSkeleton />;
  if (error || !project) return <ErrorState error={error} onRetry={fetchProject} />;

  // ✅ Build product title for SEO
  const productTitle = `${project.title} - Enterprise Software Solution | Krynova Technologies`;
  const productDescription = project.description || `Explore ${project.title} - an enterprise software solution for businesses. Trusted by 50+ businesses in India and globally.`;

  return (
    <>
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO COMBINED */}
      {/* ========================================== */}
      <Helmet>
        {/* ===== SEO TAGS ===== */}
        <title>{productTitle}</title>
        <meta name="description" content={productDescription} />
        <meta name="keywords" content={`${project.title}, ${project.category} software, enterprise software, business solution, software for businesses, ${project.category} system India, Krynova Technologies product`} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* ✅ Canonical Tag */}
        <link rel="canonical" href={`${siteUrl}/products/${project.id}`} />
        
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
        <meta name="question" content={`What is ${project.title} software?`} />
        <meta name="answer" content={`${project.title} is an enterprise software solution by Krynova Technologies for ${project.category} management. It helps businesses streamline their operations and improve efficiency.`} />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content={`${project.title}, ${project.category} software, enterprise solution, business software, Krynova product`} />
        
        {/* ===== AEO - Rich Snippets ===== */}
        <meta name="rich-snippet" content="product" />
        <meta name="structured-data" content="true" />
        <meta name="product-category" content={project.category} />
        <meta name="product-status" content={project.is_upcoming ? 'Upcoming' : 'Active'} />
        
        {/* ===== Open Graph ===== */}
        <meta property="og:title" content={productTitle} />
        <meta property="og:description" content={productDescription} />
        <meta property="og:url" content={`${siteUrl}/products/${project.id}`} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={productTitle} />
        <meta name="twitter:description" content={productDescription} />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
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
      {/* ✅ SCHEMA.ORG - Product Schema */}
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
      {/* MAIN CONTENT */}
      {/* ========================================== */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* HERO BANNER */}
        <div className={`bg-gradient-to-r ${getCategoryColor(project.category)} text-white relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-5"></div>
          </div>
          
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-blue-200 text-sm mb-6 flex-wrap">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link to="/products" className="hover:text-white transition-colors">Products</Link>
                <span>/</span>
                <span className="text-white font-medium">{project.title}</span>
              </nav>

              <div className="flex flex-wrap items-start gap-6">
                {/* Icon */}
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm border border-white/10 shadow-xl flex-shrink-0">
                  <i className={`fas fa-${project.icon || 'cube'}`}></i>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadgeColor(project.category)}`}>
                      {getCategoryIcon(project.category)} {project.category}
                    </span>
                    {project.is_upcoming && (
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 animate-pulse">
                        <FaRocket /> Upcoming
                      </span>
                    )}
                    {project.is_featured && (
                      <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaStar /> Featured
                      </span>
                    )}
                    <span className="bg-green-400/30 text-green-100 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <FaCheckCircle /> Active
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{project.title}</h1>
                  <p className="text-blue-100 text-lg mt-2 max-w-2xl opacity-90">
                    {project.short_desc || project.description?.substring(0, 150) + '...'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-xs">
                      <FaMapPin className="text-yellow-400" /> {indianCities.length}+ Indian Cities
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-xs">
                      <FaGlobe className="text-yellow-400" /> {globalCountries.length}+ Countries
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isLiked ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <FaHeart className={isLiked ? 'animate-pulse' : ''} />
                  </button>
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isBookmarked ? 'bg-blue-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <FaBookmark />
                  </button>
                  <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-white">
                    <FaShare />
                  </button>
                </div>
              </div>

              {/* Stats */}
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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 flex flex-wrap gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: FaInfoCircle },
                  { id: 'features', label: 'Features', icon: FaList },
                  { id: 'tech', label: 'Tech Stack', icon: FaCode },
                  { id: 'reviews', label: 'Reviews', icon: FaComment }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="text-sm" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">About This Product</h3>
                      <p className="text-gray-600 leading-relaxed">{project.description}</p>
                    </div>

                    {/* Video Section */}
                    {project.video_url && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FaVideo className="text-blue-600" /> Product Demo
                        </h4>
                        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
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
                              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
                                <FaPlay className="text-4xl group-hover:scale-110 transition-transform" />
                              </div>
                              <p className="text-sm opacity-70 mt-4">Click to play demo video</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                      {project.demo_url && (
                        <a 
                          href={project.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
                        >
                          <FaExternalLinkAlt /> Launch Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-lg shadow-gray-500/25"
                        >
                          <FaGithub /> View on GitHub
                        </a>
                      )}
                      <Link 
                        to="/contact"
                        className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300"
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
                          <div key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 bg-gray-50 p-6 rounded-lg text-center">
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
                          <span key={i} className="px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-300 hover:shadow-md transition-all">
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 bg-gray-50 p-6 rounded-lg text-center">
                        No tech stack information available.
                      </p>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">User Reviews</h3>
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">⭐</div>
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

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaArrowRight className="text-blue-600" /> Related Products
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    {relatedProjects.map((related) => (
                      <Link 
                        key={related.id}
                        to={`/products/${related.id}`}
                        className="bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl group-hover:scale-110 transition-transform">
                            <i className={`fas fa-${related.icon || 'cube'}`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {related.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{related.category}</span>
                              {related.is_upcoming && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Upcoming</span>
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
              {/* Quick Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Info</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium text-gray-900">{project.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${project.is_upcoming ? 'text-yellow-600' : 'text-green-600'}`}>
                      {project.is_upcoming ? 'Upcoming' : 'Active'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Priority</span>
                    <span className="font-medium text-gray-900">{project.priority || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Created</span>
                    <span className="font-medium text-gray-900">
                      {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service Area</span>
                    <span className="font-medium text-gray-900 text-right">{indianCities.length}+ Cities</span>
                  </div>
                </div>
              </div>

              {/* Rating Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">⭐</div>
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

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                <div className="text-3xl mb-3">🚀</div>
                <h4 className="text-lg font-bold mb-2">Ready to Get Started?</h4>
                <p className="text-blue-100 text-sm mb-4">
                  Schedule a personalized demo and see how this solution can transform your business.
                </p>
                <Link 
                  to="/contact"
                  className="block text-center bg-white text-blue-600 px-4 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Request Demo
                </Link>
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Share This Product</h4>
                <div className="flex gap-2">
                  <button className="flex-1 p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                    <FaLink />
                  </button>
                  <button className="flex-1 p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                    <FaTwitter />
                  </button>
                  <button className="flex-1 p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                    <FaLinkedin />
                  </button>
                  <button className="flex-1 p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                    <FaWhatsapp />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
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