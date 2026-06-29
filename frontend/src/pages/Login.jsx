import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaCube, FaSpinner, FaShieldAlt, FaEnvelope, FaLock, 
  FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle,
  FaBuilding, FaUserShield, FaClock, FaGlobe,
  FaLockOpen, FaKey, FaSignInAlt, FaHome
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../utils/security';

// ============================================
// UI COMPONENTS
// ============================================

const InputField = ({ 
  icon: Icon, 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  onBlur,
  required = false,
  showToggle = false,
  onToggle,
  showPassword = false
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon className="text-lg" />
      </div>
      <input
        type={showToggle ? (showPassword ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
          error ? 'border-red-500 ring-2 ring-red-500 ring-opacity-50' : 
          'border-gray-300 focus:border-blue-400 focus:ring-blue-200'
        }`}
        autoComplete={type === 'password' ? 'current-password' : 'email'}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
    {error && (
      <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
        <span>⚠️</span> {error}
      </p>
    )}
  </div>
);

// ============================================
// MAIN LOGIN COMPONENT
// ============================================

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('krynova_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Lockout timer
  useEffect(() => {
    if (isLocked) {
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
        toast.success('Account unlocked. You can try again.');
      }, 30000); // 30 seconds lockout
      setLockTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  const validate = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
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
    
    // Check if account is locked
    if (isLocked) {
      toast.error('Account temporarily locked. Please wait 30 seconds.');
      return;
    }
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        // Save remember me preference
        if (rememberMe) {
          localStorage.setItem('krynova_remember_email', email);
        } else {
          localStorage.removeItem('krynova_remember_email');
        }
        
        toast.success('Welcome back! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      }
    } catch (error) {
      // Track failed attempts
      setLoginAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          setIsLocked(true);
          toast.error('Too many failed attempts. Account locked for 30 seconds.');
        } else {
          toast.error(`Invalid credentials. ${5 - newAttempts} attempts remaining.`);
        }
        return newAttempts;
      });
      
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-5"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <FaCube className="text-4xl text-blue-400/20" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float-delayed">
          <FaShieldAlt className="text-5xl text-blue-400/20" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-float-slow">
          <FaBuilding className="text-3xl text-yellow-400/10" />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <img 
                  src="/logo.png" 
                  alt="Krynova Technologies" 
                  className="h-12 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    document.getElementById('fallback-icon').style.display = 'flex';
                  }}
                />
                <div id="fallback-icon" className="text-white text-4xl hidden items-center justify-center">
                  <FaCube />
                </div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your Krynova admin dashboard</p>
            
            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <FaShieldAlt className="text-green-500 text-sm" />
              <span className="text-xs text-gray-500">Official Krynova Technologies Portal</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
            <InputField
              icon={FaEnvelope}
              label="Email Address"
              type="email"
              placeholder="admin@krynova.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: null }));
                }
              }}
              error={errors.email}
              required
            />

            <InputField
              icon={FaLock}
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: null }));
                }
              }}
              error={errors.password}
              required
              showToggle={true}
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  Remember me
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 text-lg ${
                loading || isLocked
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Authenticating...
                </>
              ) : isLocked ? (
                <>
                  <FaClock className="animate-pulse" />
                  Account Locked - Wait 30s
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Login to Dashboard
                </>
              )}
            </button>

            {/* Login Attempts Warning */}
            {loginAttempts > 0 && loginAttempts < 5 && (
              <div className="mt-3 text-center">
                <p className="text-xs text-orange-500">
                  ⚠️ {5 - loginAttempts} login attempts remaining
                </p>
              </div>
            )}

            {isLocked && (
              <div className="mt-3 text-center animate-pulse">
                <p className="text-xs text-red-500">
                  🔒 Account temporarily locked. Please wait 30 seconds.
                </p>
              </div>
            )}
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                <FaHome className="text-xs" /> Home
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-blue-600 transition-colors">
                Need Help?
              </Link>
              <Link to="/products" className="text-gray-500 hover:text-blue-600 transition-colors">
                Our Products
              </Link>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <FaCheckCircle className="text-green-500 text-xs" />
              <span className="text-xs text-gray-600">256-bit SSL Encrypted</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Krynova Technologies - Enterprise Software Solutions
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              © 2026 Krynova Technologies. All rights reserved.
            </p>
          </div>
        </div>

        {/* Features Badges */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
            <FaShieldAlt className="text-green-400 text-xl mx-auto mb-1" />
            <p className="text-xs text-white/70">Secure Access</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
            <FaUserShield className="text-blue-400 text-xl mx-auto mb-1" />
            <p className="text-xs text-white/70">Role Based</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
            <FaGlobe className="text-yellow-400 text-xl mx-auto mb-1" />
            <p className="text-xs text-white/70">Global Access</p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: floatDelayed 3.5s ease-in-out infinite 1s; }
        .animate-float-slow { animation: floatSlow 4s ease-in-out infinite 0.5s; }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}} />
    </div>
  );
};

export default Login;