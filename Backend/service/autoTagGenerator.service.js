import ollama from "ollama";

const SYSTEM_PROMPT = `
You are an expert content classifier and tag generator.
OUTPUT ONLY a JSON array of 5 concise, highly relevant tags.
DO NOT include any explanations, text, markdown, or code fences.
Each tag must reflect the main or nuanced topics in the blog content.
Prefer multi-word descriptive tags when appropriate (e.g., "Civic Engagement" instead of "Politics").
Ignore generic words such as "blog", "article", "post", "content".
Focus only on the most important topics; do not add extra or irrelevant tags.

Example valid output:
["Entrepreneurship", "Self-Doubt", "Adaptability"]

Blog content:
"""
{{BLOG_CONTENT}}
"""
`;

export const generateAutoTags = async ({ description }) => {
  try {
    if (!description) throw new Error("Blog description is required.");

    const truncatedContent =
      description.length > 2000 ? description.slice(0, 2000) : description;

    const response = await ollama.chat({
      model: "mistral:7b",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT.replace("{{BLOG_CONTENT}}", truncatedContent),
        },
        {
          role: "user",
          content: truncatedContent,
        },
      ],
    });

    let tags = [];

    let match = response.message.content.match(/\[.*?\]/s);

    if (!match) {
      const lines = response.message.content.split("\n");
      for (const line of lines) {
        if (line.trim().startsWith("[")) {
          try {
            tags = JSON.parse(line.trim());
            break;
          } catch {}
        }
      }
    }

    if (match) {
      try {
        tags = JSON.parse(match[0]);
      } catch (err) {
        console.warn("Failed to parse JSON from regex match:", err);
      }
    }

    if (!tags || !Array.isArray(tags)) tags = [];

    return tags;
  } catch (err) {
    console.error("Auto-tag generation failed:", err);
    return [];
  }
};

const dummy_data = `Relational Databases
Relational databases are based on the relational model, which organizes data into tables with rows and columns. These databases have been the standard choice for many applications due to their robust consistency, support for complex queries, and adherence to ACID properties (Atomicity, Consistency, Isolation, Durability). Key features and benefits of relational databases include:

Structured data organization: Data in relational databases is stored in tables with a predefined schema, enforcing a consistent structure throughout the database. This organization makes it easier to manage and maintain data, especially when dealing with large amounts of structured data.

Relationships and referential integrity: The relationships between tables in a relational database are defined by primary and foreign keys, ensuring referential integrity. This feature allows for efficient querying of related data and supports complex data relationships.

SQL support: Relational databases use Structured Query Language (SQL) for querying, manipulating, and managing data. SQL is a powerful and widely adopted language that enables developers to perform complex queries and data manipulations.

Transactions and ACID properties: Relational databases support transactions, which are sets of related operations that either succeed or fail as a whole. This feature ensures the ACID properties – Atomicity, Consistency, Isolation, and Durability – are maintained, guaranteeing data consistency and integrity.

Indexing and optimization: Relational databases offer various indexing techniques and query optimization strategies, which help improve query performance and reduce resource consumption.

Relational databases also have some drawbacks:

Limited scalability: Scaling relational databases horizontally (adding more nodes) can be challenging, especially when compared to some NoSQL databases that are designed for distributed environments.

Rigidity: The predefined schema in relational databases can make it difficult to adapt to changing requirements, as altering the schema may require significant modifications to existing data and applications.

Performance issues with large datasets: As the volume of data grows, relational databases may experience performance issues, particularly when dealing with complex queries and large-scale data manipulations.

Inefficient for unstructured or semi-structured data: Relational databases are designed for structured data, which may not be suitable for managing unstructured or semi-structured data, such as social media data or sensor data.

Popular relational databases include MySQL, PostgreSQL, Microsoft SQL Server, and Oracle. Each of these options has its unique features, strengths, and weaknesses, making them suitable for different use cases and requirements. When considering a relational database, it is essential to evaluate the specific needs of the application in terms of data consistency, support for complex queries, and scalability, among other factors.`

generateAutoTags({ description: dummy_data }).then((data) => console.log(data));