# 🐛 Bug Report: ${title}

<table>
<tr>
<td><b>Status</b></td>
<td><code>${status}</code></td>
<td><b>Type</b></td>
<td><code>${bugType}</code></td>
</tr>
<tr>
<td><b>Mood</b></td>
<td><code>${mood || "N/A"}</code></td>
<td><b>User Type</b></td>
<td><code>${userType}</code></td>
</tr>
<tr>
<td><b>Score</b></td>
<td><code>${verificationScore || "N/A"}</code></td>
<td><b>Report ID</b></td>
<td><code>${reportId}</code></td>
</tr>
</table>

**Reported:** ${timestamp}

---

## 📝 Description

${description}

---

## 🔄 How to Reproduce

${stepsSection}

---

## 📸 Visual Evidence

${attachmentsSection}

---

## ⚠️ Console Errors

${consoleErrorsSection}

---

## 🖥️ Technical Environment

<details>
<summary><b>📊 View Metadata</b></summary>

<br>

${metadataSection}

</details>

---

## 💡 Investigation Checklist

- [ ] Verify reproduction steps
- [ ] Review console errors  
- [ ] Check visual evidence
- [ ] Test in reported environment

---

<sub>🤖 Auto-generated • BlogChat Bug System • ID: ${reportId}</sub>