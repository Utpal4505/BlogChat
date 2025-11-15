import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const removeLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("❌ Failed to delete local file:", err);
    } else {
      console.log("🗑️ Local file deleted:", filePath);
    }
  });
};

const uploadToCloudinary = async (localFilePath, folder = "uploads") => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder,
    });

    removeLocalFile(localFilePath); // async cleanup
    return result;
  } catch (error) {
    removeLocalFile(localFilePath); // even on error cleanup
    console.error("Cloudinary upload error:", error);
    throw new ApiError(500, "Cloudinary upload failed");
  }
};

export { uploadToCloudinary };
