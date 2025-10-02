import React, { useState, useCallback } from 'react';
import { ImageIcon, Edit3, Trash2, Loader2, AlertCircle } from 'lucide-react';

const CoverImage = ({ 
  coverImage, 
  setCoverImage, 
  setShowImagePicker, 
  isDark, 
  isPreview = false,
  isUploading = false,
  onError = null,
  maxFileSize = 10 * 1024 * 1024 // 10MB default
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Handle image load errors
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
    if (onError) {
      onError('Failed to load image');
    }
  }, [onError]);

  // Handle image load success
  const handleImageLoad = useCallback(() => {
    setImageError(false);
    setImageLoading(false);
  }, []);

  // Handle image load start
  const handleImageLoadStart = useCallback(() => {
    setImageLoading(true);
    setImageError(false);
  }, []);

  // Get image source safely
  const getImageSrc = useCallback(() => {
    if (!coverImage) return null;
    return typeof coverImage === 'string' ? coverImage : coverImage?.url || null;
  }, [coverImage]);

  // Get image alt text safely
  const getImageAlt = useCallback(() => {
    if (!coverImage) return 'Cover image';
    return typeof coverImage === 'string' 
      ? 'Cover image' 
      : coverImage?.alt || 'Cover image';
  }, [coverImage]);

  // Preview mode with cover image
  if (isPreview && coverImage) {
    const imageSrc = getImageSrc();
    const imageAlt = getImageAlt();

    return (
      <div className="aspect-[2.5/1] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        {imageSrc ? (
          <>
            {imageLoading && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}
            <img 
              src={imageSrc}
              alt={imageAlt}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoadStart={handleImageLoadStart}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
            {imageError && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Failed to load image</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
    );
  }

  // Preview mode without cover image
  if (isPreview && !coverImage) {
    return null;
  }

  // Show loading state during upload
  if (isUploading) {
    return (
      <div className="mb-8" role="status" aria-label="Uploading cover image">
        <div className={`relative aspect-[2.5/1] rounded-xl border-2 border-dashed flex items-center justify-center ${
          isDark 
            ? 'border-dMuted-text bg-dcard/20' 
            : 'border-gray-300 bg-gray-50'
        }`}>
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className={`w-8 h-8 animate-spin ${
              isDark ? 'text-daccent' : 'text-accent'
            }`} />
            <p className={`text-sm font-medium ${
              isDark ? 'text-dMuted-text' : 'text-muted-text'
            }`}>
              Uploading cover image...
            </p>
            <div className={`w-32 h-1 rounded-full overflow-hidden ${
              isDark ? 'bg-dMuted-text/20' : 'bg-gray-200'
            }`}>
              <div className={`h-full rounded-full animate-pulse ${
                isDark ? 'bg-daccent' : 'bg-accent'
              }`} style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display existing cover image
  if (coverImage) {
    const imageSrc = getImageSrc();
    const imageAlt = getImageAlt();

    return (
      <div className="mb-8 group">
        <div className="relative aspect-[2.5/1] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          {imageSrc && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              )}
              <img 
                src={imageSrc}
                alt={imageAlt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoadStart={handleImageLoadStart}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${
                  isDark ? 'text-dMuted-text' : 'text-gray-400'
                }`} />
                <p className={`text-sm ${
                  isDark ? 'text-dMuted-text' : 'text-gray-500'
                }`}>
                  Failed to load image
                </p>
              </div>
            </div>
          )}
          
          {/* Hover overlay with controls */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-3">
              <button
                onClick={() => setShowImagePicker(true)}
                className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-800 font-medium hover:bg-white transition-colors flex items-center space-x-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Change cover image"
              >
                <Edit3 className="w-4 h-4" />
                <span>Change</span>
              </button>
              <button
                onClick={() => {
                  setCoverImage(null);
                  setImageError(false);
                }}
                className="px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-red-500 transition-colors flex items-center space-x-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Remove cover image"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Credit for Unsplash images */}
        {typeof coverImage === 'object' && coverImage?.credit && (
          <p className={`text-xs mt-3 ${isDark ? 'text-dMuted-text' : 'text-muted-text'}`}>
            Photo by{' '}
            <a 
              href={coverImage.credit.profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${isDark ? 'text-daccent hover:underline' : 'text-accent hover:underline'} transition-colors focus:outline-none focus:underline`}
            >
              {coverImage.credit.photographer}
            </a>
            {' '}on{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${isDark ? 'text-daccent hover:underline' : 'text-accent hover:underline'} transition-colors focus:outline-none focus:underline`}
            >
              Unsplash
            </a>
          </p>
        )}
      </div>
    );
  }

  // Add cover image button
  return (
    <div className="mb-8">
      <button
        onClick={() => setShowImagePicker(true)}
        className={`group flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 border-dashed focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDark 
            ? 'border-dMuted-text hover:border-daccent hover:bg-dcard/30 text-dMuted-text hover:text-dText focus:ring-daccent' 
            : 'border-gray-300 hover:border-accent hover:bg-gray-50 text-muted-text hover:text-text focus:ring-accent'
        }`}
        aria-label="Add cover image to blog post"
      >
        <ImageIcon className="w-5 h-5 mr-3 group-hover:scale-105 transition-transform" />
        <span>Add cover image</span>
      </button>
    </div>
  );
};

export default CoverImage;
