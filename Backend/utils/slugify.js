import { nanoid } from "nanoid";

export function slugify(text, maxLength = 100) {
  const uniqueId = nanoid(6);

  const baseSlug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, "-") // spaces/underscores -> dashes
    .replace(/[^a-z0-9\-]/g, "") // remove everything except a-z, 0-9, dash
    .replace(/\-+/g, "-") // collapse multiple dashes
    .replace(/^-+|-+$/g, "") // remove leading/trailing dashes
    .substring(0, maxLength);

  // Generate short unique id (take only first 8 chars of UUID for readability)
  return `${baseSlug}-${uniqueId}`;
}
