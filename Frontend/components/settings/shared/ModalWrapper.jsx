// components/settings/shared/ModalWrapper.jsx
import React from "react";
import { X } from "lucide-react";

const ModalWrapper = ({ show, onClose, title, children, footer, isDanger = false }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-bg dark:bg-dbg rounded-xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDanger ? "border-danger/20" : "border-bordercolor dark:border-dbordercolor"}`}>
          <h2 className={`text-lg font-semibold ${isDanger ? "text-danger" : "text-text dark:text-dText"}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-card/50 dark:hover:bg-dcard/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-text dark:text-dMuted-text" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-bordercolor dark:border-dbordercolor">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalWrapper;
