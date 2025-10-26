// components/settings/tabs/SecuritySettings.jsx
import React, { useState } from "react";
import { Lock, Shield, Smartphone, Clock, Wrench, ChevronRight } from "lucide-react";
import PasswordModal from "../modals/PasswordModal";

const SecuritySettings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <div className="max-w-2xl space-y-0">
        {/* Change Password - Active */}
        <div
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center justify-between py-6 border-b border-bordercolor dark:border-dbordercolor cursor-pointer hover:bg-card/10 dark:hover:bg-dcard/10 transition-colors -mx-6 px-6"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 dark:from-daccent/20 dark:to-daccent/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-accent dark:text-daccent" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium text-text dark:text-dText mb-1">
                Change password
              </h3>
              <p className="text-sm text-muted-text dark:text-dMuted-text">
                Update your password to keep your account secure
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-text dark:text-dMuted-text" />
        </div>

        {/* Two-Factor Authentication - Under Development */}
        <div className="flex items-center justify-between py-6 border-b border-bordercolor dark:border-dbordercolor -mx-6 px-6 opacity-70">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted-text/10 to-muted-text/5 flex items-center justify-center">
              <Shield className="w-6 h-6 text-muted-text dark:text-dMuted-text" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-medium text-text dark:text-dText">
                  Two-factor authentication
                </h3>
              </div>
              <p className="text-sm text-muted-text dark:text-dMuted-text">
                Add an extra layer of security with 2FA
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

        {/* Active Sessions - Under Development */}
        <div className="flex items-center justify-between py-6 border-b border-bordercolor dark:border-dbordercolor -mx-6 px-6 opacity-70">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted-text/10 to-muted-text/5 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-muted-text dark:text-dMuted-text" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-medium text-text dark:text-dText">
                  Active sessions
                </h3>
              </div>
              <p className="text-sm text-muted-text dark:text-dMuted-text">
                Manage devices where you're logged in
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

        {/* Login History - Under Development */}
        <div className="flex items-center justify-between py-6 -mx-6 px-6 opacity-70">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted-text/10 to-muted-text/5 flex items-center justify-center">
              <Clock className="w-6 h-6 text-muted-text dark:text-dMuted-text" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-medium text-text dark:text-dText">
                  Login history
                </h3>
              </div>
              <p className="text-sm text-muted-text dark:text-dMuted-text">
                Review your recent login activity
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

      {/* Info Box */}
      <div className="max-w-2xl mt-8 p-4 bg-gradient-to-br from-accent/10 to-accent/5 dark:from-daccent/10 dark:to-daccent/5 border border-accent/20 dark:border-daccent/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 dark:bg-daccent/20 flex items-center justify-center flex-shrink-0">
            <Wrench className="w-4 h-4 text-accent dark:text-daccent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text dark:text-dText mb-1">
              More security features coming soon!
            </p>
            <p className="text-sm text-muted-text dark:text-dMuted-text">
              We're actively developing two-factor authentication, device management, and login tracking to make your account even more secure.
            </p>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <PasswordModal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </>
  );
};

export default SecuritySettings;
