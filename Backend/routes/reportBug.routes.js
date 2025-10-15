import { Router } from "express";
import { createBugReport } from "../service/bugReport.service.js";
import { bugReportLimiter } from "../middlewares/rateLimiters.middlewares.js";
import { verifyJWTSoft } from "../middlewares/verifyJWTSoft.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/").post(verifyJWTSoft, bugReportLimiter,upload.array("attachments") , createBugReport);

export default router;
