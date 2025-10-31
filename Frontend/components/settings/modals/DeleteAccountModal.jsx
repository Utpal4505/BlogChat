// components/settings/modals/DeleteAccountModal.jsx
import React, { useState, useEffect, useContext } from "react";
import ModalWrapper from "../shared/ModalWrapper";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const DeleteAccountModal = ({ show, onClose }) => {
  const [confirmText, setConfirmText] = useState("");

  const { deleteUser } = useContext(AuthContext);

  useEffect(() => {
    if (show) setConfirmText("");
  }, [show]);

  const canDelete = confirmText === "DELETE";

  const handleDelete = async () => {
    if (!canDelete) return;

    try {
      const data = await deleteUser();
      console.log("Delete account data", data);
      alert("Your account has been deleted.");
      onClose();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account.");
    }
  };

  return (
    <ModalWrapper
      show={show}
      onClose={onClose}
      title="Delete account"
      isDanger
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-bordercolor dark:border-dbordercolor rounded-lg text-text dark:text-dText hover:bg-card/20 dark:hover:bg-dcard/20 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!canDelete}
            className="flex-1 px-4 py-2.5 bg-danger text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Delete forever
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
          <p className="text-sm text-text dark:text-dText">
            This action <strong>cannot be undone</strong>. This will permanently
            delete your account and remove all your data from our servers.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-dText mb-3">
            Type <strong className="text-danger">DELETE</strong> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-3 border-2 border-danger/30 rounded-lg bg-bg dark:bg-dbg text-text dark:text-dText focus:outline-none focus:border-danger transition-colors text-base"
            placeholder="DELETE"
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteAccountModal;
