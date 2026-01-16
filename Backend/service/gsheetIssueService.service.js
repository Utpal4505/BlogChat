import { google } from "googleapis";

export const googleSheetIssueService = async ({
  bugReport,
  githubIssueNumber,
}) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "../gsheet_crendtial.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();

    const spreadsheetId = "1KK_j8tC8A3MAM6-I8kVCNAy96HDFd4v5ah1DHTLZDqw";

    const gSheets = google.sheets({
      version: "v4",
      auth: client,
    });

    // bugId	bugType	title	page	customPage	mood	userType	status	verificationScore	stepsToReproduce	consoleErrors	hasAttachments	userId
    const writeSheets = await gSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1!A:M",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            githubIssueNumber,
            bugReport.id,
            bugReport.bugType,
            bugReport.title,
            bugReport.page,
            bugReport.customPage,
            bugReport.mood,
            bugReport.userType,
            bugReport.status,
            bugReport.verificationScore,
            JSON.stringify(bugReport.stepsToReproduce),
            JSON.stringify(bugReport.consoleErrors),
            JSON.stringify(bugReport.attachments),
            bugReport.userId,
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Error writing to Google Sheet:", error);
  }
};
