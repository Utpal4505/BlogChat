import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { bugReportHandler } from "../service/githubIssueCreator.service.js";

const router = Router();

router.route("/").post(verifyJWT, bugReportHandler);

export default router;
