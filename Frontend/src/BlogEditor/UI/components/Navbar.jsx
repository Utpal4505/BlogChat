import React from "react";
import { ArrowLeft, Check, Sun, Moon, Eye, Upload, Type } from "lucide-react";


const Navbar = ({
  isPreview,
  setIsPreview,
  wordCount,
  onPublish,
}) => {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 bg-bg/95 dark:bg-dbg/95 border-bordercolor/20 dark:border-dbordercolor/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-5">
            <button
              onClick={() => window.history.back()}
              className="flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all hover:bg-gray-100 dark:hover:bg-dcard/50 text-muted-text dark:text-dMuted-text hover:text-text dark:hover:text-dText"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <div className="h-5 w-px bg-bordercolor/30 dark:bg-dbordercolor/30" />
          </div>

          {/* Center Section */}
          <div className="hidden md:flex items-center space-x-5 ml-12 px-4 py-2 rounded-lg bg-gray-50 dark:bg-dcard/30">
            <div className="flex items-center space-x-2 text-sm">
              <Type className="w-4 h-4 opacity-60" />
              <span className="font-semibold">{wordCount}</span>
              <span className="text-muted-text dark:text-dMuted-text">
                words
              </span>
            </div>

            <div className="w-px h-4 bg-bordercolor/30 dark:bg-dbordercolor/30" />

            <div className="text-sm">
              <span className="font-semibold">
                {Math.ceil(wordCount / 200)}
              </span>
              <span className="text-muted-text dark:text-dMuted-text">
                {" "}
                min
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-dcard/50 text-muted-text dark:text-dMuted-text hover:text-text dark:hover:text-dText"
              title="Toggle theme"
            >
              <Sun className="w-4 h-4 hidden dark:block" />
              <Moon className="w-4 h-4 block dark:hidden" />
            </button>

            {/* Preview Toggle */}
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                isPreview
                  ? "bg-accent/15 dark:bg-daccent/15 text-accent dark:text-daccent border border-accent/30 dark:border-daccent/30"
                  : "hover:bg-gray-100 dark:hover:bg-dcard/50 text-muted-text dark:text-dMuted-text hover:text-text dark:hover:text-dText border border-transparent"
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? "Edit" : "Preview"}
            </button>

            {/* Publish Button with Validation */}
            <button
              onClick={onPublish}
              className="flex items-center px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg bg-accent dark:bg-daccent hover:bg-accent/90 dark:hover:bg-daccent/90 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Publish
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
