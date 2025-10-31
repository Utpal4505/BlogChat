// components/settings/modals/PasswordModal.jsx
import React, { useState } from "react";
import ModalWrapper from "../shared/ModalWrapper";
import PasswordInput, { GetStrength } from "../../PasswordStrengthCheck";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const PasswordModal = ({ show, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { updateUserProfile } = useContext(AuthContext);

  const handleSave = async () => {
    // Check password strength
    const strength = GetStrength(newPassword);
    const isStrong = strength.label === "Strong";
    if (!isStrong) {
      toast.error("Please choose a stronger password!");
    }

    // Check if passwords match and meet length requirement
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      toast.success("Password changed successfully!");
      onClose();
    } else if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    } else if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long!");
    }

    // Now calling API to change password can be done here
    try {
      await updateUserProfile({ Newpassword: newPassword });
      toast.success("Password changed successfully!");

      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password!");
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
          <label className="block text-sm font-medium text-text dark:text-dText mb-2">
            New password
          </label>
          <PasswordInput password={newPassword} setPassword={setNewPassword} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text dark:text-dText mb-2">
            Confirm new password
          </label>
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
