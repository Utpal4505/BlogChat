import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Loader2,
  Maximize2,
  Minimize2,
  Eye,
  ArrowLeft,
  AlertCircle,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components
import Navbar from "../src/BlogEditor/UI/components/Navbar";
import CoverImage from "../src/BlogEditor/UI/components/CoverImage";
import TitleInput from "../src/BlogEditor/UI/components/TitleInput";
import TagsSection from "../src/BlogEditor/UI/components/TagsSection";
import Toolbar from "../src/BlogEditor/UI/components/Toolbar";
import EditorContent from "../src/BlogEditor/UI/components/EditorContent";
import PreviewMode from "../src/BlogEditor/UI/components/PreviewMode";
import ImagePickerModal from "../src/BlogEditor/UI/components/ImagePickerModal";

import { useEditor } from "../src/BlogEditor/hooks/UseEditor";
import ToastContainer from "../src/BlogEditor/UI/components/Toast";
import { AuthContext } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { createPost, user } = useContext(AuthContext);

  const [toasts, setToasts] = useState([]);

  const titleRef = useRef(null);
  const editorRef = useRef(null);

  const { editor, wordCount, charCount, lastSaved, isSaving, setLink } =
    useEditor();

  const navigate = useNavigate();

  const addToast = (message, type = "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const validateForm = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      addToast("Title is required", "error");
      return false;
    }
    if (trimmedTitle.length < 10) {
      addToast("Title must be at least 10 characters", "error");
      return false;
    }
    if (trimmedTitle.length > 150) {
      addToast("Title cannot exceed 150 characters", "error");
      return false;
    }

    const contentText = editor?.getText().trim() || "";
    if (!contentText) {
      addToast("Content is required", "error");
      return false;
    }
    if (contentText.length < 20) {
      addToast(
        `Content must be at least 20 characters (currently ${contentText.length})`,
        "error"
      );
      return false;
    }

    return true;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    const content = editor.getHTML();

    try {
      await createPost({ title, content, tags, coverImage });
      navigate("/home");
      addToast("Blog published successfully!", "success");
      
    } catch (err) {
      addToast(err.message || "Something went wrong", "error");

      if (err.errors && err.errors.length) {
        err.errors.forEach((e) => {
          addToast(e.error, "error");

          switch (e.field) {
            case "title":
              titleRef.current?.focus();
              titleRef.current?.select();
              break;
            case "content":
              editor.commands.focus();
              break;
            case "coverImage":
              setShowImagePicker(true);
              break;
            default:
              break;
          }
        });
      }
    }
  };

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

      // ESC to exit preview or focus mode
      if (e.key === "Escape") {
        if (isPreview) {
          setIsPreview(false);
        } else if (isFocusMode) {
          setIsFocusMode(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode, isPreview]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg dark:bg-dbg">
        <Loader2 className="w-8 h-8 animate-spin text-accent dark:text-daccent" />
      </div>
    );
  }

  if (!user) {
    return <LoadingScreen text="Loading Editor..." />;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-bg dark:bg-dbg text-text dark:text-dText">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {!isFocusMode && (
        <Navbar
          isPreview={isPreview}
          setIsPreview={setIsPreview}
          isSaving={isSaving}
          lastSaved={lastSaved}
          wordCount={wordCount}
          onPublish={handlePublish}
        />
      )}

      {!isPreview && (
        <div className="fixed top-6 right-6 z-[998] flex items-center gap-3">
          {isFocusMode && (
            <button
              onClick={() => setIsPreview(true)}
              className="p-3 rounded-full flex transition-all duration-300 group bg-white/80 dark:bg-dcard/80 hover:bg-white dark:hover:bg-dcard border-bordercolor dark:border-dbordercolor text-text dark:text-dText border backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105"
              title="Preview"
            >
              <Eye className="w-5 h-5" />
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-white dark:bg-dcard text-text dark:text-dText border-bordercolor dark:border-dbordercolor border shadow-lg">
                Preview
              </span>
            </button>
          )}

          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="p-3 rounded-full transition-all duration-300 group bg-white/80 dark:bg-dcard/80 hover:bg-white dark:hover:bg-dcard border-bordercolor dark:border-dbordercolor text-text dark:text-dText border backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105"
            title={
              isFocusMode ? "Exit Focus Mode (ESC)" : "Enter Focus Mode (F11)"
            }
          >
            {isFocusMode ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-white dark:bg-dcard text-text dark:text-dText border-bordercolor dark:border-dbordercolor border shadow-lg">
              {isFocusMode ? "Exit Focus (ESC)" : "Focus Mode (F11)"}
            </span>
          </button>
        </div>
      )}

      <main
        className={`transition-all duration-500 ${
          isFocusMode ? "w-full px-32 py-16" : "max-w-6xl mx-auto px-6 py-8"
        }`}
      >
        {/* Back Button - Preview + Focus Mode */}
        {isPreview && isFocusMode && (
          <button
            onClick={() => setIsPreview(false)}
            className="fixed top-6 left-6 z-[998] p-3 rounded-full transition-all duration-300 group bg-white/80 dark:bg-dcard/80 hover:bg-white dark:hover:bg-dcard border-bordercolor dark:border-dbordercolor text-text dark:text-dText border backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105"
            title="Back to Editor (ESC)"
          >
            <EyeOff className="w-5 h-5" />
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-white dark:bg-dcard text-text dark:text-dText border-bordercolor dark:border-dbordercolor border shadow-lg">
              Back to Editor
            </span>
          </button>
        )}

        {isPreview ? (
          <PreviewMode
            title={title}
            tags={tags}
            wordCount={wordCount}
            coverImage={coverImage}
            editorContent={editor.getHTML()}
            author={user}
          />
        ) : (
          <>
            {/* Focus Mode - Minimal Title */}
            {isFocusMode ? (
              <div className="mb-10">
                <TitleInput title={title} setTitle={setTitle} />
              </div>
            ) : (
              <>
                {/* Normal Mode - Full UI */}
                <CoverImage
                  coverImage={coverImage}
                  setCoverImage={setCoverImage}
                  setShowImagePicker={setShowImagePicker}
                />

                <div>
                  <TitleInput
                    ref={titleRef}
                    title={title}
                    setTitle={setTitle}
                  />
                  {/* Title Error */}
                </div>

                {/* <TagsSection
                  tags={tags}
                  setTags={setTags}
                  tagInput={tagInput}
                  setTagInput={setTagInput}
                /> */}
              </>
            )}

            {/* Editor Container */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                isFocusMode
                  ? "w-full rounded-xl bg-white/70 dark:bg-dcard/70 border border-accent/20 dark:border-daccent/20"
                  : "rounded-2xl shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white dark:bg-dcard border border-bordercolor dark:border-dbordercolor"
              }`}
            >
              <Toolbar editor={editor} setLink={setLink} />

              <EditorContent
                editor={editor}
                wordCount={wordCount}
                charCount={charCount}
                isFocusMode={isFocusMode}
                ref={editorRef}
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
      />

      {/* Focus Mode Background Overlay */}
      {isFocusMode && (
        <div className="fixed inset-0 bg-black/10 dark:bg-black/30 -z-10 backdrop-blur-sm transition-all duration-500" />
      )}
    </div>
  );
};

export default BlogEditor;
