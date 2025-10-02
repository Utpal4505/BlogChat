import React from 'react';
import { User, Calendar, Type } from 'lucide-react';
import CoverImage from './CoverImage';

const PreviewMode = ({ 
  title, 
  tags, 
  wordCount, 
  coverImage, 
  editorContent, 
  isDark 
}) => {
  return (
    <article className={`max-w-4xl mx-auto rounded-2xl shadow-xl overflow-hidden ${
      isDark ? 'bg-dcard border border-dbordercolor' : 'bg-white border border-bordercolor'
    }`}>
      <CoverImage 
        coverImage={coverImage}
        isPreview={true}
      />
      
      <div className="p-12">
        <header className="mb-12">
          <h1 className={`text-6xl font-bold mb-6 leading-tight font-merriweather ${
            isDark ? 'text-dText' : 'text-text'
          }`}>
            {title || 'Untitled Post'}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className={`flex items-center space-x-2 ${
              isDark ? 'text-dMuted-text' : 'text-muted-text'
            }`}>
              <User className="w-4 h-4" />
              <span>Your Name</span>
            </div>
            <div className={`flex items-center space-x-2 ${
              isDark ? 'text-dMuted-text' : 'text-muted-text'
            }`}>
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className={`flex items-center space-x-2 ${
              isDark ? 'text-dMuted-text' : 'text-muted-text'
            }`}>
              <Type className="w-4 h-4" />
              <span>{wordCount} words • {Math.ceil(wordCount / 200)} min read</span>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDark 
                      ? 'bg-daccent/20 text-daccent' 
                      : 'bg-accent/20 text-accent'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>
        
        <div className="blog-preview-content prose prose-xl max-w-none">
          <div dangerouslySetInnerHTML={{ __html: editorContent }} />
        </div>
      </div>
    </article>
  );
};

export default PreviewMode;
