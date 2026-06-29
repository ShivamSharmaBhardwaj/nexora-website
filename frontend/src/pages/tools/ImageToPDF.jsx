// src/pages/tools/ImageToPDF.jsx
import React, { useState } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaImage, 
  FaFilePdf, FaCheckCircle, FaCircle, FaTimes, 
  FaTrash, FaPlus, FaCrown, FaRocket, FaShieldAlt,
  FaGripLines, FaArrowRight, FaUpload
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const ImageToPDF = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }
    
    const totalSize = validFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 20 * 1024 * 1024) {
      toast.error('Total file size must be less than 20MB');
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
    const validFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      toast.error('Please drop valid image files');
      return;
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    setLoading(true);
    
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('is_premium', isPremium);
    
    try {
      const response = await api.imageToPdf(formData);
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        toast.success(`✅ ${response.data.pages} images converted to PDF!`);
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
        toast.error(error.response?.data?.error || 'Failed to convert images');
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
    toast.success('PDF downloaded!');
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
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaImage className="text-purple-500" />
            Image to PDF Converter
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Image to <span className="gradient-text">PDF Converter</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert multiple images to a single PDF file with customizable layout and compression
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: 3 images/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaLock className="text-green-500" /> Premium: Unlimited
            </span>
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              <FaGripLines className="text-purple-500" /> Multiple Images
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
                <span className="flex items-center gap-2"><FaCrown className="text-yellow-500" /> Premium: Unlimited images</span>
              ) : (
                `${usageInfo.used} images used today • ${usageInfo.remaining} images remaining`
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
                    <p className="font-medium text-gray-900">{files.length} images selected</p>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-red-500 hover:text-red-700 transition text-sm flex items-center gap-1"
                    >
                      <FaTrash /> Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-100 rounded-lg">
                    {files.map((file, index) => (
                      <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                        <FaImage className="text-purple-500" />
                        <span className="truncate max-w-[100px]">{file.name}</span>
                        <span className="text-xs text-gray-400">({formatFileSize(file.size)})</span>
                        <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))}
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
                  <p className="text-xs text-gray-400">Supports JPG, PNG, GIF, BMP, WEBP (up to 20MB total)</p>
                  <input
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

            {/* Stats */}
            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-gray-900">{files.length}</p>
                  <p className="text-gray-500">Images</p>
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
                <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited images)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || files.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaFilePdf />}
              {loading ? 'Converting...' : `Convert ${files.length} Images to PDF`}
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
                  <button
                    onClick={() => {
                      setFiles([]);
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
            <FaImage className="text-3xl text-purple-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Multiple Images</h4>
            <p className="text-xs text-gray-500">Convert multiple images to one PDF</p>
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

export default ImageToPDF;