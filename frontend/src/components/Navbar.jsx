import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FaCube, 
  FaHome, 
  FaProjectDiagram, 
  FaComments, 
  FaEnvelope, 
  FaSignOutAlt, 
  FaUserShield,
  FaTools,
  FaStar,
  FaPhone,
  FaWhatsapp,
  FaChevronDown,
  FaRocket,
  FaBuilding,
  FaCode
} from 'react-icons/fa';
import { secureStorage } from '../utils/security';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication
  useEffect(() => {
    const token = secureStorage.get('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    secureStorage.remove('auth_token');
    secureStorage.remove('user');
    setIsLoggedIn(false);
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/products', label: 'Products', icon: FaProjectDiagram },
    { path: '/testimonials', label: 'Testimonials', icon: FaComments },
    { path: '/tools', label: 'Free Tools', icon: FaTools },
    { path: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            aria-label="Krynova Technologies Home"
          >
            <div className="relative">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="Krynova Technologies Logo" 
                  className="h-10 w-auto md:h-12 transition-transform duration-300 group-hover:scale-105"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl shadow-lg shadow-blue-500/25">
                  <FaCube />
                </div>
              )}
              <div className="absolute -inset-1 bg-blue-600/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Krynova
              </span>
              <span className="text-[8px] md:text-[10px] font-medium text-gray-400 tracking-wider uppercase">
                Technologies
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    active 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <Icon className={`text-sm ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Contact */}
            <a 
              href="tel:+918630519082" 
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition px-3 py-2 rounded-lg hover:bg-blue-50"
              aria-label="Call us"
            >
              <FaPhone className="text-sm" />
              <span className="text-sm font-medium">+91 86305 19082</span>
            </a>
            <a 
              href="https://wa.me/918630519082" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition px-3 py-2 rounded-lg hover:bg-green-50"
              aria-label="WhatsApp us"
            >
              <FaWhatsapp className="text-lg" />
            </a>

            {/* Admin/User Button */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                  <FaUserShield />
                  <span>Admin</span>
                  <FaChevronDown className={`text-xs transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-scale-in">
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUserShield className="text-sm" />
                      Dashboard
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition w-full"
                    >
                      <FaSignOutAlt className="text-sm" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
              >
                <FaUserShield />
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-2xl text-gray-700 hover:text-blue-600 transition p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-4 pt-2 border-t border-gray-100 space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                    active 
                      ? 'text-blue-600 bg-blue-50 font-medium' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={`text-lg ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                  {link.label}
                  {active && <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Current</span>}
                </Link>
              );
            })}

            <hr className="my-2 border-gray-100" />

            {/* Mobile Quick Contact */}
            <div className="px-4 py-2">
              <a 
                href="tel:+918630519082" 
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition py-2"
              >
                <FaPhone className="text-lg" />
                <span>+91 86305 19082</span>
              </a>
              <a 
                href="https://wa.me/918630519082" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-green-600 hover:text-green-700 transition py-2"
              >
                <FaWhatsapp className="text-lg" />
                <span>WhatsApp</span>
              </a>
            </div>

            <hr className="my-2 border-gray-100" />

            {/* Mobile Auth */}
            {isLoggedIn ? (
              <>
                <Link 
                  to="/admin" 
                  className="flex items-center gap-3 py-3 px-4 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserShield className="text-lg" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <FaSignOutAlt className="text-lg" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-blue-600 hover:bg-blue-50 transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                <FaUserShield className="text-lg" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
      `}} />
    </nav>
  );
};

export default Navbar;