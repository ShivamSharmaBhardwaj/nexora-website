import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaCube, FaSpinner, FaShieldAlt, FaEnvelope, FaLock, 
  FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle,
  FaBuilding, FaUserShield, FaClock, FaGlobe,
  FaLockOpen, FaKey, FaSignInAlt, FaHome,
  FaRocket, FaMicrochip, FaServer, FaCloud,
  FaDatabase, FaNetworkWired, FaBrain, FaCog
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
    <label className="block text-sm font-medium text-gray-700 mb-1.5 backdrop-blur-sm">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300 group-hover:text-blue-400">
        <Icon className="text-lg" />
      </div>
      <input
        type={showToggle ? (showPassword ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full pl-10 pr-12 py-3 border bg-white/10 backdrop-blur-xl rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
          error ? 'border-red-400 ring-2 ring-red-400 ring-opacity-50 bg-red-50/20' : 
          'border-white/20 focus:border-blue-400/50 focus:ring-blue-400/30 hover:border-white/40'
        } placeholder-gray-400 text-gray-800`}
        autoComplete={type === 'password' ? 'current-password' : 'email'}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
    {error && (
      <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1 animate-fadeIn">
        <span>⚠️</span> {error}
      </p>
    )}
  </div>
);

// ============================================
// FLOATING PARTICLES
// ============================================

const FloatingParticles = () => {
  const particles = [
    { icon: FaCube, delay: '0s', duration: '3s', x: '10%', y: '20%' },
    { icon: FaShieldAlt, delay: '1s', duration: '3.5s', x: '85%', y: '15%' },
    { icon: FaBuilding, delay: '2s', duration: '4s', x: '5%', y: '70%' },
    { icon: FaRocket, delay: '0.5s', duration: '3.2s', x: '90%', y: '80%' },
    { icon: FaMicrochip, delay: '1.5s', duration: '3.8s', x: '15%', y: '85%' },
    { icon: FaServer, delay: '2.5s', duration: '4.2s', x: '80%', y: '30%' },
    { icon: FaCloud, delay: '0.8s', duration: '3.6s', x: '20%', y: '10%' },
    { icon: FaDatabase, delay: '1.8s', duration: '3.9s', x: '70%', y: '70%' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute animate-float"
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        >
          <particle.icon className="text-4xl text-white/10 hover:text-white/20 transition-all duration-1000" />
        </div>
      ))}
    </div>
  );
};

// ============================================
// GLASS CARD COMPONENT
// ============================================

const GlassCard = ({ children, className = '' }) => (
  <div className={`relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl ${className}`}>
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
    <div className="absolute inset-px rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
    <div className="relative">{children}</div>
  </div>
);

// ============================================
// STATS BADGE
// ============================================

const StatsBadge = ({ icon: Icon, label, value, color }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center hover:border-white/30 transition-all duration-300 hover:scale-105">
      <Icon className={`${color} text-xl mx-auto mb-1 group-hover:scale-110 transition-transform duration-300`} />
      <p className="text-xs text-white/70">{label}</p>
      <p className="text-xs font-semibold text-white/90">{value}</p>
    </div>
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
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
        toast.success('Account unlocked. You can try again.', {
          style: {
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
          },
        });
      }, 30000);
      setLockTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    
    if (isLocked) {
      toast.error('Account temporarily locked. Please wait 30 seconds.', {
        style: {
          background: 'rgba(255,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          border: '1px solid rgba(255,0,0,0.2)',
        },
      });
      return;
    }
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('krynova_remember_email', email);
        } else {
          localStorage.removeItem('krynova_remember_email');
        }
        
        toast.success('Welcome back! 🚀', {
          style: {
            background: 'rgba(16,185,129,0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(16,185,129,0.2)',
          },
        });
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      }
    } catch (error) {
      setLoginAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          setIsLocked(true);
          toast.error('Too many failed attempts. Locked for 30s.', {
            style: {
              background: 'rgba(255,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255,0,0,0.2)',
            },
          });
        } else {
          toast.error(`Invalid credentials. ${5 - newAttempts} attempts left.`, {
            style: {
              background: 'rgba(255,165,0,0.1)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255,165,0,0.2)',
            },
          });
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
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center py-12 px-4 relative overflow-hidden"
      style={{
        transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
      }}
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Glass Morphism Card */}
        <GlassCard className="p-8 transform transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
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
            </div>
            
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-white/60 text-sm mt-1">Sign in to your Krynova admin dashboard</p>
            
            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                <FaShieldAlt className="text-green-400 text-sm animate-pulse" />
                <span className="text-xs text-white/70">Official Krynova Technologies Portal</span>
              </div>
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
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-white/20 bg-white/10 backdrop-blur-sm focus:ring-blue-500/50 cursor-pointer"
                  />
                </div>
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className={`relative w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 text-lg overflow-hidden group ${
                loading || isLocked
                  ? 'bg-white/5 cursor-not-allowed border border-white/10'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5'
              }`}
            >
              {/* Button Shimmer Effect */}
              {!loading && !isLocked && (
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              )}
              
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
                  <FaSignInAlt className="group-hover:scale-110 transition-transform duration-300" />
                  Login to Dashboard
                </>
              )}
            </button>

            {/* Login Attempts Warning */}
            {loginAttempts > 0 && loginAttempts < 5 && (
              <div className="mt-3 text-center animate-pulse">
                <p className="text-xs text-orange-400/80 bg-orange-400/10 backdrop-blur-sm px-3 py-1 rounded-full inline-block border border-orange-400/20">
                  ⚠️ {5 - loginAttempts} login attempts remaining
                </p>
              </div>
            )}

            {isLocked && (
              <div className="mt-3 text-center animate-pulse">
                <p className="text-xs text-red-400/80 bg-red-400/10 backdrop-blur-sm px-3 py-1 rounded-full inline-block border border-red-400/20">
                  🔒 Account temporarily locked. Please wait 30 seconds.
                </p>
              </div>
            )}
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/" className="text-white/50 hover:text-white transition-colors flex items-center gap-1 group">
                <FaHome className="text-xs group-hover:scale-110 transition-transform duration-300" /> Home
              </Link>
              <Link to="/contact" className="text-white/50 hover:text-white transition-colors">
                Need Help?
              </Link>
              <Link to="/products" className="text-white/50 hover:text-white transition-colors">
                Our Products
              </Link>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-green-400/30 transition-all duration-300">
              <FaCheckCircle className="text-green-400 text-xs" />
              <span className="text-xs text-white/60">256-bit SSL Encrypted</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-white/30">
              Krynova Technologies - Enterprise Software Solutions
            </p>
            <p className="text-xs text-white/20 mt-0.5">
              © 2026 Krynova Technologies. All rights reserved.
            </p>
          </div>
        </GlassCard>

        {/* Features Badges with Glassmorphism */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatsBadge 
            icon={FaShieldAlt} 
            label="Security" 
            value="Enterprise Grade"
            color="text-green-400"
          />
          <StatsBadge 
            icon={FaUserShield} 
            label="Access" 
            value="Role Based"
            color="text-blue-400"
          />
          <StatsBadge 
            icon={FaGlobe} 
            label="Reach" 
            value="Global Access"
            color="text-yellow-400"
          />
        </div>

        {/* Tech Stack Indicators */}
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300">
            <FaServer className="text-blue-400 text-xs" />
            <span className="text-xs text-white/50">Cloud Native</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300">
            <FaDatabase className="text-purple-400 text-xs" />
            <span className="text-xs text-white/50">Scalable</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300">
            <FaNetworkWired className="text-cyan-400 text-xs" />
            <span className="text-xs text-white/50">API Ready</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        /* Glass morphism hover effects */
        .glass-card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card-hover:hover {
          backdrop-filter: blur(20px);
          background: rgba(255,255,255,0.15);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
      `}} />
    </div>
  );
};

export default Login;