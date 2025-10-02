import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TitleInput = ({ title, setTitle, isDark }) => {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = title.length;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <motion.input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Write your story title..."
        animate={{ scale: isFocused ? 1.01 : 1 }}
        transition={{ duration: 0.2 }}
        className={`w-full text-5xl font-bold bg-transparent border-none outline-none font-merriweather transition-all duration-300 ${
          isDark 
            ? 'text-dText placeholder-dMuted-text/50 focus:text-daccent' 
            : 'text-text placeholder-muted-text/50 focus:text-accent'
        } ${isFocused ? 'transform' : ''}`}
        maxLength={200}
      />
      
      {/* Simple character counter */}
      {(isFocused || charCount > 150) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-right"
        >
          <span className={`text-sm ${
            charCount > 180 
              ? 'text-red-500' 
              : isDark ? 'text-dMuted-text' : 'text-muted-text'
          }`}>
            {charCount}/200
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TitleInput;
