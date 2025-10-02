import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Components
import Navbar from '../src/BlogEditor/UI/components/Navbar';
import CoverImage from '../src/BlogEditor/UI/components/CoverImage';
import TitleInput from '../src/BlogEditor/UI/components/TitleInput';
import TagsSection from '../src/BlogEditor/UI/components/TagsSection';
import Toolbar from '../src/BlogEditor/UI/components/Toolbar';
import EditorContent from '../src/BlogEditor/UI/components/EditorContent';
import PreviewMode from '../src/BlogEditor/UI/components/PreviewMode';
import ImagePickerModal from '../src/BlogEditor/UI/components/ImagePickerModal';

// Custom Hook
import { useEditor } from '../src/BlogEditor/hooks/UseEditor';

const BlogEditor = () => {
  // State management
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Custom hook for editor logic
  const {
    editor,
    wordCount,
    charCount,
    lastSaved,
    isSaving,
    setLink
  } = useEditor();

  // Loading state
  if (!editor) {
    return (
      <div className={`flex items-center justify-center h-screen ${
        isDark ? 'bg-dbg' : 'bg-bg'
      }`}>
        <Loader2 className={`w-8 h-8 animate-spin ${
          isDark ? 'text-daccent' : 'text-accent'
        }`} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-dbg text-dText' : 'bg-bg text-text'
    }`}>
      {/* Navigation */}
      <Navbar 
        isDark={isDark}
        setIsDark={setIsDark}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        isSaving={isSaving}
        lastSaved={lastSaved}
        wordCount={wordCount}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
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
            {/* Cover Image */}
            <CoverImage 
              coverImage={coverImage}
              setCoverImage={setCoverImage}
              setShowImagePicker={setShowImagePicker}
              isDark={isDark}
            />

            {/* Title Input */}
            <TitleInput 
              title={title}
              setTitle={setTitle}
              isDark={isDark}
            />

            {/* Tags Section */}
            <TagsSection 
              tags={tags}
              setTags={setTags}
              tagInput={tagInput}
              setTagInput={setTagInput}
              isDark={isDark}
            />

            {/* Editor Container */}
            <div className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl ${
              isDark ? 'bg-dcard border border-dbordercolor' : 'bg-white border border-bordercolor'
            }`}>
              {/* Toolbar */}
              <Toolbar 
                editor={editor}
                setLink={setLink}
                isDark={isDark}
              />

              {/* Editor Content */}
              <EditorContent 
                editor={editor}
                wordCount={wordCount}
                charCount={charCount}
                isDark={isDark}
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
    </div>
  );
};

export default BlogEditor;
