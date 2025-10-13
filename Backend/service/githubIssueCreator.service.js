import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT
});

export const bugReportHandler = async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: "Title and description required" });
  }

  try {
    const issue = await octokit.issues.create({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      title: title,
      body: description,
      labels: tags || ["bug", "from-platform"]
    });

    res.json({ success: true, issueUrl: issue.data.html_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create GitHub issue" });
  }
};