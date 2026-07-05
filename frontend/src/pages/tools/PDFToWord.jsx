// src/pages/tools/PDFToWord.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFilePdf, 
  FaFileWord, FaCheckCircle, FaCircle, FaTimes, 
  FaEye, FaFileAlt, FaArrowRight, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaRegFileWord,
  FaClock, FaHistory, FaUpload,
  FaFile, FaImage, FaInfoCircle, FaChevronDown,
  FaChevronUp, FaRegFileExcel, FaFilePdf as FaFilePdfIcon,
  FaCog, FaGlobe, FaMapMarkerAlt, FaLanguage, FaHeadphones
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import PaymentModal from '../../components/PaymentModal';

// ============================================
// ✅ SAFE ARRAY HELPERS - Fix for .map() errors
// ============================================

const safeMap = (data, callback) => {
  if (!data) return null;
  const arr = Array.isArray(data) ? data : [];
  return arr.map(callback);
};

const safeArray = (data) => {
  return Array.isArray(data) ? data : [];
};

// ============================================
// SEO + GEO DATA
// ============================================

const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://krynovatechnology.pythonanywhere.com';

const indianCities = [
  "Agra", "Lucknow", "Kanpur", "Varanasi", "Prayagraj", "Mathura", "Aligarh", "Bareilly",
  "Meerut", "Ghaziabad", "Noida", "Delhi", "Mumbai", "Pune", "Bengaluru", "Chennai",
  "Hyderabad", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Indore", "Bhopal", "Nagpur",
  "Patna", "Ranchi", "Bhubaneswar", "Guwahati", "Chandigarh", "Dehradun", "Shimla",
  "Srinagar", "Jammu", "Amritsar", "Ludhiana", "Jalandhar", "Panchkula", "Mohali",
  "Gurugram", "Faridabad", "Aurangabad", "Nashik", "Vadodara", "Rajkot",
  "Jodhpur", "Udaipur", "Kota", "Bikaner", "Gwalior", "Jabalpur", "Ujjain", "Sagar",
  "Raipur", "Bilaspur", "Durgapur", "Asansol", "Siliguri", "Dhanbad", "Bhagalpur",
  "Muzaffarpur", "Gaya", "Nanded", "Solapur", "Mysore", "Tiruchirappalli", "Coimbatore",
  "Madurai", "Kochi", "Thiruvananthapuram", "Goa", "Panaji", "Puducherry"
];

const globalCountries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "United Arab Emirates", "Saudi Arabia", "Singapore", "Malaysia", "Indonesia",
  "Philippines", "South Africa", "Nigeria", "Kenya", "Tanzania", "Uganda", "Rwanda",
  "Egypt", "Morocco", "Turkey", "Russia", "Japan", "South Korea", "China", "Hong Kong",
  "Brazil", "Argentina", "Mexico", "New Zealand", "Ireland", "Netherlands", "Italy",
  "Spain", "Portugal", "Sweden", "Norway", "Denmark", "Finland", "Switzerland", "Austria"
];

// ============================================
// SUPPORTED FILE FORMATS
// ============================================

const SUPPORTED_FORMATS = [
  { id: 'pdf-to-word', label: 'PDF to Word', icon: FaFileWord, color: 'blue' },
  { id: 'pdf-to-excel', label: 'PDF to Excel', icon: FaRegFileExcel, color: 'green' },
  { id: 'pdf-to-image', label: 'PDF to Image', icon: FaImage, color: 'purple' },
  { id: 'image-to-pdf', label: 'Image to PDF', icon: FaFilePdfIcon, color: 'red' },
];

// ============================================
// CONVERSION HISTORY
// ============================================

