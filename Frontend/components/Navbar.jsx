import {
  ChevronDown,
  Search,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  LogIn,
  Lightbulb,
  LightbulbOff,
} from "lucide-react";
import { useEffect, useState, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Window resize handler for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu when switching to desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const { user, logout } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add your search logic here
    }
  };

  const handleLogOut = () => {
    logout();
    toast.success("Logged out successfully");
    setIsDropdownOpen(false);
  };

  const handleLogin = () => {
    navigate("/login"); // Update with your login route
  };

  // Responsive breakpoints
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  return (
    <header className="sticky top-0 z-50 bg-bg/95 dark:bg-dbg/95 backdrop-blur-md border-b border-bordercolor dark:border-dbordercolor transition-all duration-300">
      <nav className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-2 group">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary dark:text-dPrimary transition-colors group-hover:text-accent dark:group-hover:text-daccent">
                BlogChat
              </div>
            </NavLink>
          </div>

          {/* Search Bar - Responsive visibility and sizing */}
          <div
            className={`${
              isMobile ? "hidden" : "flex"
            } flex-1 max-w-xs sm:max-w-md lg:max-w-2xl mx-3 sm:mx-4 lg:mx-8`}
          >
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search
                className={`absolute left-3 sm:left-4 top-1/2 ${
                  isMobile ? "h-4 w-4" : isTablet ? "h-4 w-4" : "h-5 w-5"
                } -translate-y-1/2 text-muted-text dark:text-dMuted-text transition-colors group-focus-within:text-accent dark:group-focus-within:text-daccent`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${
                  isTablet
                    ? "h-10 text-sm"
                    : "h-10 sm:h-12 text-sm sm:text-base"
                } rounded-xl sm:rounded-2xl border border-bordercolor dark:border-dbordercolor bg-card dark:bg-dcard px-9 sm:px-12 text-text dark:text-dText placeholder:text-muted-text dark:placeholder:text-dMuted-text focus:outline-none focus:ring-2 focus:ring-accent/40 dark:focus:ring-daccent/40 focus:border-accent dark:focus:border-daccent transition-all duration-200 shadow-sm`}
                placeholder={
                  isTablet ? "Search..." : "Search articles, topics..."
                }
              />
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Enhanced Theme Toggle - Responsive sizing */}
            <div className="relative">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`relative flex items-center justify-center ${
                  isMobile ? "w-11 h-6" : isTablet ? "w-12 h-6" : "w-14 h-7"
                } bg-bordercolor dark:bg-dbordercolor rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent/40 dark:focus:ring-daccent/40 hover:shadow-md`}
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {/* Toggle Track */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent dark:from-dPrimary dark:to-daccent opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

                {/* Toggle Knob - Responsive sizing */}
                <div
                  className={`relative z-10 flex items-center justify-center ${
                    isMobile ? "w-5 h-5" : isTablet ? "w-5 h-5" : "w-6 h-6"
                  } bg-card dark:bg-dcard rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${
                    isDark
                      ? isMobile
                        ? "translate-x-2.5"
                        : isTablet
                        ? "translate-x-3"
                        : "translate-x-3.5"
                      : isMobile
                      ? "-translate-x-2.5"
                      : isTablet
                      ? "-translate-x-3"
                      : "-translate-x-3.5"
                  }`}
                >
                  {/* Icons - Responsive sizing */}
                  <LightbulbOff
                    className={`absolute ${
                      isMobile ? "h-3 w-3" : "h-3.5 w-3.5"
                    } text-accent transition-all duration-300 ${
                      isDark
                        ? "opacity-0 rotate-180 scale-0"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <Lightbulb
                    className={`absolute ${
                      isMobile ? "h-3 w-3" : "h-3.5 w-3.5"
                    } text-daccent transition-all duration-300 ${
                      isDark
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-180 scale-0"
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Conditional Rendering: User Dropdown OR Login Button */}
            {user ? (
              // User Dropdown - When logged in
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="menu"
                  className={`flex items-center space-x-1 sm:space-x-2 ${
                    isMobile ? "p-1.5" : "p-2"
                  } rounded-xl text-muted-text dark:text-dMuted-text hover:bg-primary/10 dark:hover:bg-dPrimary/10 hover:text-primary dark:hover:text-dPrimary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:focus:ring-daccent/40`}
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                    }
                    alt="User avatar"
                    className={`${
                      isMobile ? "h-7 w-7" : isTablet ? "h-8 w-8" : "h-8 w-8"
                    } rounded-full object-cover border-2 border-bordercolor dark:border-dbordercolor hover:border-accent dark:hover:border-daccent transition-all duration-200`}
                  />
                  {windowWidth > 480 && (
                    <ChevronDown
                      className={`${
                        isMobile ? "h-3 w-3" : "h-4 w-4"
                      } transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 sm:mt-3 ${
                      isMobile ? "w-48" : isTablet ? "w-52" : "w-56"
                    } rounded-xl sm:rounded-2xl bg-card dark:bg-dcard border border-bordercolor dark:border-dbordercolor shadow-xl shadow-primary/5 dark:shadow-black/20 py-2 z-50 animate-in slide-in-from-top-2 duration-200`}
                  >
                    {/* User Info Header */}
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-bordercolor dark:border-dbordercolor">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <img
                          src={
                            user?.avatar ||
                            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                          }
                          alt="User avatar"
                          className={`${
                            isMobile ? "h-8 w-8" : "h-10 w-10"
                          } rounded-full object-cover border-2 border-bordercolor dark:border-dbordercolor`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`${
                              isMobile ? "text-xs" : "text-sm"
                            } font-semibold text-text dark:text-dText truncate`}
                          >
                            {user?.username || "@johndoe"}
                          </p>
                          <p
                            className={`${
                              isMobile ? "text-xs" : "text-xs"
                            } text-muted-text dark:text-dMuted-text truncate`}
                          >
                            {user?.name || "John Doe"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1 sm:py-2">
                      <NavLink
                        to="/profile"
                        className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 ${
                          isMobile ? "text-xs" : "text-sm"
                        } text-text dark:text-dText hover:bg-primary/5 dark:hover:bg-dPrimary/5 transition-all duration-200 group`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User
                          className={`${
                            isMobile ? "w-3.5 h-3.5" : "w-4 h-4"
                          } text-muted-text dark:text-dMuted-text group-hover:text-accent dark:group-hover:text-daccent transition-colors duration-200`}
                        />
                        <span className="group-hover:text-accent dark:group-hover:text-daccent transition-colors duration-200">
                          Profile
                        </span>
                      </NavLink>

                      <NavLink
                        to="/settings"
                        className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 ${
                          isMobile ? "text-xs" : "text-sm"
                        } text-text dark:text-dText hover:bg-primary/5 dark:hover:bg-dPrimary/5 transition-all duration-200 group`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings
                          className={`${
                            isMobile ? "w-3.5 h-3.5" : "w-4 h-4"
                          } text-muted-text dark:text-dMuted-text group-hover:text-accent dark:group-hover:text-daccent transition-colors duration-200`}
                        />
                        <span className="group-hover:text-accent dark:group-hover:text-daccent transition-colors duration-200">
                          Settings
                        </span>
                      </NavLink>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-bordercolor dark:border-dbordercolor my-1 sm:my-2"></div>

                    {/* Sign Out */}
                    <button
                      className={`flex items-center space-x-2 sm:space-x-3 w-full px-3 sm:px-4 py-2 sm:py-3 ${
                        isMobile ? "text-xs" : "text-sm"
                      } text-danger hover:bg-danger/5 transition-all duration-200 group`}
                      onClick={handleLogOut}
                    >
                      <LogOut
                        className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`}
                      />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-2 py-2">
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-bordercolor/50 dark:border-dbordercolor/50 bg-white/30 dark:bg-white/[0.05] backdrop-blur-md hover:bg-white/40 dark:hover:bg-white/[0.08] hover:border-accent/60 dark:hover:border-daccent/60 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 dark:via-daccent/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  {/* Icon */}
                  <LogIn
                    className="w-[18px] h-[18px] relative z-10 text-accent dark:text-daccent group-hover:scale-110 transition-transform duration-200"
                    strokeWidth={2.5}
                  />

                  {/* Text */}
                  <span className="relative z-10 text-[15px] font-semibold tracking-wide text-text dark:text-dText group-hover:text-accent dark:group-hover:text-daccent transition-colors duration-200">
                    Sign In
                  </span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden ${
                isMobile ? "p-2" : "p-2.5"
              } rounded-xl text-muted-text dark:text-dMuted-text hover:bg-primary/10 dark:hover:bg-dPrimary/10 hover:text-primary dark:hover:text-dPrimary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:focus:ring-daccent/40`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
              ) : (
                <Menu className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced responsiveness */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-bordercolor dark:border-dbordercolor pt-3 sm:pt-4 pb-3 sm:pb-4 space-y-3 sm:space-y-4">
            {/* Mobile Search */}
            <div className="mb-3 sm:mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search
                  className={`absolute left-3 sm:left-4 top-1/2 ${
                    isMobile ? "h-4 w-4" : "h-5 w-5"
                  } -translate-y-1/2 text-muted-text dark:text-dMuted-text`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${
                    isMobile ? "h-10 text-sm" : "h-12 text-base"
                  } rounded-xl sm:rounded-2xl border border-bordercolor dark:border-dbordercolor bg-card dark:bg-dcard px-9 sm:px-12 text-text dark:text-dText placeholder:text-muted-text dark:placeholder:text-dMuted-text focus:outline-none focus:ring-2 focus:ring-accent/40 dark:focus:ring-daccent/40`}
                  placeholder="Search..."
                />
              </form>
            </div>

            {/* Mobile User Info or Login Button */}
            {user ? (
              <div className="px-2">
                <div
                  className={`flex items-center space-x-3 px-3 sm:px-4 py-3 bg-primary/5 dark:bg-dPrimary/5 rounded-xl`}
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                    }
                    alt="User avatar"
                    className={`${
                      isMobile ? "h-8 w-8" : "h-10 w-10"
                    } rounded-full object-cover border-2 border-bordercolor dark:border-dbordercolor`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`${
                        isMobile ? "text-sm" : "text-base"
                      } font-semibold text-text dark:text-dText truncate`}
                    >
                      {user?.username || "@johndoe"}
                    </p>
                    <p
                      className={`${
                        isMobile ? "text-xs" : "text-sm"
                      } text-muted-text dark:text-dMuted-text truncate`}
                    >
                      {user?.name || "John Doe"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-2 py-2">
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-bordercolor/50 dark:border-dbordercolor/50 bg-white/30 dark:bg-white/[0.05] backdrop-blur-md hover:bg-white/40 dark:hover:bg-white/[0.08] hover:border-accent/60 dark:hover:border-daccent/60 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 dark:via-daccent/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  {/* Icon */}
                  <LogIn
                    className="w-[18px] h-[18px] relative z-10 text-accent dark:text-daccent group-hover:scale-110 transition-transform duration-200"
                    strokeWidth={2.5}
                  />

                  {/* Text */}
                  <span className="relative z-10 text-[15px] font-semibold tracking-wide text-text dark:text-dText group-hover:text-accent dark:group-hover:text-daccent transition-colors duration-200">
                    Sign In
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
