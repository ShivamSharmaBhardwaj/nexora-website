// src/pages/tools/SplitPDF.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFilePdf, 
  FaCheckCircle, FaCircle, FaTimes, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaCut,
  FaFile, FaUpload, FaArrowRight, FaClock,
  FaHistory, FaChevronDown, FaChevronUp, FaCog,
  FaInfoCircle, FaRegFilePdf, FaSlidersH,
  FaList, FaTh, FaFileSignature, FaCompress,
  FaExpand, FaSearch, FaFilter, FaSort, FaSortAmountUp,
  FaSortAmountDown, FaCheckDouble, FaEye, FaEyeSlash,
  FaFileExport, FaFileImport
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import PaymentModal from '../../components/PaymentModal';

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// ============================================
// SPLIT OPTIONS
// ============================================

const SplitOptions = ({ options, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaCog className="text-red-500" /> Split Options
        </h4>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-red-500 hover:text-red-700 transition flex items-center gap-1"
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          {showAdvanced ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Split Mode
          </label>
          <select
            value={options.mode || 'all'}
            onChange={(e) => onChange({ ...options, mode: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Split All Pages</option>
            <option value="range">Split by Page Range</option>
            <option value="custom">Custom Selection</option>
          </select>
        </div>

        {options.mode === 'range' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Start Page
              </label>
              <input
                type="number"
                min="1"
                value={options.startPage || 1}
                onChange={(e) => onChange({ ...options, startPage: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End Page
              </label>
              <input
                type="number"
                min="1"
                value={options.endPage || 1}
                onChange={(e) => onChange({ ...options, endPage: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {options.mode === 'custom' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Page Numbers (comma separated, e.g., 1,3,5-8)
            </label>
            <input
              type="text"
              value={options.customPages || ''}
              onChange={(e) => onChange({ ...options, customPages: e.target.value })}
              placeholder="e.g., 1,3,5-8"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        )}

        {showAdvanced && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Output Format
              </label>
              <select
                value={options.outputFormat || 'separate'}
                onChange={(e) => onChange({ ...options, outputFormat: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="separate">Separate Files</option>
                <option value="single">Single File (Selected Pages)</option>
                <option value="ranges">Multiple Ranges</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="compressOutput"
                checked={options.compressOutput || false}
                onChange={(e) => onChange({ ...options, compressOutput: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <label htmlFor="compressOutput" className="text-xs text-gray-700">
                Compress output PDFs
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="mergeSelected"
                checked={options.mergeSelected || false}
                onChange={(e) => onChange({ ...options, mergeSelected: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <label htmlFor="mergeSelected" className="text-xs text-gray-700">
                Merge selected pages into one PDF
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// SPLIT HISTORY
// ============================================

const SplitHistory = ({ history, onReuse }) => {
  const [expanded, setExpanded] = useState(false);

  if (history.length === 0) return null;

  const displayedHistory = expanded ? history : history.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          <FaHistory className="text-red-500" />
          <span className="font-semibold text-gray-700">Split History</span>
          <span className="text-xs text-gray-400">({history.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {expanded ? 'Show less' : 'Show more'}
          </span>
          {expanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </div>
      </button>
      
      {expanded && (
        <div className="border-t border-gray-200 p-3 space-y-2 max-h-60 overflow-y-auto">
          {history.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3 min-w-0">
                <FaFilePdf className="text-red-400 flex-shrink-0" />
                <span className="text-sm truncate">{item.filename}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {item.pageCount} pages
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.status === 'completed' && (
                  <>
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <FaCheckCircle className="text-xs" /> Done
                    </span>
                    <button
                      onClick={() => onReuse(item)}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Reuse
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// PAGE PREVIEW COMPONENT
// ============================================

const PagePreview = ({ page, index, isSelected, onToggle, onDownload, totalPages }) => {
  return (
    <div 
      className={`p-3 rounded-lg border-2 text-center cursor-pointer transition ${
        isSelected 
          ? 'border-red-500 bg-red-50 shadow-md' 
          : 'border-gray-200 hover:border-red-300 bg-white hover:shadow'
      }`}
      onClick={() => onToggle(index)}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
        {isSelected && <FaCheckCircle className="text-red-500 text-xs" />}
      </div>
      <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center mb-2">
        <FaFilePdf className="text-2xl text-red-400" />
      </div>
      <p className="text-xs font-medium text-gray-700">Page {index + 1}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDownload(page, index);
        }}
        className="mt-1 text-red-600 hover:text-red-800 text-xs flex items-center justify-center gap-1 w-full py-1 rounded hover:bg-red-50 transition"
      >
        <FaDownload className="text-xs" /> Download
      </button>
    </div>
  );
};

// ============================================
// MAIN SPLIT PDF COMPONENT
// ============================================

const SplitPDF = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [splitHistory, setSplitHistory] = useState([]);
  const [splitOptions, setSplitOptions] = useState({
    mode: 'all',
    startPage: 1,
    endPage: 1,
    customPages: '',
    outputFormat: 'separate',
    compressOutput: false,
    mergeSelected: false,
  });
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const fileInputRef = useRef(null);

  // Check premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        let response;
        if (api.checkPremiumStatus) {
          response = await api.checkPremiumStatus();
        } else if (api.checkPremium) {
          response = await api.checkPremium();
        } else {
          return;
        }
        
        if (response.data && response.data.is_premium) {
          setIsPremium(true);
          toast.success('🎉 Premium activated! Unlimited splits.');
        }
      } catch (error) {
        console.error('Premium check failed:', error);
      }
    };
    checkPremiumStatus();
  }, []);

  // Load split history
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('pdfSplitHistory');
      if (savedHistory) {
        setSplitHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  const saveToHistory = (filename, status, resultData) => {
    const newEntry = {
      filename,
      pageCount: resultData.total_pages || 0,
      timestamp: new Date().toISOString(),
      status,
    };
    const updatedHistory = [newEntry, ...splitHistory].slice(0, 20);
    setSplitHistory(updatedHistory);
    try {
      localStorage.setItem('pdfSplitHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Could not save history:', e);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndAddFile(selectedFile);
    }
  };

  const validateAndAddFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }
    
    // ✅ Updated limits: Free = 20MB, Premium = 50MB
    const maxSize = isPremium ? 50 * 1024 * 1024 : 20 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(`File size must be less than ${isPremium ? '50MB' : '20MB'}. ${!isPremium ? 'Upgrade to premium for larger files.' : ''}`);
      return;
    }
    
    setFile(selectedFile);
    setResult(null);
    setSelectedPages([]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndAddFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    // Check if user has reached free limit (3 per day for free)
    if (!isPremium) {
      const today = new Date().toDateString();
      const splitUsage = JSON.parse(localStorage.getItem('pdfSplitUsage') || '{"date":"","count":0}');
      if (splitUsage.date === today && splitUsage.count >= 3) {
        toast.error('Free limit reached! Upgrade to premium for unlimited splits.');
        setShowPaymentModal(true);
        return;
      }
    }

    setLoading(true);
    setProgress(0);
    setProgressStatus('Starting split...');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_premium', isPremium);
    formData.append('options', JSON.stringify(splitOptions));
    
    try {
      setProgress(30);
      setProgressStatus('Processing PDF...');
      
      const response = await api.splitPdf(formData);
      
      setProgress(90);
      setProgressStatus('Finalizing split...');
      
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        
        // Track usage
        if (!isPremium) {
          const today = new Date().toDateString();
          const splitUsage = JSON.parse(localStorage.getItem('pdfSplitUsage') || '{"date":"","count":0}');
          if (splitUsage.date === today) {
            splitUsage.count += 1;
          } else {
            splitUsage.date = today;
            splitUsage.count = 1;
          }
          localStorage.setItem('pdfSplitUsage', JSON.stringify(splitUsage));
        }
        
        saveToHistory(file.name, 'completed', response.data);
        
        setProgress(100);
        setProgressStatus('✅ Split complete!');
        
        // Select all pages by default
        setSelectedPages(response.data.pages.map((_, i) => i));
        
        toast.success(`✅ ${response.data.total_pages} pages split successfully!`);
        
        if (isPremium) {
          setTimeout(() => {
            if (response.data.pages.length > 0) {
              downloadPage(response.data.pages[0], 0);
            }
          }, 1000);
        }
      }
    } catch (error) {
      setProgress(0);
      setProgressStatus('❌ Split failed');
      if (error.response?.data?.limit_reached) {
        toast.error('Free limit reached! Upgrade to premium for unlimited splits.');
        setUsageInfo({
          used: error.response.data.usage_count,
          remaining: 0,
          isPremium: false
        });
        setShowPaymentModal(true);
      } else {
        toast.error(error.response?.data?.error || 'Failed to split PDF');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 3000);
    }
  };

  const downloadPage = (pageData, index) => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pageData}`;
    link.download = `${file?.name?.replace('.pdf', '') || 'page'}-${index + 1}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSelected = () => {
    if (!result) return;
    const selected = selectedPages.map(i => result.pages[i]).filter(Boolean);
    if (selected.length === 0) {
      toast.error('Please select at least one page');
      return;
    }
    
    if (splitOptions.mergeSelected && selected.length > 1) {
      if (!isPremium) {
        toast.error('Merge selected pages is a premium feature. Please upgrade.');
        setShowPaymentModal(true);
        return;
      }
      toast.info('Merging selected pages... (Premium feature)');
    }
    
    selected.forEach((page, idx) => {
      setTimeout(() => {
        const originalIndex = result.pages.indexOf(page);
        downloadPage(page, originalIndex);
      }, idx * 400);
    });
    toast.success(`Downloading ${selected.length} pages...`);
  };

  const downloadAll = () => {
    if (!result) return;
    if (result.pages.length > 20 && !isPremium) {
      toast.warning('Large file detected. Premium users get faster bulk downloads.');
    }
    result.pages.forEach((page, index) => {
      setTimeout(() => downloadPage(page, index), index * 300);
    });
    toast.success(`Downloading ${result.pages.length} pages...`);
  };

  const togglePageSelection = (index) => {
    setSelectedPages(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const selectAll = () => {
    if (!result) return;
    if (selectedPages.length === result.pages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(result.pages.map((_, i) => i));
    }
  };

  const selectRange = (start, end) => {
    if (!result) return;
    const newSelected = [];
    for (let i = start; i <= end && i < result.pages.length; i++) {
      newSelected.push(i);
    }
    setSelectedPages(newSelected);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setSelectedPages([]);
    setProgress(0);
    setProgressStatus('');
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const reuseHistory = (item) => {
    toast.success('Reusing previous split settings');
    setFile(null);
  };

  // Get filtered pages based on search - FIXED for unique keys
  const getFilteredPages = () => {
    if (!result || !result.pages) return [];
    if (!searchTerm || searchTerm.trim() === '') return result.pages;
    
    const term = searchTerm.trim().toLowerCase();
    const uniquePages = [];
    const seen = new Set();
    
    // Handle range like "1-5"
    if (term.includes('-')) {
      const parts = term.split('-');
      const start = parseInt(parts[0]);
      const end = parseInt(parts[1]);
      if (!isNaN(start) && !isNaN(end)) {
        const startIdx = Math.max(0, start - 1);
        const endIdx = Math.min(result.pages.length, end);
        for (let i = startIdx; i < endIdx; i++) {
          if (!seen.has(i)) {
            seen.add(i);
            uniquePages.push(result.pages[i]);
          }
        }
        return uniquePages;
      }
    }
    
    // Handle single page
    const pageNum = parseInt(term);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= result.pages.length) {
      return [result.pages[pageNum - 1]];
    }
    
    // Handle multiple comma-separated pages like "1,3,5"
    if (term.includes(',')) {
      const parts = term.split(',').map(p => p.trim());
      for (const part of parts) {
        if (part.includes('-')) {
          const rangeParts = part.split('-');
          const start = parseInt(rangeParts[0]);
          const end = parseInt(rangeParts[1]);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start - 1; i < end && i < result.pages.length; i++) {
              if (!seen.has(i)) {
                seen.add(i);
                uniquePages.push(result.pages[i]);
              }
            }
          }
        } else {
          const num = parseInt(part);
          if (!isNaN(num) && num > 0 && num <= result.pages.length) {
            if (!seen.has(num - 1)) {
              seen.add(num - 1);
              uniquePages.push(result.pages[num - 1]);
            }
          }
        }
      }
      return uniquePages;
    }
    
    return result.pages;
  };

  const filteredPages = getFilteredPages();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaCut className="text-red-500" />
            Split PDF Pages
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Split <span className="gradient-text">PDF Pages</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Split large PDF files into separate pages or smaller documents with ease
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: 3/day • 20MB max
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaCrown className="text-yellow-500" /> Premium: Unlimited • 50MB max
            </span>
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
              <FaCut className="text-red-500" /> Individual Pages
            </span>
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              <FaCompress className="text-purple-500" /> Compress Output
            </span>
          </div>
        </div>

        {/* Usage Info */}
        {usageInfo && (
          <div className={`mb-6 p-4 rounded-lg flex flex-wrap items-center justify-between ${
            usageInfo.isPremium ? 'bg-green-50 border border-green-200' :
            usageInfo.remaining > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="text-sm flex flex-wrap items-center gap-2">
              {usageInfo.isPremium ? (
                <><FaCrown className="text-yellow-500" /> <span className="font-semibold">Premium:</span> Unlimited splits • 50MB files</>
              ) : (
                <>
                  <FaClock className="text-blue-500" />
                  <span>{usageInfo.used || 0} used today • {usageInfo.remaining || 0} remaining</span>
                  <span className="text-gray-400">|</span>
                  <span>20MB max file</span>
                </>
              )}
            </div>
            {!usageInfo.isPremium && (
              <button
                onClick={handleUpgrade}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                <FaCrown /> Upgrade Now
              </button>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {loading && progress > 0 && (
          <div className="mb-6 bg-white rounded-xl p-4 border border-red-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaSpinner className="animate-spin text-red-500" />
                {progressStatus}
              </span>
              <span className="text-sm font-semibold text-red-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-rose-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                dragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-500 text-2xl">
                      <FaFilePdf />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                      {!isPremium && file.size > 20 * 1024 * 1024 && (
                        <p className="text-xs text-red-500">⚠️ Exceeds free limit (20MB). Upgrade to premium.</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded-lg"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl text-red-400 mx-auto">
                    <FaCut className="mx-auto" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-lg">Drop your PDF here</p>
                    <p className="text-sm text-gray-400">or click to browse</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {isPremium ? 'Supports PDF up to 50MB' : 'Supports PDF up to 20MB (Premium: 50MB)'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="inline-block px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer"
                  >
                    Choose PDF File
                  </label>
                </div>
              )}
            </div>

            {/* Split Options */}
            <SplitOptions 
              options={splitOptions}
              onChange={setSplitOptions}
            />

            {/* Premium Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <label className="text-sm text-gray-700 flex items-center gap-1">
                <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited splits • 50MB files)
              </label>
              {!isPremium && (
                <span className="text-xs text-gray-400 ml-2">
                  (Free: 3/day • 20MB)
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaCut />}
              {loading ? 'Splitting...' : 'Split PDF'}
            </button>
          </form>

          {/* Results */}
          {result && result.pages && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border border-red-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">✅ Split Complete!</p>
                      <p className="text-sm text-red-600">{result.total_pages} pages extracted</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={selectAll}
                      className="text-sm bg-white px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                    >
                      {selectedPages.length === result.pages.length ? 'Deselect All' : 'Select All'}
                    </button>
                    {isPremium && (
                      <button
                        onClick={() => selectRange(0, 9)}
                        className="text-sm bg-white px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                      >
                        First 10
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Download Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={downloadSelected}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm flex items-center gap-2"
                  >
                    <FaDownload /> Download Selected ({selectedPages.length})
                  </button>
                  <button
                    onClick={downloadAll}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm flex items-center gap-2"
                  >
                    <FaDownload /> Download All
                  </button>
                  {isPremium && splitOptions.mergeSelected && selectedPages.length > 1 && (
                    <button
                      onClick={() => toast.info('Merging selected pages... (Premium)')}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition text-sm flex items-center gap-2"
                    >
                      <FaFileExport /> Merge & Download
                    </button>
                  )}
                </div>

                {/* View Controls */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded transition ${
                        viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title="Grid View"
                    >
                      <FaTh className="text-sm" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded transition ${
                        viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title="List View"
                    >
                      <FaList className="text-sm" />
                    </button>
                    <span className="text-xs text-gray-400 ml-2">
                      {selectedPages.length} of {result.pages.length} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search page..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-24"
                    />
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="text-xs text-gray-400 hover:text-gray-600 transition"
                    >
                      {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                    </button>
                  </div>
                </div>

                {/* Pages Grid - FIXED with unique keys */}
                <div className={`mt-4 max-h-96 overflow-y-auto custom-scrollbar ${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2 md:grid-cols-4 gap-3' 
                    : 'space-y-2'
                }`}>
                  {filteredPages.map((page, idx) => {
                    // Find the actual index in the original result
                    const index = result.pages.findIndex(p => p === page);
                    // ✅ Use a combination of index and page content hash as key
                    const uniqueKey = `${index}-${String(page).slice(0, 50)}-${idx}`;
                    
                    if (viewMode === 'grid') {
                      return (
                        <PagePreview
                          key={uniqueKey}
                          page={page}
                          index={index}
                          isSelected={selectedPages.includes(index)}
                          onToggle={togglePageSelection}
                          onDownload={downloadPage}
                          totalPages={result.pages.length}
                        />
                      );
                    } else {
                      return (
                        <div 
                          key={uniqueKey}
                          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${
                            selectedPages.includes(index) 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-200 hover:border-red-300 bg-white'
                          }`}
                          onClick={() => togglePageSelection(index)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-gray-500 w-8">#{index + 1}</span>
                            <FaFilePdf className="text-red-400" />
                            <span className="text-sm">Page {index + 1}</span>
                            <span className="text-xs text-gray-400">{formatSize(new Blob([page]).size)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedPages.includes(index) && (
                              <FaCheckCircle className="text-red-500 text-xs" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadPage(page, index);
                              }}
                              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>

                {filteredPages.length === 0 && result.pages.length > 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No pages found matching "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Split History */}
        <div className="mt-6">
          <SplitHistory 
            history={splitHistory} 
            onReuse={reuseHistory}
          />
        </div>

        {/* Features Section */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaCut className="text-3xl text-red-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Individual Pages</h4>
            <p className="text-xs text-gray-500">Split into separate PDF pages</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaShieldAlt className="text-3xl text-red-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Secure Processing</h4>
            <p className="text-xs text-gray-500">Files are encrypted and protected</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaRocket className="text-3xl text-red-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Fast Splitting</h4>
            <p className="text-xs text-gray-500">Split PDFs in seconds</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaCompress className="text-3xl text-red-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Compress Output</h4>
            <p className="text-xs text-gray-500">Reduce file size (Premium)</p>
          </div>
        </div>

        {/* Upgrade CTA */}
        {!isPremium && (
          <div className="mt-8 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
              <p className="text-red-100 mb-4">
                Get unlimited splits, 50MB file support, compress output, and priority support.
              </p>
              <button
                onClick={handleUpgrade}
                className="bg-white text-red-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5"
              >
                Upgrade Now — ₹499/month
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        userEmail={localStorage.getItem('userEmail') || ''}
        userId={localStorage.getItem('userId') || ''}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}} />
    </div>
  );
};

export default SplitPDF;