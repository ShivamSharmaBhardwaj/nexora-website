// src/pages/tools/PDFToExcel.jsx
import React, { useState } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFilePdf, 
  FaFileExcel, FaCheckCircle, FaCircle, FaTimes, 
  FaEye, FaFileAlt, FaArrowRight, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaTable
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const PDFToExcel = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (selectedFile.size > 15 * 1024 * 1024) {
        toast.error('File size must be less than 15MB');
        return;
      }
      setFile(selectedFile);
      setResult(null);
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
      if (droppedFile.size > 15 * 1024 * 1024) {
        toast.error('File size must be less than 15MB');
        return;
      }
      setFile(droppedFile);
      setResult(null);
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
      const response = await api.pdfToExcel(formData);
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        toast.success('✅ PDF converted to Excel successfully!');
      }
    } catch (error) {
      if (error.response?.data?.limit_reached) {
        toast.error('Free limit reached! Upgrade to premium for unlimited access.');
        setUsageInfo({
          used: error.response.data.usage_count,
          remaining: 0,
          isPremium: false
        });
      } else {
        toast.error(error.response?.data?.error || 'Failed to convert PDF');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${result.file}`;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Excel file downloaded!');
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
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
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaFilePdf className="text-green-500" />
            PDF to Excel Converter
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            PDF to <span className="gradient-text">Excel Converter</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Extract tables and data from PDFs to Excel spreadsheets for analysis and reporting
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: 2/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaLock className="text-green-500" /> Premium: Unlimited
            </span>
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              <FaTable className="text-purple-500" /> Table Extraction
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
                  <div className="text-6xl text-green-400 mx-auto">
                    <FaFileExcel className="mx-auto" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-lg">Drop your PDF here</p>
                    <p className="text-sm text-gray-400">or click to browse</p>
                  </div>
                  <p className="text-xs text-gray-400">Supports PDF up to 15MB</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="inline-block px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer"
                  >
                    Choose PDF File
                  </label>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <FaShieldAlt className="text-green-500 mx-auto mb-1" />
                <span className="text-gray-600">Secure</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <FaRocket className="text-blue-500 mx-auto mb-1" />
                <span className="text-gray-600">Fast</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <FaTable className="text-green-500 mx-auto mb-1" />
                <span className="text-gray-600">Table Extraction</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <FaFileExcel className="text-green-500 mx-auto mb-1" />
                <span className="text-gray-600">Editable</span>
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
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaFileExcel />}
              {loading ? 'Converting...' : 'Convert to Excel'}
            </button>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                    <FaCheckCircle />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-800">✅ Conversion Complete!</p>
                    <p className="text-sm text-green-600">Your PDF has been converted to Excel format</p>
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
                      setFile(null);
                      setResult(null);
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

        {/* Features Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaShieldAlt className="text-3xl text-green-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Secure Conversion</h4>
            <p className="text-xs text-gray-500">Files are encrypted and automatically deleted</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaTable className="text-3xl text-green-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Table Extraction</h4>
            <p className="text-xs text-gray-500">Accurately extracts tables from PDFs</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaFileExcel className="text-3xl text-green-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Editable Excel</h4>
            <p className="text-xs text-gray-500">Get fully editable Excel spreadsheets</p>
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

export default PDFToExcel;