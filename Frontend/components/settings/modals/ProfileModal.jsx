// components/settings/modals/ProfileModal.jsx
import React, { useState, useEffect, useContext } from "react";
import { Upload, Camera, Loader2 } from "lucide-react";
import ModalWrapper from "../shared/ModalWrapper";
import { uploadFilesToServer } from "../../../utils/UploadFileToServer";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";

const ProfileModal = ({
  show,
  onClose,
  name,
  setName,
  profileImage,
  setProfileImage,
}) => {
  const [newName, setNewName] = useState(name);
  const [tempImage, setTempImage] = useState(profileImage);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { updateUserProfile } = useContext(AuthContext);

  // Reset state when modal opens
  useEffect(() => {
    if (show) {
      setNewName(name);
      setTempImage(profileImage);
      setUploadedUrl(null);
      setIsUploading(false);
    }
  }, [show, name, profileImage]);

  const handleSave = async () => {
    // Prevent save if upload is still in progress
    if (isUploading) {
      toast.error("Please wait for image upload to complete");
      return;
    }

    try {
      const finalImageUrl = uploadedUrl || tempImage;

      await updateUserProfile({
        name: newName,
        avatarUrl: finalImageUrl,
      });

      // Update parent state
      setName(newName);
      setProfileImage(finalImageUrl);

      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const oldImage = tempImage;
    setIsUploading(true);

    try {
      // 1. Show preview immediately (optimistic UI)
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);

      // 2. Upload to server
      const uploaded = await uploadFilesToServer([file], "avatars");

      // 3. Validate upload response
      if (!uploaded || uploaded.length === 0 || !uploaded[0].url) {
        throw new Error("Invalid upload response");
      }

      const url = uploaded[0].url;

      // 4. Update with actual uploaded URL
      setTempImage(url);
      setUploadedUrl(url);

      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);

      // Revert to old image on error
      setTempImage(oldImage);
      setUploadedUrl(null);

      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Prevent closing if upload is in progress
  const handleClose = () => {
    if (isUploading) {
      toast.error("Please wait for image upload to complete");
      return;
    }
    onClose();
  };

  return (
    <ModalWrapper
      show={show}
      onClose={handleClose}
      title="Profile information"
      footer={
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="flex-1 px-4 py-2.5 border border-bordercolor dark:border-dbordercolor rounded-lg text-text dark:text-dText hover:bg-card/20 dark:hover:bg-dcard/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUploading}
            className="flex-1 px-4 py-2.5 bg-accent dark:bg-daccent text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text dark:text-dText mb-4">
            Profile photo
          </label>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={tempImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-bordercolor dark:border-dbordercolor"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              {!isUploading && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              <label
                className={`flex items-center justify-center gap-2 px-4 py-2.5 border border-bordercolor dark:border-dbordercolor rounded-lg text-sm text-text dark:text-dText hover:bg-card/20 dark:hover:bg-dcard/20 transition-colors font-medium ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload new photo
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <p className="text-xs text-muted-text dark:text-dMuted-text mt-2">
                JPG, PNG or GIF. Max 5MB
              </p>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text dark:text-dText mb-3">
            Name
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={isUploading}
            className="w-full px-4 py-3 border border-bordercolor dark:border-dbordercolor rounded-lg bg-bg dark:bg-dbg text-text dark:text-dText focus:outline-none focus:border-accent dark:focus:border-daccent transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Your name"
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ProfileModal;
