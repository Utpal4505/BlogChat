import React, { forwardRef } from "react";
import { EditorContent as TiptapEditorContent } from "@tiptap/react";
import { Type } from "lucide-react";

const EditorContent = forwardRef(
  ({ editor, wordCount, charCount, isFocusMode = false }, ref) => {
    if (!editor) return null;

    return (
      <div className="relative">
        <TiptapEditorContent
          editor={editor}
          ref={ref}
          className={`focus:outline-none transition-all duration-300 ${
            isFocusMode ? "min-h-[85vh] p-6 text-base" : "min-h-[60vh] p-8"
          }`}
        />

        {/* Status Bar - Hide in Focus Mode */}
        {!isFocusMode && (
          <div
            className={`flex items-center justify-between px-8 py-4 border-t text-xs border-bordercolor bg-card text-muted-text dark:border-dbordercolor dark:bg-dcard dark:text-dMuted-text transition-colors`}
          >
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
                <span className="font-medium">
                  {Math.ceil(wordCount / 200)}
                </span>
                <span> min read</span>
              </div>
            </div>

            <div className="text-right">Keep writing your masterpiece...</div>
          </div>
        )}
      </div>
    );
  }
);

export default EditorContent;
