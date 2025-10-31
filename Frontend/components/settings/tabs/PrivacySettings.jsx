// components/settings/tabs/PrivacySettings.jsx
import React, { useState } from "react";
import { Globe, Lock, Check, Wrench } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const PrivacySettings = ({ user }) => {
  const [profileVisibility, setProfileVisibility] = useState(
    user?.visibility || "PUBLIC"
  );

  const { updateUserProfile } = useContext(AuthContext);

  const visibilityOptions = [
    {
      value: "PUBLIC",
      icon: Globe,
      label: "Public",
      description: "Anyone can see your profile, posts, and activity",
    },
    {
      value: "PRIVATE",
      icon: Lock,
      label: "Private",
      description: "Only your followers can see your content",
    },
  ];

  const handleVisibilityChange = async (value) => {
    try {
      setProfileVisibility(value);
      await updateUserProfile({ visibility: value });
    } catch (error) {
      console.error("Failed to update profile visibility:", error);
      toast.error("Failed to update profile visibility. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl space-y-0">
      {/* Profile Visibility */}
      <div className="py-6 border-b border-bordercolor dark:border-dbordercolor -mx-6 px-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-text dark:text-dText mb-1">
            Profile Visibility
          </h3>
          <p className="text-sm text-muted-text dark:text-dMuted-text">
            Control who can see your profile and posts
          </p>
        </div>

        <div className="space-y-3">
          {visibilityOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = profileVisibility === option.value;

            return (
              <button
                key={option.value}
                onClick={() => handleVisibilityChange(option.value)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? "border-accent dark:border-daccent bg-gradient-to-br from-accent/10 to-accent/5 dark:from-daccent/10 dark:to-daccent/5"
                    : "border-bordercolor dark:border-dbordercolor hover:bg-card/20 dark:hover:bg-dcard/20"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-br from-accent/30 to-accent/20 dark:from-daccent/30 dark:to-daccent/20"
                      : "bg-card dark:bg-dcard"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isSelected
                        ? "text-accent dark:text-daccent"
                        : "text-muted-text dark:text-dMuted-text"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`text-base font-medium ${
                        isSelected
                          ? "text-accent dark:text-daccent"
                          : "text-text dark:text-dText"
                      }`}
                    >
                      {option.label}
                    </h4>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-accent dark:bg-daccent flex items-center justify-center">
                        <Check
                          className="w-3.5 h-3.5 text-white"
                          strokeWidth={3}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-text dark:text-dMuted-text">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Social Connections */}
      <div className="py-6 -mx-6 px-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-text dark:text-dText mb-1">
            Social Connections
          </h3>
          <p className="text-sm text-muted-text dark:text-dMuted-text">
            View your linked accounts
          </p>
        </div>

        <div className="space-y-3">
          {/* Google Connection - Currently Connected (View Only) */}
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-bordercolor dark:border-dbordercolor bg-card/10 dark:bg-dcard/10 opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <svg className="w-7 h-7" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text dark:text-dText">
                  Google
                </p>
                <p className="text-xs text-muted-text dark:text-dMuted-text">
                  Sign in with Google
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full">
              <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
              <span className="text-xs font-medium text-amber-600 dark:text-amber-500">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Twitter/X Connection (Coming Soon) */}
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-bordercolor dark:border-dbordercolor bg-card/10 dark:bg-dcard/10 opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text dark:text-dText">
                  X (Twitter)
                </p>
                <p className="text-xs text-muted-text dark:text-dMuted-text">
                  Sign in with X
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full">
              <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
              <span className="text-xs font-medium text-amber-600 dark:text-amber-500">
                Coming Soon
              </span>
            </div>
          </div>

          {/* GitHub Connection (Coming Soon) */}
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-bordercolor dark:border-dbordercolor bg-card/10 dark:bg-dcard/10 opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#181717] flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text dark:text-dText">
                  GitHub
                </p>
                <p className="text-xs text-muted-text dark:text-dMuted-text">
                  Sign in with GitHub
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full">
              <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
              <span className="text-xs font-medium text-amber-600 dark:text-amber-500">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="max-w-2xl -mx-6 px-6 pb-6">
        <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 dark:from-daccent/10 dark:to-daccent/5 border border-accent/20 dark:border-daccent/20 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 dark:bg-daccent/20 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-4 h-4 text-accent dark:text-daccent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text dark:text-dText mb-1">
                Account management features coming soon
              </p>
              <p className="text-sm text-muted-text dark:text-dMuted-text">
                We're working on letting you manage and disconnect social
                accounts. For now, your Google account is safely connected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
