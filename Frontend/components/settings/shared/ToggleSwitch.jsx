// components/settings/shared/ToggleSwitch.jsx
import React from "react";

const ToggleSwitch = ({ value, onChange }) => {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? "bg-accent dark:bg-daccent" : "bg-muted-text/20 dark:bg-dMuted-text/20"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
