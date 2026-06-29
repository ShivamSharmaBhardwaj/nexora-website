// src/pages/tools/PDFToImage.jsx
import React, { useState } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFilePdf, 
  FaImage, FaCheckCircle, FaCircle, FaTimes, FaEye,
  FaFileAlt, FaArrowRight, FaTrash, FaPlus
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const PDFToImage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setResult(null);
      setSelectedImages([]);
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
      const response = await api.pdfToImage(formData);
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        toast.success(`✅ Converted ${response.data.converted} pages to images!`);
      }
    } catch (error) {
      if (error.response?.data?.limit_reached) {
        toast.error(`Free limit reached! You can convert ${error.response.data.remaining_pages || 0} more pages today.`);
        setUsageInfo({
          used: error.response.data.usage_count,
          remaining: error.response.data.remaining_pages || 0,
          isPremium: false
        });
      } else {
        toast.error(error.response?.data?.error || 'Failed to convert PDF');
      }
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
      const link = document.createElement('a');
      link.download = `page-${index + 1}.png`;
      link.href = result.images[index].image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    toast.success(`Downloaded ${selectedImages.length} images`);
  };

  const downloadAll = () => {
    result.images.forEach((img, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `page-${index + 1}.png`;
        link.href = img.image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 300);
    });
    toast.success(`Downloading ${result.images.length} images...`);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setSelectedImages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaFilePdf className="text-blue-500" />
            PDF to Image Converter
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            PDF to <span className="gradient-text">Image Converter</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert PDF pages to high-quality JPG/PNG images. Perfect for presentations and sharing.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: 3 pages/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaLock className="text-green-500" /> Premium: Unlimited
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
                '✨ Premium: Unlimited pages'
              ) : (
                `${usageInfo.used} pages used today • ${usageInfo.remaining} pages remaining`
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
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition group">
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaFilePdf className="text-red-500 text-3xl" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-5xl text-blue-400 mx-auto">
                    <FaFilePdf className="mx-auto" />
                  </div>
                  <p className="text-gray-600">Drop your PDF here or click to browse</p>
                  <p className="text-sm text-gray-400">Supports PDF up to 10MB</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                  >
                    Choose PDF
                  </label>
                </div>
              )}
            </div>

            {/* Premium Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700 flex items-center gap-1">
                <FaStar className="text-yellow-400" /> Premium Mode (Unlimited pages)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaFilePdf />}
              {loading ? 'Converting...' : 'Convert PDF to Images'}
            </button>
          </form>

          {/* Results */}
          {result && result.images && result.images.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaImage className="text-blue-600" /> Converted Images
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadSelected}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm flex items-center gap-2"
                  >
                    <FaDownload /> Selected ({selectedImages.length})
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
                {result.images.map((img, index) => (
                  <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    <img 
                      src={img.image} 
                      alt={`Page ${img.page}`} 
                      className="w-full h-auto cursor-pointer"
                      onClick={() => setPreviewImage(img.image)}
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Page {img.page}
                    </div>
                    <button
                      onClick={() => toggleImageSelection(index)}
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition ${
                        selectedImages.includes(index) 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white/80 text-gray-600 hover:bg-white'
                      }`}
                    >
                      {selectedImages.includes(index) ? <FaCheckCircle className="text-sm" /> : <FaCircle className="text-sm" />}
                    </button>
                    <a
                      href={img.image}
                      download={`page-${img.page}.png`}
                      className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100"
                    >
                      <FaDownload className="text-sm text-gray-600" />
                    </a>
                  </div>
                ))}
              </div>

              {result.total_pages > result.converted && !usageInfo?.isPremium && (
                <p className="text-xs text-amber-600 mt-4 text-center">
                  ⚡ {result.total_pages - result.converted} more pages available in premium
                </p>
              )}
            </div>
          )}
        </div>

        {/* Image Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImage(null)}>
            <div className="max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="font-semibold">Preview</h3>
                <button onClick={() => setPreviewImage(null)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              <img src={previewImage} alt="Preview" className="max-h-[80vh] w-auto object-contain" />
            </div>
          </div>
        )}
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

export default PDFToImage;