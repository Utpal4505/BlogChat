export const TRUSTED_DOMAINS = [
  "res.cloudinary.com",
  "youtube.com",
  "youtu.be",
  "mycdn.example.com",
];

export const isTrustedUrl = (str) => {
  try {
    const url = new URL(str);
    return TRUSTED_DOMAINS.some((domain) => url.hostname.endsWith(domain));
  } catch {
    return false;
  }
};

// basic public_id validator for MVP
export const isValidPublicId = (id) => {
  if (typeof id !== "string") return false;
  if (id.includes("..")) return false; // no path traversal
  return /^[A-Za-z0-9\-_.\/]+$/.test(id); // safe characters only
};
