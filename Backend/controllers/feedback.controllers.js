import prisma from "../config/db.config.js";
import { sanitizer } from "../service/sanitizer.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";

export const createFeedback = asyncHandler(async (req, res) => {
  try {
    const { feedbackPayload, recaptchaToken } = req.body;

    if (!feedbackPayload || !recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: "Missing feedbackPayload or reCAPTCHA token",
      });
    }

    // 🔒 Sanitize user input
    const sanitizedFeedback = sanitizer(feedbackPayload);

    // 🤖 Verify reCAPTCHA
    const { data: verification } = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!verification.success)
      return res
        .status(403)
        .json({ success: false, message: "reCAPTCHA verification failed" });

    if (verification.score < 0.5)
      return res.status(403).json({
        success: false,
        message: "Low reCAPTCHA score — request looks suspicious.",
        score: verification.score,
      });

    // 🐞 Create Feedback Entry

    const createFeedback = await prisma.feedback.create({
      data: {
        userId: req.user.id,
        experienceMood: sanitizedFeedback.experience_mood,
        liked: sanitizedFeedback.liked,
        issues: sanitizedFeedback.issues,
        page: sanitizedFeedback.page_context,
        improvement: sanitizedFeedback.improvement_suggestion,
        hasBug: sanitizedFeedback.has_bug,
        bugDescription: sanitizedFeedback.bug_description,
        screenshotUrl: sanitizedFeedback.bug_screenshots,
        recommendScore: parseInt(sanitizedFeedback.nps_score, 10),
        metadata: sanitizedFeedback.metadata,
      },
    });

    console.log("Feedback created successfully", createFeedback);

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
