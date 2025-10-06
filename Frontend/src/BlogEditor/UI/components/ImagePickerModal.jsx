import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Search, 
  Sparkles, 
  Loader2,
  Image as ImageIcon,
  FolderOpen,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { UNSPLASH_ACCESS_KEY, UNSPLASH_API_URL, UNSPLASH_CATEGORIES } from './Unsplash.BlogChat';

const ImagePickerModal = ({ isOpen, onClose, onSelectImage, isDark }) => {
  const [activeTab, setActiveTab] = useState('unsplash');
  const [searchTerm, setSearchTerm] = useState('');
  const [unsplashImages, setUnsplashImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fetchUnsplashImages = async (query = 'minimal', pageNum = 1, perPage = 12) => {
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'your-unsplash-access-key-here') {
      const mockImages = Array.from({ length: 12 }, (_, i) => ({
        id: `mock-${i}`,
        urls: {
          small: `https://picsum.photos/400/300?random=${i}`,
          regular: `https://picsum.photos/800/600?random=${i}`,
        },
        alt_description: `Mock image ${i + 1}`,
        user: {
          name: `Photographer ${i + 1}`,
          username: `user${i + 1}`,
          links: { html: '#' }
        },
        links: { download_location: '#' }
      }));
      
      setLoading(true);
      setTimeout(() => {
        setUnsplashImages(mockImages);
        setLoading(false);
      }, 500);
      return;
    }

    setLoading(true);
    try {
      const endpoint = query 
        ? `${UNSPLASH_API_URL}/search/photos?query=${query}&page=${pageNum}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
        : `${UNSPLASH_API_URL}/photos?page=${pageNum}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      const images = query ? data.results : data;
      
      setUnsplashImages(images);
    } catch (error) {
      console.error('Error fetching Unsplash images:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'unsplash') {
      fetchUnsplashImages('minimal', 1);
    }
  }, [isOpen, activeTab]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchUnsplashImages(searchTerm.trim(), 1);
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          const reader = new FileReader();
          reader.onload = (e) => {
            onSelectImage(e.target.result);
            onClose();
          };
          reader.readAsDataURL(file);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const selectUnsplashImage = (image) => {
    onSelectImage({
      url: image.urls.regular,
      alt: image.alt_description || 'Cover image',
      credit: {
        photographer: image.user.name,
        username: image.user.username,
        profileUrl: image.user.links.html
      }
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl ${
              isDark ? 'bg-dcard border border-dbordercolor/20' : 'bg-white border border-bordercolor/20'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b backdrop-blur-sm ${
              isDark ? 'border-dbordercolor/30 bg-dcard/80' : 'border-bordercolor/30 bg-white/80'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-daccent/20' : 'bg-accent/20'
                }`}>
                  <ImageIcon className={`w-5 h-5 ${
                    isDark ? 'text-daccent' : 'text-accent'
                  }`} />
                </div>
                <h2 className={`text-xl font-semibold ${
                  isDark ? 'text-dText' : 'text-text'
                }`}>
                  Add Cover Image
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2.5 rounded-xl transition-colors duration-200 ${
                  isDark 
                    ? 'hover:bg-dbg/80 text-dMuted-text hover:text-dText' 
                    : 'hover:bg-gray-100 text-muted-text hover:text-text'
                }`}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className={`flex border-b ${
              isDark ? 'border-dbordercolor/30' : 'border-bordercolor/30'
            }`}>
              {['upload', 'unsplash'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center px-8 py-4 font-medium transition-colors duration-200 ${
                    activeTab === tab
                      ? isDark
                        ? 'text-daccent bg-daccent/10'
                        : 'text-accent bg-accent/10'
                      : isDark
                        ? 'text-dMuted-text hover:text-dText hover:bg-dbg/30'
                        : 'text-muted-text hover:text-text hover:bg-gray-50'
                  }`}
                >
                  {tab === 'upload' ? (
                    <Upload className="w-4 h-4 mr-3" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-3" />
                  )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isDark ? 'bg-daccent' : 'bg-accent'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'upload' ? (
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Upload Area */}
                    <div
                      className={`relative ${isUploading ? 'pointer-events-none' : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <label className={`w-full aspect-[2.5/1] rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                        dragActive 
                          ? isDark
                            ? 'border-daccent bg-daccent/10 scale-[1.01]' 
                            : 'border-accent bg-accent/10 scale-[1.01]'
                          : isDark 
                            ? 'border-dbordercolor hover:border-daccent/60 hover:bg-daccent/5' 
                            : 'border-bordercolor hover:border-accent/60 hover:bg-accent/5'
                      } ${isUploading ? 'opacity-60' : ''}`}>
                        
                        {isUploading ? (
                          <div className="text-center space-y-4">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                              isDark ? 'bg-daccent/20' : 'bg-accent/20'
                            }`}>
                              <Loader2 className={`w-8 h-8 animate-spin ${
                                isDark ? 'text-daccent' : 'text-accent'
                              }`} />
                            </div>
                            <div>
                              <h3 className={`text-lg font-semibold mb-2 ${
                                isDark ? 'text-dText' : 'text-text'
                              }`}>
                                Uploading... {uploadProgress}%
                              </h3>
                              <div className={`w-64 h-2 mx-auto rounded-full overflow-hidden ${
                                isDark ? 'bg-dbg' : 'bg-gray-200'
                              }`}>
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${uploadProgress}%` }}
                                  className={`h-full rounded-full ${
                                    isDark ? 'bg-daccent' : 'bg-accent'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors ${
                              dragActive 
                                ? isDark ? 'bg-daccent/20' : 'bg-accent/20'
                                : isDark ? 'bg-dbg' : 'bg-gray-100'
                            }`}>
                              <Upload className={`w-8 h-8 transition-colors ${
                                dragActive 
                                  ? isDark ? 'text-daccent' : 'text-accent'
                                  : isDark ? 'text-dMuted-text' : 'text-muted-text'
                              }`} />
                            </div>
                            
                            <div>
                              <h3 className={`text-xl font-semibold mb-2 ${
                                isDark ? 'text-dText' : 'text-text'
                              }`}>
                                {dragActive ? 'Drop your image here' : 'Click to upload an image'}
                              </h3>
                              <p className={`text-base mb-4 ${
                                isDark ? 'text-dMuted-text' : 'text-muted-text'
                              }`}>
                                or drag and drop it here
                              </p>
                              
                              <div className="flex items-center justify-center space-x-2">
                                <CheckCircle2 className={`w-4 h-4 ${
                                  isDark ? 'text-daccent' : 'text-accent'
                                }`} />
                                <span className={`text-sm ${
                                  isDark ? 'text-dMuted-text' : 'text-muted-text'
                                }`}>
                                  PNG, JPG, WebP up to 10MB
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => document.querySelector('input[type="file"]').click()}
                        disabled={isUploading}
                        className={`flex items-center justify-center space-x-3 p-4 rounded-xl border transition-colors duration-200 ${
                          isUploading 
                            ? 'opacity-50 cursor-not-allowed' 
                            : isDark
                              ? 'border-dbordercolor hover:border-daccent/60 hover:bg-daccent/5 text-dMuted-text hover:text-dText'
                              : 'border-bordercolor hover:border-accent/60 hover:bg-accent/5 text-muted-text hover:text-text'
                        }`}
                      >
                        <FolderOpen className="w-5 h-5" />
                        <span className="font-medium">Browse Files</span>
                      </motion.button>

                      <div className={`flex items-center justify-center space-x-3 p-4 rounded-xl border ${
                        isDark 
                          ? 'border-dbordercolor/50 bg-dbg/30 text-dMuted-text' 
                          : 'border-bordercolor/50 bg-gray-50 text-muted-text'
                      }`}>
                        <ImageIcon className="w-5 h-5" />
                        <span className="font-medium text-sm">Max: 10MB</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className={`text-sm ${
                        isDark ? 'text-dMuted-text' : 'text-muted-text'
                      }`}>
                        Recommended size: 1200×480px • Supported: JPEG, PNG, WebP
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="unsplash"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Search */}
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDark ? 'text-dMuted-text' : 'text-muted-text'
                        }`} />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search for beautiful images..."
                          className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-colors duration-200 ${
                            isDark 
                              ? 'bg-dbg border-dbordercolor text-dText placeholder-dMuted-text focus:border-daccent' 
                              : 'bg-bg border-bordercolor text-text placeholder-muted-text focus:border-accent'
                          }`}
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="submit"
                          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors duration-200 ${
                            isDark 
                              ? 'hover:bg-daccent/20 text-dMuted-text hover:text-daccent' 
                              : 'hover:bg-accent/20 text-muted-text hover:text-accent'
                          }`}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </form>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-3">
                      {UNSPLASH_CATEGORIES.map((category) => (
                        <motion.button
                          key={category}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSearchTerm(category);
                            fetchUnsplashImages(category, 1);
                          }}
                          className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                            isDark 
                              ? 'bg-daccent/15 text-daccent hover:bg-daccent/25 border border-daccent/30' 
                              : 'bg-accent/15 text-accent hover:bg-accent/25 border border-accent/30'
                          }`}
                        >
                          {category}
                        </motion.button>
                      ))}
                    </div>

                    {/* Images Grid */}
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <Loader2 className={`w-10 h-10 animate-spin ${
                          isDark ? 'text-daccent' : 'text-accent'
                        }`} />
                        <p className={`text-lg font-medium ${
                          isDark ? 'text-dText' : 'text-text'
                        }`}>
                          Finding beautiful images...
                        </p>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-3 gap-4"
                      >
                        {unsplashImages.map((image) => (
                          <motion.button
                            key={image.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => selectUnsplashImage(image)}
                            className="group relative aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
                          >
                            <img
                              src={image.urls.small}
                              alt={image.alt_description}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <span className="text-sm font-medium text-white bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                by {image.user.name}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImagePickerModal;
