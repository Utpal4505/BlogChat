import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Plus, X, Tag, ChevronDown } from 'lucide-react';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl mb-8 overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'bg-dcard/50 border border-dbordercolor/50 backdrop-blur-sm' 
          : 'bg-white/80 border border-bordercolor/50 backdrop-blur-sm'
      } ${isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}`}
    >
      {/* Collapsed Header */}
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between p-5 cursor-pointer transition-all duration-200 ${
          !isExpanded && 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            animate={{ rotate: isExpanded ? 0 : 0 }}
            className={`p-2.5 rounded-lg transition-colors ${
              isDark ? 'bg-daccent/15' : 'bg-accent/15'
            }`}
          >
            <Hash className={`w-4 h-4 ${isDark ? 'text-daccent' : 'text-accent'}`} />
          </motion.div>
          
          <div className="flex-1">
            <h3 className={`text-base font-semibold ${
              isDark ? 'text-dText' : 'text-text'
            }`}>
              Tags
            </h3>
            
            {!isExpanded && (
              <div className="flex items-center space-x-2 mt-1">
                {tags.length > 0 ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md ${
                            isDark 
                              ? 'bg-daccent/15 text-daccent' 
                              : 'bg-accent/15 text-accent'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {tags.length > 3 && (
                      <span className={`text-xs font-medium ${
                        isDark ? 'text-dMuted-text' : 'text-muted-text'
                      }`}>
                        +{tags.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className={`text-sm ${
                    isDark ? 'text-dMuted-text/70' : 'text-muted-text/70'
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
              scale: tags.length >= 8 ? 1.05 : 1,
            }}
            className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
              isDark 
                ? tags.length >= 8 
                  ? 'bg-red-500/15 text-red-400' 
                  : 'bg-daccent/15 text-daccent'
                : tags.length >= 8 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-accent/15 text-accent'
            }`}
          >
            {tags.length}/10
          </motion.div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ChevronDown className={`w-5 h-5 transition-colors ${
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
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`px-5 pb-5 pt-2 space-y-5 border-t ${
              isDark ? 'border-dbordercolor/30' : 'border-bordercolor/30'
            }`}>
              {/* Tags Display */}
              <AnimatePresence mode="popLayout">
                {tags.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <motion.span
                          key={tag}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.03, y: -2 }}
                          transition={{ duration: 0.2 }}
                          className={`group inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                            isDark 
                              ? 'bg-daccent/15 text-daccent border border-daccent/20 hover:bg-daccent/20 hover:border-daccent/30' 
                              : 'bg-accent/15 text-accent border border-accent/20 hover:bg-accent/20 hover:border-accent/30'
                          }`}
                        >
                          <Tag className="w-3.5 h-3.5 mr-2 opacity-70" />
                          {tag}
                          <motion.button
                            whileHover={{ scale: 1.15, rotate: 90 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTag(tag);
                            }}
                            className={`ml-2.5 p-1 rounded-full transition-colors ${
                              isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-500'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
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
                className="flex gap-2.5"
              >
                <motion.div 
                  className="flex-1 relative"
                  animate={{ 
                    scale: inputFocused ? 1.005 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyPress}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder={tags.length >= 10 ? "Maximum tags reached" : "Add tags (press Enter or comma)..."}
                    disabled={tags.length >= 10}
                    maxLength={30}
                    className={`w-full px-4 py-3 pl-11 rounded-lg border transition-all duration-200 font-medium text-sm ${
                      isDark 
                        ? 'bg-dbg/60 border-dbordercolor text-dText placeholder-dMuted-text/70 focus:border-daccent focus:bg-dbg/80' 
                        : 'bg-white/80 border-bordercolor text-text placeholder-muted-text/70 focus:border-accent focus:bg-white'
                    } ${tags.length >= 10 ? 'opacity-50 cursor-not-allowed' : 'focus:shadow-md focus:ring-2 focus:ring-offset-0'} ${
                      isDark ? 'focus:ring-daccent/20' : 'focus:ring-accent/20'
                    }`}
                  />
                  <Hash className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    inputFocused 
                      ? isDark ? 'text-daccent' : 'text-accent'
                      : isDark ? 'text-dMuted-text/70' : 'text-muted-text/70'
                  }`} />
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: tags.length >= 10 || !tagInput.trim() ? 1 : 1.05 }}
                  whileTap={{ scale: tags.length >= 10 || !tagInput.trim() ? 1 : 0.95 }}
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 10}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    !tagInput.trim() || tags.length >= 10
                      ? 'opacity-40 cursor-not-allowed'
                      : isDark
                        ? 'bg-daccent/15 border-daccent/30 text-daccent hover:bg-daccent/25 hover:border-daccent/50'
                        : 'bg-accent/15 border-accent/30 text-accent hover:bg-accent/25 hover:border-accent/50'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Info Text */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`flex items-center justify-between text-xs ${
                  isDark ? 'text-dMuted-text/80' : 'text-muted-text/80'
                }`}
              >
                <p>
                  Press <kbd className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    isDark ? 'bg-dbg border border-dbordercolor' : 'bg-gray-100 border border-gray-300'
                  }`}>Enter</kbd> or <kbd className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    isDark ? 'bg-dbg border border-dbordercolor' : 'bg-gray-100 border border-gray-300'
                  }`}>,</kbd> to add
                </p>
                {tags.length < 10 && (
                  <p className="font-medium">
                    {10 - tags.length} remaining
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default TagsSection;
