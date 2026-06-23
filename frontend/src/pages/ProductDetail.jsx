import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  FaArrowRight  // <-- Added this import
} from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch by ID first
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
        setProject(response.data);
        
        // Fetch related projects from same category
        if (response.data.category) {
          try {
            const relatedRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/projects/category/${response.data.category}`
            );
            // Filter out current project and limit to 3
            const related = relatedRes.data.filter(p => p.id !== response.data.id).slice(0, 3);
            setRelatedProjects(related);
          } catch (err) {
            // Related projects are optional, don't fail if they don't load
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
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-5xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Product not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for might have been moved or doesn't exist.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/25"
              >
                <FaArrowLeft /> Browse All Products
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'HRMS': <FaUsers />,
      'TODO': <FaCheckCircle />,
      'Estate': <FaBuilding />,
      'WhatsApp': <FaMobileAlt />
    };
    return icons[category] || <FaCode />;
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'HRMS': 'from-blue-500 to-blue-700',
      'TODO': 'from-green-500 to-emerald-700',
      'Estate': 'from-purple-500 to-indigo-700',
      'WhatsApp': 'from-teal-500 to-cyan-700'
    };
    return colors[category] || 'from-gray-500 to-gray-700';
  };

  // Features array (already parsed by backend)
  const features = project.features || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header with Gradient */}
          <div className={`bg-gradient-to-r ${getCategoryColor(project.category)} text-white p-8 relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="text-5xl bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <i className={`fas fa-${project.icon || 'cube'}`}></i>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                      {getCategoryIcon(project.category)}
                      {project.category}
                    </span>
                    {project.is_upcoming && (
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaRocket /> Upcoming
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mt-2">{project.title}</h1>
                </div>
              </div>
              <p className="text-blue-100 text-lg max-w-3xl">{project.description}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Video & Demo Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Video */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <FaVideo className="text-blue-600" /> Product Demo
                </h3>
                {project.video_url ? (
                  <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                    {showVideo ? (
                      <iframe 
                        src={project.video_url} 
                        className="w-full h-full"
                        allowFullScreen
                        title="Product Demo Video"
                      ></iframe>
                    ) : (
                      <div 
                        className="w-full h-full flex flex-col items-center justify-center text-white cursor-pointer group"
                        onClick={() => setShowVideo(true)}
                      >
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
                          <FaPlay className="text-4xl group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-sm opacity-70 mt-4">Click to play demo video</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <FaVideo className="text-4xl mx-auto mb-2 opacity-50" />
                      <p>No video available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Demo & Features */}
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                    <FaExternalLinkAlt className="text-blue-600" /> Live Demo
                  </h3>
                  {project.demo_url ? (
                    <a 
                      href={project.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
                    >
                      Launch Demo <FaExternalLinkAlt className="text-sm" />
                    </a>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
                      <p>Demo coming soon</p>
                      <p className="text-sm mt-1">Check back later for a live demo</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Key Features</h3>
                  {features.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                          <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center">
                      No features listed
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Related Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedProjects.map((related) => (
                    <Link 
                      key={related.id}
                      to={`/products/${related.id}`}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50 transition-all duration-300 group border border-transparent hover:border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl text-blue-600">
                          <i className={`fas fa-${related.icon || 'cube'}`}></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {related.title}
                          </h4>
                          <p className="text-xs text-gray-500">{related.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Request Demo CTA */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Schedule a personalized demo with our team and see how this solution can transform your business.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl"
                >
                  Request Demo <FaExternalLinkAlt />
                </Link>
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300"
                >
                  Browse All Products <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;