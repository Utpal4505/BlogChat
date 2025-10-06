import React, { useState, useEffect, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { ChevronDown } from 'lucide-react';

const CodeBlockWithLanguage = ({ node, updateAttributes, }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'plaintext', label: 'Plain Text' },
  ];

  const currentLanguage = node.attrs.language || 'plaintext';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleLanguageChange = (lang) => {
    updateAttributes({ language: lang });
    setShowDropdown(false);
  };

  return (
    <NodeViewWrapper className="code-block-wrapper relative my-4">
      <div className="relative">
        {/* Language Selector - Top Right */}
        <div className="absolute top-2 right-2 z-10" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-black/40 hover:bg-black/60 text-white/90 hover:text-white transition-colors border border-white/10"
            contentEditable={false}
          >
            <span>{languages.find(l => l.value === currentLanguage)?.label || 'Language'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-1 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleLanguageChange(lang.value)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      currentLanguage === lang.value
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    contentEditable={false}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Code Block Content */}
        <pre className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 pr-24 overflow-x-auto">
          <NodeViewContent as="code" className={`language-${currentLanguage}`} />
        </pre>
      </div>
    </NodeViewWrapper>
  );
};

export default CodeBlockWithLanguage;
