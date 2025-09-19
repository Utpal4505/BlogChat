export function slugify(text, maxLength = 100) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, "-")       // spaces/underscores -> dashes
    .replace(/[^a-z0-9\-]/g, "")    // remove everything except a-z, 0-9, dash
    .replace(/\-+/g, "-")           // collapse multiple dashes
    .replace(/^-+|-+$/g, "")        // remove leading/trailing dashes
    .substring(0, maxLength);       // enforce max length
}