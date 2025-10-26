// components/settings/modals/BioModal.jsx
import React, { useState, useEffect } from "react";
import ModalWrapper from "../shared/ModalWrapper";

const BioModal = ({ show, onClose, bio, setBio }) => {
  const [newBio, setNewBio] = useState(bio);

  useEffect(() => {
    if (show) setNewBio(bio);
  }, [show, bio]);

  const handleSave = () => {
    setBio(newBio);
    onClose();
  };

  return (
    <ModalWrapper
      show={show}
      onClose={onClose}
      title="Short bio"
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
            Save
          </button>
        </div>
      }
    >
      <div>
        <label className="block text-sm font-medium text-text dark:text-dText mb-3">
          Bio
        </label>
        <textarea
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          maxLength={160}
          rows={4}
          className="w-full px-4 py-3 border border-bordercolor dark:border-dbordercolor rounded-lg bg-bg dark:bg-dbg text-text dark:text-dText focus:outline-none focus:border-accent dark:focus:border-daccent resize-none transition-colors text-base"
          placeholder="Tell people about yourself..."
        />
        <div className="flex justify-between mt-3">
          <p className="text-xs text-muted-text dark:text-dMuted-text">
            Appears on your profile
          </p>
          <p className={`text-xs font-medium ${newBio.length >= 160 ? 'text-danger' : 'text-muted-text dark:text-dMuted-text'}`}>
            {newBio.length}/160
          </p>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default BioModal;
