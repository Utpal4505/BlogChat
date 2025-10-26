// components/settings/modals/EmailModal.jsx
import React from "react";
import { AlertCircle } from "lucide-react";
import ModalWrapper from "../shared/ModalWrapper";

const EmailModal = ({ show, onClose, email }) => {
  return (
    <ModalWrapper
      show={show}
      onClose={onClose}
      title="Email address"
      footer={
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 bg-accent dark:bg-daccent text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Got it
        </button>
      }
    >
      <div className="bg-card/30 dark:bg-dcard/30 rounded-lg p-4 border border-bordercolor dark:border-dbordercolor">
        <p className="text-xs font-medium text-muted-text dark:text-dMuted-text mb-2 uppercase tracking-wide">
          Current email
        </p>
        <p className="text-base font-medium text-text dark:text-dText">{email}</p>
      </div>
      <p className="text-sm text-muted-text dark:text-dMuted-text mt-4 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>To change your email address, please contact our support team.</span>
      </p>
    </ModalWrapper>
  );
};

export default EmailModal;
