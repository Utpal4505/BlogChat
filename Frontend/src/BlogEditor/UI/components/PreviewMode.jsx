import React, { useEffect, useRef } from 'react';
import { User, Calendar, Type } from 'lucide-react';
import CoverImage from './CoverImage';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';


const PreviewMode = ({ 
  title, 
  tags, 
  wordCount, 
  coverImage, 
  editorContent
}) => {
  const contentRef = useRef(null);


  // Apply syntax highlighting to code blocks
  useEffect(() => {
    if (contentRef.current) {
      // Find all code blocks and apply highlighting
      contentRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [editorContent]); // Re-run when content changes


  return (
    <article className="max-w-4xl mx-auto rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-dcard border border-bordercolor dark:border-dbordercolor">
      <CoverImage 
        coverImage={coverImage}
        isPreview={true}
      />
      
      <div className="p-12">
        <header className="mb-12">
          <h1 className="text-6xl font-bold mb-6 leading-tight font-merriweather text-text dark:text-dText">
            {title || 'Untitled Post'}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center space-x-2 text-muted-text dark:text-dMuted-text">
              <User className="w-4 h-4" />
              <span>Your Name</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-text dark:text-dMuted-text">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-text dark:text-dMuted-text">
              <Type className="w-4 h-4" />
              <span>{wordCount} words • {Math.ceil(wordCount / 200)} min read</span>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-accent/20 dark:bg-daccent/20 text-accent dark:text-daccent"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>
        
        {/* Content with ref for highlight.js */}
        <div 
          ref={contentRef}
          className="blog-preview-content prose prose-xl max-w-none"
        >
          <div dangerouslySetInnerHTML={{ __html: editorContent }} />
        </div>
      </div>
    </article>
  );
};


export default PreviewMode;
