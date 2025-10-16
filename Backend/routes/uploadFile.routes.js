import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

/**
 * POST /api/upload-file
 * Accepts multiple files, uploads to Cloudinary, and returns array of secure URLs
 */
router.post(
  "/",
  upload.array("files"), // multer middleware
  asyncHandler(async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No files provided" });
      }

      const uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          const uploaded = await uploadToCloudinary(file.path);
          if (!uploaded) throw new Error("File upload failed");
          return { url: uploaded.secure_url, public_id: uploaded.public_id };
        })
      );

      return res.status(200).json({
        success: true,
        urls: uploadedFiles,
      });
    } catch (error) {
      console.error(
        "Somwthing went wrong while uploading files on cloudinary",
        error
      );
      return res.status(500).json({
        success: false,
        message: "Something went wrong while creating Bug",
      });
    }
  })
);

export default router;
