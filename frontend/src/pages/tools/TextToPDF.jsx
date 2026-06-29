// src/pages/tools/TextToPDF.jsx
import React, { useState } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFileAlt, 
  FaFilePdf, FaCheckCircle, FaCircle, FaTimes, 
  FaTrash, FaPlus, FaCrown, FaRocket, FaShieldAlt,
  FaMagic, FaArrowRight, FaUpload, FaEdit,
  FaBold, FaItalic, FaUnderline, FaAlignLeft,
  FaAlignCenter, FaAlignRight, FaListUl, FaListOl
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const TextToPDF = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('Document');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.trim() ? newText.trim().split(/\s+/).length : 0);
    setCharCount(newText.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }
    setLoading(true);
    
    try {
      const response = await api.textToPdf({
        text,
        title: title || 'Document',
        is_premium: isPremium
      });
      
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        toast.success('✅ PDF generated successfully!');
      }
    } catch (error) {
      if (error.response?.data?.limit_reached) {
        toast.error('Free limit reached! Upgrade to premium.');
        setUsageInfo({
          used: error.response.data.usage_count,
          remaining: 0,
          isPremium: false
        });
      } else {
        toast.error(error.response?.data?.error || 'Failed to generate PDF');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${result.file}`;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('PDF downloaded!');
  };

  const clearText = () => {
    setText('');
    setWordCount(0);
    setCharCount(0);
    setResult(null);
  };

  const loadSample = () => {
    const sample = `Krynova Technologies - Company Profile

About Us
Krynova Technologies is a leading web development company based in Agra, India. We specialize in creating custom web solutions for businesses of all sizes.

Our Services
• Custom Web Development
• HRMS Solutions
• Property Management Systems
• WhatsApp Automation Bots
• Data Analytics Solutions
• Security & Compliance

Why Choose Us
1. 8+ years of industry experience
2. 50+ successful enterprise systems built
3. 100% client satisfaction rate
4. 24/7 premium support
5. Cost-effective pricing starting from ₹15,000

Contact Information
Email: princeb744@gmail.com
Phone: +91 86305 19082
Location: Agra, Uttar Pradesh, India`;
    
    setText(sample);
    setWordCount(sample.trim() ? sample.trim().split(/\s+/).length : 0);
    setCharCount(sample.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaFileAlt className="text-cyan-500" />
            Text to PDF Generator
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Text to <span className="gradient-text">PDF Generator</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert text, HTML, or markdown content into professional PDF documents instantly
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: 5/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaLock className="text-green-500" /> Premium: Unlimited
            </span>
            <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm">
              <FaMagic className="text-cyan-500" /> Instant Conversion
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
                <span className="flex items-center gap-2"><FaCrown className="text-yellow-500" /> Premium: Unlimited conversions</span>
              ) : (
                `${usageInfo.used} used today • ${usageInfo.remaining} free remaining`
              )}
            </p>
            {!usageInfo.isPremium && usageInfo.remaining === 0 && (
              <button
                onClick={() => window.location.href = '/contact?upgrade=premium'}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
              >
                Upgrade Now
              </button>
            )}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter document title"
              />
            </div>

            {/* Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex flex-wrap gap-2">
                  <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Bold">
                    <FaBold className="text-sm text-gray-600" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Italic">
                    <FaItalic className="text-sm text-gray-600" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Underline">
                    <FaUnderline className="text-sm text-gray-600" />
                  </button>
                  <span className="w-px h-6 bg-gray-300 mx-1"></span>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Align Left">
                    <FaAlignLeft className="text-sm text-gray-600" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Align Center">
                    <FaAlignCenter className="text-sm text-gray-600" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Align Right">
                    <FaAlignRight className="text-sm text-gray-600" />
                  </button>
                  <span className="w-px h-6 bg-gray-300 mx-1"></span>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Bullet List">
                    <FaListUl className="text-sm text-gray-600" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Numbered List">
                    <FaListOl className="text-sm text-gray-600" />
                  </button>
                </div>
                <textarea 
                  rows="10" 
                  value={text} 
                  onChange={handleTextChange} 
                  className="w-full px-4 py-3 focus:outline-none resize-y min-h-[200px]"
                  placeholder="Enter your text content here... Use bullet points with - or * for lists"
                />
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>Words: {wordCount}</span>
                  <span>Characters: {charCount}</span>
                </div>
                <button
                  type="button"
                  onClick={loadSample}
                  className="text-xs text-cyan-600 hover:text-cyan-800 transition"
                >
                  Load Sample Text
                </button>
              </div>
            </div>

            {/* Premium Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700 flex items-center gap-1">
                <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited conversions)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaFilePdf />}
              {loading ? 'Generating...' : 'Generate PDF'}
            </button>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                    <FaCheckCircle />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-cyan-800">✅ PDF Generated!</p>
                    <p className="text-sm text-cyan-600">
                      Document "{title}" created with {wordCount} words
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Words</p>
                    <p className="font-bold text-gray-900">{wordCount}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Characters</p>
                    <p className="font-bold text-gray-900">{charCount}</p>
                  </div>
                </div>

                <button
                  onClick={downloadFile}
                  className="w-full bg-cyan-500 text-white py-2.5 rounded-lg hover:bg-cyan-600 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg mt-4"
                >
                  <FaDownload /> Download PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaMagic className="text-3xl text-cyan-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Instant Conversion</h4>
            <p className="text-xs text-gray-500">Convert text to PDF in seconds</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaEdit className="text-3xl text-cyan-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Rich Text Support</h4>
            <p className="text-xs text-gray-500">Supports formatting and lists</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaShieldAlt className="text-3xl text-cyan-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Secure & Private</h4>
            <p className="text-xs text-gray-500">Your content is safe and private</p>
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

export default TextToPDF;