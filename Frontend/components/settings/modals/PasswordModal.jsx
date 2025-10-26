// components/settings/modals/PasswordModal.jsx
import React, { useState } from "react";
import ModalWrapper from "../shared/ModalWrapper";

const PasswordModal = ({ show, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      alert("Password changed successfully!");
      onClose();
    }
  };

  return (
    <ModalWrapper
      show={show}
      onClose={onClose}
      title="Change password"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-bordercolor dark:border-dbordercolor rounded-lg text-text dark:text-dText hover:bg-card/20 dark:hover:bg-dcard/20 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-accent dark:bg-daccent text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Update password
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text dark:text-dText mb-2">Current password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 border border-bordercolor dark:border-dbordercolor rounded-lg bg-bg dark:bg-dbg text-text dark:text-dText focus:outline-none focus:border-accent dark:focus:border-daccent transition-colors"
            placeholder="Enter current password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text dark:text-dText mb-2">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-bordercolor dark:border-dbordercolor rounded-lg bg-bg dark:bg-dbg text-text dark:text-dText focus:outline-none focus:border-accent dark:focus:border-daccent transition-colors"
            placeholder="Enter new password"
          />
          <p className="text-xs text-muted-text dark:text-dMuted-text mt-2">Must be at least 8 characters</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-text dark:text-dText mb-2">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-bordercolor dark:border-dbordercolor rounded-lg bg-bg dark:bg-dbg text-text dark:text-dText focus:outline-none focus:border-accent dark:focus:border-daccent transition-colors"
            placeholder="Confirm new password"
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default PasswordModal;
