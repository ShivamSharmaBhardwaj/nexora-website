// src/pages/tools/MergePDF.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFilePdf, 
  FaCheckCircle, FaCircle, FaTimes, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaGripLines,
  FaArrowUp, FaArrowDown, FaSort, FaUpload, FaClock,
  FaHistory, FaChevronDown, FaChevronUp, FaCog,
  FaFile, FaInfoCircle, FaRegFilePdf, FaSlidersH,
  FaList, FaTh, FaFileSignature, FaCompress, FaSortAmountUp,
  FaSortAmountDown, FaCheckDouble, FaGlobe, FaMapMarkerAlt,
  FaLanguage, FaHeadphones
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
// SEO DATA
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
// UTILITY FUNCTIONS
// ============================================

const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// ============================================
// MERGE OPTIONS
// ============================================

const MergeOptions = ({ options, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaCog className="text-indigo-500" /> Merge Options
        </h4>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-indigo-500 hover:text-indigo-700 transition flex items-center gap-1"
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
            value={options.pageSize || 'auto'}
            onChange={(e) => onChange({ ...options, pageSize: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="auto">Auto (Match first page)</option>
            <option value="A4">A4 (210 × 297 mm)</option>
            <option value="Letter">Letter (8.5 × 11 in)</option>
            <option value="Legal">Legal (8.5 × 14 in)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Merge Mode
          </label>
          <select
            value={options.mode || 'standard'}
            onChange={(e) => onChange({ ...options, mode: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="standard">Standard Merge</option>
            <option value="combine">Combine All Pages</option>
            <option value="alternate">Alternate Pages</option>
          </select>
        </div>

        {showAdvanced && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Page Range (Comma separated, e.g., 1-3,5,7-9)
              </label>
              <input
                type="text"
                value={options.pageRange || ''}
                onChange={(e) => onChange({ ...options, pageRange: e.target.value })}
                placeholder="e.g., 1-3,5,7-9"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="addBookmarks"
                checked={options.addBookmarks || false}
                onChange={(e) => onChange({ ...options, addBookmarks: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="addBookmarks" className="text-xs text-gray-700">
                Add bookmarks for each file
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="compressOutput"
                checked={options.compressOutput || false}
                onChange={(e) => onChange({ ...options, compressOutput: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="compressOutput" className="text-xs text-gray-700">
                Compress output PDF
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="addPageNumbers"
                checked={options.addPageNumbers || false}
                onChange={(e) => onChange({ ...options, addPageNumbers: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="addPageNumbers" className="text-xs text-gray-700">
                Add page numbers
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MERGE HISTORY
// ============================================

const MergeHistory = ({ history, onReuse }) => {
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
          <FaHistory className="text-indigo-500" />
          <span className="font-semibold text-gray-700">Merge History</span>
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
                  {item.fileCount} files
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
                      className="text-xs text-indigo-500 hover:text-indigo-700 transition"
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
// FILE ITEM COMPONENT - Card View
// ============================================

const FileCard = ({ file, index, total, onRemove, onMoveUp, onMoveDown, isSelected, onSelect }) => {
  return (
    <div className={`bg-white rounded-lg border-2 p-4 hover:shadow-md transition ${
      isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(index)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 mt-1"
            />
            <span className="text-xs font-medium text-gray-400 w-6">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <FaFilePdf className="text-red-500 flex-shrink-0" />
              <span className="truncate text-sm font-medium">{file.name}</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span>{formatSize(file.size)}</span>
              <span>•</span>
              <span className="text-gray-300">Click to reorder</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            type="button"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="p-1 text-gray-400 hover:text-indigo-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move Up"
          >
            <FaArrowUp className="text-xs" />
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            className="p-1 text-gray-400 hover:text-indigo-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move Down"
          >
            <FaArrowDown className="text-xs" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 text-gray-400 hover:text-red-600 transition"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
        <div 
          className="bg-indigo-500 h-1 rounded-full transition-all duration-500"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
};

// ============================================
// FILE ITEM COMPONENT - List View
// ============================================

const FileListItem = ({ file, index, total, onRemove, onMoveUp, onMoveDown, isSelected, onSelect }) => {
  return (
    <div className={`bg-white px-4 py-2 rounded-lg flex items-center justify-between group hover:shadow-sm transition ${
      isSelected ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-gray-50'
    }`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(index)}
          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
        />
        <span className="text-xs font-medium text-gray-400 w-6">{index + 1}</span>
        <FaFilePdf className="text-red-500 flex-shrink-0" />
        <span className="truncate text-sm font-medium flex-1">{file.name}</span>
        <span className="text-xs text-gray-400 flex-shrink-0">{formatSize(file.size)}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          className="p-1 text-gray-400 hover:text-indigo-600 transition opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move Up"
        >
          <FaArrowUp className="text-xs" />
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1}
          className="p-1 text-gray-400 hover:text-indigo-600 transition opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move Down"
        >
          <FaArrowDown className="text-xs" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-gray-400 hover:text-red-600 transition"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN MERGE PDF COMPONENT
// ============================================

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [userId, setUserId] = useState('anonymous');
  const [dragActive, setDragActive] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mergeHistory, setMergeHistory] = useState([]);
  const [mergeOptions, setMergeOptions] = useState({
    pageSize: 'auto',
    mode: 'standard',
    pageRange: '',
    addBookmarks: false,
    compressOutput: false,
    addPageNumbers: false,
  });
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

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
          toast.success('🎉 Premium activated! Unlimited merges.');
        }
      } catch (error) {
        console.error('Premium check failed:', error);
        setIsPremium(false);
      }
    };
    
    if (userId) {
      checkPremiumStatus();
    }
  }, [userId]);

  // Load merge history
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('pdfMergeHistory');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        const cleanHistory = parsed.map(item => ({
          filename: item.filename,
          fileCount: item.fileCount || 0,
          timestamp: item.timestamp,
          status: item.status,
          result: item.result ? { filename: item.result.filename, pages: item.result.pages } : null
        }));
        setMergeHistory(cleanHistory);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // Save merge history
  const saveToHistory = (filename, status, resultData) => {
    const newEntry = {
      filename,
      fileCount: safeArray(files).length,
      timestamp: new Date().toISOString(),
      status,
      result: {
        filename: resultData.filename || 'merged.pdf',
        pages: resultData.pages || safeArray(files).length,
        file_count: resultData.file_count || safeArray(files).length,
      }
    };
    
    const updatedHistory = [newEntry, ...mergeHistory].slice(0, 20);
    setMergeHistory(updatedHistory);
    
    try {
      localStorage.setItem('pdfMergeHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Storage full, storing fewer items');
      const trimmedHistory = updatedHistory.slice(0, 10);
      try {
        localStorage.setItem('pdfMergeHistory', JSON.stringify(trimmedHistory));
      } catch (e2) {
        console.error('Could not save history:', e2);
      }
    }
  };

  // Sort files
  const sortFiles = (order) => {
    const sorted = [...files];
    sorted.sort((a, b) => {
      if (order === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setFiles(sorted);
    setSelectedFiles([]);
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortFiles(newOrder);
    toast.success(`Sorted ${newOrder === 'asc' ? 'A → Z' : 'Z → A'}`);
  };

  const toggleSelectAll = () => {
    if (safeArray(selectedFiles).length === safeArray(files).length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((_, index) => index));
    }
  };

  const removeSelected = () => {
    if (safeArray(selectedFiles).length === 0) {
      toast.error('No files selected');
      return;
    }
    const newFiles = files.filter((_, index) => !selectedFiles.includes(index));
    setFiles(newFiles);
    setSelectedFiles([]);
    toast.success(`Removed ${safeArray(selectedFiles).length} files`);
  };

  const validateAndAddFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => file.type === 'application/pdf');
    
    if (validFiles.length === 0) {
      toast.error('Please select valid PDF files');
      return;
    }
    
    const totalFiles = safeArray(files).length + validFiles.length;
    
    if (!isPremium && totalFiles > 35) {
      toast.error(`Free users can merge up to 35 files. You have ${totalFiles} files. Please remove some files or upgrade to premium for unlimited files.`);
      return;
    }
    
    if (isPremium && totalFiles > 200) {
      toast.error('Maximum 200 files allowed. Please reduce the number of files.');
      return;
    }
    
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const largeFiles = validFiles.filter(f => f.size > MAX_FILE_SIZE);
    if (largeFiles.length > 0) {
      toast.error(`Some files exceed 10MB limit: ${largeFiles.map(f => f.name).join(', ')}. Please compress them first.`);
      return;
    }
    
    const totalSize = [...files, ...validFiles].reduce((acc, f) => acc + f.size, 0);
    const MAX_TOTAL_SIZE = isPremium ? 200 * 1024 * 1024 : 50 * 1024 * 1024;
    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error(`Total file size must be less than ${isPremium ? '200MB' : '50MB'}`);
      return;
    }
    
    setFiles(prev => [...prev, ...validFiles]);
    setResult(null);
    toast.success(`Added ${validFiles.length} PDF(s)`);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
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
    setSelectedFiles(prev => prev.filter(i => i !== index));
  };

  const moveFileUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    setFiles(newFiles);
  };

  const moveFileDown = (index) => {
    if (index === safeArray(files).length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  const clearAll = () => {
    setFiles([]);
    setResult(null);
    setProgress(0);
    setProgressStatus('');
    setSelectedFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (safeArray(files).length < 2) {
      toast.error('Please select at least 2 PDF files to merge');
      return;
    }
    
    if (!isPremium && safeArray(files).length > 35) {
      toast.error(`Free users can merge up to 35 files. You have ${safeArray(files).length} files. Please upgrade to premium for unlimited files.`);
      return;
    }
    
    if (isPremium && safeArray(files).length > 200) {
      toast.error('Maximum 200 files allowed. Please reduce the number of files.');
      return;
    }
    
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    const MAX_TOTAL_SIZE = isPremium ? 200 * 1024 * 1024 : 50 * 1024 * 1024;
    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error(`Total file size must be less than ${isPremium ? '200MB' : '50MB'}`);
      return;
    }

    setLoading(true);
    setProgress(0);
    setProgressStatus('Starting merge...');
    
    const formData = new FormData();
    safeArray(files).forEach(file => formData.append('files', file));
    formData.append('is_premium', isPremium ? 'true' : 'false');
    formData.append('user_id', userId);
    formData.append('options', JSON.stringify(mergeOptions));
    formData.append('batch_mode', 'false');
    
    try {
      setProgress(30);
      setProgressStatus(`Processing ${safeArray(files).length} files...`);
      
      const loadingToast = toast.loading(`Merging ${safeArray(files).length} files...`);
      
      const response = await api.mergePdf(formData);
      
      toast.dismiss(loadingToast);
      
      setProgress(90);
      setProgressStatus('Finalizing merged PDF...');
      
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium,
          maxFilesFree: response.data.max_files_free || 35
        });
        
        saveToHistory('merged.pdf', 'completed', response.data);
        
        setProgress(100);
        setProgressStatus('✅ Merge complete!');
        
        const fileCount = response.data.file_count || response.data.pages;
        const totalPages = response.data.total_pages;
        
        if (totalPages) {
          toast.success(`✅ ${fileCount} PDFs merged successfully! (${totalPages} total pages)`);
        } else {
          toast.success(`✅ ${fileCount} PDFs merged successfully!`);
        }
        
        if (isPremium) {
          setTimeout(() => downloadFile(), 1000);
        }
      }
    } catch (error) {
      setProgress(0);
      setProgressStatus('❌ Merge failed');
      
      console.error('Merge error:', error);
      
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Try reducing the number of files.');
      } else if (error.response?.data?.limit_reached) {
        const limitType = error.response.data.limit_type;
        if (limitType === 'file_count') {
          toast.error(`Free users can merge up to ${error.response.data.max_free || 35} files. You have ${error.response.data.file_count} files. Upgrade to premium for unlimited files.`);
          setShowPaymentModal(true);
        } else {
          toast.error('Daily merge limit reached (3 per day). Upgrade to premium for unlimited merges.');
          setShowPaymentModal(true);
        }
        setUsageInfo({
          used: error.response.data.usage_count || 0,
          remaining: 0,
          isPremium: false
        });
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to merge PDFs. Please try again with fewer files.');
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
    link.download = result.filename || 'merged.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Merged PDF downloaded!');
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const reuseHistory = (item) => {
    toast.success('Reusing previous merge settings');
    setFiles([]);
  };

  const toggleFileSelection = (index) => {
    setSelectedFiles(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <>
      {/* ============================================ */}
      {/* SEO + AEO + GEO Helmet Implementation */}
      {/* ============================================ */}
      <Helmet>
        <title>Free Merge PDF Online - Combine PDF Files | Krynova Technologies</title>
        <meta name="description" content="Merge PDF files online for free with Krynova Technologies. Combine multiple PDFs into one document. Free users get 3 merges per day. Premium users get unlimited merges." />
        <meta name="keywords" content="merge PDF, combine PDF files, PDF merger online, free PDF merge, merge multiple PDFs, PDF combiner, Krynova PDF merge, merge PDF India, best PDF merger tool" />
        <link rel="canonical" href={`${siteUrl}/tools/merge-pdf`} />
        
        {/* GEO Meta Tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta name="serviceArea" content={`India, ${globalCountries.join(", ")}, Worldwide`} />
        <meta name="targetGeo" content="India" />
        
        {/* AEO Meta Tags */}
        <meta name="question" content="How to merge PDF files for free in India?" />
        <meta name="answer" content="Krynova Technologies offers a free PDF merger in India. Upload multiple PDF files, arrange them in the desired order, and merge them into a single PDF. Free users get 3 merges per day with up to 35 files per merge. Premium users get unlimited merges." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="voice-search" content="true" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Merge PDF Online - Combine PDF Files | Krynova Technologies" />
        <meta property="og:description" content="Merge PDF files online for free. Combine multiple PDFs into one document. Free users get 3 merges per day." />
        <meta property="og:url" content={`${siteUrl}/tools/merge-pdf`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Merge PDF Online - Combine PDF Files" />
        <meta name="twitter:description" content="Merge PDF files online for free with Krynova Technologies." />
      </Helmet>

      {/* ============================================ */}
      {/* Speakable Content for Voice Assistants */}
      {/* ============================================ */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Free Merge PDF Online - Krynova Technologies</h2>
        <p>Merge PDF files online for free. Combine multiple PDF documents into a single PDF file.</p>
        <ul>
          <li>Free PDF merging - 3 merges per day for free users</li>
          <li>Merge up to 35 files per merge (Free) or unlimited (Premium)</li>
          <li>Reorder PDF files before merging</li>
          <li>Custom page size and merge modes</li>
          <li>Add bookmarks and page numbers (Premium)</li>
          <li>Compress output PDF (Premium)</li>
          <li>Secure and encrypted file processing</li>
        </ul>
        <p>Krynova Technologies is the best PDF merger in India, serving cities like Agra, Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, and all across India.</p>
      </div>

      {/* ============================================ */}
      {/* Schema.org WebApplication */}
      {/* ============================================ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PDF Merger",
          "description": "Free online PDF merger. Combine multiple PDF files into a single document. Supports 3 free merges per day with 35 files each.",
          "url": `${siteUrl}/tools/merge-pdf`,
          "applicationCategory": "Utilities",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "description": "Free PDF merger with 3 merges per day. Premium upgrade available for unlimited merges."
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
            "target": `${siteUrl}/tools/merge-pdf`,
            "result": {
              "@type": "DigitalDocument",
              "contentUrl": `${siteUrl}/api/merge-pdf`
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
              "name": "How to merge PDF files for free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To merge PDF files for free, visit Krynova Technologies' PDF Merger, upload multiple PDF files, arrange them in the desired order using drag and drop or the move buttons, and click Merge. Download your combined PDF instantly. Free users get 3 merges per day with up to 35 files per merge."
              }
            },
            {
              "@type": "Question",
              "name": "How many PDF files can I merge at once?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Free users can merge up to 35 PDF files per merge. Premium users can merge an unlimited number of files (up to 200 per merge for optimal performance)."
              }
            },
            {
              "@type": "Question",
              "name": "Can I reorder PDF files before merging?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, you can easily reorder PDF files before merging. Use the drag and drop feature, or the move up and move down buttons to arrange files in your preferred order."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best PDF merger in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies offers one of the best free PDF mergers in India. It supports merging multiple files, offers reordering capabilities, provides advanced options for premium users, and serves users across all major Indian cities including Agra, Delhi, Mumbai, Bengaluru, Chennai, and Hyderabad."
              }
            },
            {
              "@type": "Question",
              "name": "Is it safe to merge PDF files online?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Krynova Technologies ensures secure PDF merging with encrypted file processing. All uploaded files are automatically deleted after merging, and your documents are never shared with third parties."
              }
            },
            {
              "@type": "Question",
              "name": "What advanced options are available for merging PDFs?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Premium users can access advanced options including page size selection (A4, Letter, Legal), merge modes (Standard, Combine, Alternate), page range selection, adding bookmarks, compressing output PDF, and adding page numbers."
              }
            }
          ]
        })}
      </script>

      {/* ============================================ */}
      {/* Main Component */}
      {/* ============================================ */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaFilePdf className="text-indigo-500" />
              Free Merge PDF Files
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Merge <span className="gradient-text">PDF Files</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Combine multiple PDF files into a single document with custom page order. Free users get 3 merges per day.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free: 3/day • 35 files max
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCrown className="text-yellow-500" /> Premium: Unlimited • Unlimited files
              </span>
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                <FaGripLines className="text-indigo-500" /> Reorder Pages
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaCompress className="text-purple-500" /> Compress Output
              </span>
              <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                <FaGlobe className="text-teal-500" /> Serving 60+ Indian Cities
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
                  <><FaCrown className="text-yellow-500" /> <span className="font-semibold">✨ Premium:</span> Unlimited merges • Unlimited files</>
                ) : (
                  <>
                    <FaClock className="text-blue-500" />
                    <span>{usageInfo.used || 0} used today • {usageInfo.remaining || 0} remaining</span>
                    <span className="text-gray-400">|</span>
                    <span>Max {usageInfo.maxFilesFree || 35} files per merge</span>
                  </>
                )}
              </div>
              {!usageInfo.isPremium && (
                <button
                  onClick={handleUpgrade}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  <FaCrown /> Upgrade Now
                </button>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="mb-6 bg-white rounded-xl p-4 border border-indigo-200 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaSpinner className="animate-spin text-indigo-500" />
                  {progressStatus}
                </span>
                <span className="text-sm font-semibold text-indigo-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
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
                  dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {safeArray(files).length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{safeArray(files).length} PDFs selected</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-indigo-600 hover:text-indigo-700 transition text-sm flex items-center gap-1"
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

                    {/* View Controls */}
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleSelectAll}
                          className="text-xs text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
                        >
                          <FaCheckDouble className="text-xs" />
                          {safeArray(selectedFiles).length === safeArray(files).length ? 'Deselect All' : 'Select All'}
                        </button>
                        {safeArray(selectedFiles).length > 0 && (
                          <button
                            type="button"
                            onClick={removeSelected}
                            className="text-xs text-red-500 hover:text-red-700 transition flex items-center gap-1"
                          >
                            <FaTrash className="text-xs" />
                            Remove ({safeArray(selectedFiles).length})
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleSort}
                          className="text-xs text-gray-500 hover:text-indigo-600 transition flex items-center gap-1"
                          title={`Sort ${sortOrder === 'asc' ? 'A → Z' : 'Z → A'}`}
                        >
                          {sortOrder === 'asc' ? <FaSortAmountUp className="text-xs" /> : <FaSortAmountDown className="text-xs" />}
                          Sort
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('list')}
                          className={`p-1.5 rounded transition ${
                            viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="List View"
                        >
                          <FaList className="text-sm" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('card')}
                          className={`p-1.5 rounded transition ${
                            viewMode === 'card' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="Card View"
                        >
                          <FaTh className="text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* File List */}
                    <div className={`max-h-96 overflow-y-auto custom-scrollbar space-y-2 border border-gray-100 rounded-lg p-2 ${
                      viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-2'
                    }`}>
                      {safeArray(files).map((file, index) => (
                        viewMode === 'card' ? (
                          <FileCard
                            key={index}
                            file={file}
                            index={index}
                            total={safeArray(files).length}
                            onRemove={removeFile}
                            onMoveUp={moveFileUp}
                            onMoveDown={moveFileDown}
                            isSelected={safeArray(selectedFiles).includes(index)}
                            onSelect={toggleFileSelection}
                          />
                        ) : (
                          <FileListItem
                            key={index}
                            file={file}
                            index={index}
                            total={safeArray(files).length}
                            onRemove={removeFile}
                            onMoveUp={moveFileUp}
                            onMoveDown={moveFileDown}
                            isSelected={safeArray(selectedFiles).includes(index)}
                            onSelect={toggleFileSelection}
                          />
                        )
                      ))}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl text-indigo-400 mx-auto">
                      <FaFilePdf className="mx-auto" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-lg">Drop your PDFs here</p>
                      <p className="text-sm text-gray-400">or click to browse</p>
                    </div>
                    <p className="text-xs text-gray-400">Supports PDF up to 30MB total</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="inline-block px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer"
                    >
                      Choose PDF Files
                    </label>
                  </div>
                )}
              </div>

              {/* Stats */}
              {safeArray(files).length > 0 && (
                <div className="grid grid-cols-4 gap-3 text-center text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold text-gray-900">{safeArray(files).length}</p>
                    <p className="text-gray-500">Files</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold text-gray-900">{formatSize(files.reduce((acc, f) => acc + f.size, 0))}</p>
                    <p className="text-gray-500">Total Size</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold text-gray-900">{safeArray(files).length}</p>
                    <p className="text-gray-500">Pages to Merge</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold text-gray-900">PDF</p>
                    <p className="text-gray-500">Output Format</p>
                  </div>
                </div>
              )}

              {/* Merge Options */}
              <MergeOptions 
                options={mergeOptions}
                onChange={setMergeOptions}
              />

              {/* Premium Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited merges + Advanced options)
                </label>
                {!isPremium && (
                  <span className="text-xs text-gray-400 ml-2">
                    (Free: 3/day • 35 files max)
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || safeArray(files).length < 2}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaFilePdf />}
                {loading ? 'Merging...' : `Merge ${safeArray(files).length} PDF Files`}
              </button>
            </form>

            {/* Results */}
            {result && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-indigo-800">✅ Merge Complete!</p>
                      <p className="text-sm text-indigo-600">
                        {result.file_count || result.pages} PDF files merged 
                        {result.total_pages && <span> • {result.total_pages} total pages</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={downloadFile}
                      className="flex-1 bg-indigo-500 text-white py-2.5 rounded-lg hover:bg-indigo-600 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                    >
                      <FaDownload /> Download Merged PDF
                    </button>
                    <button
                      onClick={() => {
                        clearAll();
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2 font-semibold"
                    >
                      <FaPlus /> Merge Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Merge History */}
          <div className="mt-6">
            <MergeHistory 
              history={mergeHistory} 
              onReuse={reuseHistory}
            />
          </div>

          {/* Features Section */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaGripLines className="text-3xl text-indigo-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Reorder Pages</h4>
              <p className="text-xs text-gray-500">Arrange PDFs in any order</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaShieldAlt className="text-3xl text-indigo-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Secure Merge</h4>
              <p className="text-xs text-gray-500">Files are encrypted and protected</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaRocket className="text-3xl text-indigo-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Fast Processing</h4>
              <p className="text-xs text-gray-500">Merge PDFs in seconds</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaCompress className="text-3xl text-indigo-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Compress Output</h4>
              <p className="text-xs text-gray-500">Reduce merged file size (Premium)</p>
            </div>
          </div>

          {/* Upgrade CTA */}
          {!isPremium && (
            <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
                <p className="text-indigo-100 mb-4">
                  Get unlimited merges, advanced options, compress output, and priority support.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5"
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
          userId={userId}
          onSuccess={() => {
            setIsPremium(true);
            toast.success('🎉 Premium activated! Enjoy unlimited merges.');
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
    </>
  );
};

export default MergePDF; // ✅ MAKE SURE THIS IS AT THE END