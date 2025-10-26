// components/settings/tabs/AccountSettings.jsx
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import SettingItem from "../shared/SettingItem";
import EmailModal from "../modals/EmailModal";
import UsernameModal from "../modals/UsernameModal";
import ProfileModal from "../modals/ProfileModal";
import BioModal from "../modals/BioModal";
import DeleteAccountModal from "../modals/DeleteAccountModal";

const AccountSettings = ({
    user,
}) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [username, setUsername] = useState(user?.username || "johndoe");
  const [name, setName] = useState(user?.name || "John Doe");
  const [bio, setBio] = useState(user?.bio || "Web Developer | Building BlogChat 🚀");
  const [profileImage, setProfileImage] = useState(
    user?.avatar || "https://i.pravatar.cc/120?img=10"
  );

  return (
    <>
      <div className="max-w-2xl space-y-0">
        <SettingItem
          title="Email address"
          value={user?.email || "johndoe@example.com"}
          onClick={() => setShowEmailModal(true)}
        />

        <SettingItem
          title="Username"
          description={`blogchat.com/${username}`}
          value={`${username}`}
          onClick={() => setShowUsernameModal(true)}
        />

        <SettingItem
          title="Profile information"
          description="Edit your photo and name"
          onClick={() => setShowProfileModal(true)}
          rightContent={
            <div className="flex items-center gap-3">
              <span className="text-sm text-text dark:text-dText font-medium">
                {name}
              </span>
              <img
                src={profileImage}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
          }
        />

        <SettingItem
          title="Short bio"
          description={bio || "Add a short bio to your profile"}
          onClick={() => setShowBioModal(true)}
          icon={
            <ChevronRight className="w-5 h-5 text-muted-text dark:text-dMuted-text" />
          }
        />

        <SettingItem
          title="Delete account"
          description="Permanently delete your account and all data"
          onClick={() => setShowDeleteModal(true)}
          isDanger
          icon={<ChevronRight className="w-5 h-5 text-danger" />}
        />
      </div>

      <EmailModal
        show={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        email={"utpalkumar@example.com"}
      />
      <UsernameModal
        show={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        username={username}
        setUsername={setUsername}
      />
      <ProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        name={name}
        setName={setName}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
      />
      <BioModal
        show={showBioModal}
        onClose={() => setShowBioModal(false)}
        bio={bio}
        setBio={setBio}
      />
      <DeleteAccountModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default AccountSettings;
