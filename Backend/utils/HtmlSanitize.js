import sanitizeHtml from "sanitize-html";

// Plain text only, koi HTML tags allow nahi
export const sanitizeInput = (input) => {
  return sanitizeHtml(input, {
    allowedTags: [], // koi tag allow nahi
    allowedAttributes: {}, // koi attribute allow nahi
  });
};

export const sanitizePosts = (content) => {
  return sanitizeHtml(content, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "p",
      "ul",
      "li",
      "strong",
      "em",
      "blockquote",
      "code",
      "pre",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["https"],
  });
};
