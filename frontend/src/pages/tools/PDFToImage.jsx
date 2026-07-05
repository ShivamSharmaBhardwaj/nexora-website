// src/pages/tools/PDFToImage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFilePdf, 
  FaImage, FaCheckCircle, FaCircle, FaTimes, FaEye,
  FaFileAlt, FaArrowRight, FaTrash, FaPlus, FaCrown,
  FaUpload, FaCheck, FaClock, FaPercent, FaList,
  FaFile, FaCompress, FaExpand, FaPlay, FaStop,
  FaGlobe, FaMapMarkerAlt, FaLanguage, FaHeadphones,
  FaShieldAlt, FaRocket
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
// MAIN PDF TO IMAGE COMPONENT
// ============================================

const PDFToImage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [conversionResults, setConversionResults] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Check premium status on load
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await api.checkPremium();
        if (response.data.is_premium) {
          setIsPremium(true);
          toast.success('🎉 Premium activated! Unlimited conversions unlocked.');
        }
      } catch (error) {
        console.error('Premium check failed:', error);
      }
    };
    checkPremiumStatus();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  };

  const validateAndAddFiles = (newFiles) => {
    const validFiles = [];
    const errors = [];

    newFiles.forEach(file => {
      if (file.type !== 'application/pdf') {
        errors.push(`${file.name} is not a PDF file`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} exceeds 10MB limit`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      toast.success(`Added ${validFiles.length} PDF(s)`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResult(null);
    setSelectedImages([]);
    setConversionResults([]);
  };

  const clearAllFiles = () => {
    setFiles([]);
    setResult(null);
    setSelectedImages([]);
    setConversionResults([]);
    setProgress(0);
    setProgressStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (safeArray(files).length === 0) {
      toast.error('Please select at least one PDF file');
      return;
    }

    setLoading(true);
    setProgress(0);
    setProgressStatus('Starting conversion...');
    setConversionResults([]);
    setResult(null);
    setSelectedImages([]);

    const allResults = [];
    let totalPagesConverted = 0;

    try {
      for (let i = 0; i < safeArray(files).length; i++) {
        const file = safeArray(files)[i];
        setCurrentFileIndex(i);
        setTotalFiles(safeArray(files).length);
        setProgressStatus(`Processing file ${i + 1} of ${safeArray(files).length}: ${file.name}`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('is_premium', isPremium);

        try {
          const response = await api.pdfToImage(formData);
          
          if (response.data.success) {
            allResults.push({
              fileName: file.name,
              images: safeArray(response.data.images),
              totalPages: response.data.total_pages,
              converted: response.data.converted,
              success: true
            });
            
            totalPagesConverted += response.data.converted;
            
            const progressPercentage = ((i + 1) / safeArray(files).length) * 100;
            setProgress(progressPercentage);
            setProgressStatus(`Completed ${i + 1} of ${safeArray(files).length} files`);

            setUsageInfo({
              used: response.data.usage_count,
              remaining: response.data.remaining_free,
              isPremium: response.data.is_premium
            });

            if (response.data.is_premium) {
              setIsPremium(true);
            }

          } else {
            allResults.push({
              fileName: file.name,
              error: response.data.error || 'Conversion failed',
              success: false
            });
          }
        } catch (error) {
          if (error.response?.data?.limit_reached) {
            toast.error(`Free limit reached! Please upgrade to premium for unlimited conversions.`);
            setUsageInfo({
              used: error.response.data.usage_count,
              remaining: error.response.data.remaining_pages || 0,
              isPremium: false
            });
            setShowPaymentModal(true);
            break;
          } else {
            allResults.push({
              fileName: file.name,
              error: error.response?.data?.error || 'Failed to convert',
              success: false
            });
          }
        }
      }

      setConversionResults(allResults);
      setProgress(100);
      setProgressStatus('Conversion complete!');

      const allImages = allResults
        .filter(r => r.success)
        .flatMap(r => safeArray(r.images));

      if (safeArray(allImages).length > 0) {
        setResult({
          images: allImages,
          total_pages: allImages.length,
          converted: allImages.length,
          allFiles: allResults
        });
        toast.success(`✅ Successfully converted ${allImages.length} pages from ${allResults.filter(r => r.success).length} files!`);
      }

    } catch (error) {
      toast.error('Failed to convert files');
      console.error('Conversion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (index) => {
    setSelectedImages(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const downloadSelected = () => {
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    
    selectedImages.forEach(index => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `page-${index + 1}.png`;
        link.href = safeArray(result?.images)[index]?.image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200);
    });
    toast.success(`Downloading ${selectedImages.length} images...`);
  };

  const downloadAll = () => {
    if (!result || !safeArray(result?.images)) return;
    
    safeArray(result.images).forEach((img, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `page-${img.page || index + 1}.png`;
        link.href = img.image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200);
    });
    toast.success(`Downloading ${safeArray(result.images).length} images...`);
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const getTotalPages = () => {
    return safeArray(files).length > 0 ? `${safeArray(files).length} file(s) selected` : 'No files selected';
  };

  return (
    <>
      {/* ============================================ */}
      {/* SEO + AEO + GEO Helmet Implementation */}
      {/* ============================================ */}
      <Helmet>
        <title>Free PDF to Image Converter - Convert PDF to PNG/JPG Online | Krynova Technologies</title>
        <meta name="description" content="Convert PDF to images online for free with Krynova Technologies. Convert PDF pages to high-quality PNG/JPG images. Free users get 3 pages per day. Premium users get unlimited conversions." />
        <meta name="keywords" content="PDF to image converter, convert PDF to PNG, PDF to JPG, PDF to image online, free PDF to image converter, extract images from PDF, Krynova PDF to image, best PDF to image tool, PDF to PNG converter India" />
        <link rel="canonical" href={`${siteUrl}/tools/pdf-to-image`} />
        
        {/* GEO Meta Tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta name="serviceArea" content={`India, ${globalCountries.join(", ")}, Worldwide`} />
        <meta name="targetGeo" content="India" />
        
        {/* AEO Meta Tags */}
        <meta name="question" content="How to convert PDF to image for free in India?" />
        <meta name="answer" content="Krynova Technologies offers a free PDF to image converter in India. Upload your PDF file, choose your conversion options, and download your images as PNG or JPG. Free users get 3 pages per day. Premium users get unlimited conversions." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="voice-search" content="true" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free PDF to Image Converter - Convert PDF to PNG/JPG Online | Krynova Technologies" />
        <meta property="og:description" content="Convert PDF to images online for free. Convert PDF pages to high-quality PNG/JPG images. Free users get 3 pages per day." />
        <meta property="og:url" content={`${siteUrl}/tools/pdf-to-image`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF to Image Converter - Convert PDF to PNG/JPG Online" />
        <meta name="twitter:description" content="Convert PDF to images online for free with Krynova Technologies." />
      </Helmet>

      {/* ============================================ */}
      {/* Speakable Content for Voice Assistants */}
      {/* ============================================ */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Free PDF to Image Converter - Krynova Technologies</h2>
        <p>Convert PDF to images online for free. Convert PDF pages to high-quality PNG and JPG images.</p>
        <ul>
          <li>Free PDF to image conversion - 3 pages per day</li>
          <li>Convert PDF pages to PNG or JPG format</li>
          <li>High-quality image output</li>
          <li>Multiple PDF file support</li>
          <li>Download individual pages or all pages</li>
          <li>Premium - Unlimited conversions, unlimited files</li>
          <li>Secure and encrypted file processing</li>
        </ul>
        <p>Krynova Technologies is the best PDF to image converter in India, serving cities like Agra, Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, and all across India.</p>
      </div>

      {/* ============================================ */}
      {/* Schema.org WebApplication */}
      {/* ============================================ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PDF to Image Converter",
          "description": "Free online PDF to image converter. Convert PDF pages to high-quality PNG and JPG images. Supports 3 free pages per day.",
          "url": `${siteUrl}/tools/pdf-to-image`,
          "applicationCategory": "Utilities",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "description": "Free PDF to image converter with 3 pages per day. Premium upgrade available for unlimited conversions."
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
            "target": `${siteUrl}/tools/pdf-to-image`,
            "result": {
              "@type": "ImageObject",
              "contentUrl": `${siteUrl}/api/pdf-to-image`
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
              "name": "How to convert PDF to image for free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To convert PDF to image for free, visit Krynova Technologies' PDF to Image Converter, upload your PDF file, and click Convert. Download your images as PNG or JPG instantly. Free users get 3 pages per day."
              }
            },
            {
              "@type": "Question",
              "name": "What image formats are supported?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies' PDF to Image converter supports PNG and JPG formats. PNG is recommended for images with text and graphics, while JPG is better for photographs."
              }
            },
            {
              "@type": "Question",
              "name": "Can I convert multiple PDFs at once?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, you can upload multiple PDF files at once. Premium users get unlimited file conversions. Free users are limited to 3 pages per day total across all files."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best PDF to image converter in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies offers one of the best free PDF to image converters in India. It supports multiple formats, high-quality output, batch processing, and serves users across all major Indian cities including Agra, Delhi, Mumbai, Bengaluru, Chennai, and Hyderabad."
              }
            },
            {
              "@type": "Question",
              "name": "Is it safe to convert PDF to image online?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Krynova Technologies ensures secure PDF to image conversion with encrypted file processing. All uploaded files are automatically deleted after conversion, and your documents are never shared with third parties."
              }
            },
            {
              "@type": "Question",
              "name": "Can I download individual pages or all pages?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, you can download individual pages by selecting them, or download all pages at once. Each page is converted to a separate image file with page numbers in the filename."
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
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaFilePdf className="text-blue-500" />
              Free PDF to Image Converter
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              PDF to <span className="gradient-text">Image Converter</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Convert PDF pages to high-quality images. Perfect for presentations, thumbnails, and sharing. Free users get 3 pages per day.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free: 3 pages/day
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCrown className="text-yellow-500" /> Premium: Unlimited
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaPlus className="text-purple-500" /> Multi-file support
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
                  <>
                    <FaCrown className="text-yellow-500" />
                    <span className="font-semibold">✨ Premium:</span> Unlimited pages • Unlimited files
                  </>
                ) : (
                  <>
                    <FaClock className="text-blue-500" />
                    {usageInfo.used} pages used today • {usageInfo.remaining} pages remaining
                  </>
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
          {loading && (
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
                ></div>
              </div>
              {totalFiles > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Processing file {currentFileIndex + 1} of {totalFiles}
                </p>
              )}
            </div>
          )}

          {/* Conversion Results Summary */}
          {safeArray(conversionResults).length > 0 && !loading && (
            <div className="mb-6 bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaList className="text-blue-500" /> Conversion Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {safeArray(conversionResults).map((result, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-lg">
                    {result.success ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                    <span className="truncate">{result.fileName}</span>
                    {result.success && (
                      <span className="text-xs text-gray-500 ml-auto">{result.converted} pages</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : safeArray(files).length > 0 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
              >
                {safeArray(files).length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FaCheck className="text-2xl" />
                      <span className="font-medium">{safeArray(files).length} PDF(s) selected</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      {safeArray(files).map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm mb-1">
                          <div className="flex items-center gap-2 truncate">
                            <FaFilePdf className="text-red-500 flex-shrink-0" />
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-600 transition"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-blue-600 hover:text-blue-800 transition font-medium"
                      >
                        <FaPlus className="inline mr-1" /> Add more files
                      </button>
                      <button
                        type="button"
                        onClick={clearAllFiles}
                        className="text-sm text-red-500 hover:text-red-700 transition font-medium"
                      >
                        <FaTrash className="inline mr-1" /> Clear all
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-5xl text-blue-400 mx-auto">
                      <FaUpload className="mx-auto" />
                    </div>
                    <p className="text-gray-600">Drop PDF files here or click to browse</p>
                    <p className="text-sm text-gray-400">Supports multiple PDFs up to 10MB each</p>
                    <p className="text-xs text-blue-500">{isPremium ? '✨ Unlimited files' : '📄 Free: 3 pages/day'}</p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                
                {safeArray(files).length === 0 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                  >
                    Browse Files
                  </button>
                )}
              </div>

              {/* Premium Toggle */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700 flex items-center gap-2">
                  <FaCrown className="text-yellow-500" /> 
                  <span className="font-medium">Premium Mode</span>
                  <span className="text-xs text-gray-400">(Unlimited pages & files)</span>
                </label>
                {!isPremium && (
                  <span className="text-xs text-amber-600 ml-auto">
                    ⚡ {safeArray(files).length} file(s) selected • Pages limited to 3/day
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || safeArray(files).length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    {progress > 0 ? `Converting... ${Math.round(progress)}%` : 'Converting...'}
                  </>
                ) : (
                  <>
                    <FaPlay />
                    Convert {safeArray(files).length} PDF(s) to Images
                  </>
                )}
              </button>
            </form>

            {/* Results */}
            {result && safeArray(result?.images).length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FaImage className="text-blue-600" /> 
                    Converted Images 
                    <span className="text-sm font-normal text-gray-500">
                      ({safeArray(result.images).length} pages)
                    </span>
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={downloadSelected}
                      disabled={safeArray(selectedImages).length === 0}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaDownload /> Selected ({safeArray(selectedImages).length})
                    </button>
                    <button
                      onClick={downloadAll}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm flex items-center gap-2"
                    >
                      <FaDownload /> All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {safeArray(result.images).map((img, index) => (
                    <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                      <img 
                        src={img.image} 
                        alt={`PDF Page ${img.page || index + 1}`} 
                        className="w-full h-auto cursor-pointer"
                        onClick={() => setPreviewImage(img.image)}
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Page {img.page || index + 1}
                      </div>
                      <button
                        onClick={() => toggleImageSelection(index)}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition ${
                          safeArray(selectedImages).includes(index) 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white/80 text-gray-600 hover:bg-white'
                        }`}
                      >
                        {safeArray(selectedImages).includes(index) ? <FaCheckCircle className="text-sm" /> : <FaCircle className="text-sm" />}
                      </button>
                      <a
                        href={img.image}
                        download={`page-${img.page || index + 1}.png`}
                        className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100"
                      >
                        <FaDownload className="text-sm text-gray-600" />
                      </a>
                    </div>
                  ))}
                </div>

                {result.total_pages > result.converted && !isPremium && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-600 text-center flex items-center justify-center gap-2">
                      <FaLock className="text-xs" />
                      {result.total_pages - result.converted} more pages locked • 
                      <button 
                        onClick={handleUpgrade}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Upgrade to Premium
                      </button>
                      {' '}to convert all pages
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaImage className="text-3xl text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">High Quality</h4>
              <p className="text-xs text-gray-500">High-resolution PNG images</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaShieldAlt className="text-3xl text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Secure Conversion</h4>
              <p className="text-xs text-gray-500">Files encrypted and auto-deleted</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaRocket className="text-3xl text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Fast Processing</h4>
              <p className="text-xs text-gray-500">Convert in seconds</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaPlus className="text-3xl text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Multi-file Support</h4>
              <p className="text-xs text-gray-500">Convert multiple PDFs at once</p>
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
                <h3 className="text-xl font-bold mb-2">Unlock Unlimited PDF to Image Conversions!</h3>
                <p className="text-blue-100 mb-4 text-sm">
                  Get premium access and convert unlimited PDF pages to images. No daily limits, no file restrictions.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2 mx-auto"
                >
                  <FaCrown className="text-yellow-500" /> Upgrade to Premium
                </button>
                <p className="text-xs text-blue-200 mt-3">Starting at just ₹99/month</p>
              </div>
            </div>
          )}

          {/* Image Preview Modal */}
          {previewImage && (
            <div 
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setPreviewImage(null)}
            >
              <div className="relative max-w-4xl max-h-[90vh]">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
                >
                  <FaTimes className="text-xl" />
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = 'page.png';
                    link.href = previewImage;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <FaDownload /> Download
                </button>
              </div>
            </div>
          )}

          {/* Payment Modal */}
          <PaymentModal 
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={() => {
              setIsPremium(true);
              setShowPaymentModal(false);
              toast.success('🎉 Premium activated! Enjoy unlimited conversions.');
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PDFToImage;