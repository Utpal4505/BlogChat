import prisma from "../config/db.config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import { sanitizeInput } from "../utils/HtmlSanitize.js";
import { createGitHubIssue } from "./githubIssueService.service.js";
import { googleSheetIssueService } from "./gsheetIssueService.service.js";

export const createBugReport = asyncHandler(async (req, res) => {
  try {
    const { bugPayload, recaptchaToken } = req.body;
    const userType = req.user ? "VERIFIED" : "UNVERIFIED";

    if (!bugPayload || !recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: "Missing bugPayload or reCAPTCHA token",
      });
    }

    // 🔒 Sanitize user input
    const Title = sanitizeInput(bugPayload.Title);
    const Description = sanitizeInput(bugPayload.Description);
    const Page = sanitizeInput(bugPayload.Page);
    const customPage = sanitizeInput(bugPayload.Custom_Page);
    const sanitizedSteps = (bugPayload.Steps_to_reproduce || []).map((step) =>
      sanitizeInput(step)
    );

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

    // 📎 Use uploaded URLs from frontend
    const attachmentsUpload = Array.isArray(bugPayload.Attachments)
      ? bugPayload.Attachments
      : [];

    // 🐞 Create Bug Report
    const createBug = await prisma.bugReport.create({
      data: {
        bugType: bugPayload.Bugtype,
        title: Title,
        description: Description,
        page: Page,
        customPage: customPage,
        mood: bugPayload.Mood,
        userType,
        status: "OPEN",
        verificationScore: verification.score,
        attachments: attachmentsUpload.length ? attachmentsUpload : null,
        stepsToReproduce: sanitizedSteps,
        userId: req.user?.id || null,
        metadata: bugPayload.Metadata,
        consoleErrors: bugPayload.Metadata.Console_err || [{}],
      },
    });

    const githubIssue = await createGitHubIssue(createBug);

    await googleSheetIssueService({ bugReport: createBug, githubIssueNumber: githubIssue.number });

    return res.status(201).json({
      success: true,
      message: "Bug report created successfully",
      bugId: createBug.id,
      githubIssueUrl: githubIssue.html_url,
    });
  } catch (error) {
    console.error("Something went wrong while creating Bug", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating Bug",
    });
  }
});
