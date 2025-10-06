import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ReactNodeViewRenderer,
  useEditor as useTiptapEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { common, createLowlight } from "lowlight";
import CodeBlockWithLanguage from "../UI/components/CodeBlockWithLanguage";

import "highlight.js/styles/github-dark.css";
const lowlight = createLowlight(common);

export const useEditor = (initialContent = "") => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Memoize extensions to prevent unnecessary re-renders
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false, // Disable default code block
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "text-highlight",
        },
      }),
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-link hover:text-link-hover transition-colors",
          rel: "noopener noreferrer",
          target: "_blank",
        },
        validate: (href) => /^https?:\/\//.test(href),
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockWithLanguage);
        },
      }).configure({
        lowlight,
        defaultLanguage: "javascript",
        HTMLAttributes: {
          class: "code-block",
        },
      }),
      CharacterCount.configure({
        limit: 50000,
      }),
      Placeholder.configure({
        placeholder: "Start crafting your masterpiece...",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "is-empty",
      }),
    ],
    []
  );

  const editor = useTiptapEditor({
    extensions,
    content: initialContent || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "enhanced-blog-editor focus:outline-none prose prose-lg max-w-none",
        spellcheck: "true",
      },

      // FIX BUG 1: Arrow Key Escape from Code Blocks
      handleKeyDown: (view, event) => {
        const { state } = view;
        const { selection } = state;
        const { $from, $to } = selection;

        // Check if we're in a code block
        const isInCodeBlock = $from.parent.type.name === "codeBlock";

        // UP ARROW - Escape from top of code block
        if (event.key === "ArrowUp" && isInCodeBlock) {
          // Check if cursor is at the first line of code block
          const isAtStart = $from.parentOffset === 0;

          if (isAtStart) {
            const beforePos = $from.before($from.depth);

            // If code block is at the very start of document
            if (beforePos <= 1) {
              event.preventDefault();
              // Insert empty paragraph above
              view.dispatch(
                state.tr.insert(0, state.schema.nodes.paragraph.create())
              );
              // Move cursor to that paragraph
              view.dispatch(
                state.tr.setSelection(
                  state.selection.constructor.near(state.doc.resolve(1))
                )
              );
              return true;
            }

            // Move cursor to previous block
            event.preventDefault();
            const newPos = state.doc.resolve(beforePos - 1);
            view.dispatch(
              state.tr.setSelection(
                state.selection.constructor.near(newPos, -1)
              )
            );
            return true;
          }
        }

        // DOWN ARROW - Escape from bottom of code block
        if (event.key === "ArrowDown" && isInCodeBlock) {
          // Check if cursor is at the last line of code block
          const isAtEnd = $from.parentOffset === $from.parent.content.size;

          if (isAtEnd) {
            const afterPos = $from.after($from.depth);

            // If code block is at the very end of document
            if (afterPos >= state.doc.content.size - 1) {
              event.preventDefault();
              // Insert empty paragraph below
              view.dispatch(
                state.tr.insert(afterPos, state.schema.nodes.paragraph.create())
              );
              // Move cursor to that paragraph
              const newDocSize = state.doc.content.size;
              view.dispatch(
                state.tr.setSelection(
                  state.selection.constructor.near(
                    state.doc.resolve(Math.min(afterPos + 1, newDocSize))
                  )
                )
              );
              return true;
            }

            // Move cursor to next block
            event.preventDefault();
            const newPos = state.doc.resolve(afterPos + 1);
            view.dispatch(
              state.tr.setSelection(state.selection.constructor.near(newPos, 1))
            );
            return true;
          }
        }

        // Allow Ctrl/Cmd shortcuts
        if (event.ctrlKey || event.metaKey) {
          return false;
        }

        return false;
      },
    },

    onUpdate: useCallback(
      ({ editor }) => {
        const stats = editor.storage.characterCount;
        const words = stats?.words() || 0;
        const chars = stats?.characters() || 0;

        // Update word/char counts
        setWordCount((prev) => (prev !== words ? words : prev));
        setCharCount((prev) => (prev !== chars ? chars : prev));

        // Clear save error
        if (saveError) {
          setSaveError(null);
        }

        // FIX BUG 2: Auto-scroll to cursor
        // Scroll cursor into view with smooth animation
        requestAnimationFrame(() => {
          const { selection } = editor.state;
          const coords = editor.view.coordsAtPos(selection.from);

          if (coords) {
            const editorElement = editor.view.dom;
            const editorRect = editorElement.getBoundingClientRect();

            // Check if cursor is below viewport
            if (coords.top > window.innerHeight - 100) {
              window.scrollTo({
                top: window.scrollY + (coords.top - window.innerHeight + 150),
                behavior: "smooth",
              });
            }
            // Check if cursor is above viewport
            else if (coords.top < 100) {
              window.scrollTo({
                top: window.scrollY + (coords.top - 150),
                behavior: "smooth",
              });
            }
          }
        });
      },
      [saveError]
    ),

    onCreate: useCallback(() => {
      setIsReady(true);
    }, []),

    onDestroy: useCallback(() => {
      setIsReady(false);
    }, []),
  });

  // Auto-save logic (unchanged)
  useEffect(() => {
    if (!editor || !isReady) return;

    let saveTimeout;
    let autoSaveInterval;

    const performSave = async () => {
      const content = editor.getText().trim();
      const htmlContent = editor.getHTML();

      if (!content || content === "" || isSaving) return;

      setIsSaving(true);
      setSaveError(null);

      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.95) {
              reject(new Error("Save failed"));
            } else {
              resolve();
            }
          }, Math.random() * 800 + 200);
        });

        setLastSaved(new Date());

        localStorage.setItem(
          "blog-draft",
          JSON.stringify({
            content: htmlContent,
            savedAt: new Date().toISOString(),
            wordCount: wordCount,
          })
        );
      } catch (error) {
        setSaveError(error.message);
        console.error("Auto-save failed:", error);
      } finally {
        setIsSaving(false);
      }
    };

    const debouncedSave = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(performSave, 2000);
    };

    autoSaveInterval = setInterval(performSave, 30000);
    editor.on("update", debouncedSave);

    return () => {
      clearTimeout(saveTimeout);
      clearInterval(autoSaveInterval);
      editor.off("update", debouncedSave);
    };
  }, [editor, isReady, isSaving, wordCount]);

  // Enhanced link setter (unchanged)
  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const urlPattern =
      /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

    if (!urlPattern.test(url)) {
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: fullUrl })
      .run();
  }, [editor]);

  const saveNow = useCallback(async () => {
    if (!editor || isSaving) return false;

    setIsSaving(true);
    setSaveError(null);

    try {
      const content = editor.getHTML();
      await new Promise((resolve) => setTimeout(resolve, 500));

      setLastSaved(new Date());
      return true;
    } catch (error) {
      setSaveError(error.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [editor, isSaving]);

  const loadDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem("blog-draft");
      if (draft && editor) {
        const { content } = JSON.parse(draft);
        editor.commands.setContent(content);
        return true;
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
    return false;
  }, [editor]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem("blog-draft");
    if (editor) {
      editor.commands.clearContent();
    }
  }, [editor]);

  const readingTime = useMemo(() => {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
  }, [wordCount]);

  return {
    editor,
    wordCount,
    charCount,
    readingTime,
    lastSaved,
    isSaving,
    saveError,
    isReady,
    setLink,
    saveNow,
    loadDraft,
    clearDraft,
  };
};
