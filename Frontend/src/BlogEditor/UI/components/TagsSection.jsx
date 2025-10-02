import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Plus, X, Tag, Sparkles, ChevronDown } from 'lucide-react';

const TagsSection = ({ 
  tags, 
  setTags, 
  tagInput, 
  setTagInput, 
  isDark 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const sectionRef = useRef(null);

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl mb-8 overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-dcard/40 to-dcard/20 border border-dbordercolor/30 backdrop-blur-sm' 
          : 'bg-gradient-to-br from-white/80 to-gray-50/80 border border-bordercolor/30 backdrop-blur-sm'
      }`}
    >
      {/* Collapsed Header - Always Visible */}
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between p-6 cursor-pointer transition-all duration-200 ${
          isExpanded ? 'pb-4' : 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`p-2 rounded-lg ${
              isDark ? 'bg-daccent/20' : 'bg-accent/20'
            }`}
          >
            <Hash className={`w-5 h-5 ${isDark ? 'text-daccent' : 'text-accent'}`} />
          </motion.div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-dText' : 'text-text'
            }`}>
              Tags
            </h3>
            {!isExpanded && (
              <div className="flex items-center space-x-2 mt-1">
                {tags.length > 0 ? (
                  <div className="flex items-center space-x-1">
                    <div className="flex -space-x-1">
                      {tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={tag}
                          className={`inline-block px-2 py-1 text-xs rounded-md border ${
                            isDark 
                              ? 'bg-daccent/15 text-daccent border-daccent/30' 
                              : 'bg-accent/15 text-accent border-accent/30'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {tags.length > 3 && (
                      <span className={`text-xs ${
                        isDark ? 'text-dMuted-text' : 'text-muted-text'
                      }`}>
                        +{tags.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className={`text-sm ${
                    isDark ? 'text-dMuted-text' : 'text-muted-text'
                  }`}>
                    Click to add tags
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.div 
            animate={{ 
              scale: tags.length >= 8 ? 1.1 : 1,
              color: tags.length >= 10 ? '#ef4444' : undefined
            }}
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              isDark 
                ? tags.length >= 8 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-daccent/20 text-daccent'
                : tags.length >= 8 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-accent/20 text-accent'
            }`}
          >
            {tags.length}/10
          </motion.div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className={`w-5 h-5 ${
              isDark ? 'text-dMuted-text' : 'text-muted-text'
            }`} />
          </motion.div>
        </div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">
              {/* Tags Display */}
              <AnimatePresence>
                {tags.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          className={`group inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isDark 
                              ? 'bg-daccent/15 text-daccent border border-daccent/30 hover:bg-daccent/25' 
                              : 'bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25'
                          }`}
                        >
                          <Tag className="w-3 h-3 mr-2" />
                          {tag}
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTag(tag);
                            }}
                            className={`ml-3 p-1 rounded-full transition-colors ${
                              isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-500'
                            }`}
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-3"
              >
                <motion.div 
                  className="flex-1 relative"
                  animate={{ scale: inputFocused ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyPress}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Add tags (press Enter or comma)..."
                    disabled={tags.length >= 10}
                    className={`w-full px-4 py-3.5 pl-12 rounded-xl border-2 transition-all duration-300 ${
                      isDark 
                        ? 'bg-dbg/60 border-dbordercolor text-dText placeholder-dMuted-text focus:border-daccent focus:bg-dbg/80' 
                        : 'bg-white/80 border-bordercolor text-text placeholder-muted-text focus:border-accent focus:bg-white'
                    } ${tags.length >= 10 ? 'opacity-50 cursor-not-allowed' : 'focus:shadow-lg'}`}
                  />
                  <Hash className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-dMuted-text' : 'text-muted-text'
                  }`} />
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 10}
                  className={`p-3.5 rounded-xl border-2 transition-all duration-200 ${
                    !tagInput.trim() || tags.length >= 10
                      ? 'opacity-50 cursor-not-allowed'
                      : isDark
                        ? 'bg-daccent/10 border-daccent/30 text-daccent hover:bg-daccent/20 hover:border-daccent/50'
                        : 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 hover:border-accent/50'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Info Text */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-xs ${
                  isDark ? 'text-dMuted-text' : 'text-muted-text'
                }`}
              >
                <p>
                  Use commas or Enter to separate tags • Max 10 tags
                  {tags.length < 10 && ` • ${10 - tags.length} remaining`}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default TagsSection;
