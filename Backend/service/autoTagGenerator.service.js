import ollama from "ollama";

const SYSTEM_PROMPT = `
You are an expert content classifier and tag generator.
OUTPUT ONLY a JSON array of 5 concise, highly relevant tags.
DO NOT include any explanations, text, markdown, or code fences.
Each tag must reflect the main or nuanced topics in the blog content.
Prefer multi-word descriptive tags when appropriate (e.g., "Civic Engagement" instead of "Politics").
Ignore generic words such as "blog", "article", "post", "content".
Focus only on the most important topics; do not add extra or irrelevant tags.

Example valid output:
["Entrepreneurship", "Self-Doubt", "Adaptability"]

Blog content:
"""
{{BLOG_CONTENT}}
"""
`;

export const generateAutoTags = async ({ description }) => {
  try {
    if (!description) throw new Error("Blog description is required.");

    const truncatedContent =
      description.length > 2000 ? description.slice(0, 2000) : description;

    const response = await ollama.chat({
      model: "llama3:latest",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT.replace("{{BLOG_CONTENT}}", truncatedContent),
        },
        {
          role: "user",
          content: truncatedContent,
        },
      ],
    });

    let tags = [];

    let match = response.message.content.match(/\[.*?\]/s);

    if (!match) {
      const lines = response.message.content.split("\n");
      for (const line of lines) {
        if (line.trim().startsWith("[")) {
          try {
            tags = JSON.parse(line.trim());
            break;
          } catch {}
        }
      }
    }

    if (match) {
      try {
        tags = JSON.parse(match[0]);
      } catch (err) {
        console.warn("Failed to parse JSON from regex match:", err);
      }
    }

    if (!tags || !Array.isArray(tags)) tags = [];

    return tags;
  } catch (err) {
    console.error("Auto-tag generation failed:", err);
    return [];
  }
};
