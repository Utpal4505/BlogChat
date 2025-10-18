import { Router } from "express";
import { createBugReport } from "../service/bugReport.service.js";
import { bugReportLimiter } from "../middlewares/rateLimiters.middlewares.js";
import { verifyJWTSoft } from "../middlewares/verifyJWTSoft.middlewares.js";

const router = Router();

router.route("/").post(verifyJWTSoft, bugReportLimiter, createBugReport);

export default router;
