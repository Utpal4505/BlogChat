import { useState, useEffect } from 'react';
import { useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import {TextStyle} from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CharacterCount from '@tiptap/extension-character-count';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

export const useEditor = () => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useTiptapEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-link',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      CharacterCount,
    ],
    content: '<p>Start crafting your masterpiece...</p>',
    editorProps: {
      attributes: {
        class: 'enhanced-blog-editor focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const words = editor.storage.characterCount?.words() || 0;
      const chars = editor.storage.characterCount?.characters() || 0;
      setWordCount(words);
      setCharCount(chars);
    },
  });

  // Auto-save logic
  useEffect(() => {
    const autoSave = setInterval(async () => {
      if (editor && editor.getText().trim() !== 'Start crafting your masterpiece...' && !isSaving) {
        setIsSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLastSaved(new Date());
        setIsSaving(false);
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [editor, isSaving]);

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl || '');
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (urlPattern.test(url)) {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        editor.chain().focus().extendMarkRange('link').setLink({ href: fullUrl }).run();
      } else {
        alert('Please enter a valid URL');
      }
    }
  };

  return {
    editor,
    wordCount,
    charCount,
    lastSaved,
    isSaving,
    setLink
  };
};
