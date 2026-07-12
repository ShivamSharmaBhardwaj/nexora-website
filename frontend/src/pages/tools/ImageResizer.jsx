// src/pages/tools/ImageResizer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaImage, 
  FaCheckCircle, FaCircle, FaTimes, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaArrowsAlt,
  FaExpand, FaCompress, FaUpload, FaArrowRight, FaClock,
  FaHistory, FaChevronDown, FaChevronUp, FaCog,
  FaInfoCircle, FaRegFileImage, FaSlidersH,
  FaList, FaTh, FaFileSignature, FaCompressAlt,
  FaExpandAlt, FaSearch, FaFilter, FaSort, FaSortAmountUp,
  FaSortAmountDown, FaCheckDouble, FaEye, FaEyeSlash,
  FaFileExport, FaFileImport, FaCrop, FaMagic,
  FaMapPin, FaGlobe, FaMicrophone, FaComments, FaPenFancy
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import { secureStorage } from '../../utils/security';
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
// ✅ INDIAN CITIES FOR GEO TARGETING
// ============================================
const indianCities = [
  "Agra", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", 
  "Pune", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Lucknow", 
  "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", 
  "Patna", "Vadodara", "Ludhiana", "Nashik", "Faridabad", "Meerut", 
  "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", 
  "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", 
  "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", 
  "Chandigarh", "Guwahati", "Solapur", "Hubballi-Dharwad", "Mysore", 
  "Tiruchirappalli", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", 
  "Dehradun", "Noida", "Gurugram", "Ghaziabad", "Faridabad"
];

