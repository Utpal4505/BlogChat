"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Compass,
  MessageSquare,
  NotebookPen,
  Bug,
  Settings,
  MessageCircle,
  UserCircle,
  LogOut,
  ChevronLeft,
  MoreHorizontal,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const NavigationSidebar = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Window resize handler for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-collapse on mobile
      if (window.innerWidth < 768) {
        setIsExpanded(false);
        setShowMoreMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MotionLink = motion(Link);
  const MotionNavLink = motion(NavLink);

  const sections = [
    {
      title: "Navigation",
      items: [
        { icon: Home, label: "Home", href: "/" },
        { icon: Compass, label: "Explore", href: "/explore" },
        { icon: MessageSquare, label: "Chat", href: "/chat" },
        { icon: NotebookPen, label: "Write a blog", href: "/Write-Blog" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: Bug, label: "Report Bug", href: "/report-bug" },
        { icon: MessageCircle, label: "Give Feedback", href: "/feedback" },
        { icon: Settings, label: "Settings", href: "/settings" },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: UserCircle, label: "Profile", href: "/profile" },
        { icon: LogOut, label: "Logout", href: "/logout" },
      ],
    },
  ];

  // Flatten all items for easier management

  // For mobile, show only main navigation + more button
  const mobileMainItems = sections[0].items; // Navigation items
  const mobileMoreItems = [...sections[1].items, ...sections[2].items]; // Support + Account

  // Responsive breakpoints
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Variants for desktop sidebar
  const sidebarVariants = {
    collapsed: { width: 64 },
    expanded: { width: 180 },
  };

  const btnVariants = {
    collapsed: { justifyContent: "center", padding: "10px" },
    expanded: { justifyContent: "flex-start", padding: "10px 16px" },
  };

  const textVariants = {
    hidden: { opacity: 0, width: 0, marginLeft: 0 },
    visible: {
      opacity: 1,
      width: "auto",
      marginLeft: 8,
      transition: { duration: 0.3 },
    },
  };

  // Mobile tab bar variants
  const tabBarVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const moreMenuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const handleItemClick = (globalIndex) => {
    setActiveItem(globalIndex);
    if (isMobile) {
      setShowMoreMenu(false);
    }
  };

  // Desktop/Tablet Sidebar
  if (!isMobile) {
    return (
      <motion.div
        className={`fixed left-3 sm:left-4 z-40 
        bg-card/95 dark:bg-dcard/95 backdrop-blur-md 
        rounded-2xl shadow-xl border border-bordercolor/40 dark:border-dbordercolor/40 
        overflow-hidden
        ${isExpanded ? "top-20" : "top-1/2 -translate-y-1/2"}`}
        variants={sidebarVariants}
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Toggle */}
        <div className="flex justify-end p-2 sm:p-3 border-b border-bordercolor/60 dark:border-dbordercolor/60">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-muted-text dark:text-dMuted-text hover:bg-primary/10 dark:hover:bg-dPrimary/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft size={isTablet ? 16 : 18} />
            </motion.div>
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3 space-y-3 sm:space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
          {sections.map((section, si) => (
            <div key={si}>
              {isExpanded && (
                <span className="block text-[9px] sm:text-[10px] font-medium text-muted-text dark:text-dMuted-text uppercase tracking-wide mb-1">
                  {section.title}
                </span>
              )}
              <div className="space-y-1">
                {section.items.map((item, idx) => {
                  const Icon = item.icon;
                  const globalIndex =
                    sections
                      .slice(0, si)
                      .reduce((acc, s) => acc + s.items.length, 0) + idx;
                  const isActive = activeItem === globalIndex;
                  const isLogout = item.label === "Logout";

                  return (
                    <MotionLink
                      to={item.href}
                      key={globalIndex}
                      onClick={() => handleItemClick(globalIndex)}
                      className={`
                        w-full flex items-center rounded-lg px-2 py-1.5 text-xs sm:text-sm transition-all
                        ${isExpanded ? "" : "justify-center"} 
                        ${
                          isActive
                            ? isLogout
                              ? "bg-danger text-white"
                              : "bg-primary dark:bg-dPrimary text-white"
                            : "text-text dark:text-dText hover:bg-primary/10 dark:hover:bg-dPrimary/10"
                        }
                      `}
                      variants={btnVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      title={!isExpanded ? item.label : undefined}
                    >
                      <Icon
                        size={isTablet ? 18 : 20}
                        strokeWidth={isActive ? 2 : 1.5}
                        className={
                          isExpanded ? "mr-2 sm:mr-3 flex-shrink-0" : ""
                        }
                      />
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.span
                            className="font-medium text-xs sm:text-sm truncate"
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </MotionLink>
                  );
                })}
              </div>
              {/* Section Divider */}
              {si < sections.length - 1 && (
                <motion.div
                  className="my-2 sm:my-3 flex justify-center"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-bordercolor dark:via-dbordercolor to-transparent relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-bordercolor dark:bg-dbordercolor rounded-full" />
                  </div>
                </motion.div>
              )}
            </div>
          ))}

          {/* Profile */}
          {isExpanded && (
            <motion.div className="mt-2 pt-2 border-t border-bordercolor/60 dark:border-dbordercolor/60">
              <div className="flex items-center p-2 rounded-lg bg-primary/5 dark:bg-dPrimary/5">
                <img
                  src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                  alt="User Avatar"
                  className="w-5 sm:w-6 h-5 sm:h-6 rounded-full mr-2"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[10px] sm:text-xs text-text dark:text-dText truncate">
                    John Doe
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-muted-text dark:text-dMuted-text truncate">
                    john.doe@example.com
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // Mobile Tab Bar
  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMoreMenu && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMoreMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* More Menu */}
      <AnimatePresence>
        {showMoreMenu && (
          <motion.div
            className="fixed bottom-20 left-4 right-4 z-50 bg-card dark:bg-dcard rounded-2xl shadow-2xl border border-bordercolor dark:border-dbordercolor p-4"
            variants={moreMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div className="grid grid-cols-2 gap-3">
              {mobileMoreItems.map((item, idx) => {
                const Icon = item.icon;
                const globalIndex = mobileMainItems.length + idx;
                const isActive = activeItem === globalIndex;
                const isLogout = item.label === "Logout";

                return (
                  <motion.button
                    key={globalIndex}
                    onClick={() => handleItemClick(globalIndex)}
                    className={`
                      flex flex-col items-center p-4 rounded-xl transition-all
                      ${
                        isActive
                          ? isLogout
                            ? "bg-danger text-white"
                            : "bg-primary dark:bg-dPrimary text-white"
                          : "text-text dark:text-dText hover:bg-primary/10 dark:hover:bg-dPrimary/10"
                      }
                    `}
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                    <span className="text-xs font-medium mt-2 text-center">
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* User Profile in More Menu */}
            <motion.div
              className="mt-4 pt-4 border-t border-bordercolor dark:border-dbordercolor"
              variants={menuItemVariants}
            >
              <div className="flex items-center p-3 rounded-xl bg-primary/5 dark:bg-dPrimary/5">
                <img
                  src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-text dark:text-dText truncate">
                    John Doe
                  </div>
                  <div className="text-xs text-muted-text dark:text-dMuted-text truncate">
                    john.doe@example.com
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Bar */}
      <motion.div
        className="fixed bottom-4 left-4 right-4 z-40 bg-card/95 dark:bg-dcard/95 backdrop-blur-md rounded-2xl shadow-xl border border-bordercolor dark:border-dbordercolor"
        variants={tabBarVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-around px-2 py-3">
          {/* Main Navigation Items */}
          {mobileMainItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeItem === idx;

            return (
              <MotionLink
                to={item.href}
                key={idx}
                onClick={() => handleItemClick(idx)}
                className={`
                  flex flex-col items-center p-2 rounded-xl transition-all min-w-0 flex-1
                  ${
                    isActive
                      ? "bg-primary dark:bg-dPrimary text-white shadow-lg"
                      : "text-muted-text dark:text-dMuted-text hover:text-primary dark:hover:text-dPrimary"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className="mb-1"
                />
                <span
                  className={`text-xs font-medium truncate ${
                    isActive ? "text-white" : ""
                  }`}
                >
                  {item.label.split(" ")[0]}{" "}
                  {/* Show only first word on mobile */}
                </span>
              </MotionLink>
            );
          })}

          {/* More Button */}
          <motion.button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`
              flex flex-col items-center p-2 rounded-xl transition-all min-w-0 flex-1
              ${
                showMoreMenu
                  ? "bg-accent dark:bg-daccent text-white shadow-lg"
                  : "text-muted-text dark:text-dMuted-text hover:text-accent dark:hover:text-daccent"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: showMoreMenu ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <MoreHorizontal
                size={20}
                strokeWidth={showMoreMenu ? 2 : 1.5}
                className="mb-1"
              />
            </motion.div>
            <span
              className={`text-xs font-medium ${
                showMoreMenu ? "text-white" : ""
              }`}
            >
              More
            </span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default NavigationSidebar;
