// src/pages/tools/QRGenerator.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaQrcode, 
  FaCheckCircle, FaTimes, FaTrash, FaCrown,
  FaRocket, FaShieldAlt, FaPalette, FaCopy, 
  FaClock, FaFileImage, FaLink, FaEnvelope, FaPhone,
  FaFileExcel, FaFileWord, FaBars,
  FaChevronDown, FaChevronUp, FaGlobe
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import PaymentModal from '../../components/PaymentModal';
import * as XLSX from 'xlsx';

// ============================================
// ✅ CONSTANTS
// ============================================

const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://krynovatechnology.pythonanywhere.com';

const QR_STYLES = [
  { id: 'default', name: 'Default', color: 'black', bg: 'white' },
  { id: 'blue', name: 'Blue', color: '#2563eb', bg: 'white' },
  { id: 'green', name: 'Green', color: '#16a34a', bg: 'white' },
  { id: 'purple', name: 'Purple', color: '#7c3aed', bg: 'white' },
  { id: 'red', name: 'Red', color: '#dc2626', bg: 'white' },
  { id: 'dark', name: 'Dark', color: '#1f2937', bg: '#f3f4f6' },
  { id: 'gradient', name: 'Gradient', color: 'gradient', bg: 'white' },
];

const QR_SIZES = [
  { id: 'small', name: 'Small', size: 150 },
  { id: 'medium', name: 'Medium', size: 250 },
  { id: 'large', name: 'Large', size: 350 },
  { id: 'xlarge', name: 'Extra Large', size: 500 },
];

const indianCities = [
  "Agra", "Lucknow", "Kanpur", "Varanasi", "Prayagraj", "Mathura", "Aligarh", "Bareilly",
  "Meerut", "Ghaziabad", "Noida", "Delhi", "Mumbai", "Pune", "Bengaluru", "Chennai",
  "Hyderabad", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Indore", "Bhopal", "Nagpur",
  "Patna", "Ranchi", "Bhubaneswar", "Guwahati", "Chandigarh", "Dehradun", "Shimla",
  "Srinagar", "Jammu", "Amritsar", "Ludhiana", "Jalandhar", "Panchkula", "Mohali",
  "Gurugram", "Faridabad", "Aurangabad", "Nashik", "Vadodara", "Rajkot"
];

const globalCountries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "United Arab Emirates", "Saudi Arabia", "Singapore", "Malaysia", "Indonesia",
  "Philippines", "South Africa", "Nigeria", "Kenya", "Tanzania", "Uganda", "Rwanda",
  "Egypt", "Morocco", "Turkey", "Russia", "Japan", "South Korea", "China"
];

// ============================================
// ✅ SAFE ARRAY HELPERS
// ============================================

const safeArray = (data) => Array.isArray(data) ? data : [];
const safeString = (data) => data || '';

// ============================================
// ✅ MAIN QR GENERATOR
// ============================================

