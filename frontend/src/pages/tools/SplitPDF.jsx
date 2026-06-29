// src/pages/tools/SplitPDF.jsx
import React, { useState } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFilePdf, 
  FaCheckCircle, FaCircle, FaTimes, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaCut,
  FaFile, FaUpload, FaArrowRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const SplitPDF = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast.error('File size must be less than 20MB');
        return;
      }
      setFile(selectedFile);
      setResult(null);
      setSelectedPages([]);
    }
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
      if (droppedFile.type !== 'application/pdf') {
        toast.error('Please drop a PDF file');
        return;
      }
      if (droppedFile.size > 20 * 1024 * 1024) {
        toast.error('File size must be less than 20MB');
        return;
      }
      setFile(droppedFile);
      setResult(null);
      setSelectedPages([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_premium', isPremium);
    
    try {
      const response = await api.splitPdf(formData);
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        toast.success(`✅ ${response.data.total_pages} pages split successfully!`);
        setSelectedPages(response.data.pages.map((_, i) => i));
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
        toast.error(error.response?.data?.error || 'Failed to split PDF');
      }
    } finally {
      setLoading(false);
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
    result.pages.forEach((page, index) => {
      setTimeout(() => downloadPage(page, index), index * 400);
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

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setSelectedPages([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
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
              <FaStar className="text-yellow-400" /> Free: 3/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaLock className="text-green-500" /> Premium: Unlimited
            </span>
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
              <FaCut className="text-red-500" /> Individual Pages
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
                <span className="flex items-center gap-2"><FaCrown className="text-yellow-500" /> Premium: Unlimited splits</span>
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
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl text-red-400 mx-auto">
                    <FaCut className="mx-auto" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-lg">Drop your PDF here</p>
                    <p className="text-sm text-gray-400">or click to browse</p>
                  </div>
                  <p className="text-xs text-gray-400">Supports PDF up to 20MB</p>
                  <input
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

            {/* Premium Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700 flex items-center gap-1">
                <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited splits)
              </label>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">✅ Split Complete!</p>
                      <p className="text-sm text-red-600">{result.total_pages} pages extracted</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAll}
                      className="text-sm bg-white px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                    >
                      {selectedPages.length === result.pages.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>
                
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
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 max-h-64 overflow-y-auto">
                  {result.pages.map((page, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border-2 text-center cursor-pointer transition ${
                        selectedPages.includes(index) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                      onClick={() => togglePageSelection(index)}
                    >
                      <p className="text-sm font-medium">Page {index + 1}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPage(page, index);
                        }}
                        className="mt-1 text-blue-600 hover:text-blue-800 text-xs flex items-center justify-center gap-1"
                      >
                        <FaDownload className="text-xs" /> Download
                      </button>
                      {selectedPages.includes(index) && (
                        <FaCheckCircle className="text-blue-500 text-xs mx-auto mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
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

export default SplitPDF;