// ✅ GLOBAL COUNTRIES
const globalCountries = [
  "USA", "UK", "Canada", "Australia", "UAE", "Singapore", 
  "Germany", "France", "Japan", "South Korea", "Netherlands", 
  "Sweden", "Norway", "Denmark", "Finland", "New Zealand", 
  "Ireland", "Malaysia", "Thailand", "Vietnam", "Indonesia", 
  "Philippines", "South Africa", "Kenya", "Nigeria", "Egypt", 
  "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"
];

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
// RESIZE OPTIONS COMPONENT
// ============================================
const ResizeOptions = ({ options, onChange, isPremium }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaCog className="text-pink-500" /> Resize Options
        </h4>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-pink-500 hover:text-pink-700 transition flex items-center gap-1"
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          {showAdvanced ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Quality
          </label>
          <select
            value={options.quality || 'medium'}
            onChange={(e) => onChange({ ...options, quality: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="high">High (Best Quality)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="low">Low (Smallest File)</option>
          </select>
        </div>

        {showAdvanced && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            {isPremium ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Output Format
                  </label>
                  <select
                    value={options.format || 'PNG'}
                    onChange={(e) => onChange({ ...options, format: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="PNG">PNG (Transparent)</option>
                    <option value="JPEG">JPEG (Smaller)</option>
                    <option value="WEBP">WEBP (Modern)</option>
                    <option value="GIF">GIF (Animated)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Background Color (for transparent images)
                  </label>
                  <input
                    type="color"
                    value={options.background || '#ffffff'}
                    onChange={(e) => onChange({ ...options, background: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-10"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="preserveMetadata"
                    checked={options.preserveMetadata || false}
                    onChange={(e) => onChange({ ...options, preserveMetadata: e.target.checked })}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label htmlFor="preserveMetadata" className="text-xs text-gray-700">
                    Preserve EXIF metadata
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoEnhance"
                    checked={options.autoEnhance || false}
                    onChange={(e) => onChange({ ...options, autoEnhance: e.target.checked })}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label htmlFor="autoEnhance" className="text-xs text-gray-700">
                    Auto-enhance colors (Premium)
                  </label>
                </div>
              </>
            ) : (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-700 flex items-center gap-2">
                  <FaCrown className="text-yellow-500" />
                  Upgrade to premium for advanced options: Output formats, EXIF preservation, Auto-enhance, and more!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// RESIZE HISTORY COMPONENT
// ============================================
const ResizeHistory = ({ history, onReuse }) => {
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
          <FaHistory className="text-pink-500" />
          <span className="font-semibold text-gray-700">Resize History</span>
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
                <FaImage className="text-pink-400 flex-shrink-0" />
                <span className="text-sm truncate">{item.filename}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {item.originalSize} → {item.newSize}
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
                      className="text-xs text-pink-500 hover:text-pink-700 transition"
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
// MAIN IMAGE RESIZER
// ============================================
const ImageResizer = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [userId, setUserId] = useState('anonymous');
  const [dragActive, setDragActive] = useState(false);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [preview, setPreview] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [resizeHistory, setResizeHistory] = useState([]);
  const [resizeOptions, setResizeOptions] = useState({
    quality: 'medium',
    format: 'PNG',
    background: '#ffffff',
    preserveMetadata: false,
    autoEnhance: false,
  });
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [conversionResults, setConversionResults] = useState([]);
  const fileInputRef = useRef(null);

  const siteUrl = window.location.origin;
  const MAX_DIMENSION_FREE = 1200;
  const MAX_DIMENSION_PREMIUM = 8000;

  // ✅ Get user ID from storage
  useEffect(() => {
    try {
      const user = secureStorage.get('user');
      if (user?.id) {
        setUserId(user.id);
      } else if (user?.email) {
        setUserId(user.email);
      }
    } catch (e) {
      console.warn('Could not get user:', e);
    }
  }, []);

  // ✅ Check premium status with proper user ID
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await api.checkPremium(userId);
        
        if (response.data && response.data.is_premium) {
          setIsPremium(true);
          toast.success('🎉 Premium activated! Unlimited large resizing.');
        }
      } catch (error) {
        console.error('Premium check failed:', error);
        // Default to free
        setIsPremium(false);
      }
    };
    
    if (userId) {
      checkPremiumStatus();
    }
  }, [userId]);

  // Load resize history
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('imageResizeHistory');
      if (savedHistory) {
        setResizeHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  const saveToHistory = (filename, status, resultData) => {
    const newEntry = {
      filename,
      originalSize: `${resultData.original_size[0]}x${resultData.original_size[1]}`,
      newSize: `${resultData.new_size[0]}x${resultData.new_size[1]}`,
      timestamp: new Date().toISOString(),
      status,
    };
    const updatedHistory = [newEntry, ...resizeHistory].slice(0, 20);
    setResizeHistory(updatedHistory);
    try {
      localStorage.setItem('imageResizeHistory', JSON.stringify(updatedHistory));
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

  const handleBatchFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    newFiles.forEach(file => validateAndAddFile(file, true));
  };

  const validateAndAddFile = (selectedFile, batch = false) => {
    if (!selectedFile.type.startsWith('image/')) {
      toast.error(`${selectedFile.name} is not an image file`);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error(`${selectedFile.name} exceeds 10MB limit`);
      return;
    }
    
    if (batch) {
      setFiles(prev => [...prev, selectedFile]);
      toast.success(`Added ${selectedFile.name} to queue`);
    } else {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
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
      if (files.length === 0) {
        toast.error('Please add at least one image');
        return;
      }
      await handleBatchSubmit();
    } else {
      if (!file) {
        toast.error('Please select an image');
        return;
      }
      await handleSingleSubmit();
    }
  };

  const handleSingleSubmit = async () => {
    const maxDim = isPremium ? MAX_DIMENSION_PREMIUM : MAX_DIMENSION_FREE;
    if (width > maxDim || height > maxDim) {
      toast.error(`Free users can resize up to ${MAX_DIMENSION_FREE}x${MAX_DIMENSION_FREE}. Upgrade to premium for larger sizes.`);
      setShowPaymentModal(true);
      return;
    }

    if (width < 10 || height < 10) {
      toast.error('Width and height must be at least 10px');
      return;
    }

    setLoading(true);
    setProgress(0);
    setProgressStatus('Starting resize...');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('is_premium', isPremium ? 'true' : 'false');
    formData.append('user_id', userId);
    formData.append('options', JSON.stringify(resizeOptions));
    formData.append('batch_mode', 'false');
    
    try {
      setProgress(30);
      setProgressStatus('Processing image...');
      
      const response = await api.imageResizer(formData);
      
      setProgress(90);
      setProgressStatus('Finalizing...');
      
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium,
          maxDimension: response.data.max_dimension
        });
        
        saveToHistory(file.name, 'completed', response.data);
        
        setProgress(100);
        setProgressStatus('✅ Resize complete!');
        toast.success(`✅ Image resized from ${response.data.original_size[0]}x${response.data.original_size[1]} to ${response.data.new_size[0]}x${response.data.new_size[1]}!`);
        
        if (isPremium) {
          setTimeout(() => downloadImage(), 1000);
        }
      }
    } catch (error) {
      setProgress(0);
      setProgressStatus('❌ Resize failed');
      if (error.response?.data?.limit_reached) {
        toast.error('Dimension limit reached! Upgrade to premium for larger sizes.');
        setUsageInfo({
          used: error.response.data.usage_count,
          remaining: 0,
          isPremium: false
        });
        setShowPaymentModal(true);
      } else {
        toast.error(error.response?.data?.error || 'Failed to resize image');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 3000);
    }
  };

  const handleBatchSubmit = async () => {
    setLoading(true);
    setProgress(0);
    setProgressStatus('Starting batch resize...');
    setConversionResults([]);

    const results = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      setProgressStatus(`Resizing ${i + 1} of ${total}: ${currentFile.name}`);
      
      const formData = new FormData();
      formData.append('file', currentFile);
      formData.append('width', width);
      formData.append('height', height);
      formData.append('is_premium', isPremium ? 'true' : 'false');
      formData.append('user_id', userId);
      formData.append('options', JSON.stringify(resizeOptions));
      formData.append('batch_mode', 'true');

      try {
        const response = await api.imageResizer(formData);
        
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
            error: response.data.error || 'Resize failed',
            success: false
          });
        }
      } catch (error) {
        results.push({
          filename: currentFile.name,
          error: error.response?.data?.error || 'Resize failed',
          success: false
        });
      }

      setProgress(((i + 1) / total) * 100);
    }

    setConversionResults(results);
    setProgress(100);
    setProgressStatus(`✅ Batch resize complete! (${results.filter(r => r.success).length}/${total} succeeded)`);
    
    const successCount = results.filter(r => r.success).length;
    if (successCount > 0) {
      toast.success(`✅ ${successCount} images resized successfully!`);
    }
    if (successCount < total) {
      toast.warning(`⚠️ ${total - successCount} images failed to resize`);
    }

    setLoading(false);
    setTimeout(() => setProgress(0), 3000);
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.image;
    link.download = `resized-${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  const downloadBatchFile = (resultData, filename) => {
    const link = document.createElement('a');
    link.href = resultData.image;
    link.download = `resized-${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllBatch = () => {
    const successful = conversionResults.filter(r => r.success);
    if (successful.length === 0) {
      toast.error('No successful resizes to download');
      return;
    }
    
    successful.forEach((item, index) => {
      setTimeout(() => {
        downloadBatchFile(item.result, item.filename);
      }, index * 500);
    });
    toast.success(`Downloading ${successful.length} files...`);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setPreview(null);
    setProgress(0);
    setProgressStatus('');
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const reuseHistory = (item) => {
    toast.success('Reusing previous resize settings');
    setFile(null);
  };

  const presets = [
    { label: 'Social Media', w: 1080, h: 1080 },
    { label: 'Website', w: 1200, h: 800 },
    { label: 'Thumbnail', w: 300, h: 300 },
    { label: 'Banner', w: 1920, h: 500 },
    { label: 'Profile', w: 400, h: 400 },
    { label: 'Blog', w: 800, h: 600 },
  ];

  const applyPreset = (w, h) => {
    const maxDim = isPremium ? MAX_DIMENSION_PREMIUM : MAX_DIMENSION_FREE;
    if (w > maxDim || h > maxDim) {
      toast.warning(`This preset requires premium. Max free size is ${MAX_DIMENSION_FREE}x${MAX_DIMENSION_FREE}`);
      if (!isPremium) {
        setShowPaymentModal(true);
        return;
      }
    }
    setWidth(w);
    setHeight(h);
  };

  return (
    <>
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO */}
      {/* ========================================== */}
      <Helmet>
        <title>Free Image Resizer - Resize Images Online | Krynova Technologies</title>
        <meta name="description" content="Resize images online for free with our image resizer tool. Resize images to any dimension up to 8000x8000, batch processing, quality optimization. No sign-up required. Best free image resizer in India and globally." />
        <meta name="keywords" content="free image resizer, resize image online, image resizer tool, bulk image resizer, resize photo, image optimizer, best image resizer, image resizer India, Krynova image resizer, resize JPG PNG, image dimensions tool" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        <link rel="canonical" href={`${siteUrl}/tools/image-resizer`} />
        
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="city" content="Agra" />
        <meta name="state" content="Uttar Pradesh" />
        <meta name="country" content="India" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta name="serviceArea" content={`India, ${globalCountries.join(", ")}, Worldwide`} />
        <meta name="targetedCities" content={indianCities.join(", ")} />
        <meta name="targetedCountries" content={globalCountries.join(", ")} />
        <meta name="language" content="en, hi, bn, te, ta, ur, gu, mr, kn, ml, pa" />
        
        <meta name="question" content="What is the best free image resizer in India?" />
        <meta name="answer" content="Krynova Technologies offers the best free image resizer in India with custom dimensions up to 8000x8000, batch processing, quality optimization, and multiple format support. No sign-up required." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="free image resizer, resize image online, bulk image resizer, photo resizer, image optimizer" />
        
        <meta name="rich-snippet" content="tool" />
        <meta name="structured-data" content="true" />
        <meta name="application-category" content="Image Resizer" />
        <meta name="application-rating" content="4.9" />
        
        <meta property="og:title" content="Free Image Resizer - Resize Images Online | Krynova Technologies" />
        <meta property="og:description" content="Resize images online for free. Custom dimensions up to 8000x8000, batch processing, quality optimization. No sign-up required." />
        <meta property="og:url" content={`${siteUrl}/tools/image-resizer`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Resizer - Resize Images Online" />
        <meta name="twitter:description" content="Resize images online for free. No sign-up required." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Free Image Resizer - Krynova Technologies</h2>
        <p>Resize images online for free with our image resizer tool. Resize images to any dimension up to 8000x8000, batch processing, quality optimization, and multiple format support.</p>
        <p>Available for users in Agra, Delhi, Mumbai, Bangalore, and all Indian cities, as well as globally in USA, UK, Canada, Australia, and more.</p>
        <ul>
          <li>Custom dimensions up to 8000x8000 (Premium)</li>
          <li>Batch processing for multiple images</li>
          <li>Quality optimization (High, Medium, Low)</li>
          <li>Multiple output formats (PNG, JPEG, WEBP, GIF)</li>
          <li>Preserve EXIF metadata</li>
          <li>No sign-up required for free tier</li>
        </ul>
        <p>Best free image resizer for professionals and businesses worldwide.</p>
      </div>

      {/* ========================================== */}
      {/* ✅ SCHEMA.ORG - WebApplication */}
      {/* ========================================== */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Image Resizer",
          "description": "Free online image resizer with custom dimensions up to 8000x8000, batch processing, and quality optimization.",
          "url": `${siteUrl}/tools/image-resizer`,
          "applicationCategory": "Multimedia",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "description": "Free tier with unlimited resizes up to 1200x1200. Premium upgrade for larger sizes and advanced features."
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "180"
          },
          "provider": {
            "@type": "Organization",
            "name": "Krynova Technologies",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Agra",
              "addressRegion": "Uttar Pradesh",
              "addressCountry": "India"
            }
          },
          "areaServed": indianCities,
          "availableLanguage": ["English", "Hindi", "Bengali", "Telugu", "Tamil", "Urdu", "Gujarati", "Marathi", "Kannada", "Malayalam", "Punjabi"],
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          }
        })}
      </script>

      {/* ========================================== */}
      {/* ✅ FAQ Schema */}
      {/* ========================================== */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is the image resizer free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our image resizer offers a free tier with unlimited resizes up to 1200x1200. Premium upgrade available for larger sizes up to 8000x8000 and advanced features."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to sign up to use the image resizer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No sign-up is required! You can resize images instantly without creating an account."
              }
            },
            {
              "@type": "Question",
              "name": "What image formats are supported?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our image resizer supports JPG, PNG, WEBP, and GIF formats. Premium users can convert between these formats."
              }
            },
            {
              "@type": "Question",
              "name": "Can I resize multiple images at once?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Premium users can resize multiple images in batch mode, saving time and effort."
              }
            }
          ]
        })}
      </script>

      {/* ========================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================== */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaImage className="text-pink-500" />
              Image Resizer & Optimizer
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Image <span className="gradient-text">Resizer</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Resize and optimize images. Free users unlimited up to 1200x1200, premium users up to 8000x8000!
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free: Unlimited • 1200x1200
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCrown className="text-yellow-500" /> Premium: Unlimited • 8000x8000
              </span>
              <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                <FaExpand className="text-pink-500" /> Presets Available
              </span>
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                <FaUpload className="text-orange-500" /> Batch Mode
              </span>
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                <FaMapPin className="text-yellow-500" /> {indianCities.length}+ Cities
              </span>
              <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm">
                <FaGlobe className="text-cyan-500" /> {globalCountries.length}+ Countries
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
                  <><FaCrown className="text-yellow-500" /> <span className="font-semibold">Premium:</span> Unlimited • Up to 8000x8000</>
                ) : (
                  <>
                    <FaClock className="text-blue-500" />
                    <span>Unlimited resizes • Max {usageInfo.maxDimension || 1200}x{usageInfo.maxDimension || 1200}</span>
                  </>
                )}
              </div>
              {!usageInfo.isPremium && (
                <button
                  onClick={handleUpgrade}
                  className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  <FaCrown /> Upgrade Now
                </button>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="mb-6 bg-white rounded-xl p-4 border border-pink-200 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaSpinner className="animate-spin text-pink-500" />
                  {progressStatus}
                </span>
                <span className="text-sm font-semibold text-pink-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-rose-600 h-2.5 rounded-full transition-all duration-500"
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
                        setPreview(null);
                      }
                    }}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaUpload className="text-pink-500" /> Batch Mode
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
                  className="text-xs text-pink-600 hover:text-pink-800 transition flex items-center gap-1"
                >
                  <FaCrown className="text-yellow-500" /> Upgrade for Batch
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
                  dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!batchMode && file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center text-pink-500 text-2xl">
                        <FaImage />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
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
                ) : batchMode && files.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FaCheckCircle className="text-2xl" />
                      <span className="font-medium">{safeArray(files).length} image(s) added to queue</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {safeArray(files).map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="truncate">{f.name}</span>
                          <span className="text-gray-400 text-xs ml-2">{formatSize(f.size)}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('batch-upload-input')?.click()}
                      className="text-sm text-pink-600 hover:text-pink-800 transition"
                    >
                      <FaPlus className="inline mr-1" /> Add more images
                    </button>
                    <input
                      id="batch-upload-input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleBatchFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl text-pink-400 mx-auto">
                      <FaImage className="mx-auto" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-lg">
                        {batchMode ? 'Drop images here for batch resize' : 'Drop your image here'}
                      </p>
                      <p className="text-sm text-gray-400">or click to browse</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {batchMode ? 'Multiple images up to 10MB each' : 'Supports JPG, PNG, WEBP, GIF up to 10MB'}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                      multiple={batchMode}
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer"
                    >
                      {batchMode ? 'Choose Images' : 'Choose Image'}
                    </label>
                  </div>
                )}
              </div>

              {/* Preview */}
              {preview && !batchMode && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                  <img src={preview} alt="Preview" className="max-h-32 mx-auto object-contain" />
                </div>
              )}

              {/* Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {safeArray(presets).map((preset, index) => {
                    const isPremiumPreset = preset.w > MAX_DIMENSION_FREE || preset.h > MAX_DIMENSION_FREE;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => applyPreset(preset.w, preset.h)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition border ${
                          isPremiumPreset 
                            ? 'bg-yellow-50 hover:bg-yellow-100 border-yellow-300 text-yellow-700' 
                            : 'bg-gray-100 hover:bg-pink-100 border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        {preset.label} ({preset.w}x{preset.h})
                        {isPremiumPreset && <FaCrown className="inline ml-1 text-yellow-500 text-xs" />}
                      </button>
                    );
                  })}
                </div>
                {!isPremium && (
                  <p className="text-xs text-gray-400 mt-2">
                    ⚡ Presets with <FaCrown className="inline text-yellow-500 text-xs" /> require premium for sizes above {MAX_DIMENSION_FREE}x{MAX_DIMENSION_FREE}
                  </p>
                )}
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                  <input 
                    type="number" 
                    value={width} 
                    onChange={(e) => setWidth(parseInt(e.target.value) || 0)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min="10"
                    max={isPremium ? 8000 : 1200}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min="10"
                    max={isPremium ? 8000 : 1200}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded"
                />
                <label className="text-sm text-gray-700">Maintain aspect ratio</label>
              </div>

              <div className="text-xs text-gray-400">
                {isPremium ? (
                  <span className="text-green-600">✨ Premium: Up to 8000x8000</span>
                ) : (
                  <span>📐 Free: Up to {MAX_DIMENSION_FREE}x{MAX_DIMENSION_FREE} • <button onClick={handleUpgrade} className="text-pink-600 hover:underline">Upgrade for larger sizes</button></span>
                )}
              </div>

              {/* Resize Options */}
              <ResizeOptions 
                options={resizeOptions}
                onChange={setResizeOptions}
                isPremium={isPremium}
              />

              {/* Premium Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                />
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited • 8000x8000 • Advanced)
                </label>
                {!isPremium && (
                  <span className="text-xs text-gray-400 ml-2">
                    (Free: Unlimited • 1200x1200)
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (batchMode ? files.length === 0 : !file)}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaArrowsAlt />}
                {loading 
                  ? batchMode ? `Resizing... ${Math.round(progress)}%` : 'Resizing...'
                  : batchMode ? `Resize ${safeArray(files).length} Images to ${width}x${height}` : `Resize to ${width}x${height}`
                }
              </button>
            </form>

            {/* Batch Results */}
            {safeArray(conversionResults).length > 0 && !loading && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" /> Resize Results
                  </h4>
                  {safeArray(conversionResults).filter(r => r.success).length > 0 && (
                    <button
                      onClick={downloadAllBatch}
                      className="text-sm bg-pink-500 text-white px-4 py-1.5 rounded-lg hover:bg-pink-600 transition flex items-center gap-2"
                    >
                      <FaDownload /> Download All
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
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
                          {item.success ? `${item.result.new_size[0]}x${item.result.new_size[1]}` : item.error}
                        </span>
                      </div>
                      {item.success && (
                        <button
                          onClick={() => downloadBatchFile(item.result, item.filename)}
                          className="text-pink-500 hover:text-pink-700 transition text-sm flex items-center gap-1 flex-shrink-0"
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
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-pink-800">✅ Resize Complete!</p>
                      <p className="text-sm text-pink-600">
                        {result.original_size[0]}x{result.original_size[1]} → {result.new_size[0]}x{result.new_size[1]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Original</p>
                      <p className="font-bold text-gray-900">{result.original_size[0]}x{result.original_size[1]}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Resized</p>
                      <p className="font-bold text-green-600">{result.new_size[0]}x{result.new_size[1]}</p>
                    </div>
                  </div>

                  {result.image && (
                    <img src={result.image} alt="Resized" className="max-h-48 mx-auto my-3 border border-gray-200 rounded-lg" />
                  )}

                  <button
                    onClick={downloadImage}
                    className="w-full bg-pink-500 text-white py-2.5 rounded-lg hover:bg-pink-600 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                  >
                    <FaDownload /> Download Resized Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resize History */}
          <div className="mt-6">
            <ResizeHistory 
              history={resizeHistory} 
              onReuse={reuseHistory}
            />
          </div>

          {/* Features Section */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaExpand className="text-3xl text-pink-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Custom Dimensions</h4>
              <p className="text-xs text-gray-500">Up to 8000x8000 (Premium)</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaCompress className="text-3xl text-pink-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Optimize Quality</h4>
              <p className="text-xs text-gray-500">Maintain quality while resizing</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaRocket className="text-3xl text-pink-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Fast Processing</h4>
              <p className="text-xs text-gray-500">Resize images in seconds</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaUpload className="text-3xl text-pink-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Batch Processing</h4>
              <p className="text-xs text-gray-500">Resize multiple images (Premium)</p>
            </div>
          </div>

          {/* Upgrade CTA */}
          {!isPremium && (
            <div className="mt-8 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
                <p className="text-pink-100 mb-4">
                  Get unlimited large resizing up to 8000x8000, batch processing, advanced formats, and priority support.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="bg-white text-pink-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5"
                >
                  Upgrade Now — ₹99/month
                </button>
                <p className="text-pink-200 text-xs mt-3">Available in {indianCities.length}+ Indian cities and {globalCountries.length}+ countries worldwide</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        userEmail={localStorage.getItem('userEmail') || ''}
        userId={userId}
        onSuccess={() => {
          setIsPremium(true);
          toast.success('🎉 Premium activated! Enjoy unlimited resizing.');
          // Refresh premium status
          api.checkPremium(userId).then(res => {
            if (res.data?.is_premium) {
              setIsPremium(true);
            }
          }).catch(() => {});
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        input[type="color"]::-webkit-color-swatch {
          border: 1px solid #e5e7eb;
          border-radius: 4px;
        }
      `}} />
    </>
  );
};

export default ImageResizer;