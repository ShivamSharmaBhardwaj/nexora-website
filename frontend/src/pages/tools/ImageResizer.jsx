// src/pages/tools/ImageResizer.jsx
import React, { useState } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaImage, 
  FaCheckCircle, FaCircle, FaTimes, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaArrowsAlt,
  FaExpand, FaCompress, FaUpload, FaArrowRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const ImageResizer = () => {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setResult(null);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
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
      if (!droppedFile.type.startsWith('image/')) {
        toast.error('Please drop an image file');
        return;
      }
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(droppedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an image');
      return;
    }
    if (width < 10 || height < 10) {
      toast.error('Width and height must be at least 10px');
      return;
    }
    if (width > 8000 || height > 8000) {
      toast.error('Width and height must be less than 8000px');
      return;
    }
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('is_premium', isPremium);
    
    try {
      const response = await api.imageResizer(formData);
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        toast.success(`✅ Image resized from ${response.data.original_size[0]}x${response.data.original_size[1]} to ${response.data.new_size[0]}x${response.data.new_size[1]}!`);
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
        toast.error(error.response?.data?.error || 'Failed to resize image');
      }
    } finally {
      setLoading(false);
    }
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

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setPreview(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
    setWidth(w);
    setHeight(h);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
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
            Resize and optimize images for web, social media, and print with batch processing
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: 5/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaLock className="text-green-500" /> Premium: Unlimited
            </span>
            <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
              <FaExpand className="text-pink-500" /> Presets Available
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
                <span className="flex items-center gap-2"><FaCrown className="text-yellow-500" /> Premium: Unlimited resizes</span>
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
              className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
                dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center text-pink-500 text-2xl">
                      <FaImage />
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
                  <div className="text-6xl text-pink-400 mx-auto">
                    <FaImage className="mx-auto" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-lg">Drop your image here</p>
                    <p className="text-sm text-gray-400">or click to browse</p>
                  </div>
                  <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP, GIF up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer"
                  >
                    Choose Image
                  </label>
                </div>
              )}
            </div>

            {/* Preview */}
            {preview && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                <img src={preview} alt="Preview" className="max-h-32 mx-auto object-contain" />
              </div>
            )}

            {/* Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyPreset(preset.w, preset.h)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-pink-100 rounded-lg text-xs transition border border-gray-200 hover:border-pink-300"
                  >
                    {preset.label} ({preset.w}x{preset.h})
                  </button>
                ))}
              </div>
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
                  max="8000"
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
                  max="8000"
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

            {/* Premium Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700 flex items-center gap-1">
                <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited resizes)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaArrowsAlt />}
              {loading ? 'Resizing...' : `Resize to ${width}x${height}`}
            </button>
          </form>

          {/* Results */}
          {result && (
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

        {/* Features Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <FaExpand className="text-3xl text-pink-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Custom Dimensions</h4>
            <p className="text-xs text-gray-500">Set any width and height</p>
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

export default ImageResizer;