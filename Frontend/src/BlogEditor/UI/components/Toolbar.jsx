import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Link as LinkIcon,
  Palette,
  Type,
  CodeSquare,
  Paintbrush,
  RotateCcw,
  ChevronUp,
  Sparkles,
} from "lucide-react";

// Professional and Soft Text Colors
const COLOR_PALETTE = [
  "#1f2937",
  "#374151",
  "#6b7280",
  "#9ca3af",
  "#1e40af",
  "#3b82f6",
  "#60a5fa",
  "#0891b2",
  "#dc2626",
  "#ef4444",
  "#f87171",
  "#7c3aed",
  "#a855f7",
  "#c084fc",
  "#059669",
  "#10b981",
  "#34d399",
  "#92400e",
  "#d97706",
  "#f59e0b",
  "#000000",
  "#111827",
];

// Soft Highlight Colors
const HIGHLIGHT_COLORS = [
  "#fef3c7",
  "#fde68a",
  "#fed7aa",
  "#d1fae5",
  "#a7f3d0",
  "#6ee7b7",
  "#dbeafe",
  "#bfdbfe",
  "#93c5fd",
  "#fce7f3",
  "#f9a8d4",
  "#fb7185",
  "#f3e8ff",
  "#ddd6fe",
  "#c4b5fd",
  "#fed7cc",
  "#fdba74",
  "#fbbf24",
  "#f1f5f9",
  "#e2e8f0",
  "#cbd5e1",
  "#ccfbf1",
  "#99f6e4",
  "#5eead4",
];