const QRGenerator = () => {
  // ============================================
  // STATE
  // ============================================
  
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [loadingPremium, setLoadingPremium] = useState(false);
  
  const [content, setContent] = useState('');
  const [bulkContent, setBulkContent] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [qrName, setQrName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [qrHistory, setQrHistory] = useState([]);
  const [mode, setMode] = useState('single');
  const [bulkResults, setBulkResults] = useState([]);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkStatus, setBulkStatus] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const fileInputRef = useRef(null);

  // ============================================
  // ✅ GET USER ID FROM STORAGE
  // ============================================
  
  const getUserId = useCallback(() => {
    try {
      let id = localStorage.getItem('userId');
      if (!id) {
        id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('userId', id);
      }
      return id;
    } catch (error) {
      console.error('Error getting userId:', error);
      return `user_${Date.now()}`;
    }
  }, []);

  // ============================================
  // ✅ CHECK PREMIUM STATUS
  // ============================================
  
  const checkPremiumStatus = useCallback(async () => {
    const id = getUserId();
    if (!id) return;
    
    setUserId(id);
    setLoadingPremium(true);
    
    try {
      const response = await api.checkPremium(id);
      
      if (response.data && response.data.success) {
        const premium = response.data.is_premium || false;
        setIsPremium(premium);
        
        if (premium) {
          toast.success('🎉 Premium activated! Bulk generation unlocked.');
        }
      }
    } catch (error) {
      console.error('Premium check failed:', error);
      setIsPremium(false);
    } finally {
      setLoadingPremium(false);
    }
  }, [getUserId]);

  // ============================================
  // ✅ LOAD USER DATA ON MOUNT
  // ============================================
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const id = getUserId();
        setUserId(id);
        
        const email = localStorage.getItem('userEmail') || '';
        setUserEmail(email);
        
        await checkPremiumStatus();
        
        try {
          const history = JSON.parse(localStorage.getItem('qrHistory') || '[]');
          setQrHistory(history.slice(0, 10));
        } catch (e) {
          setQrHistory([]);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, [checkPremiumStatus, getUserId]);

  // ============================================
  // ✅ HANDLE PAYMENT SUCCESS
  // ============================================
  
  const handlePaymentSuccess = useCallback(async () => {
    toast.success('🎉 Payment successful! Premium activated.');
    setShowPaymentModal(false);
    await checkPremiumStatus();
    
    if (result) {
      try {
        const response = await api.checkPremium(userId);
        if (response.data && response.data.success) {
          setUsageInfo({
            used: response.data.usage_count || 0,
            remaining: response.data.remaining_free || "Unlimited",
            isPremium: response.data.is_premium || false
          });
        }
      } catch (error) {
        console.error('Error refreshing usage:', error);
      }
    }
  }, [userId, result, checkPremiumStatus]);

  // ============================================
  // ✅ GENERATE SINGLE QR
  // ============================================
  
  const generateSingleQR = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Please enter content for QR code');
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const payload = {
        content: content.trim(),
        style: selectedStyle,
        size: QR_SIZES.find(s => s.id === selectedSize)?.size || 250,
        is_premium: isPremium,
        name: qrName || content.trim().substring(0, 20),
        user_id: userId
      };
      
      const response = await api.generateQR(payload);
      
      if (response.data.success) {
        const qrData = response.data.qr_code;
        setResult(qrData);
        
        const newHistory = [{
          id: Date.now(),
          content: content.trim(),
          name: qrName || content.trim().substring(0, 20),
          qr: qrData,
          timestamp: new Date().toISOString()
        }, ...qrHistory].slice(0, 10);
        
        setQrHistory(newHistory);
        localStorage.setItem('qrHistory', JSON.stringify(newHistory));
        
        setUsageInfo({
          used: response.data.usage_count || 0,
          remaining: response.data.remaining_free || 0,
          isPremium: response.data.is_premium || false
        });
        
        toast.success('🎉 QR Code generated successfully!');
      }
    } catch (error) {
      if (error.response?.data?.limit_reached) {
        toast.error('Free limit reached! Upgrade to premium for unlimited access.');
        setUsageInfo({
          used: error.response.data.usage_count || 0,
          remaining: 0,
          isPremium: false,
          maxFree: error.response.data.max_free || 5
        });
        setShowPaymentModal(true);
      } else {
        toast.error(error.response?.data?.error || 'Failed to generate QR code');
      }
    } finally {
      setLoading(false);
    }
  }, [content, selectedStyle, selectedSize, isPremium, qrName, userId, qrHistory]);

  // ============================================
  // ✅ GENERATE BULK QR
  // ============================================
  
  const generateBulkQR = useCallback(async () => {
    if (!bulkContent.trim()) {
      toast.error('Please enter content for QR codes (one per line)');
      return;
    }

    const lines = safeArray(bulkContent.split('\n')).filter(line => line.trim());
    if (lines.length === 0) {
      toast.error('Please enter at least one QR code content');
      return;
    }

    if (!isPremium) {
      toast.error('Bulk generation is a premium feature. Please upgrade!');
      setShowPaymentModal(true);
      return;
    }

    setLoading(true);
    setBulkResults([]);
    setBulkProgress(0);
    setBulkStatus('Starting bulk generation...');

    const results = [];
    const total = lines.length;

    for (let i = 0; i < total; i++) {
      const line = lines[i].trim();
      setBulkStatus(`Generating QR ${i + 1} of ${total}: ${line.substring(0, 30)}...`);
      
      try {
        const payload = {
          content: line,
          style: selectedStyle,
          size: QR_SIZES.find(s => s.id === selectedSize)?.size || 250,
          is_premium: true,
          name: line.substring(0, 30),
          user_id: userId
        };
        
        const response = await api.generateQR(payload);
        
        if (response.data.success) {
          results.push({
            content: line,
            qr: response.data.qr_code,
            success: true,
            index: i + 1
          });
        } else {
          results.push({
            content: line,
            error: response.data.error || 'Generation failed',
            success: false,
            index: i + 1
          });
        }
      } catch (error) {
        results.push({
          content: line,
          error: error.response?.data?.error || 'Generation failed',
          success: false,
          index: i + 1
        });
      }

      setBulkProgress(((i + 1) / total) * 100);
      setBulkResults([...results]);
    }

    setBulkStatus(`Completed! ${results.filter(r => r.success).length} of ${total} QR codes generated`);
    
    const successCount = results.filter(r => r.success).length;
    if (successCount > 0) {
      toast.success(`✅ Generated ${successCount} QR codes successfully!`);
    }
    if (successCount < total) {
      toast.warning(`⚠️ ${total - successCount} QR codes failed to generate`);
    }

    setLoading(false);
  }, [bulkContent, selectedStyle, selectedSize, isPremium, userId]);

  // ============================================
  // ✅ DOWNLOAD FUNCTIONS
  // ============================================
  
  const handleDownloadSingle = useCallback(() => {
    if (!result) return;
    const link = document.createElement('a');
    link.download = `${qrName || 'qrcode'}.png`;
    link.href = result;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded!');
  }, [result, qrName]);

  const handleDownloadWord = useCallback(() => {
    if (!result) return;
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: white; }
            .container { text-align: center; padding: 20px; }
            img { max-width: 400px; height: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; }
            h1 { color: #333; margin-bottom: 10px; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>QR Code</h1>
            <p>${content.substring(0, 100)}</p>
            <img src="${result}" alt="QR Code" />
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${qrName || 'qrcode'}.doc`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Word document downloaded!');
  }, [result, content, qrName]);

  const handleDownloadExcel = useCallback(() => {
    const results = safeArray(bulkResults);
    if (results.length === 0) {
      toast.error('No QR codes to export');
      return;
    }

    try {
      const data = results.map((item, index) => ({
        'S.No': index + 1,
        'Content': item.content,
        'Status': item.success ? 'Generated' : 'Failed',
        'Error': item.error || 'N/A'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      ws['!cols'] = [
        { wch: 8 },
        { wch: 50 },
        { wch: 15 },
        { wch: 30 }
      ];
      XLSX.utils.book_append_sheet(wb, ws, 'QR Codes');
      
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-codes-${new Date().toISOString().slice(0,10)}.xlsx`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Excel file downloaded with QR code list!');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to export Excel file');
    }
  }, [bulkResults]);

  const handleDownloadExcelWithImages = useCallback(async () => {
    const results = safeArray(bulkResults);
    if (results.length === 0) {
      toast.error('No QR codes to export');
      return;
    }

    try {
      const successResults = results.filter(r => r.success);
      if (successResults.length === 0) {
        toast.error('No successful QR codes to export');
        return;
      }

      toast.info('Preparing Excel with QR images... This may take a moment.');
      
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .qr-cell img { max-width: 100px; height: auto; }
            </style>
          </head>
          <body>
            <h1>QR Codes Generated on ${new Date().toLocaleString()}</h1>
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Content</th>
                  <th>QR Code</th>
                </tr>
              </thead>
              <tbody>
                ${successResults.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.content.substring(0, 100)}</td>
                    <td class="qr-cell"><img src="${item.qr}" alt="QR Code" /></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p>Total: ${successResults.length} QR codes generated</p>
          </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-codes-with-images-${new Date().toISOString().slice(0,10)}.html`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('HTML file with QR images downloaded!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export with images');
    }
  }, [bulkResults]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success('QR Code copied to clipboard!');
  }, [result]);

  const handlePrint = useCallback(() => {
    if (!result) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>QR Code</title></head>
          <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;">
            <img src="${result}" style="max-width:80%;"/>
            <script>
              window.onload = function() { window.print(); }
            <\/script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }, [result]);

  // ============================================
  // ✅ HANDLE SUBMIT
  // ============================================
  
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (mode === 'single') {
      await generateSingleQR();
    } else {
      await generateBulkQR();
    }
  }, [mode, generateSingleQR, generateBulkQR]);

  // ============================================
  // ✅ SET EXAMPLE
  // ============================================
  
  const setExample = useCallback((value) => {
    if (mode === 'single') {
      setContent(value);
    } else {
      setBulkContent(value);
    }
  }, [mode]);

  // ============================================
  // ✅ REUSE QR
  // ============================================
  
  const reuseQR = useCallback((content) => {
    setContent(content);
    setMode('single');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ============================================
  // ✅ HANDLE UPGRADE
  // ============================================
  
  const handleUpgrade = useCallback(() => {
    setShowPaymentModal(true);
  }, []);

  // ============================================
  // ✅ CLEAR HISTORY
  // ============================================
  
  const clearHistory = useCallback(() => {
    setQrHistory([]);
    localStorage.removeItem('qrHistory');
    toast.success('History cleared!');
  }, []);

  // ============================================
  // ✅ EXAMPLES
  // ============================================
  
  const examples = [
    { label: 'Website URL', value: 'https://krynova.com' },
    { label: 'Business Card', value: 'John Doe\nCEO, Krynova Technologies\n+91 86305 19082' },
    { label: 'WiFi Network', value: 'WIFI:S:Krynova;T:WPA;P:password123;;' },
    { label: 'Email', value: 'mailto:princeb744@gmail.com' },
    { label: 'Phone Number', value: 'tel:+918630519082' },
  ];

  const bulkExamples = [
    { label: '5 URLs', value: 'https://krynova.com\nhttps://google.com\nhttps://github.com\nhttps://stackoverflow.com\nhttps://npmjs.com' },
    { label: 'Business Cards', value: 'John Doe, CEO, +911234567890\nJane Smith, CTO, +911234567891\nBob Johnson, CMO, +911234567892' },
  ];

  // ============================================
  // ✅ RENDER
  // ============================================
  
  return (
    <>
      <Helmet>
        <title>Free QR Code Generator - Create Custom QR Codes Online | Krynova Technologies</title>
        <meta name="description" content="Generate free custom QR codes online with Krynova Technologies. Create QR codes for websites, business cards, WiFi networks, and more. No registration required." />
        <meta name="keywords" content="free QR code generator, create QR codes online, QR code maker, custom QR code generator, QR generator India" />
        <link rel="canonical" href={`${siteUrl}/tools/qr-generator`} />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta property="og:title" content="Free QR Code Generator - Create Custom QR Codes Online" />
        <meta property="og:description" content="Generate free custom QR codes online. Create QR codes for websites, business cards, WiFi, and more." />
        <meta property="og:url" content={`${siteUrl}/tools/qr-generator`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "QR Code Generator",
          "description": "Free online QR code generator. Create custom QR codes for websites, business cards, WiFi, and more.",
          "url": `${siteUrl}/tools/qr-generator`,
          "applicationCategory": "Utilities",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "description": "Free QR code generator with 5 QR codes per day."
          },
          "provider": {
            "@type": "Organization",
            "name": "Krynova Technologies",
            "url": siteUrl
          }
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaQrcode className="text-green-500" />
              Free QR Code Generator
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              QR Code <span className="gradient-text">Generator</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create custom QR codes instantly for websites, business cards, WiFi, and more. 
              Free users get 5 QR codes per day.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free: 5/day
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCrown className="text-yellow-500" /> Premium: Unlimited + Bulk
              </span>
              {isPremium && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <FaCrown className="text-yellow-500" /> Premium Active
                </span>
              )}
            </div>
          </div>

          {/* Usage Info */}
          {usageInfo && (
            <div className={`mb-6 p-4 rounded-lg flex flex-wrap items-center justify-between ${
              usageInfo.isPremium ? 'bg-green-50 border border-green-200' :
              usageInfo.remaining > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className="text-sm flex items-center gap-2">
                {usageInfo.isPremium ? (
                  <>
                    <FaCrown className="text-yellow-500" />
                    <span className="font-semibold">✨ Premium:</span> Unlimited QR codes • Bulk generation • Export to Excel
                  </>
                ) : (
                  <>
                    <FaClock className="text-blue-500" />
                    {usageInfo.used || 0} used today • {usageInfo.remaining || 0} free remaining
                  </>
                )}
              </p>
              {!usageInfo.isPremium && (
                <button
                  onClick={handleUpgrade}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  <FaCrown /> Upgrade Now — ₹99/month
                </button>
              )}
            </div>
          )}

          {/* Mode Toggle */}
          <div className="mb-6 bg-white rounded-xl p-2 border border-gray-200 flex items-center justify-between shadow-sm">
            <div className="flex gap-1">
              <button
                onClick={() => setMode('single')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  mode === 'single' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaQrcode /> Single QR
              </button>
              <button
                onClick={() => {
                  if (!isPremium) {
                    toast.error('Bulk generation is a premium feature!');
                    setShowPaymentModal(true);
                    return;
                  }
                  setMode('bulk');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  mode === 'bulk' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaBars /> Bulk {!isPremium && <FaLock className="text-xs" />}
              </button>
            </div>
            {isPremium && (
              <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <FaCrown className="inline mr-1" /> Premium Active
              </span>
            )}
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'single' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content / URL *
                        </label>
                        <div className="relative">
                          <textarea
                            rows="3"
                            placeholder="Enter text, URL, WiFi config, vCard, or any data to encode"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            required
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {content.length} characters
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          QR Name (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Enter a name for this QR code"
                          value={qrName}
                          onChange={(e) => setQrName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bulk Content (One per line) *
                        </label>
                        <div className="relative">
                          <textarea
                            rows="6"
                            placeholder="Enter multiple QR code contents, one per line&#10;Example:&#10;https://krynova.com&#10;https://google.com&#10;John Doe, CEO, +911234567890"
                            value={bulkContent}
                            onChange={(e) => setBulkContent(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm transition"
                            required
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {bulkContent.split('\n').filter(l => l.trim()).length} items
                          </div>
                        </div>
                      </div>

                      {isPremium && (
                        <div className="flex flex-wrap gap-2">
                          {bulkExamples.map((example, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setExample(example.value)}
                              className="px-2 py-1 bg-gray-100 hover:bg-green-100 rounded text-xs transition border border-gray-200 hover:border-green-300"
                            >
                              {example.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Quick Examples */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Quick Examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {examples.map((example, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setExample(example.value)}
                          className="px-2 py-1 bg-gray-100 hover:bg-green-100 rounded text-xs transition border border-gray-200 hover:border-green-300"
                        >
                          {example.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                    <div className="flex flex-wrap gap-2">
                      {QR_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setSelectedStyle(style.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition border ${
                            selectedStyle === style.id
                              ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {style.id === 'gradient' ? (
                              <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
                            ) : (
                              <div 
                                className="w-4 h-4 rounded border border-gray-200"
                                style={{ backgroundColor: style.bg }}
                              >
                                <div 
                                  className="w-2 h-2 mx-auto mt-1"
                                  style={{ backgroundColor: style.color }}
                                />
                              </div>
                            )}
                            {style.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <div className="flex flex-wrap gap-2">
                      {QR_SIZES.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setSelectedSize(size.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition border ${
                            selectedSize === size.id
                              ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || (mode === 'single' ? !content.trim() : !bulkContent.trim())}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaQrcode />}
                    {loading 
                      ? mode === 'single' ? 'Generating...' : `Generating... ${Math.round(bulkProgress)}%`
                      : mode === 'single' ? 'Generate QR Code' : `Generate ${bulkContent.split('\n').filter(l => l.trim()).length || 0} QR Codes`
                    }
                  </button>

                  {mode === 'bulk' && !isPremium && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                      <p className="text-sm text-yellow-700">
                        🔒 Bulk generation is a premium feature. 
                        <button 
                          onClick={handleUpgrade}
                          className="ml-2 text-green-600 font-semibold hover:underline"
                        >
                          Upgrade Now — ₹99/month
                        </button>
                      </p>
                    </div>
                  )}
                </form>

                {/* Bulk Progress */}
                {loading && mode === 'bulk' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{bulkStatus}</span>
                      <span className="text-sm font-semibold text-green-600">{Math.round(bulkProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${bulkProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 h-full flex flex-col">
                  <div className="flex items-center justify-between w-full mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FaQrcode className="text-green-600" /> Preview
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{QR_STYLES.find(s => s.id === selectedStyle)?.name || 'Default'} • {QR_SIZES.find(s => s.id === selectedSize)?.name || 'Medium'}</span>
                    </div>
                  </div>

                  {mode === 'single' && result ? (
                    <>
                      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 mx-auto">
                        <img 
                          src={result} 
                          alt={`QR Code${qrName ? ' for ' + qrName : ''}`}
                          className="max-w-[250px] max-h-[250px] mx-auto"
                          loading="lazy"
                        />
                        {qrName && (
                          <p className="text-center text-sm text-gray-600 mt-2 font-medium">{qrName}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={handleDownloadSingle}
                          className="flex-1 bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                          <FaDownload /> PNG
                        </button>
                        <button
                          onClick={handleDownloadWord}
                          className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                          <FaFileWord /> Word
                        </button>
                        <button
                          onClick={handleCopy}
                          className="flex-1 bg-gray-500 text-white py-2.5 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2 text-sm font-semibold"
                        >
                          <FaCopy /> Copy
                        </button>
                      </div>
                    </>
                  ) : mode === 'bulk' && bulkResults.length > 0 ? (
                    <>
                      <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2">
                        {bulkResults.slice(0, 10).map((item, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 hover:shadow-md transition">
                            <span className="text-xs font-medium text-gray-400 w-8">{item.index}</span>
                            {item.success ? (
                              <>
                                <img src={item.qr} alt={`QR Code ${item.index}`} className="w-10 h-10" loading="lazy" />
                                <span className="text-sm truncate flex-1">{item.content.substring(0, 40)}</span>
                                <FaCheckCircle className="text-green-500 text-sm" />
                              </>
                            ) : (
                              <>
                                <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                                  <FaTimes className="text-red-500" />
                                </div>
                                <span className="text-sm text-red-500 truncate flex-1">{item.error}</span>
                              </>
                            )}
                          </div>
                        ))}
                        {bulkResults.length > 10 && (
                          <p className="text-xs text-gray-400 text-center py-2">
                            + {bulkResults.length - 10} more QR codes
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={handleDownloadExcel}
                          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                          <FaFileExcel /> Excel (List)
                        </button>
                        <button
                          onClick={handleDownloadExcelWithImages}
                          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                          <FaFileExcel /> Excel (Images)
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-2">
                        {bulkResults.filter(r => r.success).length} of {bulkResults.length} QR codes generated successfully
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-400 flex-1 flex flex-col items-center justify-center">
                      <FaQrcode className="text-6xl mx-auto mb-4 opacity-30" />
                      <p className="text-lg">Your QR Code will appear here</p>
                      <p className="text-sm mt-2">
                        {mode === 'single' ? 'Enter content and click Generate' : 'Enter bulk content and click Generate'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          {qrHistory.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaClock className="text-green-600" /> Recent QR Codes
                  <span className="text-xs text-gray-400 font-normal">({qrHistory.length})</span>
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-500 hover:text-red-700 transition flex items-center gap-1"
                >
                  <FaTrash /> Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {qrHistory.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center hover:shadow-md transition">
                    <img src={item.qr} alt={`QR Code ${item.name}`} className="w-16 h-16 mx-auto mb-2" loading="lazy" />
                    <p className="text-xs text-gray-600 truncate font-medium">{item.name || item.content.substring(0, 20)}</p>
                    <p className="text-xs text-gray-400 truncate">{item.content.substring(0, 15)}...</p>
                    <button
                      onClick={() => reuseQR(item.content)}
                      className="text-xs text-green-600 hover:text-green-800 transition mt-1 font-medium"
                    >
                      Reuse
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Modal */}
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            userEmail={userEmail}
            userId={userId}
            onSuccess={handlePaymentSuccess}
          />
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .gradient-text {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}} />
      </div>
    </>
  );
};

export default QRGenerator;