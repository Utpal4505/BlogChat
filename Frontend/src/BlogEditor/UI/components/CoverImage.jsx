import React, { useState, useCallback } from 'react';
import { ImageIcon, Edit3, Trash2, Loader2, AlertCircle } from 'lucide-react';


const CoverImage = ({ 
  coverImage, 
  setCoverImage, 
  setShowImagePicker, 
  isPreview = false,
  isUploading = false,
  onError = null,
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
      <div className="aspect-[2.5/1] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
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
        <div className="relative aspect-[2.5/1] rounded-xl border-2 border-dashed flex items-center justify-center border-gray-300 dark:border-dMuted-text bg-gray-50 dark:bg-dcard/20">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent dark:text-daccent" />
            <p className="text-sm font-medium text-muted-text dark:text-dMuted-text">
              Uploading cover image...
            </p>
            <div className="w-32 h-1 rounded-full overflow-hidden bg-gray-200 dark:bg-dMuted-text/20">
              <div className="h-full rounded-full animate-pulse bg-accent dark:bg-daccent" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Display existing cover image - COMPACT LAYOUT
  if (coverImage) {
    const imageSrc = getImageSrc();
    const imageAlt = getImageAlt();


    return (
      <div className="mb-8">
        <div className="flex items-center gap-5">
          {/* Medium-sized thumbnail (not too small) */}
          <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-xl border overflow-hidden border-gray-200 dark:border-dbordercolor bg-gray-50 dark:bg-dcard">
            {imageSrc && !imageError ? (
              <>
                {imageLoading && (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
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
              <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-dMuted-text" />
                <p className="text-xs text-gray-500 dark:text-dMuted-text">
                  Failed to load
                </p>
              </div>
            )}
          </div>
          
          {/* Buttons side by side */}
          <div className="flex justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setShowImagePicker(true)}
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border bg-white dark:bg-dcard border-gray-300 dark:border-dbordercolor text-gray-700 dark:text-dText hover:bg-gray-50 dark:hover:bg-dcard/80"
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
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border border-red-200 bg-white dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20"
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
          <p className="text-xs mt-3 text-muted-text dark:text-dMuted-text">
            Photo by{' '}
            <a 
              href={coverImage.credit.profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent dark:text-daccent hover:underline transition-colors focus:outline-none focus:underline"
            >
              {coverImage.credit.photographer}
            </a>
            {' '}on{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent dark:text-daccent hover:underline transition-colors focus:outline-none focus:underline"
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
        className="group flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 border-dashed focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 dark:border-dMuted-text hover:border-accent dark:hover:border-daccent hover:bg-card/30 dark:hover:bg-dcard/30 text-muted-text dark:text-dMuted-text hover:text-text dark:hover:text-dText focus:ring-accent dark:focus:ring-daccent"
        aria-label="Add cover image to blog post"
      >
        <ImageIcon className="w-5 h-5 mr-3 group-hover:scale-105 transition-transform" />
        <span>Add cover image</span>
      </button>
    </div>
  );
};


export default CoverImage;
