import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../utils/api';
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
  FaComments, FaSearchLocation, FaMapPin, FaCity, FaFlag,
  FaPalette, FaBorderAll
} from 'react-icons/fa';

// ============================================
// IMPORT IMAGES - VITE WAY
// ============================================
import hrmsImage from '/products/hrms-software.png';
import propertyImage from '/products/property-management.png';
import taskImage from '/products/task-management.png';
import whatsappImage from '/products/whatsapp-bot.png';

// ============================================
// STATIC PRODUCTS DATA WITH IMAGES
// ============================================
const STATIC_PRODUCTS = [
  {
    id: 1,
    title: 'Enterprise HRMS',
    category: 'HRMS',
    image: hrmsImage,
    description: 'Complete Human Resource Management System with payroll, attendance, leaves, performance tracking, and employee self-service portal.',
    short_desc: 'Complete HR management system for modern enterprises.',
    features: ['Payroll Management', 'Attendance Tracking', 'Leave Management', 'Performance Reviews', 'Employee Portal', 'Reports & Analytics'],
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
    is_featured: true,
    is_upcoming: false,
    priority: 10,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Property Management System',
    category: 'Estate',
    image: propertyImage,
    description: 'Advanced property management system for real estate businesses with tenant management, rent collection, maintenance tracking, and financial reporting.',
    short_desc: 'Advanced property management for real estate.',
    features: ['Tenant Management', 'Rent Collection', 'Maintenance Tracking', 'Financial Reports', 'Document Management', 'Communication Portal'],
    tech_stack: ['React', 'Django', 'PostgreSQL', 'AWS'],
    is_featured: true,
    is_upcoming: false,
    priority: 9,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Task Management System',
    category: 'TODO',
    image: taskImage,
    description: 'Comprehensive task and project management system with team collaboration, deadline tracking, priority management, and productivity analytics.',
    short_desc: 'Productivity and project management tool.',
    features: ['Task Creation', 'Team Collaboration', 'Deadline Tracking', 'Priority Management', 'Progress Reports', 'Mobile App'],
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    is_featured: false,
    is_upcoming: false,
    priority: 7,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'WhatsApp Business Bot',
    category: 'WhatsApp',
    image: whatsappImage,
    description: 'AI-powered WhatsApp automation bot for lead generation, customer support, order management, and automated marketing campaigns.',
    short_desc: 'AI-powered WhatsApp automation for business.',
    features: ['Lead Generation', 'Auto-replies', 'Order Management', 'Marketing Campaigns', 'Analytics Dashboard', 'Multi-agent Support'],
    tech_stack: ['Node.js', 'WhatsApp Business API', 'MongoDB', 'Redis'],
    is_featured: true,
    is_upcoming: false,
    priority: 8,
    created_at: new Date().toISOString()
  }
];

// ============================================
// LOADING SKELETON - Neumorphic Style
// ============================================
const ProductSkeleton = () => (
  <div className="neumorphic-card rounded-2xl overflow-hidden animate-pulse">
    <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-2xl"></div>
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
// CATEGORY FILTER - Neumorphic + Liquid Glass
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
        className={`group px-6 py-3 rounded-2xl font-medium transition-all duration-500 flex items-center gap-2 relative ${
          selected === 'all' 
            ? 'liquid-glass-active text-white shadow-2xl' 
            : 'neumorphic-btn text-gray-700 hover:text-blue-600'
        }`}
      >
        <span className="text-lg" aria-hidden="true">{categoryIcons['All']}</span>
        All Products
        {selected === 'all' && (
          <>
            <FaCheckCircle className="text-white/70 text-sm" aria-hidden="true" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 animate-pulse"></div>
          </>
        )}
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          role="tab"
          aria-selected={selected === cat}
          onClick={() => onSelect(cat)}
          className={`group px-6 py-3 rounded-2xl font-medium transition-all duration-500 flex items-center gap-2 relative ${
            selected === cat 
              ? 'liquid-glass-active text-white shadow-2xl' 
              : 'neumorphic-btn text-gray-700 hover:text-blue-600'
          }`}
        >
          <span className="text-lg" aria-hidden="true">{categoryIcons[cat] || <FaCode />}</span>
          {cat}
          {selected === cat && (
            <>
              <FaCheckCircle className="text-white/70 text-sm" aria-hidden="true" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 animate-pulse"></div>
            </>
          )}
        </button>
      ))}
    </div>
  );
};

