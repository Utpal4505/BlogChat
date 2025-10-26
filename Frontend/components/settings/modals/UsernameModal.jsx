// components/settings/modals/UsernameModal.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Check, Loader2, X, AlertCircle } from "lucide-react";
import ModalWrapper from "../shared/ModalWrapper";
import { AuthContext } from "../../../context/AuthContext";
import { debounce } from "lodash";
import toast from "react-hot-toast";

const UsernameModal = ({ show, onClose, username, setUsername }) => {
  const [newUsername, setNewUsername] = useState(username);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState(null);

  const { checkUsernameAvailability, updateUserProfile } =
    useContext(AuthContext);
  const usernameRegex = /^[a-z0-9_]{3,20}$/;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!show) {
      setNewUsername(username);
      setAvailability(null);
      setIsChecking(false);
    } else {
      setNewUsername(username);
    }
  }, [show, username]);

  // Debounced availability check
  const checkAvailabilityDebounced = useCallback(
    debounce(async (name) => {
      // Skip if username hasn't changed or is invalid
      if (!name || name === username || !usernameRegex.test(name)) {
        setAvailability(null);
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      try {
        const data = await checkUsernameAvailability(name);

        if (data.message === "Username is already taken") {
          setAvailability("taken");
        } else {
          setAvailability("available");
        }
      } catch (err) {
        console.error("Error checking username:", err);
        setAvailability(null);
      } finally {
        setIsChecking(false);
      }
    }, 800),
    [username, checkUsernameAvailability]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      checkAvailabilityDebounced.cancel();
    };
  }, [checkAvailabilityDebounced]);

  // Handle username input change
  const handleUsernameChange = (e) => {
    const value = e.target.value
      .replace(/[^a-z0-9_]/g, "")
      .toLowerCase()
      .trim();
    setNewUsername(value);

    // Reset availability state
    setAvailability(null);

    // Only check if valid format and different from current
    if (value && value !== username && usernameRegex.test(value)) {
      checkAvailabilityDebounced(value);
    } else {
      setIsChecking(false);
    }
  };

  const handleSave = async () => {
    try {
      if (canSave) {
        // Call your update username API here
        await updateUserProfile({ username: newUsername });

        setUsername(newUsername);
        toast.success("Username updated successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Failed to update username.");
    }
  };

  // Validation logic
  const isValidFormat = usernameRegex.test(newUsername);
  const isDifferent = newUsername !== username;
  const canSave = isValidFormat && isDifferent && availability === "available";

  return (
    <ModalWrapper
      show={show}
      onClose={onClose}
      title="Change username"
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
            disabled={!canSave}
            className="flex-1 px-4 py-2.5 bg-accent dark:bg-daccent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Save changes
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text dark:text-dText mb-3">
            Username
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text dark:text-dMuted-text font-medium">
              @
            </div>
            <input
              type="text"
              value={newUsername}
              onChange={handleUsernameChange}
              className="w-full pl-9 pr-12 py-3 border border-bordercolor dark:border-dbordercolor rounded-lg bg-bg dark:bg-dbg text-text dark:text-dText focus:outline-none focus:border-accent dark:focus:border-daccent transition-colors text-base"
              placeholder="username"
            />
            {/* Loading indicator */}
            {isChecking && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-muted-text dark:text-dMuted-text animate-spin" />
              </div>
            )}
            {/* Available indicator */}
            {!isChecking && availability === "available" && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Check className="w-5 h-5 text-accent dark:text-daccent" />
              </div>
            )}
            {/* Taken indicator */}
            {!isChecking && availability === "taken" && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-5 h-5 text-danger" />
              </div>
            )}
          </div>
        </div>

        {/* URL Preview */}
        <div className="bg-card/30 dark:bg-dcard/30 rounded-lg p-3 border border-bordercolor dark:border-dbordercolor">
          <p className="text-xs font-medium text-muted-text dark:text-dMuted-text mb-1">
            Your profile URL
          </p>
          <p className="text-sm text-text dark:text-dText font-mono">
            blogchat.com/{newUsername || "username"}
          </p>
        </div>

        {/* Validation Messages */}
        {newUsername.length > 0 && newUsername.length < 3 && (
          <div className="flex items-start gap-2 text-sm text-muted-text dark:text-dMuted-text">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Username must be 3-20 characters</span>
          </div>
        )}
        {newUsername.length > 20 && (
          <div className="flex items-start gap-2 text-sm text-danger">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Username must be 3-20 characters</span>
          </div>
        )}
        {newUsername.length >= 3 &&
          newUsername.length <= 20 &&
          !isValidFormat && (
            <div className="flex items-start gap-2 text-sm text-muted-text dark:text-dMuted-text">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Only lowercase letters, numbers, and underscores allowed
              </span>
            </div>
          )}
        {!isChecking && availability === "available" && (
          <div className="flex items-start gap-2 text-sm text-accent dark:text-daccent">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Username is available!</span>
          </div>
        )}
        {!isChecking && availability === "taken" && (
          <div className="flex items-start gap-2 text-sm text-danger">
            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Username is already taken</span>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default UsernameModal;