const ToolbarButton = React.memo(
  ({
    onClick,
    isActive = false,
    children,
    title,
    disabled = false,
    isDark,
    shortcut,
    colorIndicator = null,
    compact = false,
  }) => {
    const handleClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled && onClick) {
          onClick();
        }
      },
      [onClick, disabled]
    );

    return (
      <button
        onClick={handleClick}
        onMouseDown={(e) => e.preventDefault()} // Prevent editor blur
        disabled={disabled}
        type="button"
        className={`
        relative transition-all duration-200 ease-out
        ${compact ? "p-2" : "p-2.5"} rounded-lg group select-none 
        ${compact ? "min-w-[38px] h-[38px]" : "min-w-[40px] h-[40px]"}
        flex items-center justify-center
        backdrop-blur-sm
        ${
          isActive
            ? isDark
              ? "bg-gradient-to-br from-daccent to-daccent/80 text-white border-daccent shadow-lg shadow-daccent/20 scale-105"
              : "bg-gradient-to-br from-accent to-accent/80 text-white border-accent shadow-lg shadow-accent/20 scale-105"
            : isDark
            ? "bg-dcard/50 text-dMuted-text border-dbordercolor/50 hover:bg-daccent/15 hover:border-daccent hover:text-daccent hover:scale-105 hover:shadow-md"
            : "bg-white/50 text-muted-text border-bordercolor/50 hover:bg-accent/10 hover:border-accent hover:text-accent hover:scale-105 hover:shadow-md"
        }
        ${
          disabled
            ? "opacity-40 cursor-not-allowed hover:scale-100"
            : "cursor-pointer active:scale-95"
        }
        border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDark ? "focus:ring-daccent/50" : "focus:ring-accent/50"
        }
      `}
        title={shortcut ? `${title} (${shortcut})` : title}
        aria-label={title}
        aria-pressed={isActive}
        tabIndex={disabled ? -1 : 0}
      >
        <span className="relative flex items-center justify-center">
          {children}
          {colorIndicator && (
            <span
              className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-md ring-1 ring-black/10"
              style={{ backgroundColor: colorIndicator }}
            />
          )}
        </span>

        {isActive && (
          <span
            className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse ${
              isDark ? "bg-daccent" : "bg-accent"
            }`}
          />
        )}
      </button>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";

const ToolbarSeparator = React.memo(({ isDark }) => (
  <div
    className={`w-px h-6 mx-2 rounded-full ${
      isDark
        ? "bg-gradient-to-b from-transparent via-dbordercolor to-transparent"
        : "bg-gradient-to-b from-transparent via-bordercolor to-transparent"
    }`}
    role="separator"
    aria-orientation="vertical"
  />
));

ToolbarSeparator.displayName = "ToolbarSeparator";

const ColorPicker = React.memo(
  ({
    show,
    onClose,
    editor,
    isDark,
    type = "color",
    currentColor = null,
    isBottom = false,
  }) => {
    const colors = type === "highlight" ? HIGHLIGHT_COLORS : COLOR_PALETTE;
    const title = type === "highlight" ? "Text Highlight" : "Text Color";
    const Icon = type === "highlight" ? Paintbrush : Type;

    const handleColorSelect = useCallback(
      (color) => {
        if (!editor) return;

        if (type === "highlight") {
          editor.chain().focus().setHighlight({ color }).run();
        } else {
          editor.chain().focus().setColor(color).run();
        }
        onClose();
      },
      [editor, onClose, type]
    );

    const handleReset = useCallback(() => {
      if (!editor) return;

      if (type === "highlight") {
        editor.chain().focus().unsetHighlight().run();
      } else {
        editor.chain().focus().unsetColor().run();
      }
      onClose();
    }, [editor, onClose, type]);

    if (!show) return null;

    return (
      <div
        className={`absolute ${
          isBottom ? "bottom-full mb-3" : "top-full mt-3"
        } right-0 p-4 rounded-xl shadow-2xl z-[1001] min-w-[300px] border backdrop-blur-xl ${
          isDark
            ? "bg-dcard/95 border-dbordercolor/50 shadow-black/20"
            : "bg-white/95 border-bordercolor/50 shadow-black/10"
        } ${
          isBottom
            ? "animate-in slide-in-from-bottom-2"
            : "animate-in slide-in-from-top-2"
        } duration-200`}
        onMouseDown={(e) => e.preventDefault()} // Prevent editor blur
      >
        <div className="flex items-center justify-between mb-3">
          <h4
            className={`text-sm font-semibold flex items-center gap-2 ${
              isDark ? "text-dText" : "text-text"
            }`}
          >
            <Icon className="w-4 h-4" />
            {title}
          </h4>
          <button
            onClick={onClose}
            onMouseDown={(e) => e.preventDefault()}
            className={`p-1 rounded-md transition-colors ${
              isDark
                ? "hover:bg-daccent/20 text-dMuted-text"
                : "hover:bg-accent/20 text-muted-text"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-3 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorSelect(color)}
              onMouseDown={(e) => e.preventDefault()}
              type="button"
              className={`w-9 h-9 rounded-lg hover:scale-110 transition-all duration-150 border-2 shadow-sm hover:shadow-md relative ${
                currentColor === color
                  ? "ring-2 ring-offset-2 ring-blue-500 scale-110 border-white"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color }}
              title={`Set ${type} to ${color}`}
              aria-label={`Set ${type} to ${color}`}
            >
              {currentColor === color && (
                <div className="absolute inset-0 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white drop-shadow-md"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleReset}
          onMouseDown={(e) => e.preventDefault()}
          type="button"
          className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-2 ${
            isDark
              ? "bg-daccent/20 hover:bg-daccent/30 text-daccent border border-daccent/30"
              : "bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset {title}
        </button>
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

// Language Selector Component
const LanguageSelector = ({ editor, isDark }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "csharp", label: "C#" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "xml", label: "XML" },
    { value: "sql", label: "SQL" },
    { value: "bash", label: "Bash" },
    { value: "plaintext", label: "Plain Text" },
  ];

  const currentLanguage =
    editor.getAttributes("codeBlock").language || "plaintext";
  const isCodeBlockActive = editor.isActive("codeBlock");

  const setLanguage = useCallback(
    (lang) => {
      editor
        .chain()
        .focus()
        .updateAttributes("codeBlock", { language: lang })
        .run();
      setShowDropdown(false);
    },
    [editor]
  );

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".language-selector")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  if (!isCodeBlockActive) return null;

  return (
    <div className="relative language-selector">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        onMouseDown={(e) => e.preventDefault()}
        type="button"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
          isDark
            ? "bg-dcard/80 text-dText border-dbordercolor hover:bg-daccent/10 hover:border-daccent"
            : "bg-white/80 text-text border-bordercolor hover:bg-accent/10 hover:border-accent"
        }`}
      >
        <CodeSquare className="w-3.5 h-3.5" />
        <span>
          {languages.find((l) => l.value === currentLanguage)?.label ||
            "Language"}
        </span>
        <svg
          className={`w-3 h-3 transition-transform ${
            showDropdown ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showDropdown && (
        <div
          className={`absolute bottom-full mb-2 right-0 rounded-xl shadow-2xl z-[1002] w-[180px] max-h-[300px] overflow-y-auto border backdrop-blur-xl ${
            isDark
              ? "bg-dcard/95 border-dbordercolor/50 shadow-black/20"
              : "bg-white/95 border-bordercolor/50 shadow-black/10"
          } animate-in slide-in-from-bottom-2 duration-200`}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div
            className={`sticky top-0 px-3 py-2 text-xs font-semibold border-b ${
              isDark
                ? "bg-dcard/95 border-dbordercolor/50 text-dText"
                : "bg-white/95 border-bordercolor/50 text-text"
            }`}
          >
            Select Language
          </div>

          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              onMouseDown={(e) => e.preventDefault()}
              type="button"
              className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between ${
                currentLanguage === lang.value
                  ? isDark
                    ? "bg-daccent/20 text-daccent font-semibold"
                    : "bg-accent/20 text-accent font-semibold"
                  : isDark
                  ? "text-dText hover:bg-daccent/10"
                  : "text-text hover:bg-accent/10"
              }`}
            >
              <span>{lang.label}</span>
              {currentLanguage === lang.value && (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

LanguageSelector.displayName = "LanguageSelector";

// Bottom Sticky Toolbar Component
const BottomStickyToolbar = ({ editor, setLink, isDark, isVisible }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const buttonStates = useMemo(() => {
    if (!editor) return {};

    try {
      return {
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        strike: editor.isActive("strike"),
        heading1: editor.isActive("heading", { level: 1 }),
        heading2: editor.isActive("heading", { level: 2 }),
        heading3: editor.isActive("heading", { level: 3 }),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        blockquote: editor.isActive("blockquote"),
        codeBlock: editor.isActive("codeBlock"),
        alignLeft: editor.isActive({ textAlign: "left" }),
        alignCenter: editor.isActive({ textAlign: "center" }),
        alignRight: editor.isActive({ textAlign: "right" }),
        alignJustify: editor.isActive({ textAlign: "justify" }),
        highlight: editor.isActive("highlight"),
        link: editor.isActive("link"),
        textColor: editor.getAttributes("textStyle").color,
        highlightColor: editor.getAttributes("highlight").color,
      };
    } catch (error) {
      console.error("Error getting button states:", error);
      return {};
    }
  }, [editor?.state?.selection, editor?.state?.doc]);

  // Handlers with proper null checks
  const handleBold = useCallback(() => {
    if (editor) editor.chain().focus().toggleBold().run();
  }, [editor]);

  const handleItalic = useCallback(() => {
    if (editor) editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const handleUnderline = useCallback(() => {
    if (editor) editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const handleStrike = useCallback(() => {
    if (editor) editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const handleCodeBlock = useCallback(() => {
    if (editor)
      editor.chain().focus().toggleCodeBlock({ language: "plaintext" }).run();
  }, [editor]);

  const handleHeading = useCallback(
    (level) => {
      if (editor) editor.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  const handleList = useCallback(
    (type) => {
      if (!editor) return;
      if (type === "bullet") {
        editor.chain().focus().toggleBulletList().run();
      } else {
        editor.chain().focus().toggleOrderedList().run();
      }
    },
    [editor]
  );

  const handleAlign = useCallback(
    (alignment) => {
      if (editor) editor.chain().focus().setTextAlign(alignment).run();
    },
    [editor]
  );

  const handleBlockquote = useCallback(() => {
    if (editor) editor.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const handleUndo = useCallback(() => {
    if (editor) editor.chain().focus().undo().run();
  }, [editor]);

  const handleRedo = useCallback(() => {
    if (editor) editor.chain().focus().redo().run();
  }, [editor]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".color-picker-container")) {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) {
    console.warn("BottomStickyToolbar: Editor is null");
    return null;
  }

  return createPortal(
    <div
      className={`fixed bottom-0 left-0 right-0 z-[999] transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      } backdrop-blur-xl ${
        isDark
          ? "bg-dcard/95 border-t-dbordercolor/50 shadow-[0_-8px_32px_rgba(0,0,0,0.4)]"
          : "bg-white/95 border-t-bordercolor/50 shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
      } border-t`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Decorative Top Border */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] ${
          isDark
            ? "bg-gradient-to-r from-transparent via-daccent to-transparent opacity-50"
            : "bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"
        }`}
      />

      <div className="max-w-7xl mx-auto px-3 py-3">
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {/* History Group */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={handleUndo}
              title="Undo"
              shortcut="Ctrl+Z"
              disabled={!editor.can().undo()}
              isDark={isDark}
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={handleRedo}
              title="Redo"
              shortcut="Ctrl+Y"
              disabled={!editor.can().redo()}
              isDark={isDark}
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <ToolbarSeparator isDark={isDark} />

          {/* Text Formatting Group */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={handleBold}
              isActive={buttonStates.bold}
              title="Bold"
              shortcut="Ctrl+B"
              isDark={isDark}
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={handleItalic}
              isActive={buttonStates.italic}
              title="Italic"
              shortcut="Ctrl+I"
              isDark={isDark}
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={handleUnderline}
              isActive={buttonStates.underline}
              title="Underline"
              shortcut="Ctrl+U"
              isDark={isDark}
            >
              <UnderlineIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={handleStrike}
              isActive={buttonStates.strike}
              title="Strikethrough"
              isDark={isDark}
            >
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <ToolbarSeparator isDark={isDark} />

          {/* Headings Group - H1, H2, H3 together */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => handleHeading(1)}
              isActive={buttonStates.heading1}
              title="Heading 1"
              isDark={isDark}
            >
              <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleHeading(2)}
              isActive={buttonStates.heading2}
              title="Heading 2"
              isDark={isDark}
            >
              <Heading2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleHeading(3)}
              isActive={buttonStates.heading3}
              title="Heading 3"
              isDark={isDark}
            >
              <Heading3 className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <ToolbarSeparator isDark={isDark} />

          {/* Lists & Structure Group */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => handleList("bullet")}
              isActive={buttonStates.bulletList}
              title="Bullet List"
              isDark={isDark}
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleList("ordered")}
              isActive={buttonStates.orderedList}
              title="Numbered List"
              isDark={isDark}
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={handleBlockquote}
              isActive={buttonStates.blockquote}
              title="Quote"
              isDark={isDark}
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={handleCodeBlock}
              isActive={buttonStates.codeBlock}
              title="Code Block"
              isDark={isDark}
            >
              <CodeSquare className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <ToolbarSeparator isDark={isDark} />

          {/* Alignment Group */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => handleAlign("left")}
              isActive={buttonStates.alignLeft}
              title="Align Left"
              isDark={isDark}
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleAlign("center")}
              isActive={buttonStates.alignCenter}
              title="Center"
              isDark={isDark}
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleAlign("right")}
              isActive={buttonStates.alignRight}
              title="Align Right"
              isDark={isDark}
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleAlign("justify")}
              isActive={buttonStates.alignJustify}
              title="Justify"
              isDark={isDark}
            >
              <AlignJustify className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <ToolbarSeparator isDark={isDark} />

          {/* Color & Styling Group */}
          <div className="flex items-center gap-1">
            <div className="relative color-picker-container">
              <ToolbarButton
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                isActive={buttonStates.highlight || showHighlightPicker}
                title="Highlight"
                isDark={isDark}
                colorIndicator={buttonStates.highlightColor}
              >
                <Highlighter className="w-4 h-4" />
              </ToolbarButton>
              <ColorPicker
                show={showHighlightPicker}
                onClose={() => setShowHighlightPicker(false)}
                editor={editor}
                isDark={isDark}
                type="highlight"
                currentColor={buttonStates.highlightColor}
                isBottom
              />
            </div>

            <div className="relative color-picker-container">
              <ToolbarButton
                onClick={() => setShowColorPicker(!showColorPicker)}
                isActive={showColorPicker || !!buttonStates.textColor}
                title="Text Color"
                isDark={isDark}
                colorIndicator={buttonStates.textColor}
              >
                <Palette className="w-4 h-4" />
              </ToolbarButton>
              <ColorPicker
                show={showColorPicker}
                onClose={() => setShowColorPicker(false)}
                editor={editor}
                isDark={isDark}
                type="color"
                currentColor={buttonStates.textColor}
                isBottom
              />
            </div>

            <ToolbarButton
              onClick={setLink}
              isActive={buttonStates.link}
              title="Link"
              isDark={isDark}
            >
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Main Toolbar Component
const Toolbar = ({ editor, setLink, isDark }) => {
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  useEffect(() => {
    if (!editor) {
      console.warn("Toolbar: Editor is null");
      return;
    }

    const handleFocus = () => {
      console.log("Editor focused");
      setIsEditorFocused(true);
    };

    const handleBlur = () => {
      setTimeout(() => {
        const activeElement = document.activeElement;
        const isToolbarElement =
          activeElement?.closest('[role="toolbar"]') ||
          activeElement?.closest(".color-picker-container") ||
          activeElement?.closest("button");
        if (!isToolbarElement && !editor.view.hasFocus()) {
          console.log("Editor blurred");
          setIsEditorFocused(false);
        }
      }, 150);
    };

    editor.view.dom.addEventListener("focus", handleFocus);
    editor.view.dom.addEventListener("blur", handleBlur);

    return () => {
      editor.view.dom.removeEventListener("focus", handleFocus);
      editor.view.dom.removeEventListener("blur", handleBlur);
    };
  }, [editor]);

  if (!editor) {
    console.warn("Toolbar: Editor not initialized yet");
    return null;
  }

  return (
    <BottomStickyToolbar
      editor={editor}
      setLink={setLink}
      isDark={isDark}
      isVisible={isEditorFocused}
    />
  );
};

export default React.memo(Toolbar);
