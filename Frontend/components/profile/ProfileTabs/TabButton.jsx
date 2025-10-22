import { motion as Motion } from "framer-motion";

const TabsNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: "posts", label: "Posts" },
    { key: "replies", label: "Replies" },
    { key: "saved", label: "Saved" },
  ];

  return (
    <div className="border-y border-bordercolor dark:border-dbordercolor sticky top-0 bg-bg/98 dark:bg-dbg/98 backdrop-blur-2xl z-20 -mx-4 px-4 mb-4 shadow-sm">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="flex-1 relative py-4 text-[14px] font-bold transition-all"
          >
            <span
              className={
                activeTab === tab.key
                  ? "text-text dark:text-dText"
                  : "text-muted-text dark:text-dMuted-text hover:text-text dark:hover:text-dText"
              }
            >
              {tab.label}
            </span>
            {activeTab === tab.key && (
              <Motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-primary dark:from-daccent dark:to-dPrimary rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsNavigation;
