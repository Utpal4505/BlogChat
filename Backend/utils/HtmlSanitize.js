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
      "span",
      "mark",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      span: ["style"],
      mark: ["style", "data-color", "class"],
    },
    allowedStyles: {
      span: {
        color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb/, /^rgba/, /^hsl/, /^hsla/],
        "background-color": [
          /^#[0-9a-fA-F]{3,6}$/,
          /^rgb/,
          /^rgba/,
          /^hsl/,
          /^hsla/,
        ],
      },
      mark: {
        color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb/, /^rgba/, /^hsl/, /^hsla/],
        "background-color": [
          /^#[0-9a-fA-F]{3,6}$/,
          /^rgb/,
          /^rgba/,
          /^hsl/,
          /^hsla/,
        ],
      },
    },
    allowedSchemes: ["https"],
  });
};
