import ollama from "ollama";

const SYSTEM_PROMPT = `You are an expert software engineer acting as an automated bug triage, enrichment, and prioritization system.

You will receive a raw bug report object generated directly from a production application.
The report may include structured and unstructured fields such as:
- id, title, bugType, description
- stepsToReproduce
- page / customPage
- userType, mood, verificationScore
- attachments, consoleErrors
- metadata (os, browser, browser_version, url, device_type, performance, timestamps)
- status and timestamps

Your responsibilities:

1. Fully understand the bug using ALL available signals (description, steps, metadata, console errors, telemetry).
2. Rewrite the issue into a clear, professional, developer-readable summary.
3. Correct misclassified bug types if necessary (e.g., visual vs functional vs performance vs security).
4. Generate accurate, meaningful tags based on:
   - corrected bug type
   - affected feature or flow
   - platform and environment (browser, OS, device)
   - NOT the originally submitted bugType if it is incorrect.
5. Assess severity based on:
   - impact on core functionality
   - authentication, data integrity, or security implications
   - reproducibility
   - affected user type (guest vs verified)
6. Assign priority using engineering urgency:
   - P0 → data loss, security risk, system unusable
   - P1 → core feature broken, no workaround
   - P2 → partial failure, workaround exists
   - P3 → cosmetic or low-impact issue
7. Enrich the report with actionable technical insights that help developers debug immediately.
8. Prefer specific, plausible root-cause hypotheses when metadata supports it.
9. Be objective and technical. Do NOT repeat user emotions. Do NOT invent facts.

---

### SEVERITY GUIDELINES

- "low" → cosmetic issues, UI alignment, copy issues
- "medium" → degraded experience, partial feature failure, performance degradation
- "high" → authentication failure, crashes, data loss, security-sensitive behavior, core flows blocked

---

### TAGGING RULES (IMPORTANT)

- Tags MUST reflect the corrected understanding of the bug.
- Include feature-level tags (e.g., login, feed, dashboard).
- Include environment tags derived from metadata (e.g., chrome, safari, windows, mobile).
- Do NOT include misleading tags (e.g., "visual" for functional failures).
- All tags must be lowercase, concise, and developer-friendly.

---

### IMPACT ANALYSIS RULES

- "user_impact" MUST be a short explanatory sentence.
- "business_impact" MUST explain risk or consequence in practical terms.
- "affected_users" MUST be one of the allowed enum values and inferred logically.

---

### OUTPUT RULES (STRICT)

IMPORTANT:
- Output ONLY the JSON object.
- Do NOT include explanations, introductions, or summaries.
- Do NOT include phrases like "Here is the output".
- The response MUST start with '{' and end with '}'.
- Any text outside JSON is strictly forbidden.


---

### REQUIRED OUTPUT FORMAT

{
  "summary": {
    "clean_title": string,
    "bug_type": string,
    "severity": "low" | "medium" | "high",
    "priority": "P0" | "P1" | "P2" | "P3"
  },
  "tags": [string],
  "impact_analysis": {
    "user_impact": string,
    "business_impact": string,
    "affected_users": "all" | "some" | "edge_cases" | "unknown"
  },
  "technical_analysis": {
    "affected_area": "frontend" | "backend" | "api" | "database" | "auth" | "infrastructure" | "unknown",
    "possible_root_cause": string | null,
    "reproducibility": "always" | "sometimes" | "rare" | "unknown"
  },
  "developer_notes": {
    "recommended_next_action": string,
    "debugging_hints": string | null
  },
  "confidence_score": number
}
`;

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}$/);
  return match ? JSON.parse(match[0]) : null;
}

export const generateBugReport = async ({ BugReport }) => {
  try {
    if (!BugReport) {
      throw new Error("BugReport is required");
    }

    const response = await ollama.chat({
      model: "mistral:7b",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `
                       id: ${BugReport.id},
                       bugType: '${BugReport.bugType}',
                       title: '${BugReport.title}',
                       description: """${BugReport.description}""",
                       page: '${BugReport.page}',
                       customPage: '${BugReport.customPage}',
                       mood: '${BugReport.mood}',
                       userType: '${BugReport.userType}',
                       userId: ${BugReport.userId},
                       attachments: ${JSON.stringify(BugReport.attachments)},
                       verificationScore: ${BugReport.verificationScore},
                       stepsToReproduce: ${JSON.stringify(
                         BugReport.stepsToReproduce
                       )},
                       metadata: ${JSON.stringify(BugReport.metadata)},
                       consoleErrors: ${JSON.stringify(
                         BugReport.consoleErrors
                       )},
                       status: '${BugReport.status}'
                       timestamps: '${BugReport.createdAt}', '${
            BugReport.updatedAt
          }'
             `,
        },
      ],
    });

    let parsedOutput;

    try {
      parsedOutput = extractJSON(response.message.content);
    } catch (err) {
      console.error("Failed to parse JSON from bug report response:", err);
      throw new Error("Invalid response format from AI service");
    }

    return parsedOutput;
  } catch (error) {
    console.error("Error generating bug report:", error);
    throw error;
  }
};

const dummyBugReport = {
  id: "BUG-1027",
  bugType: "visual", // intentionally wrong
  title: "Dashboard freezes after clicking Export",
  description: `
When I click the Export button on the analytics dashboard, the page freezes.
The spinner keeps loading forever and I have to refresh the page.
After refresh, sometimes my filters are reset.
This happens mostly in Chrome.
`,
  page: "/dashboard/analytics",
  customPage: "analytics-export",
  mood: "frustrated",
  userType: "verified",
  userId: 88421,
  attachments: [
    {
      type: "screenshot",
      url: "https://example.com/screenshots/export-freeze.png",
    },
  ],
  verificationScore: 0.92,
  stepsToReproduce: [
    "Login as a verified user",
    "Navigate to Analytics Dashboard",
    "Apply date filter (last 30 days)",
    "Click on Export → CSV",
    "Observe spinner loading indefinitely",
  ],
  metadata: {
    os: "Windows 11",
    browser: "Chrome",
    browser_version: "120.0.6099.71",
    device_type: "desktop",
    url: "https://app.example.com/dashboard/analytics",
    performance: {
      ttfb_ms: 180,
      api_latency_ms: 4200,
    },
    timestamp: "2026-01-12T14:22:11.000Z",
  },
  consoleErrors: [
    "POST https://api.example.com/export 504 (Gateway Timeout)",
    "Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'status')",
  ],
  status: "open",
  createdAt: "2026-01-12T14:22:11.000Z",
  updatedAt: "2026-01-12T14:24:55.000Z",
};

generateBugReport({ BugReport: dummyBugReport })
  .then((data) => console.log(data))
  .catch(console.error);
