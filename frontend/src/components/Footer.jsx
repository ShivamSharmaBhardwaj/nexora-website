import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaCube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaCube className="text-2xl text-blue-400" />
              <span className="text-xl font-bold">Krynova</span>
            </div>
            <p className="text-gray-400 text-sm">
              Custom web solutions for any industry. Founded March 2026.
            </p>
            {/* ✅ Added trust badge */}
            <p className="text-xs text-gray-500 mt-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Secure & Trusted
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
              <li><Link to="/testimonials" className="hover:text-white transition">Testimonials</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/products/category/HRMS" className="hover:text-white transition">HRMS</Link></li>
              <li><Link to="/products/category/TODO" className="hover:text-white transition">TODO System</Link></li>
              <li><Link to="/products/category/Estate" className="hover:text-white transition">Estate Management</Link></li>
              <li><Link to="/products/category/WhatsApp" className="hover:text-white transition">WhatsApp Bot</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="text-gray-400 hover:text-white transition"><FaFacebook /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaLinkedin /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaGithub /></a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              <a href="mailto:princeb744@gmail.com" className="hover:text-white">princeb744@gmail.com</a>
            </p>
          </div>
        </div>

        {/* ✅ Updated footer - Clear branding */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2026 Krynova Technologies. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Enterprise Software Solutions | Agra, India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;