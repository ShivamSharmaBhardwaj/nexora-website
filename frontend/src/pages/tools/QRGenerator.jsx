// src/pages/tools/QRGenerator.jsx
import React, { useState } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaQrcode, 
  FaCheckCircle, FaCircle, FaTimes, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaPalette,
  FaUpload, FaArrowRight, FaCopy, FaPrint,
  FaEye, FaEyeSlash, FaMagic, FaClock,
  FaFileImage, FaLink, FaTextHeight, FaEnvelope, FaPhone
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

// ============================================
// QR CODE STYLES
// ============================================

const QR_STYLES = [
  { id: 'default', name: 'Default', color: 'black', bg: 'white' },
  { id: 'blue', name: 'Blue', color: '#2563eb', bg: 'white' },
  { id: 'green', name: 'Green', color: '#16a34a', bg: 'white' },
  { id: 'purple', name: 'Purple', color: '#7c3aed', bg: 'white' },
  { id: 'red', name: 'Red', color: '#dc2626', bg: 'white' },
  { id: 'dark', name: 'Dark', color: '#1f2937', bg: '#f3f4f6' },
  { id: 'gradient', name: 'Gradient', color: 'gradient', bg: 'white' },
];

// ============================================
// QR CODE SIZES
// ============================================

const QR_SIZES = [
  { id: 'small', name: 'Small', size: 150 },
  { id: 'medium', name: 'Medium', size: 250 },
  { id: 'large', name: 'Large', size: 350 },
  { id: 'xlarge', name: 'Extra Large', size: 500 },
];

// ============================================
// MAIN QR GENERATOR
// ============================================

const QRGenerator = () => {
  const [content, setContent] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [qrHistory, setQrHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter content for QR code');
      return;
    }
    setLoading(true);
    
    try {
      const payload = {
        content: content.trim(),
        style: selectedStyle,
        size: QR_SIZES.find(s => s.id === selectedSize)?.size || 250,
        is_premium: isPremium
      };
      
      const response = await api.generateQR(payload);
      
      if (response.data.success) {
        setResult(response.data.qr_code);
        setQrHistory(prev => [{
          content: content.trim(),
          qr: response.data.qr_code,
          timestamp: new Date().toISOString()
        }, ...prev].slice(0, 5));
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        toast.success('🎉 QR Code generated successfully!');
      }
    } catch (error) {
      if (error.response?.data?.limit_reached) {
        toast.error('Free limit reached! Upgrade to premium for unlimited access.');
        setUsageInfo({
          used: error.response.data.usage_count,
          remaining: 0,
          isPremium: false,
          maxFree: error.response.data.max_free
        });
      } else {
        toast.error(error.response?.data?.error || 'Failed to generate QR code');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = result;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded!');
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success('QR Code copied to clipboard!');
  };

  const handlePrint = () => {
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
  };

  const handleUpgrade = () => {
    window.location.href = '/contact?upgrade=premium';
  };

  const getSizeLabel = () => {
    return QR_SIZES.find(s => s.id === selectedSize)?.name || 'Medium';
  };

  const getStyleLabel = () => {
    return QR_STYLES.find(s => s.id === selectedStyle)?.name || 'Default';
  };

  // Examples
  const examples = [
    { label: 'Website URL', value: 'https://krynova.com' },
    { label: 'Business Card', value: 'John Doe\nCEO, Krynova Technologies\n+91 86305 19082\nprinceb744@gmail.com' },
    { label: 'WiFi Network', value: 'WIFI:S:Krynova;T:WPA;P:password123;;' },
    { label: 'Email', value: 'mailto:princeb744@gmail.com' },
    { label: 'Phone Number', value: 'tel:+918630519082' },
  ];

  const setExample = (value) => {
    setContent(value);
  };

  // Quick actions
  const quickActions = [
    { label: 'URL', icon: FaLink, value: 'https://' },
    { label: 'Text', icon: FaTextHeight, value: '' },
    { label: 'Email', icon: FaEnvelope, value: 'mailto:' },
    { label: 'Phone', icon: FaPhone, value: 'tel:' },
  ];

  const prependToContent = (prefix) => {
    setContent(prefix);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaQrcode className="text-green-500" />
            QR Code Generator
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            QR Code <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create custom QR codes for websites, products, business cards, and marketing materials instantly
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: 5/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaLock className="text-green-500" /> Premium: Unlimited
            </span>
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              <FaPalette className="text-purple-500" /> Custom Styles
            </span>
          </div>
        </div>

        {/* Usage Info */}
        {usageInfo && (
          <div className={`mb-6 p-4 rounded-lg flex flex-wrap items-center justify-between ${
            usageInfo.remaining > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className="text-sm">
              {usageInfo.isPremium ? (
                <span className="flex items-center gap-2"><FaCrown className="text-yellow-500" /> Premium: Unlimited QR codes</span>
              ) : (
                `${usageInfo.used} used today • ${usageInfo.remaining} free remaining`
              )}
            </p>
            {!usageInfo.isPremium && usageInfo.remaining === 0 && (
              <button
                onClick={handleUpgrade}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
              >
                Upgrade Now
              </button>
            )}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content / URL *</label>
                  <div className="relative">
                    <textarea
                      rows="3"
                      placeholder="Enter text, URL, WiFi config, vCard, or any data to encode"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {content.length} characters
                    </div>
                  </div>
                </div>

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

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => prependToContent(action.value)}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-green-50 rounded-lg text-xs transition border border-gray-200 hover:border-green-300 flex items-center gap-1"
                      >
                        <Icon className="text-green-500" />
                        {action.label}
                      </button>
                    );
                  })}
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
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-300'
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
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Premium Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label className="text-sm text-gray-700 flex items-center gap-1">
                    <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited + Custom Styles)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaQrcode />}
                  {loading ? 'Generating...' : 'Generate QR Code'}
                </button>
              </form>
            </div>

            {/* Preview */}
            <div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 h-full flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FaQrcode className="text-green-600" /> Preview
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{getStyleLabel()} • {getSizeLabel()}</span>
                  </div>
                </div>

                {result ? (
                  <>
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                      <img 
                        src={result} 
                        alt="QR Code" 
                        className="max-w-[250px] max-h-[250px] mx-auto"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 w-full">
                      <button
                        onClick={handleDownload}
                        className="flex-1 bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        <FaDownload /> Download
                      </button>
                      <button
                        onClick={handleCopy}
                        className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        <FaCopy /> Copy
                      </button>
                      <button
                        onClick={handlePrint}
                        className="flex-1 bg-gray-600 text-white py-2.5 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 text-sm font-semibold"
                      >
                        <FaPrint /> Print
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FaQrcode className="text-6xl mx-auto mb-4 opacity-30" />
                    <p>Your QR Code will appear here</p>
                    <p className="text-sm mt-2">Enter content and click Generate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        {qrHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaClock className="text-green-600" /> Recent QR Codes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {qrHistory.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center hover:shadow-md transition">
                  <img src={item.qr} alt="QR Code" className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 truncate">{item.content.substring(0, 20)}...</p>
                  <button
                    onClick={() => setContent(item.content)}
                    className="text-xs text-green-600 hover:text-green-800 transition mt-1"
                  >
                    Reuse
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade CTA */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
            <p className="text-green-100 mb-4">
              Get unlimited QR code generation, custom colors, gradients, and priority support.
            </p>
            <button
              onClick={handleUpgrade}
              className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5"
            >
              Upgrade Now — ₹499/month
            </button>
          </div>
        </div>
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
  );
};

export default QRGenerator;