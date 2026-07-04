// src/pages/tools/PDFToExcel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFilePdf, 
  FaFileExcel, FaCheckCircle, FaCircle, FaTimes, 
  FaEye, FaFileAlt, FaArrowRight, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaTable, FaClock,
  FaHistory, FaChevronDown, FaChevronUp,
  FaInfoCircle, FaFile, FaCog, FaRegFileExcel,
  FaUpload, FaEdit, FaEye as FaEyeIcon,
  FaGlobe, FaMapMarkerAlt, FaLanguage, FaHeadphones
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import PaymentModal from '../../components/PaymentModal';
import * as XLSX from 'xlsx';

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
// TABLE PREVIEW COMPONENT
// ============================================

const TablePreview = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);
  const previewData = data.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {headers.map((header, idx) => (
                <th key={idx} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {headers.map((header, colIdx) => (
                  <td key={colIdx} className="px-3 py-2 text-gray-700 border-b border-gray-100">
                    {row[header] !== undefined && row[header] !== null ? String(row[header]) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 5 && (
          <div className="px-3 py-2 text-xs text-gray-400 border-t border-gray-200">
            + {data.length - 5} more rows
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN PDF TO EXCEL COMPONENT
// ============================================

const PDFToExcel = () => {
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
    format: 'xlsx',
    tableDetection: 'auto',
    extractionMode: 'standard',
    preserveFormatting: true,
    includeHeaders: true,
    combineTables: false,
    detectTables: true,
    mergeCells: false,
  });
  const [batchMode, setBatchMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [conversionResults, setConversionResults] = useState([]);
  const [extractedTables, setExtractedTables] = useState([]);
  const [showTablePreview, setShowTablePreview] = useState(false);
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
    const savedHistory = localStorage.getItem('pdfExcelConversionHistory');
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
    localStorage.setItem('pdfExcelConversionHistory', JSON.stringify(updatedHistory));
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
      setExtractedTables([]);
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
    setProgressStatus('Starting extraction...');
    setExtractedTables([]);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_premium', isPremium);
    formData.append('options', JSON.stringify({
      ...conversionOptions,
      detectTables: true,
    }));
    
    try {
      setProgress(20);
      setProgressStatus('Reading PDF file...');
      
      const response = await api.pdfToExcel(formData);
      
      setProgress(60);
      setProgressStatus('Extracting tables and data...');
      
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        
        if (response.data.tables) {
          setExtractedTables(response.data.tables);
        } else if (response.data.data) {
          setExtractedTables([response.data.data]);
        }
        
        saveToHistory(file.name, 'completed', response.data);
        
        setProgress(100);
        setProgressStatus('✅ Extraction complete!');
        toast.success(`✅ Extracted ${response.data.tables?.length || 1} table(s) from PDF!`);
        setShowTablePreview(true);
        
        if (isPremium) {
          setTimeout(() => downloadFile(), 1000);
        }
      }
    } catch (error) {
      setProgress(0);
      setProgressStatus('❌ Extraction failed');
      if (error.response?.data?.limit_reached) {
        toast.error('Free limit reached! Upgrade to premium for unlimited access.');
        setUsageInfo({
          used: error.response.data.usage_count,
          remaining: 0,
          isPremium: false
        });
        setShowPaymentModal(true);
      } else {
        toast.error(error.response?.data?.error || 'Failed to extract data from PDF');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 3000);
    }
  };

  const handleBatchSubmit = async () => {
    setLoading(true);
    setProgress(0);
    setProgressStatus('Starting batch extraction...');
    setConversionResults([]);
    setExtractedTables([]);

    const results = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      setProgressStatus(`Extracting ${i + 1} of ${total}: ${currentFile.name}`);
      
      const formData = new FormData();
      formData.append('file', currentFile);
      formData.append('is_premium', isPremium);
      formData.append('options', JSON.stringify({
        ...conversionOptions,
        detectTables: true,
      }));

      try {
        const response = await api.pdfToExcel(formData);
        
        if (response.data.success) {
          results.push({
            filename: currentFile.name,
            result: response.data,
            tables: response.data.tables || [response.data.data],
            success: true
          });
          saveToHistory(currentFile.name, 'completed', response.data);
        } else {
          results.push({
            filename: currentFile.name,
            error: response.data.error || 'Extraction failed',
            success: false
          });
        }
      } catch (error) {
        results.push({
          filename: currentFile.name,
          error: error.response?.data?.error || 'Extraction failed',
          success: false
        });
      }

      setProgress(((i + 1) / total) * 100);
    }

    setConversionResults(results);
    setProgress(100);
    setProgressStatus(`✅ Batch extraction complete! (${results.filter(r => r.success).length}/${total} succeeded)`);
    
    const successCount = results.filter(r => r.success).length;
    if (successCount > 0) {
      toast.success(`✅ ${successCount} files processed successfully!`);
    }
    if (successCount < total) {
      toast.warning(`⚠️ ${total - successCount} files failed to process`);
    }

    setLoading(false);
    setTimeout(() => setProgress(0), 3000);
  };

  const downloadFile = () => {
    if (!result) return;
    
    try {
      let excelData = [];
      
      if (extractedTables && extractedTables.length > 0) {
        if (conversionOptions.combineTables) {
          extractedTables.forEach((table, index) => {
            if (index === 0) {
              excelData = table;
            } else {
              excelData.push({});
              excelData.push({ '---': `Table ${index + 1} ---` });
              excelData.push({});
              excelData = [...excelData, ...table];
            }
          });
        } else {
          const wb = XLSX.utils.book_new();
          
          extractedTables.forEach((table, index) => {
            const ws = XLSX.utils.json_to_sheet(table);
            const sheetName = `Table ${index + 1}`;
            XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
          });
          
          const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([wbout], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = result.filename || `${file.name.replace('.pdf', '.xlsx')}`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          toast.success('Excel file downloaded with multiple sheets!');
          return;
        }
      } else if (result.data) {
        excelData = result.data;
      } else if (result.file) {
        const link = document.createElement('a');
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${result.file}`;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Excel file downloaded!');
        return;
      }
      
      if (excelData && excelData.length > 0) {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Extracted Data');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = result.filename || `${file.name.replace('.pdf', '.xlsx')}`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Excel file downloaded!');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download Excel file');
    }
  };

  const downloadBatchFile = (resultData, filename) => {
    try {
      let data = [];
      if (resultData.tables) {
        data = resultData.tables.flat();
      } else if (resultData.data) {
        data = resultData.data;
      }
      
      if (data && data.length > 0) {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Extracted Data');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename.replace('.pdf', '.xlsx');
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Batch download error:', error);
    }
  };

  const downloadAllBatch = () => {
    const successful = conversionResults.filter(r => r.success);
    if (successful.length === 0) {
      toast.error('No successful conversions to download');
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
    setExtractedTables([]);
    setProgress(0);
    setProgressStatus('');
    setShowTablePreview(false);
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
    toast.success('Reusing previous extraction settings');
    setFile(null);
  };

  return (
    <>
      {/* ============================================ */}
      {/* SEO + AEO + GEO Helmet Implementation */}
      {/* ============================================ */}
      <Helmet>
        <title>Free PDF to Excel Converter - Extract Tables from PDF | Krynova Technologies</title>
        <meta name="description" content="Convert PDF to Excel online for free with Krynova Technologies. Extract tables and data from PDF files to editable Excel spreadsheets. Free users get 5 conversions per day." />
        <meta name="keywords" content="PDF to Excel, convert PDF to Excel online, extract tables from PDF, PDF data extraction, Excel converter, PDF to XLSX, Krynova PDF to Excel, best PDF to Excel tool, free PDF to Excel India" />
        <link rel="canonical" href={`${siteUrl}/tools/pdf-to-excel`} />
        
        {/* GEO Meta Tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta name="serviceArea" content={`India, ${globalCountries.join(", ")}, Worldwide`} />
        <meta name="targetGeo" content="India" />
        
        {/* AEO Meta Tags */}
        <meta name="question" content="How to convert PDF to Excel for free in India?" />
        <meta name="answer" content="Krynova Technologies offers a free PDF to Excel converter in India. Upload your PDF file, choose extraction options, and download your editable Excel spreadsheet. Free users get 5 conversions per day. Premium users get unlimited conversions and batch processing." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="voice-search" content="true" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free PDF to Excel Converter - Extract Tables from PDF | Krynova Technologies" />
        <meta property="og:description" content="Convert PDF to Excel online for free. Extract tables and data from PDF to editable Excel spreadsheets." />
        <meta property="og:url" content={`${siteUrl}/tools/pdf-to-excel`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF to Excel Converter - Extract Tables from PDF" />
        <meta name="twitter:description" content="Convert PDF to Excel online for free with Krynova Technologies." />
      </Helmet>

      {/* ============================================ */}
      {/* Speakable Content for Voice Assistants */}
      {/* ============================================ */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Free PDF to Excel Converter - Krynova Technologies</h2>
        <p>Convert PDF to Excel online for free. Extract tables and data from PDF files to editable Excel spreadsheets.</p>
        <ul>
          <li>Free PDF to Excel conversion - 5 conversions per day</li>
          <li>Automatic table detection and extraction</li>
          <li>Multiple output formats - XLSX, XLS, CSV</li>
          <li>Preserve formatting and headers</li>
          <li>Combine multiple tables into one sheet</li>
          <li>Batch processing for multiple PDFs (Premium)</li>
          <li>Secure and encrypted file processing</li>
        </ul>
        <p>Krynova Technologies is the best PDF to Excel converter in India, serving cities like Agra, Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, and all across India.</p>
      </div>

      {/* ============================================ */}
      {/* Schema.org WebApplication */}
      {/* ============================================ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PDF to Excel Converter",
          "description": "Free online PDF to Excel converter. Extract tables and data from PDF files to editable Excel spreadsheets. Supports 5 free conversions per day.",
          "url": `${siteUrl}/tools/pdf-to-excel`,
          "applicationCategory": "Utilities",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "description": "Free PDF to Excel converter with 5 conversions per day. Premium upgrade available for unlimited conversions."
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
            "target": `${siteUrl}/tools/pdf-to-excel`,
            "result": {
              "@type": "DigitalDocument",
              "contentUrl": `${siteUrl}/api/pdf-to-excel`
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
              "name": "How to convert PDF to Excel for free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To convert PDF to Excel for free, visit Krynova Technologies' PDF to Excel Converter, upload your PDF file, choose your extraction options, and click Convert. Download your Excel file instantly. Free users get 5 conversions per day."
              }
            },
            {
              "@type": "Question",
              "name": "What output formats are supported?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies' PDF to Excel converter supports multiple output formats including Excel (.xlsx), Excel 97-2003 (.xls), and CSV (.csv). You can choose your preferred format before conversion."
              }
            },
            {
              "@type": "Question",
              "name": "Can I extract tables from PDF to Excel?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, the PDF to Excel converter automatically detects and extracts tables from your PDF documents. You can choose between auto detection, all tables, or first table only extraction modes."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best PDF to Excel converter in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies offers one of the best free PDF to Excel converters in India. It supports multiple formats, automatic table detection, preserves formatting, and serves users across all major Indian cities including Agra, Delhi, Mumbai, Bengaluru, Chennai, and Hyderabad."
              }
            },
            {
              "@type": "Question",
              "name": "Is it safe to convert PDF to Excel online?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Krynova Technologies ensures secure PDF to Excel conversion with encrypted file processing. All uploaded files are automatically deleted after conversion, and your data is never shared with third parties."
              }
            },
            {
              "@type": "Question",
              "name": "Can I convert multiple PDFs to Excel at once?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, batch processing is available for Premium users. Free users get 5 conversions per day. You can convert multiple PDF files to Excel at once and download them individually."
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
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaTable className="text-green-500" />
              Free PDF to Excel Converter
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              PDF to <span className="gradient-text">Excel Converter</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Extract tables and data from any PDF and convert to editable Excel spreadsheets. Free users get 5 conversions per day.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free: 5/day
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCrown className="text-yellow-500" /> Premium: Unlimited
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaTable className="text-purple-500" /> Table Extraction
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
                  <><FaCrown className="text-yellow-500" /> <span className="font-semibold">✨ Premium:</span> Unlimited conversions</>
                ) : (
                  <><FaClock className="text-blue-500" /> {usageInfo.used} used today • {usageInfo.remaining} free remaining</>
                )}
              </p>
              {!usageInfo.isPremium && (
                <button
                  onClick={handleUpgrade}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  <FaCrown /> Upgrade Now
                </button>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="mb-6 bg-white rounded-xl p-4 border border-green-200 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaSpinner className="animate-spin text-green-500" />
                  {progressStatus}
                </span>
                <span className="text-sm font-semibold text-green-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500"
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
                        setExtractedTables([]);
                      }
                    }}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaUpload className="text-green-500" /> Batch Mode
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
                  className="text-xs text-green-600 hover:text-green-800 transition flex items-center gap-1"
                >
                  <FaCrown className="text-yellow-500" /> Upgrade for Batch
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                  dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
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
                ) : batchMode && files.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FaCheckCircle className="text-2xl" />
                      <span className="font-medium">{files.length} PDF(s) added to queue</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {files.map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="truncate">{f.name}</span>
                          <span className="text-gray-400 text-xs ml-2">{formatFileSize(f.size)}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('batch-upload-input')?.click()}
                      className="text-sm text-green-600 hover:text-green-800 transition"
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
                    <div className="text-6xl text-green-400 mx-auto">
                      <FaFileExcel className="mx-auto" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-lg">
                        {batchMode ? 'Drop PDFs here for batch extraction' : 'Drop your PDF here'}
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
                      className="inline-block px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer"
                    >
                      {batchMode ? 'Choose PDF Files' : 'Choose PDF File'}
                    </label>
                  </div>
                )}
              </div>

              {/* Conversion Options */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaCog className="text-green-500" /> Extraction Options
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Output Format
                    </label>
                    <select
                      value={conversionOptions.format || 'xlsx'}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, format: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="xlsx">Excel (.xlsx)</option>
                      <option value="xls">Excel 97-2003 (.xls)</option>
                      <option value="csv">CSV (.csv)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Table Detection
                    </label>
                    <select
                      value={conversionOptions.tableDetection || 'auto'}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, tableDetection: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="auto">Auto Detect</option>
                      <option value="all">All Tables</option>
                      <option value="first">First Table Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Extraction Mode
                    </label>
                    <select
                      value={conversionOptions.extractionMode || 'standard'}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, extractionMode: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="standard">Standard</option>
                      <option value="exact">Exact (Slower)</option>
                      <option value="text">Text Only</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={conversionOptions.includeHeaders !== false}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, includeHeaders: e.target.checked })}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    Include Headers
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={conversionOptions.combineTables || false}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, combineTables: e.target.checked })}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    Combine Tables
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={conversionOptions.preserveFormatting !== false}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, preserveFormatting: e.target.checked })}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    Preserve Formatting
                  </label>
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
                  <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited + Batch)
                </label>
                {!isPremium && (
                  <span className="text-xs text-gray-400 ml-2">
                    (Free: 5/day)
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (batchMode ? files.length === 0 : !file)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaFileExcel />}
                {loading 
                  ? batchMode ? `Extracting... ${Math.round(progress)}%` : 'Extracting...'
                  : batchMode ? `Extract ${files.length} Files to Excel` : 'Extract to Excel'
                }
              </button>
            </form>

            {/* Extracted Tables Preview */}
            {extractedTables.length > 0 && !loading && showTablePreview && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaTable className="text-green-500" /> Extracted Data Preview
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowTablePreview(!showTablePreview)}
                      className="text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                      {showTablePreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  </div>
                </div>
                
                {extractedTables.map((table, index) => (
                  <TablePreview 
                    key={index} 
                    data={table} 
                    title={`Table ${index + 1} (${table.length} rows)`} 
                  />
                ))}
              </div>
            )}

            {/* Batch Results */}
            {conversionResults.length > 0 && !loading && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" /> Extraction Results
                  </h4>
                  {conversionResults.filter(r => r.success).length > 0 && (
                    <button
                      onClick={downloadAllBatch}
                      className="text-sm bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                    >
                      <FaDownload /> Download All
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {conversionResults.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.success ? (
                          <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        ) : (
                          <FaTimes className="text-red-500 flex-shrink-0" />
                        )}
                        <span className="text-sm truncate">{item.filename}</span>
                        <span className={`text-xs ${item.success ? 'text-green-500' : 'text-red-500'}`}>
                          {item.success ? `${item.tables?.length || 1} table(s)` : item.error}
                        </span>
                      </div>
                      {item.success && (
                        <button
                          onClick={() => downloadBatchFile(item.result, item.filename)}
                          className="text-green-500 hover:text-green-700 transition text-sm flex items-center gap-1 flex-shrink-0"
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
                      <p className="font-semibold text-green-800">✅ Extraction Complete!</p>
                      <p className="text-sm text-green-600">
                        {extractedTables.length} table(s) extracted from PDF
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={downloadFile}
                      className="flex-1 bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                    >
                      <FaDownload /> Download Excel File
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
                      <FaPlus /> Extract Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Conversion History */}
          <div className="mt-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FaHistory className="text-green-500" />
                  <span className="font-semibold text-gray-700">Extraction History</span>
                  <span className="text-xs text-gray-400">({conversionHistory.length})</span>
                </div>
              </div>
              {conversionHistory.length > 0 ? (
                <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
                  {conversionHistory.slice(0, 5).map((item, idx) => (
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
                          <span className="text-xs text-green-500 flex items-center gap-1">
                            <FaCheckCircle className="text-xs" /> Done
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No extraction history yet
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaShieldAlt className="text-3xl text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Secure Extraction</h4>
              <p className="text-xs text-gray-500">Files are encrypted and automatically deleted</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaTable className="text-3xl text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Smart Table Detection</h4>
              <p className="text-xs text-gray-500">Automatically detects and extracts tables</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaFileExcel className="text-3xl text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Editable Excel</h4>
              <p className="text-xs text-gray-500">Get fully editable Excel spreadsheets</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaUpload className="text-3xl text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Batch Processing</h4>
              <p className="text-xs text-gray-500">Convert multiple PDFs at once (Premium)</p>
            </div>
          </div>

          {/* Upgrade CTA */}
          {!isPremium && (
            <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
                <p className="text-green-100 mb-4">
                  Get unlimited conversions, batch processing, advanced table extraction, and priority support.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5"
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
    </>
  );
};

export default PDFToExcel;