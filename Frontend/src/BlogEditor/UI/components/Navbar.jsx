import React from 'react';
import { 
  ArrowLeft, 
  Check, 
  Sun, 
  Moon, 
  Eye, 
  Save, 
  Type,
  Loader2
} from 'lucide-react';

const Navbar = ({ 
  isDark, 
  setIsDark, 
  isPreview, 
  setIsPreview, 
  isSaving, 
  lastSaved, 
  wordCount 
}) => {
  return (
    <nav className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${
      isDark ? 'bg-dbg/90 border-dbordercolor/30' : 'bg-bg/90 border-bordercolor/30'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => window.history.back()}
              className={`flex items-center px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 ${
                isDark 
                  ? 'hover:bg-dcard/50 text-dMuted-text hover:text-dText' 
                  : 'hover:bg-gray-100/50 text-muted-text hover:text-text'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            
            <div className={`h-6 w-px ${isDark ? 'bg-dbordercolor' : 'bg-bordercolor'}`}></div>
            
            <div className="flex items-center space-x-3">
              {isSaving ? (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    isDark ? 'bg-daccent' : 'bg-accent'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-dMuted-text' : 'text-muted-text'
                  }`}>
                    Saving...
                  </span>
                </div>
              ) : lastSaved ? (
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className={`text-sm ${
                    isDark ? 'text-dMuted-text' : 'text-muted-text'
                  }`}>
                    Saved at {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className={`text-sm ${
                    isDark ? 'text-dMuted-text' : 'text-muted-text'
                  }`}>
                    Unsaved changes
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Center Section */}
          <div className={`hidden md:flex items-center space-x-6 px-4 py-2 rounded-xl ${
            isDark ? 'bg-dcard/30' : 'bg-card/30'
          }`}>
            <div className="flex items-center space-x-2 text-sm">
              <Type className="w-4 h-4" />
              <span className="font-medium">{wordCount}</span>
              <span className={isDark ? 'text-dMuted-text' : 'text-muted-text'}>words</span>
            </div>
            <div className={`w-px h-4 ${isDark ? 'bg-dbordercolor' : 'bg-bordercolor'}`}></div>
            <div className="text-sm">
              <span className="font-medium">{Math.ceil(wordCount / 200)}</span>
              <span className={isDark ? 'text-dMuted-text' : 'text-muted-text'}> min read</span>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark 
                  ? 'hover:bg-dcard/50 text-dMuted-text hover:text-dText' 
                  : 'hover:bg-gray-100/50 text-muted-text hover:text-text'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 ${
                isDark 
                  ? 'bg-dcard/50 hover:bg-dcard text-dMuted-text hover:text-dText border border-dbordercolor/50' 
                  : 'bg-gray-100/50 hover:bg-gray-100 text-muted-text hover:text-text border border-bordercolor/50'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            
            <button className={`flex items-center px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 shadow-lg ${
              isDark 
                ? 'bg-dPrimary hover:bg-daccent text-dText shadow-dPrimary/20' 
                : 'bg-primary hover:bg-accent text-white shadow-primary/20'
            }`}>
              <Save className="w-4 h-4 mr-2" />
              Publish
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
