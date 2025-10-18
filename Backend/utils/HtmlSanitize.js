import sanitizeHtml from "sanitize-html";

export const sanitizeInput = (input) => {
  if (!input || typeof input !== "string") return "";
  return sanitizeHtml(input, {
    allowedTags: [], // no HTML allowed
    allowedAttributes: {}, // no attributes
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
