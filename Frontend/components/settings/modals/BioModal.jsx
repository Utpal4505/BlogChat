import React, { useState, useEffect, useContext } from "react";
import ModalWrapper from "../shared/ModalWrapper";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const BioModal = ({ show, onClose, bio, setBio }) => {
  const [newBio, setNewBio] = useState(bio);
  const [error, setError] = useState("");

  const { updateUserProfile } = useContext(AuthContext);

  useEffect(() => {
    if (show) {
      setNewBio(bio);
      setError("");
    }
  }, [show, bio]);

  useEffect(() => {
    if (newBio.length < 10) {
      setError("Bio must be at least 10 characters");
    } else if (newBio.length > 160) {
      setError("Bio must be 160 characters or less");
    } else {
      setError("");
    }
  }, [newBio]);

  const handleSave = async () => {
    if (error) return;

    try {
      await updateUserProfile({
        bio: newBio,
      });

      setBio(newBio);

      onClose();
    } catch (error) {
      console.error("Error updating bio:", error);
      toast.error("Failed to update bio.");
    }
  };

  return (
    <ModalWrapper
      show={show}
      onClose={onClose}
      title="Short bio"
      footer={
        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-bordercolor dark:border-dbordercolor rounded-lg text-text dark:text-dText hover:bg-card/25 dark:hover:bg-dcard/25 transition-colors font-semibold shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!!error}
            className={`flex-1 py-3 rounded-lg text-white font-semibold transition-opacity shadow-sm ${
              error
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-accent dark:bg-daccent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent dark:focus:ring-daccent"
            }`}
          >
            Save
          </button>
        </div>
      }
      className="p-6"
    >
      <div>
        <label className="block text-sm font-semibold text-text dark:text-dText mb-4">
          Bio
        </label>
        <textarea
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          maxLength={160}
          rows={5}
          placeholder="Tell people about yourself..."
          className={`w-full px-5 py-4 border rounded-lg bg-bg dark:bg-dbg text-text dark:text-dText focus:outline-none text-base resize-none transition-all duration-200 ${
            error
              ? "border-danger dark:border-danger shadow-[0_0_5px_rgba(220,38,38,0.5)]"
              : "border-bordercolor dark:border-dbordercolor focus:border-accent dark:focus:border-daccent shadow-sm"
          }`}
        />
        <div className="flex justify-between items-center mt-2">
          <p
            className={`text-xs font-medium transition-colors ${
              error ? "text-danger" : "text-muted-text dark:text-dMuted-text"
            }`}
            style={{ minHeight: "1.1rem" }}
          >
            {error || "Appears on your profile"}
          </p>
          <p
            className={`text-xs font-semibold transition-colors ${
              newBio.length >= 160
                ? "text-danger"
                : "text-muted-text dark:text-dMuted-text"
            }`}
          >
            {newBio.length}/160
          </p>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default BioModal;