// ============================================
// SORT OPTIONS - Neumorphic
// ============================================
const SortOptions = ({ sortBy, sortOrder, onSort }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-600">Sort by:</span>
    <div className="neumorphic-select">
      <select
        value={sortBy}
        onChange={(e) => onSort(e.target.value, sortOrder)}
        className="px-4 py-2.5 rounded-xl text-sm bg-transparent focus:outline-none cursor-pointer"
        aria-label="Sort products by"
      >
        <option value="created_at">Newest</option>
        <option value="title">Name</option>
        <option value="priority">Priority</option>
        <option value="category">Category</option>
      </select>
    </div>
    <button
      onClick={() => onSort(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
      className="neumorphic-icon-btn p-3 rounded-xl transition-all duration-300"
      aria-label={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
    >
      {sortOrder === 'asc' ? <FaSortUp className="text-blue-600" /> : <FaSortDown className="text-blue-600" />}
    </button>
  </div>
);

// ============================================
// PRODUCT CARD - With Image Support
// ============================================
const ProductCard = ({ project, onQuickView, layout = 'bento' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Debug log
  console.log('🖼️ Rendering product:', project.title, 'Image:', project.image);
  
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

  const bentoClasses = {
    'large': 'md:col-span-2 md:row-span-2',
    'medium': 'md:col-span-1 md:row-span-1',
    'small': 'md:col-span-1 md:row-span-1',
    'wide': 'md:col-span-2 md:row-span-1'
  };

  const getBentoSize = (index) => {
    const sizes = ['large', 'medium', 'medium', 'wide', 'small', 'medium', 'large', 'medium'];
    return sizes[index % sizes.length];
  };

  const bentoSize = layout === 'bento' ? getBentoSize(project.id || 0) : 'medium';

  return (
    <article 
      className={`bento-card group relative transition-all duration-500 ${
        layout === 'bento' ? bentoClasses[bentoSize] : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="neumorphic-card rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Image Header with Fallback */}
        <div className={`h-56 ${project.image && !imageError ? '' : `bg-gradient-to-r ${getCategoryColor(project.category)}`} relative overflow-hidden cursor-pointer flex-shrink-0`}
             onClick={() => onQuickView(project)}>
          
          {/* Product Image */}
          {project.image && !imageError ? (
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                console.error('❌ Image failed to load:', project.image);
                setImageError(true);
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/90 text-7xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" aria-hidden="true">
                <FaCode />
              </div>
            </div>
          )}
          
          {/* Liquid Glass Effect Overlay */}
          <div className="absolute inset-0 liquid-glass-overlay"></div>
          
          {/* Animated Liquid Glass */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="liquid-glass-shimmer"></div>
            <div className="liquid-glass-bubble bubble-1"></div>
            <div className="liquid-glass-bubble bubble-2"></div>
            <div className="liquid-glass-bubble bubble-3"></div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${getCategoryBadgeColor(project.category)} backdrop-blur-sm shadow-lg border border-white/30`}>
              {project.category}
            </span>
          </div>

          {/* Featured/Upcoming Badges */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {project.is_upcoming && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 backdrop-blur-sm shadow-lg animate-pulse border border-white/30">
                🚀 Upcoming
              </span>
            )}
            {project.is_featured && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-white backdrop-blur-sm shadow-lg border border-white/30">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(project);
              }}
              className="px-6 py-3 bg-white/90 backdrop-blur-xl rounded-xl font-semibold text-blue-600 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/50"
              aria-label={`Quick view ${project.title}`}
            >
              <FaEye className="inline mr-2" /> Quick View
            </button>
          </div>
        </div>

        {/* Content - Neumorphic Style */}
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1" itemProp="name">
              {project.title}
            </h3>
            {project.priority > 5 && (
              <span className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-full font-medium shadow-lg">
                High Priority
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 flex-grow" itemProp="description">
            {project.short_desc || project.description?.substring(0, 100) || 'Enterprise-grade solution for modern businesses'}
          </p>

          <p className="text-xs text-blue-600 mt-1 font-medium">
            {getCategoryDescription(project.category)}
          </p>

          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 3).map((tech, idx) => (
                <span key={idx} className="text-xs neumorphic-tag px-2.5 py-1 rounded-full text-gray-700">
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 3 && (
                <span className="text-xs text-blue-600 font-medium neumorphic-tag px-2.5 py-1 rounded-full">
                  +{project.tech_stack.length - 3}
                </span>
              )}
            </div>
          )}

          {project.features && project.features.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.features.slice(0, 2).map((feature, idx) => (
                <span key={idx} className="text-xs liquid-glass-tag px-2.5 py-1 rounded-full text-blue-600">
                  {feature}
                </span>
              ))}
              {project.features.length > 2 && (
                <span className="text-xs text-gray-400 neumorphic-tag px-2.5 py-1 rounded-full">
                  +{project.features.length - 2} more
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link 
              to={`/products/${project.id}`}
              className="flex-1 neumorphic-btn-primary px-4 py-2.5 rounded-xl font-medium text-sm text-center shadow-lg"
              aria-label={`View details of ${project.title}`}
            >
              View Details
            </Link>
            {project.demo_url && (
              <a 
                href={project.demo_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 neumorphic-btn-secondary px-4 py-2.5 rounded-xl font-medium text-sm text-center group border-2 border-blue-600"
                aria-label={`Live demo of ${project.title}`}
              >
                Live Demo <FaArrowRight className="inline ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1 neumorphic-tag px-2 py-1 rounded-lg">
              <FaClock aria-hidden="true" /> {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Recently'}
            </span>
            <span className="flex items-center gap-1 neumorphic-tag px-2 py-1 rounded-lg">
              <FaTag aria-hidden="true" /> {project.category}
            </span>
          </div>

          <meta itemProp="areaServed" content="India, Worldwide" />
          <meta itemProp="availableIn" content="All Cities in India, Global" />
        </div>
      </div>
    </article>
  );
};

// ============================================
// QUICK VIEW MODAL - With Image
// ============================================
const QuickViewModal = ({ project, onClose }) => {
  const [imageError, setImageError] = useState(false);
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 liquid-glass-backdrop animate-fade-in" role="dialog" aria-modal="true">
      <div className="liquid-glass-modal rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in border border-white/30">
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-white/20 flex items-center justify-between backdrop-blur-xl bg-white/40">
          <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
          <button
            onClick={onClose}
            className="neumorphic-icon-btn p-2 rounded-xl transition"
            aria-label="Close quick view"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Product Image in Modal */}
            {project.image && !imageError ? (
              <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-full h-48 md:h-64 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <FaCode className="text-6xl text-white/50" />
              </div>
            )}
            
            <div>
              <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${project.is_upcoming ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'} border border-white/30 shadow-lg`}>
                {project.is_upcoming ? '🚀 Upcoming' : '✅ Active'}
              </span>
              <p className="text-gray-700 mt-3 leading-relaxed">{project.description}</p>
            </div>
            
            {project.features && project.features.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature, idx) => (
                    <span key={idx} className="liquid-glass-tag px-3 py-1.5 rounded-xl text-sm text-blue-600">
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
                    <span key={idx} className="neumorphic-tag px-3 py-1.5 rounded-xl text-sm text-gray-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <Link 
                to={`/products/${project.id}`}
                className="flex-1 neumorphic-btn-primary px-6 py-3 rounded-xl font-medium text-center"
              >
                View Full Details
              </Link>
              {project.demo_url && (
                <a 
                  href={project.demo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 neumorphic-btn-secondary px-6 py-3 rounded-xl font-medium text-center border-2 border-blue-600"
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
  const [viewMode, setViewMode] = useState('bento');
  const [quickViewProject, setQuickViewProject] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();
  
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
  // ✅ FIX: USE STATIC DATA FOR IMAGES
  // ============================================
  useEffect(() => {
    // Always use static data so images work
    console.log('📦 Loading products with images...');
    setProjects(STATIC_PRODUCTS);
    const cats = [...new Set(STATIC_PRODUCTS.map(p => p.category).filter(Boolean))];
    setCategories(cats);
    setLoading(false);
  }, []);

  // ============================================
  // FILTERED PRODUCTS
  // ============================================
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
      {/* HELMET - SEO + AEO + GEO COMBINED */}
      {/* ========================================== */}
      <Helmet>
        <title>Krynova Technologies Products - Enterprise Software Solutions | Global & India</title>
        <meta name="description" content="Explore Krynova Technologies' enterprise software products including HRMS, Property Management, Task Management, and WhatsApp Automation. Best web development company in Agra, India. Serving businesses across all cities in India and worldwide. Global enterprise solutions." />
        <meta name="keywords" content="HRMS software India, property management system, task management software, WhatsApp automation bot, enterprise software products, web development company Agra, software solutions Uttar Pradesh, best software company India, Krynova Technologies products, business management software, global enterprise solutions, software for all cities India, worldwide software solutions" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        <link rel="canonical" href={`${siteUrl}/products`} />
        
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
        <meta name="question" content="What enterprise software products does Krynova Technologies offer?" />
        <meta name="answer" content="Krynova Technologies offers HRMS System, Property Management System, Task Management System, and WhatsApp Automation bot for businesses worldwide." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="HRMS software, property management, WhatsApp automation, enterprise software, web development company, best software company India" />
        <meta name="rich-snippet" content="products" />
        <meta name="structured-data" content="true" />
        
        <meta property="og:title" content="Krynova Technologies Products - Enterprise Software Solutions | Global & India" />
        <meta property="og:description" content="Discover our range of enterprise software products including HRMS, Property Management, Task Management, and more. Serving businesses in all Indian cities and globally." />
        <meta property="og:url" content={`${siteUrl}/products`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Krynova Technologies Products - Enterprise Software Solutions" />
        <meta name="twitter:description" content="Enterprise software products for businesses worldwide. Based in India with global reach." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

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

      {/* Schema markup */}
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

      {/* ========================================== */}
      {/* MAIN CONTENT - Neumorphism + Liquid Glass + Bento Grid */}
      {/* ========================================== */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 relative overflow-hidden">
        {/* Liquid Glass Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-5"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Header - Neumorphic */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 neumorphic-badge px-6 py-3 rounded-2xl text-sm font-medium mb-4">
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
              <span className="inline-flex items-center gap-1 liquid-glass-tag px-3 py-1.5 rounded-full text-xs">
                <FaMapPin className="text-blue-500" /> {indianCities.length}+ Indian Cities
              </span>
              <span className="inline-flex items-center gap-1 liquid-glass-tag px-3 py-1.5 rounded-full text-xs">
                <FaGlobe className="text-green-500" /> {globalCountries.length}+ Countries
              </span>
              <span className="inline-flex items-center gap-1 liquid-glass-tag px-3 py-1.5 rounded-full text-xs">
                <FaMicrophone className="text-purple-500" /> Voice Search Ready
              </span>
              <span className="inline-flex items-center gap-1 liquid-glass-tag px-3 py-1.5 rounded-full text-xs">
                <FaComments className="text-orange-500" /> FAQ Optimized
              </span>
            </div>
            <p className="text-sm text-blue-600 mt-2 neumorphic-tag px-4 py-1.5 rounded-full inline-block">
              <FaMapMarkerAlt className="inline mr-1" aria-hidden="true" />
              Serving businesses in Agra, Delhi, Mumbai, Bangalore, and across India & Worldwide
            </p>
          </div>

          {/* Stats - Neumorphic Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="neumorphic-card-stats p-4 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-600">{totalProducts}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="neumorphic-card-stats p-4 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-green-600">{activeProducts}</div>
              <div className="text-sm text-gray-600">Active Solutions</div>
            </div>
            <div className="neumorphic-card-stats p-4 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-yellow-600">{upcomingProducts}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="neumorphic-card-stats p-4 text-center hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-purple-600">{featuredProducts}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
          </div>

          {/* Search and Filter - Liquid Glass */}
          <div className="liquid-glass-container rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search products by name, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 neumorphic-input rounded-xl focus:outline-none transition"
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
                  onClick={() => setViewMode('bento')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'bento' 
                      ? 'neumorphic-btn-active text-blue-600' 
                      : 'neumorphic-icon-btn text-gray-600'
                  }`}
                  aria-label="Bento grid view"
                >
                  <FaBorderAll />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'neumorphic-btn-active text-blue-600' 
                      : 'neumorphic-icon-btn text-gray-600'
                  }`}
                  aria-label="Grid view"
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'neumorphic-btn-active text-blue-600' 
                      : 'neumorphic-icon-btn text-gray-600'
                  }`}
                  aria-label="List view"
                >
                  <FaList />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden neumorphic-btn px-6 py-3 rounded-xl font-medium flex items-center gap-2 justify-center"
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

            <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
              <SortOptions
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <p className="text-sm text-gray-600 neumorphic-tag px-3 py-1.5 rounded-full">
                Showing {filteredProjects.length} of {projects.length} products
              </p>
            </div>
          </div>

          {/* Products Grid - Bento + Neumorphism */}
          {loading ? (
            <div className={`grid ${viewMode === 'bento' ? 'md:grid-cols-3' : viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-1'} gap-6 auto-rows-auto`}>
              {[...Array(6)].map((_, idx) => (
                <ProductSkeleton key={idx} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 neumorphic-card rounded-2xl p-12">
              <div className="text-5xl mb-4 animate-bounce">⚠️</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="neumorphic-btn-primary px-8 py-3 rounded-xl font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 neumorphic-card rounded-2xl p-12">
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
            <div className={`grid ${viewMode === 'bento' ? 'md:grid-cols-3' : viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-1'} gap-6 auto-rows-auto`}>
              {filteredProjects.map((project, index) => (
                <ProductCard 
                  key={project.id} 
                  project={project} 
                  onQuickView={setQuickViewProject}
                  layout={viewMode}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Call to Action - Liquid Glass */}
          {!loading && projects.length > 0 && (
            <div className="mt-16 liquid-glass-cta rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Need a Custom Solution?</h2>
                <p className="text-blue-100 mb-6 text-lg">
                  We develop tailored systems for your specific business requirements. Serving clients in Agra, Delhi, Mumbai, Bangalore, across India, and worldwide.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full text-xs backdrop-blur-sm border border-white/30">
                    <FaMapPin /> {indianCities.length}+ Indian Cities
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full text-xs backdrop-blur-sm border border-white/30">
                    <FaGlobe /> {globalCountries.length}+ Countries
                  </span>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 neumorphic-btn-cta px-8 py-3.5 rounded-xl font-semibold shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300"
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
          /* NEUMORPHISM STYLES */
          .neumorphic-card {
            background: #e8edf2;
            box-shadow: 20px 20px 60px #c5cace, -20px -20px 60px #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-card:hover {
            box-shadow: 25px 25px 70px #c5cace, -25px -25px 70px #ffffff;
            transform: translateY(-2px);
          }
          
          .neumorphic-btn {
            background: #e8edf2;
            box-shadow: 8px 8px 16px #c5cace, -8px -8px 16px #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-btn:hover {
            box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
            transform: scale(0.98);
          }
          
          .neumorphic-btn-active {
            background: #e8edf2;
            box-shadow: inset 8px 8px 16px #c5cace, inset -8px -8px 16px #ffffff;
            color: #2563eb;
          }
          
          .neumorphic-btn-primary {
            background: linear-gradient(145deg, #2563eb, #1d4ed8);
            box-shadow: 8px 8px 16px #c5cace, -8px -8px 16px #ffffff, inset 0 2px 4px rgba(255,255,255,0.2);
            color: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 12px 12px 24px #c5cace, -12px -12px 24px #ffffff, inset 0 2px 4px rgba(255,255,255,0.2);
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
          
          .neumorphic-icon-btn {
            background: #e8edf2;
            box-shadow: 4px 4px 8px #c5cace, -4px -4px 8px #ffffff;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-icon-btn:hover {
            box-shadow: 2px 2px 4px #c5cace, -2px -2px 4px #ffffff;
            transform: scale(0.95);
          }
          
          .neumorphic-select {
            background: #e8edf2;
            box-shadow: inset 4px 4px 8px #c5cace, inset -4px -4px 8px #ffffff;
            border-radius: 0.75rem;
            padding: 0.25rem;
          }
          .neumorphic-select select {
            background: transparent;
            border: none;
            outline: none;
            padding: 0.5rem 1rem;
          }
          
          .neumorphic-input {
            background: #e8edf2;
            box-shadow: inset 6px 6px 12px #c5cace, inset -6px -6px 12px #ffffff;
            border: none;
            color: #1a1a2e;
          }
          .neumorphic-input:focus {
            box-shadow: inset 8px 8px 16px #c5cace, inset -8px -8px 16px #ffffff;
          }
          
          .neumorphic-tag {
            background: #e8edf2;
            box-shadow: 2px 2px 4px #c5cace, -2px -2px 4px #ffffff;
          }
          
          .neumorphic-card-stats {
            background: #e8edf2;
            box-shadow: 10px 10px 20px #c5cace, -10px -10px 20px #ffffff;
            border-radius: 1rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-card-stats:hover {
            box-shadow: 14px 14px 28px #c5cace, -14px -14px 28px #ffffff;
            transform: scale(1.02);
          }
          
          .neumorphic-badge {
            background: #e8edf2;
            box-shadow: 6px 6px 12px #c5cace, -6px -6px 12px #ffffff;
          }
          
          .neumorphic-btn-cta {
            background: white;
            color: #2563eb;
            box-shadow: 10px 10px 20px rgba(0,0,0,0.1), -10px -10px 20px rgba(255,255,255,0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .neumorphic-btn-cta:hover {
            box-shadow: 15px 15px 30px rgba(0,0,0,0.15), -15px -15px 30px rgba(255,255,255,0.15);
            transform: translateY(-3px);
          }

          /* LIQUID GLASS STYLES */
          .liquid-glass-container {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5);
          }
          
          .liquid-glass-active {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(99, 102, 241, 0.3));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 8px 32px rgba(37, 99, 235, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6);
          }
          
          .liquid-glass-modal {
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6);
          }
          
          .liquid-glass-backdrop {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          
          .liquid-glass-tag {
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          
          .liquid-glass-cta {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.4), rgba(99, 102, 241, 0.4));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(37, 99, 235, 0.2);
          }
          
          .liquid-glass-overlay {
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%);
            pointer-events: none;
          }
          
          .liquid-glass-shimmer {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%, transparent 100%);
            animation: shimmer 8s infinite linear;
          }
          
          .liquid-glass-bubble {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(255,255,255,0));
            animation: bubbleFloat 10s infinite ease-in-out;
          }
          
          .bubble-1 { width: 120px; height: 120px; top: -30px; right: -30px; animation-delay: 0s; }
          .bubble-2 { width: 80px; height: 80px; bottom: -20px; left: -20px; animation-delay: 2s; }
          .bubble-3 { width: 60px; height: 60px; top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 4s; }
          
          @keyframes shimmer { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes bubbleFloat { 0%, 100% { transform: translate(0,0) scale(1); } 25% { transform: translate(20px,-20px) scale(1.1); } 50% { transform: translate(-10px,30px) scale(0.9); } 75% { transform: translate(30px,10px) scale(1.05); } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
          @keyframes floatDelayed { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-25px); } }
          
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delayed { animation: floatDelayed 7s ease-in-out infinite 1s; }
          
          .bento-card { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
          .bento-card:hover { transform: translateY(-4px); z-index: 10; }
          
          .bg-grid-pattern {
            background-image: linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
            background-size: 50px 50px;
          }
          
          .animate-fade-in { animation: fadeIn 0.4s ease-out; }
          .animate-scale-in { animation: scaleIn 0.4s ease-out; }
          
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          
          .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
          .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0; }
        `}} />
      </div>
    </>
  );
};

export default Products;