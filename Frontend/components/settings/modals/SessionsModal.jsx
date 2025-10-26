// components/settings/modals/SessionsModal.jsx
import React from "react";
import ModalWrapper from "../shared/ModalWrapper";

const SessionsModal = ({ show, onClose }) => {
  const sessions = [
    { id: 1, device: "Chrome on Windows", location: "Mumbai, India", lastActive: "Active now", current: true },
    { id: 2, device: "Safari on iPhone", location: "Mumbai, India", lastActive: "2 hours ago", current: false },
  ];

  return (
    <ModalWrapper
      show={show}
      onClose={onClose}
      title="Active sessions"
      footer={
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 bg-accent dark:bg-daccent text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Close
        </button>
      }
    >
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="p-4 border border-bordercolor dark:border-dbordercolor rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-text dark:text-dText">{session.device}</p>
                <p className="text-xs text-muted-text dark:text-dMuted-text mt-1">{session.location}</p>
              </div>
              {session.current ? (
                <span className="text-xs px-2 py-1 bg-accent/10 text-accent dark:bg-daccent/10 dark:text-daccent rounded-full font-medium">Current</span>
              ) : (
                <button className="text-xs text-danger hover:underline">Revoke</button>
              )}
            </div>
            <p className="text-xs text-muted-text dark:text-dMuted-text">{session.lastActive}</p>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

export default SessionsModal;
