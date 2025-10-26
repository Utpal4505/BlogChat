// pages/SettingsPage.jsx
import React, { useContext, useState } from "react";
import AccountSettings from "../components/settings/tabs/AccountSettings";
import PrivacySettings from "../components/settings/tabs/PrivacySettings";
import SecuritySettings from "../components/settings/tabs/SecuritySettings";
import { AuthContext } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account" },
    { id: "privacy", label: "Privacy" },
    { id: "security", label: "Security" },
  ];

  const { user } = useContext(AuthContext)

    if (!user) {
    return <LoadingScreen text="Loading Settings..." />;
    }

  return (
    <div className="w-full max-w-4xl mx-auto bg-bg dark:bg-dbg min-h-screen">
      {/* Header */}
      <div className="border-b border-bordercolor dark:border-dbordercolor px-6 py-8">
        <h1 className="text-4xl font-bold text-text dark:text-dText">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-bordercolor dark:border-dbordercolor px-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-sm font-normal relative transition-colors ${
                activeTab === tab.id
                  ? "text-text dark:text-dText"
                  : "text-muted-text dark:text-dMuted-text hover:text-text dark:hover:text-dText"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-text dark:bg-dText" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {activeTab === "account" && <AccountSettings user={user} />}
        {activeTab === "privacy" && <PrivacySettings user={user} />}
        {activeTab === "security" && <SecuritySettings user={user} />}
      </div>
    </div>
  );
};

export default SettingsPage;
