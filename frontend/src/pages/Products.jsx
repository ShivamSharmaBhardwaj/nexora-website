import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { 
  FaSearch, FaFilter, FaTimes, FaArrowRight, FaStar, FaCode, 
  FaMobileAlt, FaCloud, FaShieldAlt, FaRocket, FaChartLine,
  FaUsers, FaBuilding, FaCheckCircle, FaSpinner, FaPlayCircle,
  FaThLarge, FaList, FaSort, FaSortUp, FaSortDown, FaEye,
  FaClock, FaTag, FaLayerGroup, FaCrown, FaAward, FaMedal,
  FaTrophy, FaGithub, FaExternalLinkAlt, FaHeart, FaBookmark,
  FaShare, FaDownload, FaCalendarAlt, FaArrowLeft, FaMapMarkerAlt,
  FaGlobe, FaMicrophone, FaHeadphones, FaQuestionCircle,
  FaComments, FaSearchLocation, FaMapPin, FaCity, FaFlag
} from 'react-icons/fa';

// ============================================
// LOADING SKELETON
// ============================================
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300"></div>
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="flex gap-3">
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

// ============================================
// CATEGORY FILTER COMPONENT
// ============================================
const CategoryFilter = ({ categories, selected, onSelect }) => {
  const categoryIcons = {
    'HRMS': <FaUsers />,
    'TODO': <FaCheckCircle />,
    'Estate': <FaBuilding />,
    'WhatsApp': <FaMobileAlt />,
    'All': <FaRocket />
  };

  return (
    <div className="flex flex-wrap gap-3" role="tablist">
      <button
        role="tab"
        aria-selected={selected === 'all'}
        onClick={() => onSelect('all')}
        className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
          selected === 'all' 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
        }`}
      >
        <span className="text-lg" aria-hidden="true">{categoryIcons['All']}</span>
        All Products
        {selected === 'all' && <FaCheckCircle className="text-white/70 text-sm" aria-hidden="true" />}
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          role="tab"
          aria-selected={selected === cat}
          onClick={() => onSelect(cat)}
          className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 border ${
            selected === cat 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 border-blue-600' 
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border-gray-200 hover:border-blue-300'
          }`}
        >
          <span className="text-lg" aria-hidden="true">{categoryIcons[cat] || <FaCode />}</span>
          {cat}
          {selected === cat && <FaCheckCircle className="text-white/70 text-sm" aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
};

