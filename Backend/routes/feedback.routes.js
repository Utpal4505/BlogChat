import { Router } from "express";
import { createFeedback } from "../controllers/feedback.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/").post(verifyJWT, createFeedback);

export default router;