const ConversionHistory = ({ history, onReuse }) => {
  const [expanded, setExpanded] = useState(false);

  if (safeArray(history).length === 0) return null;

  const displayedHistory = expanded ? history : history.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          <FaHistory className="text-blue-500" />
          <span className="font-semibold text-gray-700">Conversion History</span>
          <span className="text-xs text-gray-400">({safeArray(history).length})</span>
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
          {safeArray(history).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3 min-w-0">
                <FaFilePdf className="text-red-400 flex-shrink-0" />
                <span className="text-sm truncate">{item.filename}</span>
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
                      className="text-xs text-blue-500 hover:text-blue-700 transition"
                    >
                      Reuse
                    </button>
                  </>
                )}
                {item.status === 'failed' && (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <FaTimes className="text-xs" /> Failed
                  </span>
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
// CONVERSION OPTIONS
// ============================================

const ConversionOptions = ({ options, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaCog className="text-blue-500" /> Conversion Options
        </h4>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-blue-500 hover:text-blue-700 transition flex items-center gap-1"
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          {showAdvanced ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Output Format
          </label>
          <select
            value={options.format || 'docx'}
            onChange={(e) => onChange({ ...options, format: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="docx">Word Document (.docx)</option>
            <option value="doc">Word 97-2003 (.doc)</option>
            <option value="rtf">Rich Text Format (.rtf)</option>
          </select>
        </div>

        {showAdvanced && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Layout Preservation
              </label>
              <select
                value={options.layout || 'standard'}
                onChange={(e) => onChange({ ...options, layout: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="standard">Standard</option>
                <option value="exact">Exact (Slower)</option>
                <option value="flow">Flow Text</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Image Quality
              </label>
              <select
                value={options.imageQuality || 'medium'}
                onChange={(e) => onChange({ ...options, imageQuality: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low (Smaller File)</option>
                <option value="medium">Medium</option>
                <option value="high">High (Larger File)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="preserveFormatting"
                checked={options.preserveFormatting !== false}
                onChange={(e) => onChange({ ...options, preserveFormatting: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="preserveFormatting" className="text-xs text-gray-700">
                Preserve original formatting
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeImages"
                checked={options.includeImages !== false}
                onChange={(e) => onChange({ ...options, includeImages: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeImages" className="text-xs text-gray-700">
                Include images from PDF
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// BATCH CONVERSION COMPONENT
// ============================================

const BatchConversion = ({ files, onAddFiles, onRemoveFile, onClearAll }) => {
  if (safeArray(files).length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaUpload className="text-blue-500" /> Batch Queue ({safeArray(files).length} files)
        </h4>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-700 transition"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {safeArray(files).map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 min-w-0">
              <FaFile className="text-gray-400 flex-shrink-0" />
              <span className="text-sm truncate">{file.name}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemoveFile(index)}
              className="text-red-400 hover:text-red-600 transition flex-shrink-0"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => document.getElementById('batch-upload')?.click()}
        className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <FaPlus className="text-xs" /> Add More Files
      </button>
      <input
        id="batch-upload"
        type="file"
        accept=".pdf"
        multiple
        onChange={(e) => onAddFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

// ============================================
// MAIN PDF TO WORD COMPONENT
// ============================================

const PDFToWord = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [conversionOptions, setConversionOptions] = useState({
    format: 'docx',
    layout: 'standard',
    imageQuality: 'medium',
    preserveFormatting: true,
    includeImages: true,
  });
  const [batchMode, setBatchMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [conversionResults, setConversionResults] = useState([]);
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
          toast.success('🎉 Premium activated! Unlimited conversions.');
        }
      } catch (error) {
        console.error('Premium check failed:', error);
      }
    };
    checkPremiumStatus();
  }, []);

  // Load conversion history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('pdfConversionHistory');
    if (savedHistory) {
      try {
        setConversionHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // Save conversion history
  const saveToHistory = (filename, status, resultData) => {
    const newEntry = {
      filename,
      timestamp: new Date().toISOString(),
      status,
      result: resultData,
    };
    const updatedHistory = [newEntry, ...conversionHistory].slice(0, 20);
    setConversionHistory(updatedHistory);
    localStorage.setItem('pdfConversionHistory', JSON.stringify(updatedHistory));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndAddFile(selectedFile);
    }
  };

  const handleBatchFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    newFiles.forEach(file => validateAndAddFile(file, true));
  };

  const validateAndAddFile = (selectedFile, batch = false) => {
    if (selectedFile.type !== 'application/pdf') {
      toast.error(`${selectedFile.name} is not a PDF file`);
      return;
    }
    if (selectedFile.size > 15 * 1024 * 1024) {
      toast.error(`${selectedFile.name} exceeds 15MB limit`);
      return;
    }
    
    if (batch) {
      setFiles(prev => [...prev, selectedFile]);
      toast.success(`Added ${selectedFile.name} to queue`);
    } else {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const removeBatchFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllBatchFiles = () => {
    setFiles([]);
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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (batchMode) {
      droppedFiles.forEach(file => validateAndAddFile(file, true));
    } else {
      const droppedFile = droppedFiles[0];
      if (droppedFile) {
        validateAndAddFile(droppedFile, false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (batchMode) {
      if (safeArray(files).length === 0) {
        toast.error('Please add at least one PDF file');
        return;
      }
      await handleBatchSubmit();
    } else {
      if (!file) {
        toast.error('Please select a PDF file');
        return;
      }
      await handleSingleSubmit();
    }
  };

  const handleSingleSubmit = async () => {
    setLoading(true);
    setProgress(0);
    setProgressStatus('Starting conversion...');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_premium', isPremium);
    formData.append('options', JSON.stringify(conversionOptions));
    
    try {
      setProgress(30);
      setProgressStatus('Converting PDF...');
      
      const response = await api.pdfToWord(formData);
      
      setProgress(90);
      setProgressStatus('Finalizing...');
      
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        
        saveToHistory(file.name, 'completed', response.data);
        
        setProgress(100);
        setProgressStatus('✅ Conversion complete!');
        toast.success('✅ PDF converted to Word successfully!');
        
        if (isPremium) {
          setTimeout(() => downloadFile(), 1000);
        }
      }
    } catch (error) {
      setProgress(0);
      setProgressStatus('❌ Conversion failed');
      if (error.response?.data?.limit_reached) {
        toast.error('Free limit reached! Upgrade to premium for unlimited access.');
        setUsageInfo({
          used: error.response.data.usage_count,
          remaining: 0,
          isPremium: false
        });
        setShowPaymentModal(true);
      } else {
        toast.error(error.response?.data?.error || 'Failed to convert PDF');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 3000);
    }
  };

  const handleBatchSubmit = async () => {
    setLoading(true);
    setProgress(0);
    setProgressStatus('Starting batch conversion...');
    setConversionResults([]);

    const results = [];
    const total = safeArray(files).length;

    for (let i = 0; i < total; i++) {
      const currentFile = safeArray(files)[i];
      setProgressStatus(`Converting ${i + 1} of ${total}: ${currentFile.name}`);
      
      const formData = new FormData();
      formData.append('file', currentFile);
      formData.append('is_premium', isPremium);
      formData.append('options', JSON.stringify(conversionOptions));

      try {
        const response = await api.pdfToWord(formData);
        
        if (response.data.success) {
          results.push({
            filename: currentFile.name,
            result: response.data,
            success: true
          });
          saveToHistory(currentFile.name, 'completed', response.data);
        } else {
          results.push({
            filename: currentFile.name,
            error: response.data.error || 'Conversion failed',
            success: false
          });
        }
      } catch (error) {
        results.push({
          filename: currentFile.name,
          error: error.response?.data?.error || 'Conversion failed',
          success: false
        });
      }

      setProgress(((i + 1) / total) * 100);
    }

    setConversionResults(results);
    setProgress(100);
    setProgressStatus(`✅ Batch conversion complete! (${results.filter(r => r.success).length}/${total} succeeded)`);
    
    const successCount = results.filter(r => r.success).length;
    if (successCount > 0) {
      toast.success(`✅ ${successCount} files converted successfully!`);
    }
    if (successCount < total) {
      toast.warning(`⚠️ ${total - successCount} files failed to convert`);
    }

    setLoading(false);
    setTimeout(() => setProgress(0), 3000);
  };

  const downloadFile = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${result.file}`;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Word file downloaded!');
  };

  const downloadBatchFile = (resultData, filename) => {
    const link = document.createElement('a');
    link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${resultData.file}`;
    link.download = resultData.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllBatch = () => {
    const successful = safeArray(conversionResults).filter(r => r.success);
    if (successful.length === 0) {
      toast.error('No successful conversions to download');
      return;
    }
    
    successful.forEach((item, index) => {
      setTimeout(() => {
        downloadBatchFile(item.result, item.filename.replace('.pdf', '.docx'));
      }, index * 500);
    });
    toast.success(`Downloading ${successful.length} files...`);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    setProgressStatus('');
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const reuseHistory = (item) => {
    toast.success('Reusing previous conversion settings');
    setFile(null);
  };

  return (
    <>
      {/* ============================================ */}
      {/* SEO + AEO + GEO Helmet Implementation */}
      {/* ============================================ */}
      <Helmet>
        <title>Free PDF to Word Converter - Convert PDF to DOCX Online | Krynova Technologies</title>
        <meta name="description" content="Convert PDF to Word documents online for free with Krynova Technologies. Convert PDF to editable DOCX files while preserving formatting. Free users get 2 conversions per day. Premium users get unlimited conversions and batch processing." />
        <meta name="keywords" content="PDF to Word converter, convert PDF to DOCX, PDF to Word online, free PDF to Word converter, PDF to Word India, Krynova PDF to Word, best PDF to Word tool, PDF to Word converter free, editable PDF to Word" />
        <link rel="canonical" href={`${siteUrl}/tools/pdf-to-word`} />
        
        {/* GEO Meta Tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta name="serviceArea" content={`India, ${globalCountries.join(", ")}, Worldwide`} />
        <meta name="targetGeo" content="India" />
        
        {/* AEO Meta Tags */}
        <meta name="question" content="How to convert PDF to Word for free in India?" />
        <meta name="answer" content="Krynova Technologies offers a free PDF to Word converter in India. Upload your PDF file, choose your conversion options, and download your editable Word document. Free users get 2 conversions per day. Premium users get unlimited conversions and batch processing." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="voice-search" content="true" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free PDF to Word Converter - Convert PDF to DOCX Online | Krynova Technologies" />
        <meta property="og:description" content="Convert PDF to Word documents online for free. Convert PDF to editable DOCX files while preserving formatting. Free users get 2 conversions per day." />
        <meta property="og:url" content={`${siteUrl}/tools/pdf-to-word`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF to Word Converter - Convert PDF to DOCX Online" />
        <meta name="twitter:description" content="Convert PDF to Word documents online for free with Krynova Technologies." />
      </Helmet>

      {/* ============================================ */}
      {/* Speakable Content for Voice Assistants */}
      {/* ============================================ */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Free PDF to Word Converter - Krynova Technologies</h2>
        <p>Convert PDF to Word documents online for free. Convert PDF to editable DOCX files while preserving formatting.</p>
        <ul>
          <li>Free PDF to Word conversion - 2 conversions per day</li>
          <li>Convert PDF to DOCX, DOC, or RTF format</li>
          <li>Preserves original formatting and layout</li>
          <li>Includes images from PDF</li>
          <li>Batch conversion for multiple files</li>
          <li>Premium - Unlimited conversions, batch processing</li>
          <li>Secure and encrypted file processing</li>
        </ul>
        <p>Krynova Technologies is the best PDF to Word converter in India, serving cities like Agra, Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, and all across India.</p>
      </div>

      {/* ============================================ */}
      {/* Schema.org WebApplication */}
      {/* ============================================ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PDF to Word Converter",
          "description": "Free online PDF to Word converter. Convert PDF documents to editable DOCX files while preserving formatting. Supports 2 free conversions per day.",
          "url": `${siteUrl}/tools/pdf-to-word`,
          "applicationCategory": "Utilities",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "description": "Free PDF to Word converter with 2 conversions per day. Premium upgrade available for unlimited conversions and batch processing."
          },
          "provider": {
            "@type": "Organization",
            "name": "Krynova Technologies",
            "url": siteUrl,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Agra",
              "addressRegion": "Uttar Pradesh",
              "addressCountry": "India"
            }
          },
          "areaServed": indianCities,
          "availableLanguage": ["English", "Hindi", "Marathi", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam", "Gujarati", "Punjabi", "Urdu"],
          "potentialAction": {
            "@type": "CreateAction",
            "target": `${siteUrl}/tools/pdf-to-word`,
            "result": {
              "@type": "CreativeWork",
              "name": "Word Document"
            }
          }
        })}
      </script>

      {/* ============================================ */}
      {/* FAQ Schema */}
      {/* ============================================ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How to convert PDF to Word for free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To convert PDF to Word for free, visit Krynova Technologies' PDF to Word Converter, upload your PDF file, choose your conversion options, and click Convert. Download your editable Word document instantly. Free users get 2 conversions per day."
              }
            },
            {
              "@type": "Question",
              "name": "What formats does the PDF to Word converter support?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies' PDF to Word converter supports DOCX, DOC, and RTF output formats. DOCX is recommended for modern Word versions, while DOC is compatible with older versions."
              }
            },
            {
              "@type": "Question",
              "name": "Can I convert multiple PDFs to Word at once?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, you can convert multiple PDFs to Word at once using batch mode. Premium users get unlimited batch conversions. Free users are limited to 2 conversions per day."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best PDF to Word converter in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies offers one of the best free PDF to Word converters in India. It preserves original formatting, supports multiple output formats, offers batch processing, and serves users across all major Indian cities including Agra, Delhi, Mumbai, Bengaluru, Chennai, and Hyderabad."
              }
            },
            {
              "@type": "Question",
              "name": "Is it safe to convert PDF to Word online?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Krynova Technologies ensures secure PDF to Word conversion with encrypted file processing. All uploaded files are automatically deleted after conversion, and your documents are never shared with third parties."
              }
            },
            {
              "@type": "Question",
              "name": "Does the PDF to Word converter preserve formatting?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Krynova Technologies' PDF to Word converter preserves original formatting including fonts, layouts, tables, and images. You can choose between standard, exact, or flow layout preservation modes."
              }
            }
          ]
        })}
      </script>

      {/* ============================================ */}
      {/* Main Component */}
      {/* ============================================ */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaFilePdf className="text-blue-500" />
              Free PDF to Word Converter
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              PDF to <span className="gradient-text">Word Converter</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Convert PDF documents to editable Word (DOCX) files while preserving formatting and layout
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free: 2/day
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCrown className="text-yellow-500" /> Premium: Unlimited
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaShieldAlt className="text-purple-500" /> Secure & Private
              </span>
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                <FaUpload className="text-orange-500" /> Batch Mode
              </span>
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                <FaGlobe className="text-indigo-500" /> Serving 60+ Indian Cities
              </span>
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
                  <><FaCrown className="text-yellow-500" /> <span className="font-semibold">Premium:</span> Unlimited conversions</>
                ) : (
                  <><FaClock className="text-blue-500" /> {usageInfo.used} used today • {usageInfo.remaining} free remaining</>
                )}
              </p>
              {!usageInfo.isPremium && (
                <button
                  onClick={handleUpgrade}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  <FaCrown /> Upgrade Now
                </button>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="mb-6 bg-white rounded-xl p-4 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaSpinner className="animate-spin text-blue-500" />
                  {progressStatus}
                </span>
                <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            {/* Batch Mode Toggle */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={batchMode}
                    onChange={(e) => {
                      setBatchMode(e.target.checked);
                      if (e.target.checked) {
                        setFile(null);
                        setResult(null);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaUpload className="text-blue-500" /> Batch Mode
                  </label>
                </div>
                {batchMode && isPremium && (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                    Unlimited
                  </span>
                )}
              </div>
              {batchMode && !isPremium && (
                <button
                  onClick={handleUpgrade}
                  className="text-xs text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                >
                  <FaCrown className="text-yellow-500" /> Upgrade for Batch
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!batchMode && file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-500 text-2xl">
                        <FaFilePdf />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
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
                ) : batchMode && safeArray(files).length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FaCheckCircle className="text-2xl" />
                      <span className="font-medium">{safeArray(files).length} PDF(s) added to queue</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {safeArray(files).map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="truncate">{f.name}</span>
                          <span className="text-gray-400 text-xs ml-2">{formatFileSize(f.size)}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('batch-upload-input')?.click()}
                      className="text-sm text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaPlus className="inline mr-1" /> Add more files
                    </button>
                    <input
                      id="batch-upload-input"
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleBatchFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl text-blue-400 mx-auto">
                      <FaFilePdf className="mx-auto" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-lg">
                        {batchMode ? 'Drop PDFs here for batch conversion' : 'Drop your PDF here'}
                      </p>
                      <p className="text-sm text-gray-400">or click to browse</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {batchMode ? 'Multiple PDFs up to 15MB each' : 'Supports PDF up to 15MB'}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                      multiple={batchMode}
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer"
                    >
                      {batchMode ? 'Choose PDF Files' : 'Choose PDF File'}
                    </label>
                  </div>
                )}
              </div>

              {/* Conversion Options */}
              <ConversionOptions 
                options={conversionOptions}
                onChange={setConversionOptions}
              />

              {/* Premium Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited conversions + Batch)
                </label>
                {!isPremium && (
                  <span className="text-xs text-gray-400 ml-2">
                    (Free: 2/day)
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (batchMode ? safeArray(files).length === 0 : !file)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaFileWord />}
                {loading 
                  ? batchMode ? `Converting... ${Math.round(progress)}%` : 'Converting...'
                  : batchMode ? `Convert ${safeArray(files).length} Files to Word` : 'Convert to Word'
                }
              </button>
            </form>

            {/* Batch Results */}
            {safeArray(conversionResults).length > 0 && !loading && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" /> Conversion Results
                  </h4>
                  {safeArray(conversionResults).filter(r => r.success).length > 0 && (
                    <button
                      onClick={downloadAllBatch}
                      className="text-sm bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                    >
                      <FaDownload /> Download All
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {safeArray(conversionResults).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.success ? (
                          <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        ) : (
                          <FaTimes className="text-red-500 flex-shrink-0" />
                        )}
                        <span className="text-sm truncate">{item.filename}</span>
                        <span className={`text-xs ${item.success ? 'text-green-500' : 'text-red-500'}`}>
                          {item.success ? 'Success' : item.error}
                        </span>
                      </div>
                      {item.success && (
                        <button
                          onClick={() => downloadBatchFile(item.result, item.filename)}
                          className="text-blue-500 hover:text-blue-700 transition text-sm flex items-center gap-1 flex-shrink-0"
                        >
                          <FaDownload /> Download
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Single Result */}
            {result && !batchMode && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800">✅ Conversion Complete!</p>
                      <p className="text-sm text-green-600">Your PDF has been converted to Word format</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={downloadFile}
                      className="flex-1 bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                    >
                      <FaDownload /> Download Word File
                    </button>
                    <button
                      onClick={() => {
                        clearFile();
                        if (batchMode) {
                          clearAllBatchFiles();
                        }
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2 font-semibold"
                    >
                      <FaPlus /> Convert Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Conversion History */}
          <div className="mt-6">
            <ConversionHistory 
              history={conversionHistory} 
              onReuse={reuseHistory}
            />
          </div>

          {/* Features Section */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaShieldAlt className="text-3xl text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Secure Conversion</h4>
              <p className="text-xs text-gray-500">Files are encrypted and automatically deleted</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaRocket className="text-3xl text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Fast Processing</h4>
              <p className="text-xs text-gray-500">Convert documents in seconds</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaFileWord className="text-3xl text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Editable Word</h4>
              <p className="text-xs text-gray-500">Get fully editable Word documents</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaUpload className="text-3xl text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Batch Conversion</h4>
              <p className="text-xs text-gray-500">Convert multiple PDFs at once (Premium)</p>
            </div>
          </div>

          {/* Upgrade CTA */}
          {!isPremium && (
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
                <p className="text-blue-100 mb-4">
                  Get unlimited conversions, batch processing, advanced options, and priority support.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5"
                >
                  Upgrade Now — ₹99/month
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
        `}} />
      </div>
    </>
  );
};

export default PDFToWord;