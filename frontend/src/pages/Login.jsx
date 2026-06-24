import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCube, FaSpinner, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../utils/security';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        {/* ✅ Updated Header - Clear Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <img 
              src="/logo.png" 
              alt="Krynova Technologies" 
              className="h-16 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                document.getElementById('fallback-icon').style.display = 'block';
              }}
            />
            <FaCube id="fallback-icon" className="text-5xl text-blue-600 mx-auto hidden" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Krynova Technologies</h1>
          <p className="text-gray-600">Secure Admin Dashboard Login</p>
          {/* ✅ Trust badge - helps with Google's phishing detection */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <FaShieldAlt className="text-green-500 text-sm" />
            <span className="text-xs text-gray-500">Official Krynova Technologies Portal</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@krynova.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: null }));
                }
              }}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.email ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: null }));
                }
              }}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.password ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" /> : null}
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        {/* ✅ Contact Support Link - Makes it look legitimate */}
        <div className="mt-4 text-center">
          <Link to="/contact" className="text-sm text-blue-600 hover:underline">
            Need help? Contact Support
          </Link>
        </div>

        {/* ✅ Footer - Clear branding */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            Krynova Technologies - Enterprise Software Solutions
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © 2026 Krynova Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;