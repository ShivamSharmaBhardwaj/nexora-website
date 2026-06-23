import React, { useState, useEffect, useMemo } from 'react';
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
  FaHeart
} from 'react-icons/fa';

// Loading Skeleton
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

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index }) => {
  const [isHovered, setIsHovered] = useState(false);

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

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25">
            {testimonial.client_name?.charAt(0) || '?'}
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
                <FaBuilding className="text-gray-400" />
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
      </div>

      {/* Feedback */}
      <div className="relative">
        <FaQuoteLeft className="text-blue-200 text-sm absolute -top-1 -left-1 opacity-50" />
        <p className="text-gray-600 text-sm leading-relaxed pl-4">
          "{testimonial.feedback}"
        </p>
      </div>

      {/* Date */}
      {testimonial.created_at && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-4">
          <FaCalendarAlt />
          <span>{new Date(testimonial.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      )}
    </div>
  );
};

// Star Rating Component
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
  const [filter, setFilter] = useState('all'); // all, latest, highest

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/testimonials`);
        setTestimonials(response.data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Filter testimonials
  const filteredTestimonials = useMemo(() => {
    let filtered = [...testimonials];
    
    switch (filter) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [testimonials, filter]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.client_name.trim() || !form.feedback.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/testimonials`, form);
      setSubmitted(true);
      setForm({ 
        client_name: '', 
        client_company: '', 
        rating: 5, 
        feedback: '' 
      });
      
      // Refresh testimonials
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaHeart className="text-red-500" />
            Client Feedback
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Clients Say</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Real feedback from real businesses who've transformed their operations with our solutions
          </p>
        </div>

        {/* Statistics */}
        {!loading && testimonials.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="text-2xl font-bold text-blue-600">{totalTestimonials}</div>
              <div className="text-sm text-gray-500">Total Testimonials</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="text-2xl font-bold text-yellow-500">{averageRating}</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="text-2xl font-bold text-green-600">
                {testimonials.filter(t => t.rating >= 4).length}
              </div>
              <div className="text-sm text-gray-500">4+ Star Reviews</div>
            </div>
          </div>
        )}

        {/* Filter */}
        {!loading && testimonials.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              All Testimonials
            </button>
            <button
              onClick={() => setFilter('latest')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                filter === 'latest' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaCalendarAlt className="text-sm" /> Latest First
            </button>
            <button
              onClick={() => setFilter('highest')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                filter === 'highest' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FaStar className="text-sm" /> Highest Rated
            </button>
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
        ) : filteredTestimonials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">No Testimonials Yet</h3>
            <p className="text-gray-500">Be the first to share your experience with us!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredTestimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id || index} testimonial={testimonial} index={index} />
            ))}
          </div>
        )}

        {/* Submit Testimonial Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Share Your Experience</h2>
            <p className="text-gray-600 text-sm mt-1">
              Your feedback helps us improve and serve you better
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 animate-scale-in">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Thank You!</h3>
              <p className="text-gray-600 mb-4">
                Your feedback has been submitted for approval. We appreciate your input!
              </p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="text-blue-600 font-medium hover:text-blue-800 transition inline-flex items-center gap-2"
              >
                Submit Another <FaArrowRight className="text-sm" />
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
    </div>
  );
};

export default Testimonials;