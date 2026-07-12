// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // ✅ ADD THIS
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Pricing from './pages/Pricing';

// Tools Imports
import Tools from './pages/Tools';
import ResumeBuilder from './pages/tools/ResumeBuilder';
import CoverLetterGenerator from './pages/tools/CoverLetterGenerator';
import QRGenerator from './pages/tools/QRGenerator';
import PDFToImage from './pages/tools/PDFToImage';
import PDFToWord from './pages/tools/PDFToWord';
import PDFToExcel from './pages/tools/PDFToExcel';
import ImageToPDF from './pages/tools/ImageToPDF';
import PDFCompressor from './pages/tools/PDFCompressor';
import MergePDF from './pages/tools/MergePDF';
import SplitPDF from './pages/tools/SplitPDF';
import ImageResizer from './pages/tools/ImageResizer';
import TextToPDF from './pages/tools/TextToPDF';
import WebDevelopmentAgra from './pages/services/WebDevelopmentAgra';
import HRMSSoftware from './pages/services/HRMSSoftware';
import PropertyManagement from './pages/services/PropertyManagement';
import WhatsAppAutomation from './pages/services/WhatsAppAutomation';
import EnterpriseSoftware from './pages/services/EnterpriseSoftware';

import { useSecurity } from './hooks/useSecurity';

function App() {
  useSecurity();

  return (
    <HelmetProvider> {/* ✅ WRAP EVERYTHING WITH HelmetProvider */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar />
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/category/:category" element={<Products />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Tools Routes */}
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
        <Route path="/tools/cover-letter" element={<CoverLetterGenerator />} />
        <Route path="/tools/qr-generator" element={<QRGenerator />} />
        <Route path="/tools/pdf-to-image" element={<PDFToImage />} />
        <Route path="/tools/pdf-to-word" element={<PDFToWord />} />
        <Route path="/tools/pdf-to-excel" element={<PDFToExcel />} />
        <Route path="/tools/image-to-pdf" element={<ImageToPDF />} />
        <Route path="/tools/pdf-compressor" element={<PDFCompressor />} />
        <Route path="/tools/merge-pdf" element={<MergePDF />} />
        <Route path="/tools/split-pdf" element={<SplitPDF />} />
        <Route path="/tools/image-resizer" element={<ImageResizer />} />
        <Route path="/tools/text-to-pdf" element={<TextToPDF />} />
        <Route path="/services/web-development-agra" element={<WebDevelopmentAgra />} />
        <Route path="/services/hrms-software" element={<HRMSSoftware />} />
        <Route path="/services/property-management" element={<PropertyManagement />} />
        <Route path="/services/whatsapp-automation" element={<WhatsAppAutomation />} />
        <Route path="/services/enterprise-software" element={<EnterpriseSoftware />} />
      </Routes>
      <Footer />
    </HelmetProvider>
  );
}

export default App;