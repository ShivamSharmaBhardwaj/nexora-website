import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaArrowRight, 
  FaStar, 
  FaCode, 
  FaMobileAlt,
  FaCloud,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaUsers,
  FaBuilding,
  FaCheckCircle,
  FaSpinner,
  FaPlayCircle
} from 'react-icons/fa';

// Loading Skeleton Component
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-56 bg-gray-200"></div>
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

// Category Filter Component
const CategoryFilter = ({ categories, selected, onSelect }) => {
  const categoryIcons = {
    'HRMS': <FaUsers />,
    'TODO': <FaCheckCircle />,
    'Estate': <FaBuilding />,
    'WhatsApp': <FaMobileAlt />,
    'All': <FaRocket />
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelect('all')}
        className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
          selected === 'all' 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
        }`}
      >
        <span className="text-lg">{categoryIcons['All']}</span>
        All Products
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
            selected === cat 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
          }`}
        >
          <span className="text-lg">{categoryIcons[cat] || <FaCode />}</span>
          {cat}
        </button>
      ))}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ project }) => {
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

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header with Gradient */}
      <div className={`h-56 bg-gradient-to-r ${getCategoryColor(project.category)} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/90 text-7xl transform group-hover:scale-110 transition-transform duration-500">
            <i className={`fas fa-${project.icon || 'cube'}`}></i>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getCategoryBadgeColor(project.category)} backdrop-blur-sm bg-white/90`}>
            {project.category}
          </span>
        </div>

        {/* Status Badge */}
        {project.is_upcoming && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-400 text-yellow-900 backdrop-blur-sm">
              🚀 Upcoming
            </span>
          </div>
        )}

        {/* Play Button Overlay */}
        {project.video_url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 text-3xl transform hover:scale-110 transition-all duration-300 shadow-2xl">
              <FaPlayCircle />
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {project.short_desc || project.description?.substring(0, 100) || 'Enterprise-grade solution for modern businesses'}
        </p>

        {/* Features Preview */}
        {project.features && project.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {feature}
              </span>
            ))}
            {project.features.length > 3 && (
              <span className="text-xs text-blue-600 font-medium">
                +{project.features.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link 
            to={`/products/${project.id}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm text-center shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
          >
            View Details
          </Link>
          {project.demo_url && (
            <a 
              href={project.demo_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 text-sm text-center group"
            >
              Live Demo <FaArrowRight className="inline ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`);
        setProjects(response.data);
        
        // Extract unique categories
        const cats = [...new Set(response.data.map(p => p.category).filter(Boolean))];
        setCategories(cats);
        
        // Set selected category from URL param
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

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.short_desc?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [projects, selectedCategory, searchTerm]);

  // Handle category change
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/${cat.toLowerCase()}`);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Stats
  const totalProducts = projects.length;
  const activeProducts = projects.filter(p => !p.is_upcoming).length;
  const upcomingProducts = projects.filter(p => p.is_upcoming).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaRocket className="text-blue-600" />
            Enterprise Solutions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Products</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our comprehensive suite of business solutions designed to transform your organization
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
            <div className="text-sm text-gray-500">Total Products</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            <div className="text-sm text-gray-500">Active Solutions</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{upcomingProducts}</div>
            <div className="text-sm text-gray-500">Upcoming</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition flex items-center gap-2 justify-center"
            >
              <FaFilter /> Categories
            </button>
          </div>

          {/* Category Filters */}
          <div className={`mt-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={handleCategoryChange}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProjects.length}</span> of <span className="font-semibold text-gray-900">{projects.length}</span> products
          </p>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => handleCategoryChange('all')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
            >
              <FaTimes className="text-xs" /> Clear Filter
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProductCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        {!loading && projects.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-3">Need a Custom Solution?</h2>
              <p className="text-blue-100 mb-6">
                We develop tailored systems for your specific business requirements. Let's discuss your project.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
              >
                Contact Us <FaArrowRight />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;