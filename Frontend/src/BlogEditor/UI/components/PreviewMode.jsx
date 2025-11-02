import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CoverImage from "./CoverImage";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const PreviewMode = ({
  title,
  tags,
  wordCount,
  coverImage,
  editorContent,
  author,
}) => {
  const contentRef = useRef(null);
  const readingTime = Math.ceil(wordCount / 200);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [editorContent]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.article
      className="max-w-4xl mx-auto rounded-2xl shadow-xl overflow-hidden bg-card dark:bg-dcard border border-bordercolor dark:border-dbordercolor"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <CoverImage coverImage={coverImage} isPreview={true} />

      <div className="p-8 sm:p-12">
        <motion.header className="mb-12" variants={itemVariants}>
          {/* Title */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-merriweather text-text dark:text-dText"
            variants={itemVariants}
          >
            {title || "Untitled Post"}
          </motion.h1>

          {/* Simple Author Row */}
          <motion.div
            className="flex items-center justify-between mb-6"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3">
              <motion.img
                src={
                  author?.avatar ||
                  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                }
                alt={author?.name || "Author"}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-bordercolor dark:ring-dbordercolor"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-text dark:text-dText">
                  {author?.name || "Your Name"}
                </span>
                <span className="text-muted-text dark:text-dMuted-text">•</span>
                <span className="text-muted-text dark:text-dMuted-text">
                  {readingTime} min read
                </span>
                <span className="text-muted-text dark:text-dMuted-text">•</span>
                <span className="text-muted-text dark:text-dMuted-text">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          {tags.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mb-8"
              variants={itemVariants}
            >
              {tags.map((tag, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/10 dark:bg-daccent/10 text-accent dark:text-daccent border border-accent/20 dark:border-daccent/20 hover:bg-accent/20 dark:hover:bg-daccent/20 transition-colors duration-200 cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.header>

        {/* Content */}
        <motion.div
          ref={contentRef}
          className="blog-preview-content prose prose-xl max-w-none"
          variants={itemVariants}
        >
          <div dangerouslySetInnerHTML={{ __html: editorContent }} />
        </motion.div>
      </div>
    </motion.article>
  );
};

export default PreviewMode;
