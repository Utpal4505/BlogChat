import { sanitizeInput } from "../utils/HtmlSanitize.js";
import { isValidPublicId } from "../utils/trustedDomains.js";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "utpall";

export const sanitizer = (data) => {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") return sanitizeInput(data);

  if (typeof data === "number" || typeof data === "boolean") return data;

  if (Array.isArray(data)) return data.map((item) => sanitizer(item)); // recursive

  if (typeof data === "object") {
    // Case: object has public_id → reconstruct URL, ignore client url
    if ("public_id" in data) {
      const pid = data.public_id;
      if (isValidPublicId(pid)) {
        return {
          public_id: pid,
          url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${pid}.jpg`,
        };
      } else {
        return { public_id: "", url: "" }; // invalid public_id
      }
    }

    // Normal object → sanitize keys/values recursively
    const cleanObj = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const safeKey = sanitizeInput(String(key));
        cleanObj[safeKey] = sanitizer(data[key]);
      }
    }
    return cleanObj;
  }

  return data; // fallback
};
