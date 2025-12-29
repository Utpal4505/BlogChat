import { Worker } from "bullmq";
import IORedis from "ioredis";
import { generateAutoTags } from "../service/autoTagGenerator.service.js";
import prisma from "../config/db.config.js";
import { sanitizeInput, sanitizePosts } from "../utils/HtmlSanitize.js";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const autoTagWorker = new Worker(
  "tag-generation",
  async (job) => {

    const { postId } = job.data;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error(`Post with ID ${postId} not found.`);
    }

    if (post.postTagStatus === "READY") return;

    let autoTag = [];
    try {
      const autoGenTag = await generateAutoTags({
        description: sanitizePosts(post.content),
      });

      autoTag = autoGenTag.slice(0, 5);

      for (const tagName of autoTag) {
        const sanitizeTags = sanitizeInput(tagName);

        const tag = await prisma.tag.upsert({
          where: { name: sanitizeTags },
          update: {},
          create: { name: sanitizeTags },
        });

        await prisma.postTag.upsert({
          where: {
            postId_tagId: {
              postId: post.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }

      await prisma.post.update({
        where: { id: post.id },
        data: {
          postTagStatus: "READY",
        },
      });
    } catch (err) {
      console.error(`Error generating tags for post ID ${postId}:`, err);
      await prisma.post.update({
        where: { id: post.id },
        data: {
          postTagStatus: "FAILED",
        },
      });

      throw err;
    }
  },
  {
    connection,
  }
);
