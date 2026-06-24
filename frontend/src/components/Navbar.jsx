import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaCube } from 'react-icons/fa';
import { secureStorage } from '../utils/security';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = secureStorage.get('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    secureStorage.remove('auth_token');
    secureStorage.remove('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/testimonials', label: 'Testimonials' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Krynova Technologies Logo" 
                className="h-10 w-auto md:h-12"
                onError={() => setLogoError(true)}
                loading="lazy"
              />
            ) : (
              <FaCube className="text-2xl text-blue-600" />
            )}
            <span className="text-xl font-bold text-gray-800">Krynova</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="text-red-500 hover:text-red-700 transition font-medium"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-2xl text-gray-700 hover:text-blue-600 transition" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="block py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 rounded-lg transition" 
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="block w-full text-left py-3 text-red-500 hover:bg-red-50 px-3 rounded-lg transition"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="block py-3 text-blue-600 hover:bg-blue-50 px-3 rounded-lg transition" 
                onClick={() => setIsOpen(false)}
              >
                Admin Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;