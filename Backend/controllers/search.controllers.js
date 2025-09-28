import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../config/db.config.js";
import { sanitizeInput } from "../utils/HtmlSanitize.js";

export const Search = asyncHandler(async (req, res) => {
  try {
    let { input } = req.query;

    input = input?.trim();

    if (!input || input.length < 1) {
      return res.status(400).json({ message: "Query is required" });
    }

    const sanitizeInput = sanitizeInput(input);

    const users = await prisma.user.findMany({
      where: { username: { contains: sanitizeInput, mode: "insensitive" } },
      take: 10,
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
      },
    });

    const posts = await prisma.post.findMany({
      where: { title: { contains: sanitizeInput, mode: "insensitive" } },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
    });

    const tags = await prisma.tag.findMany({
      where: { name: { contains: sanitizeInput, mode: "insensitive" } },
      take: 10,
      select: {
        id: true,
        name: true,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { users, posts, tags }, "✅ Auto-suggest results")
      );
  } catch (error) {
    console.log("Something went wrong while searching", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});
