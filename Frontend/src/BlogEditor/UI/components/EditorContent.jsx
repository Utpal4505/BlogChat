import React from 'react';
import { EditorContent as TiptapEditorContent } from '@tiptap/react';
import { Type } from 'lucide-react';

const EditorContent = ({ editor, wordCount, charCount, isDark }) => {
  if (!editor) return null;

  return (
    <div className="relative">
      <TiptapEditorContent 
        editor={editor} 
        className="min-h-[60vh] p-8 focus:outline-none"
      />
      
      {/* Status Bar */}
      <div className={`flex items-center justify-between px-8 py-4 border-t text-xs ${
        isDark ? 'border-dbordercolor bg-dcard/30 text-dMuted-text' : 'border-bordercolor bg-gray-50/50 text-muted-text'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Type className="w-3 h-3" />
            <span className="font-medium">{wordCount}</span>
            <span>words</span>
          </div>
          <div>•</div>
          <div>
            <span className="font-medium">{charCount}</span>
            <span> characters</span>
          </div>
          <div>•</div>
          <div>
            <span className="font-medium">{Math.ceil(wordCount / 200)}</span>
            <span> min read</span>
          </div>
        </div>
        
        <div className="text-right">
          Keep writing your masterpiece...
        </div>
      </div>
    </div>
  );
};

export default EditorContent;
