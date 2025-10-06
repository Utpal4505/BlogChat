import React, { useState, useEffect } from "react";
import { Loader2, Maximize2, Minimize2 } from "lucide-react";

// Components
import Navbar from "../src/BlogEditor/UI/components/Navbar";
import CoverImage from "../src/BlogEditor/UI/components/CoverImage";
import TitleInput from "../src/BlogEditor/UI/components/TitleInput";
import TagsSection from "../src/BlogEditor/UI/components/TagsSection";
import Toolbar from "../src/BlogEditor/UI/components/Toolbar";
import EditorContent from "../src/BlogEditor/UI/components/EditorContent";
import PreviewMode from "../src/BlogEditor/UI/components/PreviewMode";
import ImagePickerModal from "../src/BlogEditor/UI/components/ImagePickerModal";

// Custom Hook
import { useEditor } from "../src/BlogEditor/hooks/UseEditor";

const BlogEditor = () => {
  // State management
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Custom hook for editor logic
  const { editor, wordCount, charCount, lastSaved, isSaving, setLink } =
    useEditor();

  // Keyboard shortcuts for Focus Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F11 or Cmd/Ctrl + Shift + F to toggle focus mode
      if (
        e.key === "F11" ||
        (e.shiftKey && (e.ctrlKey || e.metaKey) && e.key === "f")
      ) {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
      }

      // ESC to exit focus mode
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode]);

  // Loading state
  if (!editor) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          isDark ? "bg-dbg" : "bg-bg"
        }`}
      >
        <Loader2
          className={`w-8 h-8 animate-spin ${
            isDark ? "text-daccent" : "text-accent"
          }`}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-dbg text-dText" : "bg-bg text-text"
      }`}
    >
      {/* Navigation - Hide in Focus Mode */}
      {!isFocusMode && (
        <Navbar
          isDark={isDark}
          setIsDark={setIsDark}
          isPreview={isPreview}
          setIsPreview={setIsPreview}
          isSaving={isSaving}
          lastSaved={lastSaved}
          wordCount={wordCount}
        />
      )}

      {/* Focus Mode Toggle Button */}
      {!isPreview && (
        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`fixed top-6 right-6 z-[998] p-3 rounded-full transition-all duration-300 group ${
            isDark
              ? "bg-dcard/80 hover:bg-dcard border-dbordercolor text-dText"
              : "bg-white/80 hover:bg-white border-bordercolor text-text"
          } border backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105`}
          title={
            isFocusMode ? "Exit Focus Mode (ESC)" : "Enter Focus Mode (F11)"
          }
        >
          {isFocusMode ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
          <span
            className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
              isDark
                ? "bg-dcard text-dText border-dbordercolor"
                : "bg-white text-text border-bordercolor"
            } border shadow-lg`}
          >
            {isFocusMode ? "Exit Focus (ESC)" : "Focus Mode (F11)"}
          </span>
        </button>
      )}

      {/* Main Content */}
      {/* Main Content */}
      <main
        className={`transition-all duration-500 ${
          isFocusMode
            ? "w-full px-32 py-16"
            : "max-w-6xl mx-auto px-6 py-8"
        }`}
      >
        {isPreview ? (
          <PreviewMode
            title={title}
            tags={tags}
            wordCount={wordCount}
            coverImage={coverImage}
            editorContent={editor.getHTML()}
            isDark={isDark}
          />
        ) : (
          <>
            {/* Focus Mode - Minimal Title */}
            {isFocusMode ? (
              <div className="mb-10">
                <TitleInput 
                title={title}
                setTitle={setTitle}
                isDark={isDark}
                />
              </div>
            ) : (
              <>
                {/* Normal Mode - Full UI */}
                <CoverImage
                  coverImage={coverImage}
                  setCoverImage={setCoverImage}
                  setShowImagePicker={setShowImagePicker}
                  isDark={isDark}
                />

                <TitleInput title={title} setTitle={setTitle} isDark={isDark} />

                <TagsSection
                  tags={tags}
                  setTags={setTags}
                  tagInput={tagInput}
                  setTagInput={setTagInput}
                  isDark={isDark}
                />
              </>
            )}

            {/* Editor Container */}
            {/* Editor Container */}
            {/* Editor Container */}
            {/* Editor Container */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                isFocusMode
                  ? `w-full rounded-xl ${
                      isDark
                        ? "bg-dcard/70 border border-daccent/20"
                        : "bg-white/70 border border-accent/20"
                    }`
                  : `rounded-2xl shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${
                      isDark
                        ? "bg-dcard border border-dbordercolor"
                        : "bg-white border border-bordercolor"
                    }`
              }`}
            >
              <Toolbar editor={editor} setLink={setLink} isDark={isDark} />

              <EditorContent
                editor={editor}
                wordCount={wordCount}
                charCount={charCount}
                isDark={isDark}
                isFocusMode={isFocusMode}
              />
            </div>
          </>
        )}
      </main>

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelectImage={(image) => setCoverImage(image)}
        isDark={isDark}
      />

      {/* Focus Mode Background Overlay (subtle) */}
      {/* Focus Mode - Dimmed Overlay */}
      {isFocusMode && (
        <div className="fixed inset-0 bg-black/10 dark:bg-black/30 -z-10 backdrop-blur-sm transition-all duration-500" />
      )}
    </div>
  );
};

export default BlogEditor;
