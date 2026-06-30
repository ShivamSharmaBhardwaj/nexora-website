// src/pages/tools/ImageToPDF.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaImage, 
  FaFilePdf, FaCheckCircle, FaCircle, FaTimes, 
  FaTrash, FaPlus, FaCrown, FaRocket, FaShieldAlt,
  FaGripLines, FaArrowRight, FaUpload, FaClock,
  FaHistory, FaChevronDown, FaChevronUp, FaCog,
  FaFile, FaInfoCircle, FaRegFilePdf, FaRegFileImage,
  FaSort, FaSortUp, FaSortDown, FaEdit, FaSave
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import PaymentModal from '../../components/PaymentModal';

// ============================================
// IMAGE PREVIEW COMPONENT
// ============================================

const ImagePreview = ({ file, index, onRemove, onMoveUp, onMoveDown }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div className="aspect-square">
        {preview ? (
          <img src={preview} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <FaImage className="text-3xl text-gray-300" />
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
        <button
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition disabled:opacity-50"
          title="Move Up"
        >
          <FaSortUp className="text-gray-700" />
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={!onMoveDown}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition disabled:opacity-50"
          title="Move Down"
        >
          <FaSortDown className="text-gray-700" />
        </button>
        <button
          onClick={() => onRemove(index)}
          className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
          title="Remove"
        >
          <FaTimes className="text-white" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="text-white text-xs truncate">{file.name}</p>
        <p className="text-white/70 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
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
          <FaCog className="text-purple-500" /> Conversion Options
        </h4>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-purple-500 hover:text-purple-700 transition flex items-center gap-1"
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          {showAdvanced ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Page Size
          </label>
          <select
            value={options.pageSize || 'A4'}
            onChange={(e) => onChange({ ...options, pageSize: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="A4">A4 (210 × 297 mm)</option>
            <option value="A3">A3 (297 × 420 mm)</option>
            <option value="A5">A5 (148 × 210 mm)</option>
            <option value="Letter">Letter (8.5 × 11 in)</option>
            <option value="Legal">Legal (8.5 × 14 in)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Image Quality
          </label>
          <select
            value={options.quality || 'high'}
            onChange={(e) => onChange({ ...options, quality: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="high">High (Best Quality)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="low">Low (Smaller File)</option>
          </select>
        </div>

        {showAdvanced && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Image Fit
              </label>
              <select
                value={options.fit || 'contain'}
                onChange={(e) => onChange({ ...options, fit: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="contain">Contain (Fit within page)</option>
                <option value="cover">Cover (Fill page)</option>
                <option value="stretch">Stretch (Full page)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Orientation
              </label>
              <select
                value={options.orientation || 'auto'}
                onChange={(e) => onChange({ ...options, orientation: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="auto">Auto (Based on image)</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="preserveQuality"
                checked={options.preserveQuality !== false}
                onChange={(e) => onChange({ ...options, preserveQuality: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="preserveQuality" className="text-xs text-gray-700">
                Preserve original image quality
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="compressImages"
                checked={options.compressImages || false}
                onChange={(e) => onChange({ ...options, compressImages: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="compressImages" className="text-xs text-gray-700">
                Compress images (smaller PDF)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="singlePage"
                checked={options.singlePage || false}
                onChange={(e) => onChange({ ...options, singlePage: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="singlePage" className="text-xs text-gray-700">
                Combine all images on one page
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN IMAGE TO PDF COMPONENT
// ============================================

const ImageToPDF = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [conversionOptions, setConversionOptions] = useState({
    pageSize: 'A4',
    quality: 'high',
    fit: 'contain',
    orientation: 'auto',
    preserveQuality: true,
    compressImages: false,
    singlePage: false,
  });
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [conversionResults, setConversionResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
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

  // Load conversion history
  useEffect(() => {
    const savedHistory = localStorage.getItem('imageToPdfHistory');
    if (savedHistory) {
      try {
        setConversionHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  const saveToHistory = (filename, status, resultData) => {
    const newEntry = {
      filename,
      imageCount: files.length,
      timestamp: new Date().toISOString(),
      status,
      result: resultData,
    };
    const updatedHistory = [newEntry, ...conversionHistory].slice(0, 20);
    setConversionHistory(updatedHistory);
    localStorage.setItem('imageToPdfHistory', JSON.stringify(updatedHistory));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };

  const validateAndAddFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }
    
    // Check total size
    const totalSize = [...files, ...validFiles].reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 20 * 1024 * 1024) {
      toast.error('Total file size must be less than 20MB');
      return;
    }
    
    setFiles(prev => [...prev, ...validFiles]);
    setResult(null);
    toast.success(`Added ${validFiles.length} image(s)`);
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
    validateAndAddFiles(droppedFiles);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    setFiles(newFiles);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  const clearAll = () => {
    setFiles([]);
    setResult(null);
    setConversionResults([]);
  };

  // In ImageToPDF.jsx - Update the handleSubmit function

const handleSubmit = async (e) => {
  e.preventDefault();
  if (files.length === 0) {
    toast.error('Please select at least one image');
    return;
  }

  // Check if it's bulk (more than 1 image)
  const isBulk = files.length > 1;
  
  // For bulk, check local limit before API call
  if (!isPremium && isBulk) {
    const today = new Date().toDateString();
    const bulkUsage = JSON.parse(localStorage.getItem('bulkImageToPdf') || '{"date":"","count":0}');
    
    if (bulkUsage.date === today && bulkUsage.count >= 2) {
      toast.error('Bulk conversion limit reached! Free users can convert 2 bulk conversions per day. Upgrade to premium for unlimited.');
      setShowPaymentModal(true);
      return;
    }
  }

  setLoading(true);
  setProgress(0);
  setProgressStatus('Starting conversion...');
  setConversionResults([]);
  
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('is_premium', isPremium);
  formData.append('options', JSON.stringify(conversionOptions));
  
  try {
    setProgress(30);
    setProgressStatus('Processing images...');
    
    const response = await api.imageToPdf(formData);
    
    setProgress(90);
    setProgressStatus('Generating PDF...');
    
    if (response.data.success) {
      setResult(response.data);
      setUsageInfo({
        used: response.data.usage_count,
        remaining: response.data.remaining_free,
        isPremium: response.data.is_premium,
        bulk_remaining: response.data.bulk_remaining,
        is_bulk: response.data.is_bulk
      });
      
      // Track bulk usage locally only if not premium
      if (!isPremium && isBulk) {
        const today = new Date().toDateString();
        const bulkUsage = JSON.parse(localStorage.getItem('bulkImageToPdf') || '{"date":"","count":0}');
        if (bulkUsage.date === today) {
          bulkUsage.count += 1;
        } else {
          bulkUsage.date = today;
          bulkUsage.count = 1;
        }
        localStorage.setItem('bulkImageToPdf', JSON.stringify(bulkUsage));
        
        // Show remaining bulk conversions
        const remaining = 2 - bulkUsage.count;
        if (remaining > 0) {
          toast.success(`✅ ${response.data.pages} images converted! ${remaining} bulk conversion${remaining > 1 ? 's' : ''} left today.`);
        } else {
          toast.success(`✅ ${response.data.pages} images converted! No more bulk conversions today. Upgrade to premium for unlimited.`);
        }
      } else {
        toast.success(`✅ ${response.data.pages} images converted to PDF!`);
      }
    }
  } catch (error) {
    setProgress(0);
    setProgressStatus('❌ Conversion failed');
    
    if (error.response?.data?.limit_reached) {
      const limitType = error.response.data.limit_type;
      if (limitType === 'bulk') {
        toast.error('Bulk conversion limit reached! Free users get 2 bulk conversions per day. Upgrade to premium for unlimited.');
        // Update local storage to reflect used bulk
        const today = new Date().toDateString();
        localStorage.setItem('bulkImageToPdf', JSON.stringify({ date: today, count: 2 }));
      } else {
        toast.error('Free limit reached! Upgrade to premium for unlimited conversions.');
      }
      setShowPaymentModal(true);
    } else {
      toast.error(error.response?.data?.error || 'Failed to convert images');
    }
  } finally {
    setLoading(false);
    setTimeout(() => setProgress(0), 3000);
  }
};

  const downloadFile = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${result.file}`;
    link.download = result.filename || 'converted.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('PDF downloaded!');
  };

  const downloadIndividualPDF = async (imageFile) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('files', imageFile);
    formData.append('is_premium', isPremium);
    formData.append('options', JSON.stringify({ ...conversionOptions, singlePage: true }));
    
    try {
      const response = await api.imageToPdf(formData);
      if (response.data.success) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${response.data.file}`;
        link.download = imageFile.name.replace(/\.[^.]+$/, '') + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloaded PDF for ${imageFile.name}`);
      }
    } catch (error) {
      toast.error('Failed to convert individual image');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const isBulk = files.length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaImage className="text-purple-500" />
            Image to PDF Converter
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Image to <span className="gradient-text">PDF Converter</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert single or multiple images to PDF. Free users get unlimited single conversions and 2 bulk conversions per day.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: Unlimited Single
            </span>
            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
              <FaUpload className="text-orange-500" /> Free: 2 Bulk/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaCrown className="text-yellow-500" /> Premium: Unlimited
            </span>
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              <FaGripLines className="text-purple-500" /> Multiple Images
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
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                <FaCrown /> Upgrade Now
              </button>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {loading && progress > 0 && (
          <div className="mb-6 bg-white rounded-xl p-4 border border-purple-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaSpinner className="animate-spin text-purple-500" />
                {progressStatus}
              </span>
              <span className="text-sm font-semibold text-purple-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2.5 rounded-full transition-all duration-500"
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
                dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {files.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      {files.length} image{files.length > 1 ? 's' : ''} selected
                      {isBulk && !isPremium && (
                        <span className="ml-2 text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                          Bulk ({2 - (JSON.parse(localStorage.getItem('bulkImageToPdf') || '{"date":"","count":0}')).count || 2} left today)
                        </span>
                      )}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-purple-600 hover:text-purple-700 transition text-sm flex items-center gap-1"
                      >
                        <FaPlus /> Add More
                      </button>
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-red-500 hover:text-red-700 transition text-sm flex items-center gap-1"
                      >
                        <FaTrash /> Clear All
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
                    {files.map((file, index) => (
                      <ImagePreview
                        key={index}
                        file={file}
                        index={index}
                        onRemove={removeFile}
                        onMoveUp={moveUp}
                        onMoveDown={moveDown}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="font-bold text-gray-900">{files.length}</p>
                      <p className="text-xs text-gray-500">Images</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="font-bold text-gray-900">{formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}</p>
                      <p className="text-xs text-gray-500">Total Size</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="font-bold text-gray-900">{isBulk ? 'Bulk' : 'Single'}</p>
                      <p className="text-xs text-gray-500">Mode</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl text-purple-400 mx-auto">
                    <FaImage className="mx-auto" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-lg">Drop your images here</p>
                    <p className="text-sm text-gray-400">or click to browse</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Supports JPG, PNG, GIF, BMP, WEBP (up to 20MB total)
                  </p>
                  <p className="text-xs text-purple-500">
                    {isPremium ? '✨ Unlimited conversions' : '📄 Single: Unlimited | Bulk: 2/day'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer"
                  >
                    Choose Images
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
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label className="text-sm text-gray-700 flex items-center gap-1">
                <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited conversions)
              </label>
              {!isPremium && isBulk && (
                <span className="text-xs text-orange-500 ml-2">
                  Bulk uses 1 of 2 free daily conversions
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || files.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaFilePdf />}
              {loading ? 'Converting...' : `Convert ${files.length} Image${files.length > 1 ? 's' : ''} to PDF`}
            </button>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                    <FaCheckCircle />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-purple-800">✅ Conversion Complete!</p>
                    <p className="text-sm text-purple-600">{result.pages} images converted to PDF</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={downloadFile}
                    className="flex-1 bg-purple-500 text-white py-2.5 rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                  >
                    <FaDownload /> Download PDF
                  </button>
                  {files.length > 1 && (
                    <button
                      onClick={() => {
                        // Download individual PDFs
                        files.forEach((file, index) => {
                          setTimeout(() => downloadIndividualPDF(file), index * 500);
                        });
                      }}
                      className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                    >
                      <FaDownload /> Download All (Individual)
                    </button>
                  )}
                  <button
                    onClick={() => {
                      clearAll();
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
        {conversionHistory.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaHistory className="text-purple-500" />
                <span className="font-semibold text-gray-700">Conversion History</span>
                <span className="text-xs text-gray-400">({conversionHistory.length})</span>
              </div>
            </div>
            <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
              {conversionHistory.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <FaFilePdf className="text-red-400 flex-shrink-0" />
                    <span className="text-sm truncate">{item.filename || 'converted.pdf'}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {item.imageCount || 0} images
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status === 'completed' && (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <FaCheckCircle className="text-xs" /> Done
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaImage className="text-3xl text-purple-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Multiple Images</h4>
            <p className="text-xs text-gray-500">Convert multiple images to one PDF</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaGripLines className="text-3xl text-purple-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Reorder Images</h4>
            <p className="text-xs text-gray-500">Drag or use buttons to reorder</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaShieldAlt className="text-3xl text-purple-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Secure Conversion</h4>
            <p className="text-xs text-gray-500">Files are encrypted and automatically deleted</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaRocket className="text-3xl text-purple-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Fast Processing</h4>
            <p className="text-xs text-gray-500">Convert images in seconds</p>
          </div>
        </div>

        {/* Upgrade CTA */}
        {!isPremium && (
          <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
              <p className="text-purple-100 mb-4">
                Get unlimited bulk conversions, advanced options, priority support, and more.
              </p>
              <button
                onClick={handleUpgrade}
                className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5"
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
      `}} />
    </div>
  );
};

export default ImageToPDF;