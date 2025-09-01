import sanitizeHtml from "sanitize-html";

// Plain text only, koi HTML tags allow nahi
export const sanitizeInput = (input) => {
  return sanitizeHtml(input, {
    allowedTags: [],        // koi tag allow nahi
    allowedAttributes: {},  // koi attribute allow nahi
  });
};
