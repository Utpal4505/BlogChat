import React, { useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
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
  Palette
} from 'lucide-react';
import { COLOR_PALETTE } from './BlogEditor';

const ToolbarButton = ({ onClick, isActive, children, title, disabled = false, isDark }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      relative transition-all duration-150 ease-out
      p-2.5 rounded-lg border
      ${isActive 
        ? isDark 
          ? 'bg-daccent text-white border-daccent shadow-lg' 
          : 'bg-accent text-white border-accent shadow-lg'
        : isDark
          ? 'bg-dcard text-dMuted-text border-dbordercolor hover:bg-daccent/10 hover:border-daccent hover:text-daccent'
          : 'bg-white text-muted-text border-bordercolor hover:bg-accent/5 hover:border-accent hover:text-accent'
      }
      ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
    `}
    title={title}
  >
    {children}
  </button>
);

const Toolbar = ({ editor, setLink, isDark }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColorPicker && !event.target.closest('.color-picker-container')) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  if (!editor) return null;

  return (
    <>
      <div className={`p-4 border-b ${
        isDark ? 'border-dbordercolor bg-dcard' : 'border-bordercolor bg-gray-50'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          {/* History */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo (Ctrl+Z)"
            disabled={!editor.can().undo()}
            isDark={isDark}
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo (Ctrl+Y)"
            disabled={!editor.can().redo()}
            isDark={isDark}
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>

          <div className={`w-px h-5 mx-2 ${isDark ? 'bg-dbordercolor' : 'bg-bordercolor'}`}></div>

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
            isDark={isDark}
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
            isDark={isDark}
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
            isDark={isDark}
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>

          <div className={`w-px h-5 mx-2 ${isDark ? 'bg-dbordercolor' : 'bg-bordercolor'}`}></div>

          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
            isDark={isDark}
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
            isDark={isDark}
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
            isDark={isDark}
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
            isDark={isDark}
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>

          <div className={`w-px h-5 mx-2 ${isDark ? 'bg-dbordercolor' : 'bg-bordercolor'}`}></div>

          {/* Lists and Quote */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
            isDark={isDark}
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
            isDark={isDark}
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
            isDark={isDark}
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
            isDark={isDark}
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>

          <div className={`w-px h-5 mx-2 ${isDark ? 'bg-dbordercolor' : 'bg-bordercolor'}`}></div>

          {/* Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
            isDark={isDark}
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
            isDark={isDark}
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
            isDark={isDark}
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
            isDark={isDark}
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>

          <div className={`w-px h-5 mx-2 ${isDark ? 'bg-dbordercolor' : 'bg-bordercolor'}`}></div>

          {/* Special Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="Highlight Text"
            isDark={isDark}
          >
            <Highlighter className="w-4 h-4" />
          </ToolbarButton>

          {/* Color Picker */}
          <div className="relative color-picker-container">
            <ToolbarButton
              onClick={() => setShowColorPicker(!showColorPicker)}
              isActive={showColorPicker}
              title="Text Color"
              isDark={isDark}
            >
              <Palette className="w-4 h-4" />
            </ToolbarButton>
            
            {showColorPicker && (
              <div className={`absolute top-full left-0 mt-2 p-4 rounded-lg shadow-xl z-50 min-w-[280px] border ${
                isDark ? 'bg-dcard border-dbordercolor' : 'bg-white border-bordercolor'
              }`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  isDark ? 'text-dText' : 'text-text'
                }`}>
                  Text Color
                </h4>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {COLOR_PALETTE.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                      className="w-10 h-10 rounded-lg hover:scale-105 transition-transform duration-150 border-2 border-gray-200"
                      style={{ backgroundColor: color }}
                      title={`Set color to ${color}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorPicker(false);
                  }}
                  className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                    isDark 
                      ? 'bg-daccent/20 hover:bg-daccent/30 text-daccent' 
                      : 'bg-accent/20 hover:bg-accent/30 text-accent'
                  }`}
                >
                  Reset Color
                </button>
              </div>
            )}
          </div>

          <div className={`w-px h-5 mx-2 ${isDark ? 'bg-dbordercolor' : 'bg-bordercolor'}`}></div>

          {/* Link */}
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Add/Edit Link"
            isDark={isDark}
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>
    </>
  );
};

export default Toolbar;