// ============================================
// SORT OPTIONS
// ============================================
const SortOptions = ({ sortBy, sortOrder, onSort }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-500">Sort by:</span>
    <select
      value={sortBy}
      onChange={(e) => onSort(e.target.value, sortOrder)}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Sort products by"
    >
      <option value="created_at">Newest</option>
      <option value="title">Name</option>
      <option value="priority">Priority</option>
      <option value="category">Category</option>
    </select>
    <button
      onClick={() => onSort(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
      aria-label={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
    >
      {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
    </button>
  </div>
);

// ============================================
// PRODUCT CARD COMPONENT
// ============================================
const ProductCard = ({ project, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  
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

  const getCategoryDescription = (category) => {
    const descriptions = {
      'HRMS': 'Human Resource Management System',
      'TODO': 'Task Management & Productivity',
      'Estate': 'Property & Real Estate Management',
      'WhatsApp': 'WhatsApp Business Automation'
    };
    return descriptions[category] || 'Enterprise Solution';
  };

  return (
    <article 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className={`h-56 bg-gradient-to-r ${getCategoryColor(project.category)} relative overflow-hidden cursor-pointer`}
           onClick={() => onQuickView(project)}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/90 text-7xl transform group-hover:scale-110 transition-transform duration-500" aria-hidden="true">
            <i className={`fas fa-${project.icon || 'cube'}`}></i>
          </div>
        </div>

        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getCategoryBadgeColor(project.category)} backdrop-blur-sm bg-white/90 shadow-sm`}>
            {project.category}
          </span>
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {project.is_upcoming && (
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 backdrop-blur-sm shadow-sm animate-pulse">
              🚀 Upcoming
            </span>
          )}
          {project.is_featured && (
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-white backdrop-blur-sm shadow-sm">
              ⭐ Featured
            </span>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(project);
            }}
            className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-xl font-semibold text-blue-600 shadow-2xl transform hover:scale-105 transition-all duration-300"
            aria-label={`Quick view ${project.title}`}
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1" itemProp="name">
            {project.title}
          </h3>
          {project.priority > 5 && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
              High Priority
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2" itemProp="description">
          {project.short_desc || project.description?.substring(0, 100) || 'Enterprise-grade solution for modern businesses'}
        </p>

        <p className="text-xs text-blue-600 mt-1 font-medium">
          {getCategoryDescription(project.category)}
        </p>

        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tech_stack.slice(0, 3).map((tech, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 3 && (
              <span className="text-xs text-blue-600 font-medium">
                +{project.tech_stack.length - 3}
              </span>
            )}
          </div>
        )}

        {project.features && project.features.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.features.slice(0, 2).map((feature, idx) => (
              <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {feature}
              </span>
            ))}
            {project.features.length > 2 && (
              <span className="text-xs text-gray-400">
                +{project.features.length - 2} more
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link 
            to={`/products/${project.id}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm text-center shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
            aria-label={`View details of ${project.title}`}
          >
            View Details
          </Link>
          {project.demo_url && (
            <a 
              href={project.demo_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 text-sm text-center group"
              aria-label={`Live demo of ${project.title}`}
            >
              Live Demo <FaArrowRight className="inline ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FaClock aria-hidden="true" /> {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Recently'}
          </span>
          <span className="flex items-center gap-1">
            <FaTag aria-hidden="true" /> {project.category}
          </span>
        </div>

        <meta itemProp="areaServed" content="India, Worldwide" />
        <meta itemProp="availableIn" content="All Cities in India, Global" />
      </div>
    </article>
  );
};

// ============================================
// QUICK VIEW MODAL
// ============================================
const QuickViewModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close quick view"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.is_upcoming ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {project.is_upcoming ? '🚀 Upcoming' : '✅ Active'}
              </span>
              <p className="text-gray-600 mt-3">{project.description}</p>
            </div>
            
            {project.features && project.features.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.tech_stack && project.tech_stack.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technology Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <Link 
                to={`/products/${project.id}`}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition text-center"
              >
                View Full Details
              </Link>
              {project.demo_url && (
                <a 
                  href={project.demo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition text-center"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN PRODUCTS COMPONENT
// ============================================
const Products = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [quickViewProject, setQuickViewProject] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();
  
  // ✅ Get current URL for canonical
  const siteUrl = window.location.origin;

  // ✅ List of all major Indian cities for GEO targeting
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

  // ✅ List of countries for global targeting
  const globalCountries = [
    "USA", "UK", "Canada", "Australia", "UAE", "Singapore", 
    "Germany", "France", "Japan", "South Korea", "Netherlands", 
    "Sweden", "Norway", "Denmark", "Finland", "New Zealand", 
    "Ireland", "Malaysia", "Thailand", "Vietnam", "Indonesia", 
    "Philippines", "South Africa", "Kenya", "Nigeria", "Egypt", 
    "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`);
        
        let projectsData = [];
        if (Array.isArray(response.data)) {
          projectsData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          projectsData = response.data.data;
        } else if (response.data?.results && Array.isArray(response.data.results)) {
          projectsData = response.data.results;
        }
        
        setProjects(projectsData);
        
        const cats = [...new Set(projectsData.map(p => p.category).filter(Boolean))];
        setCategories(cats);
        
        if (category && cats.includes(category)) {
          setSelectedCategory(category);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [category]);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.short_desc?.toLowerCase().includes(term)
      );
    }
    
    if (sortBy) {
      filtered.sort((a, b) => {
        let aVal = a[sortBy] || '';
        let bVal = b[sortBy] || '';
        
        if (sortBy === 'created_at') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [projects, selectedCategory, searchTerm, sortBy, sortOrder]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/${cat.toLowerCase()}`);
    }
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const totalProducts = projects.length;
  const activeProducts = projects.filter(p => !p.is_upcoming).length;
  const upcomingProducts = projects.filter(p => p.is_upcoming).length;
  const featuredProducts = projects.filter(p => p.is_featured).length;

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO COMBINED */}
      {/* ========================================== */}
      <Helmet>
        {/* ===== SEO TAGS ===== */}
        <title>Krynova Technologies Products - Enterprise Software Solutions | Global & India</title>
        <meta name="description" content="Explore Krynova Technologies' enterprise software products including HRMS, Property Management, Task Management, and WhatsApp Automation. Best web development company in Agra, India. Serving businesses across all cities in India and worldwide. Global enterprise solutions." />
        <meta name="keywords" content="HRMS software India, property management system, task management software, WhatsApp automation bot, enterprise software products, web development company Agra, software solutions Uttar Pradesh, best software company India, Krynova Technologies products, business management software, global enterprise solutions, software for all cities India, worldwide software solutions" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* ✅ Canonical Tag */}
        <link rel="canonical" href={`${siteUrl}/products`} />
        
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
        <meta name="question" content="What enterprise software products does Krynova Technologies offer?" />
        <meta name="answer" content="Krynova Technologies offers HRMS System, Property Management System, Task Management System, and WhatsApp Automation bot for businesses worldwide." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="HRMS software, property management, WhatsApp automation, enterprise software, web development company, best software company India" />
        
        {/* ===== AEO - Rich Snippets ===== */}
        <meta name="rich-snippet" content="products" />
        <meta name="structured-data" content="true" />
        
        {/* ===== Open Graph - SEO + GEO ===== */}
        <meta property="og:title" content="Krynova Technologies Products - Enterprise Software Solutions | Global & India" />
        <meta property="og:description" content="Discover our range of enterprise software products including HRMS, Property Management, Task Management, and more. Serving businesses in all Indian cities and globally." />
        <meta property="og:url" content={`${siteUrl}/products`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Krynova Technologies Products - Enterprise Software Solutions" />
        <meta name="twitter:description" content="Enterprise software products for businesses worldwide. Based in India with global reach." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Krynova Technologies Products</h2>
        <p>Krynova Technologies offers enterprise software products including HRMS System for human resource management, Property Management System for real estate, Task Management System for productivity, and WhatsApp Automation bot for business communication. Serving businesses in Agra, Delhi, Mumbai, Bangalore, and all major cities in India, as well as global clients worldwide.</p>
        <ul>
          <li>HRMS Software - Complete human resource management</li>
          <li>Property Management System - Real estate management</li>
          <li>Task Management System - Productivity and project management</li>
          <li>WhatsApp Automation Bot - Business communication automation</li>
        </ul>
        <p>Available in all Indian cities and globally.</p>
      </div>

      {/* ========================================== */}
      {/* ✅ SCHEMA.ORG - SEO + AEO + GEO */}
      {/* ========================================== */}
      
      {/* 📦 Product Collection Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Krynova Technologies Products",
          "description": "Enterprise software products including HRMS, Property Management, Task Management, and WhatsApp Automation. Serving businesses in all Indian cities and globally.",
          "url": `${siteUrl}/products`,
          "provider": {
            "@type": "Organization",
            "name": "Krynova Technologies",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Agra",
              "addressRegion": "Uttar Pradesh",
              "addressCountry": "India"
            }
          },
          "audience": {
            "@type": "Audience",
            "name": "Businesses Worldwide",
            "geographicArea": {
              "@type": "AdministrativeArea",
              "name": `India, ${globalCountries.join(", ")}, Worldwide`
            }
          },
          "inLanguage": ["en", "hi", "bn", "te", "ta", "ur", "gu", "mr", "kn", "ml", "pa"],
          "isAccessibleForFree": true,
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
          "priceRange": "₹25,000 - ₹5,00,000",
          "openingHours": "Mo-Fr 09:00-18:00",
          "areaServed": indianCities,
          "availableLanguage": ["English", "Hindi", "Bengali", "Telugu", "Tamil", "Urdu", "Gujarati", "Marathi", "Kannada", "Malayalam", "Punjabi"],
          "slogan": "Global Enterprise Solutions from India",
          "globalLocationNumber": "IN-UP-AGRA",
          "founder": {
            "@type": "Person",
            "name": "Shivam Sharma"
          },
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
              "name": "What enterprise software products does Krynova Technologies offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies offers HRMS System for human resource management, Property Management System for real estate, Task Management System for productivity, and WhatsApp Automation bot for business communication. Serving clients globally."
              }
            },
            {
              "@type": "Question",
              "name": "Where is Krynova Technologies located and where do you serve?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `Krynova Technologies is based in Agra, Uttar Pradesh, India. We serve clients across all major cities in India including ${indianCities.slice(0, 10).join(", ")} and many more, as well as international clients in ${globalCountries.slice(0, 10).join(", ")} and worldwide.`
              }
            },
            {
              "@type": "Question",
              "name": "What is the best web development company in India with global presence?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies is recognized as one of the best web development companies in India with global reach. With over 8 years of experience and 50+ successful enterprise systems delivered to clients worldwide, we provide custom solutions that scale globally."
              }
            },
            {
              "@type": "Question",
              "name": "Do you serve international clients?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `Yes! Krynova Technologies serves clients globally including ${globalCountries.join(", ")} and many other countries. We provide remote development and support services worldwide.`
              }
            },
            {
              "@type": "Question",
              "name": "What services do you offer for businesses in different cities?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `We offer custom web development, HRMS software, property management systems, WhatsApp automation, and enterprise solutions for businesses in ${indianCities.slice(0, 15).join(", ")}, and all other major cities in India, as well as international clients worldwide.`
              }
            },
            {
              "@type": "Question",
              "name": "What makes Krynova Technologies the best choice for enterprise software?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies combines 8+ years of experience, 50+ enterprise systems built, 100% client satisfaction, and global reach. We provide custom solutions, 24/7 support, and enterprise-grade security for businesses of all sizes."
              }
            },
            {
              "@type": "Question",
              "name": "What is the cost of enterprise software development?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Enterprise software development costs vary based on requirements. Krynova Technologies offers flexible pricing starting from ₹25,000 for basic solutions to custom quotes for complex enterprise systems. We provide free consultation to discuss your specific needs."
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-200">
              <FaRocket className="text-blue-600" aria-hidden="true" />
              Enterprise Solutions - Global & Local
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Products</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our comprehensive suite of business solutions designed to transform your organization
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                <FaMapPin className="text-blue-500" /> {indianCities.length}+ Indian Cities
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                <FaGlobe className="text-green-500" /> {globalCountries.length}+ Countries
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                <FaMicrophone className="text-purple-500" /> Voice Search Ready
              </span>
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                <FaComments className="text-orange-500" /> FAQ Optimized
              </span>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              <FaMapMarkerAlt className="inline mr-1" aria-hidden="true" />
              Serving businesses in Agra, Delhi, Mumbai, Bangalore, and across India & Worldwide
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition">
              <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
              <div className="text-sm text-gray-500">Total Products</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition">
              <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
              <div className="text-sm text-gray-500">Active Solutions</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition">
              <div className="text-2xl font-bold text-yellow-600">{upcomingProducts}</div>
              <div className="text-sm text-gray-500">Upcoming</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition">
              <div className="text-2xl font-bold text-purple-600">{featuredProducts}</div>
              <div className="text-sm text-gray-500">Featured</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search products by name, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  aria-label="Search products"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl border transition ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                  aria-label="Grid view"
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl border transition ${
                    viewMode === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                  aria-label="List view"
                >
                  <FaList />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition flex items-center gap-2 justify-center"
                aria-expanded={showFilters}
              >
                <FaFilter aria-hidden="true" /> Categories
              </button>
            </div>

            <div className={`mt-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={handleCategoryChange}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <SortOptions
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <p className="text-sm text-gray-500">
                Showing {filteredProjects.length} of {projects.length} products
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-1'} gap-6`}>
              {[...Array(6)].map((_, idx) => (
                <ProductSkeleton key={idx} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-5xl mb-4 animate-bounce">⚠️</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition"
              >
                Try Again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4 animate-pulse">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No Products Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? `No products match "${searchTerm}"` 
                  : 'No products available in this category'}
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-blue-600 font-medium hover:text-blue-800 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-1'} gap-6`}>
              {filteredProjects.map(project => (
                <ProductCard 
                  key={project.id} 
                  project={project} 
                  onQuickView={setQuickViewProject}
                />
              ))}
            </div>
          )}

          {/* Call to Action - Global & Local */}
          {!loading && projects.length > 0 && (
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Need a Custom Solution?</h2>
                <p className="text-blue-100 mb-6 text-lg">
                  We develop tailored systems for your specific business requirements. Serving clients in Agra, Delhi, Mumbai, Bangalore, across India, and worldwide.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                    <FaMapPin /> {indianCities.length}+ Indian Cities
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                    <FaGlobe /> {globalCountries.length}+ Countries
                  </span>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Contact Us <FaArrowRight aria-hidden="true" />
                </Link>
                <p className="text-blue-200 text-sm mt-4">
                  <FaMapMarkerAlt className="inline mr-1" aria-hidden="true" />
                  Based in Agra, Uttar Pradesh, India • Serving Global Clients
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick View Modal */}
        {quickViewProject && (
          <QuickViewModal
            project={quickViewProject}
            onClose={() => setQuickViewProject(null)}
          />
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in { animation: fadeIn 0.3s ease-out; }
          .animate-scale-in { animation: scaleIn 0.3s ease-out; }
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
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

export default Products;