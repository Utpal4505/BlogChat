import { Octokit } from "@octokit/rest";
import { generateBugIssueTemplate } from "../utils/BugIssueTemplate.js";
import prisma from "../config/db.config.js";

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
const OWNER = process.env.GITHUB_OWNER || "your-github-username";
const REPO = process.env.GITHUB_REPO || "your-repo-name";

export const createGitHubIssue = async (bug, aiAnalysis) => {
  const body = generateBugIssueTemplate(bug, aiAnalysis);

  const issueParams = {
    owner: OWNER,
    repo: REPO,
    title: `[BUG] ${bug.title} (ID: ${bug.id})`,
    body,
    assignee: "Utpal4505", // use either assignee OR assignees
  };

  const MAX_RETRIES = 3;
  let attempt = 0;

  const aiTags = aiAnalysis.tags || [];

  const priority = aiAnalysis.summary?.priority || "P3";
  const severity = aiAnalysis.summary?.severity || "low";

  // Add labels based on AI analysis
  const labels = [
    `priority: ${priority}`,
    `severity: ${severity}`,
    ...aiTags.map((tag) => `${tag}`),
  ];

  while (attempt < MAX_RETRIES) {
    try {
      const issue = await octokit.issues.create(issueParams);

      // Save GitHub issue number in DB
      await prisma.bugReport.update({
        where: {
          id: bug.id,
        },
        data: {
          githubIssueNumber: issue.data.number,
        },
      });

      // Add labels to the created issue
      if (labels.length > 0) {
        await octokit.issues.addLabels({
          owner: OWNER,
          repo: REPO,
          issue_number: issue.data.number,
          labels: labels,
        });
      }

      return issue.data;
    } catch (error) {
      attempt++;
      console.warn(
        `GitHub issue creation failed (attempt ${attempt}):`,
        error.message
      );
      if (attempt >= MAX_RETRIES) {
        console.error("❌ GitHub issue creation failed permanently:", error);
        throw error;
      }
    }
  }
};
