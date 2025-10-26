// components/settings/shared/SettingItem.jsx
import React from "react";

const SettingItem = ({ title, description, value, rightContent, icon, onClick, isDanger = false }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-6 border-b border-bordercolor dark:border-dbordercolor cursor-pointer transition-colors -mx-6 px-6 ${
        isDanger ? "hover:bg-danger/5" : "hover:bg-card/10 dark:hover:bg-dcard/10"
      }`}
    >
      <div className="flex-1">
        <h3 className={`text-base font-normal mb-1 ${isDanger ? "text-danger" : "text-text dark:text-dText"}`}>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-text dark:text-dMuted-text line-clamp-1">
            {description}
          </p>
        )}
      </div>
      {rightContent || value ? (
        rightContent || <span className="text-sm text-muted-text dark:text-dMuted-text">{value}</span>
      ) : icon}
    </div>
  );
};

export default SettingItem;
