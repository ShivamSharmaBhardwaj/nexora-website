// src/pages/tools/MergePDF.jsx
import React, { useState } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFilePdf, 
  FaCheckCircle, FaCircle, FaTimes, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaGripLines,
  FaArrowUp, FaArrowDown, FaSort, FaUpload
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (validFiles.length === 0) {
      toast.error('Please select valid PDF files');
      return;
    }
    
    const totalSize = validFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 30 * 1024 * 1024) {
      toast.error('Total file size must be less than 30MB');
      return;
    }
    
    setFiles(prev => [...prev, ...validFiles]);
    setResult(null);
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
    const validFiles = droppedFiles.filter(file => file.type === 'application/pdf');
    
    if (validFiles.length === 0) {
      toast.error('Please drop valid PDF files');
      return;
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFileUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    setFiles(newFiles);
  };

  const moveFileDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  const clearAll = () => {
    setFiles([]);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge');
      return;
    }
    setLoading(true);
    
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('is_premium', isPremium);
    
    try {
      const response = await api.mergePdf(formData);
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        toast.success(`✅ ${response.data.pages} PDFs merged successfully!`);
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
        toast.error(error.response?.data?.error || 'Failed to merge PDFs');
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
    toast.success('Merged PDF downloaded!');
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
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaFilePdf className="text-indigo-500" />
            Merge PDF Files
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Merge <span className="gradient-text">PDF Files</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Combine multiple PDF files into a single document with custom page order
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: 3/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaLock className="text-green-500" /> Premium: Unlimited
            </span>
            <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
              <FaGripLines className="text-indigo-500" /> Reorder Pages
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
                <span className="flex items-center gap-2"><FaCrown className="text-yellow-500" /> Premium: Unlimited merges</span>
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
                dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {files.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{files.length} PDFs selected</p>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-red-500 hover:text-red-700 transition text-sm flex items-center gap-1"
                    >
                      <FaTrash /> Clear All
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="bg-gray-50 px-4 py-2 rounded-lg flex items-center justify-between group hover:bg-indigo-50 transition">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-xs font-medium text-gray-400 w-6">{index + 1}</span>
                          <FaFilePdf className="text-red-500 flex-shrink-0" />
                          <span className="truncate text-sm font-medium flex-1">{file.name}</span>
                          <span className="text-xs text-gray-400">{formatFileSize(file.size)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveFileUp(index)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition opacity-0 group-hover:opacity-100"
                            title="Move Up"
                          >
                            <FaArrowUp className="text-xs" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveFileDown(index)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition opacity-0 group-hover:opacity-100"
                            title="Move Down"
                          >
                            <FaArrowDown className="text-xs" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 text-gray-400 hover:text-red-600 transition"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-gray-900">{files.length}</p>
                  <p className="text-gray-500">Files</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-gray-900">{formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}</p>
                  <p className="text-gray-500">Total Size</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-gray-900">PDF</p>
                  <p className="text-gray-500">Output Format</p>
                </div>
              </div>
            )}

            {/* Premium Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700 flex items-center gap-1">
                <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited merges)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || files.length < 2}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaFilePdf />}
              {loading ? 'Merging...' : `Merge ${files.length} PDF Files`}
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
                    <p className="text-sm text-indigo-600">{result.pages} PDFs merged into one document</p>
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
                      setFiles([]);
                      setResult(null);
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

        {/* Features Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
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

export default MergePDF;