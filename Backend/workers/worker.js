import { Worker } from "bullmq";
import IORedis from "ioredis";
import { generateAutoTags } from "../service/autoTagGenerator.service.js";
import prisma from "../config/db.config.js";
import { sanitizeInput, sanitizePosts } from "../utils/HtmlSanitize.js";
import { generateBugReport } from "../service/aiBugReportChecker.service.js";
import { createGitHubIssue } from "../service/githubIssueService.service.js";
import { googleSheetIssueService } from "../service/gsheetIssueService.service.js";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

console.log("Worker is running");

export const autoTagWorker = new Worker(
  "tag-generation",
  async (job) => {
    const { postId } = job.data;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error(`Post with ID ${postId} not found.`);
    }

    if (post.postTagStatus === "READY") return;

    let autoTag = [];
    try {
      const autoGenTag = await generateAutoTags({
        description: sanitizePosts(post.content),
      });

      autoTag = autoGenTag.slice(0, 5);

      for (const tagName of autoTag) {
        const sanitizeTags = sanitizeInput(tagName);

        const tag = await prisma.tag.upsert({
          where: { name: sanitizeTags },
          update: {},
          create: { name: sanitizeTags },
        });

        await prisma.postTag.upsert({
          where: {
            postId_tagId: {
              postId: post.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }

      await prisma.post.update({
        where: { id: post.id },
        data: {
          postTagStatus: "READY",
        },
      });
    } catch (err) {
      console.error(`Error generating tags for post ID ${postId}:`, err);
      await prisma.post.update({
        where: { id: post.id },
        data: {
          postTagStatus: "FAILED",
        },
      });

      throw err;
    }
  },
  {
    connection,
  }
);

export const bugReportWorker = new Worker(
  "bug-report-processing",
  async (job) => {
    try {
      console.log("bug report process start");
      const { bugReportId } = job.data;

      const ReportedBug = await prisma.bugReport.findUnique({
        where: {
          id: bugReportId,
        },
      });

      if (!ReportedBug) {
        throw new Error(`Bug Report with ID ${bugReportId} not found.`);
      }

      // calling ai for generate report

      const aiGeneratedReport = await generateBugReport({
        BugReport: ReportedBug,
      });

      const githubIssue = await createGitHubIssue(
        ReportedBug,
        aiGeneratedReport
      );

      await googleSheetIssueService({
        bugReport: ReportedBug,
        githubIssueNumber: githubIssue.number,
      });

      await prisma.bugReport.update({
        where: {
          id: bugReportId,
        },
        data: {
          githubIssueNumber: githubIssue.number,
          queueStatus: "COMPLETED",
        },
      });
    } catch (error) {
      console.error("Error processing bug report job:", error);

      await prisma.bugReport.update(
        {
          where: {
            id: job.data.bugReportId,
          },
          data: {
            queueStatus: "FAILED",
          },
        },
        {
          connection,
        }
      );
    }
  },{
    connection,
  }
);
