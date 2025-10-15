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
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files provided" });
    }

    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const uploaded = await uploadToCloudinary(file.path);
        if (!uploaded) throw new Error("File upload failed");
        return uploaded.secure_url;
      })
    );

    return res.status(200).json({
      success: true,
      urls: uploadedFiles,
    });
  })
);

export default router;
