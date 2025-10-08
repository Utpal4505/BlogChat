import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TitleInput = ({ title, setTitle }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = title.length;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const internalRef = useRef(null);
  const inputRef = ref || internalRef;

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5"
    >
      <motion.input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={inputRef}
        placeholder="Write your story title..."
        animate={{ scale: isFocused ? 1.01 : 1 }}
        transition={{ duration: 0.2 }}
        className={`w-full text-5xl font-bold bg-transparent border-none outline-none font-merriweather transition-all duration-300 text-text dark:text-dText placeholder-muted-text/50 dark:placeholder-dMuted-text/50 focus:text-accent dark:focus:text-daccent ${
          isFocused ? "transform" : ""
        }`}
        maxLength={200}
      />

      {/* Simple character counter */}
      {(isFocused || charCount > 150) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-right"
        >
          <span
            className={`text-sm ${
              charCount > 180
                ? "text-red-500"
                : "text-muted-text dark:text-dMuted-text"
            }`}
          >
            {charCount}/200
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TitleInput;
