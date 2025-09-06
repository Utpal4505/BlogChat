import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function Navbar() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <>
      <h1>BlogChat</h1>
      <nav className="bg-[#f5f5f3] text-[#1A1F1D] dark:bg-[#101815] dark:text-[#E5E7E6]">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-[#11161d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B177D9] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 dark:hover:bg-[#253547] dark:hover:text-[#f8fafc] hover:bg-[#9fa0a185] hover:text-[#161616f1] h-9 rounded-md px-3 relative group"
          type="button"
          id="radix-:r0:"
          aria-haspopup="menu"
          aria-expanded="false"
          onClick={() => setIsDark((prev) => !prev)}
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-moon h-5 w-5 transition-transform duration-200 group-hover:scale-110"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-sun h-5 w-5 transition-transform duration-200 group-hover:scale-110"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          )}
        </button>
      </nav>
    </>
  );
}

export default Navbar;
