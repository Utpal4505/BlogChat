import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../config/db.config.js";
import { sanitizeInput, sanitizePosts } from "../utils/HtmlSanitize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";

export const createPost = asyncHandler(async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userID = req.user.id;

    if (!title || !content) {
      throw new ApiError(400, "⚠️ Title and content are required");
    }

    if (!title || title.length < 3 || title.length > 150) {
      throw new ApiError(400, "Title must be between 3–150 characters");
    }

    if (!content || content.length < 20) {
      throw new ApiError(400, "Content must be at least 20 characters");
    }

    if (req.file && req.file.size > 5 * 1024 * 1024) {
      throw new ApiError(400, "Cover image must be smaller than 5MB");
    }

    const slug = slugify(title);

    const sanitizeContent = sanitizePosts(content);

    const coverImage = req?.file?.path;
    let coverImageUpload;

    if (coverImage) {
      coverImageUpload = await uploadToCloudinary(coverImage);
      if (!coverImageUpload) {
        return res
          .status(500)
          .json({ message: "Post CoverImage upload failed" });
      }
    }

    const post = await prisma.post.create({
      data: {
        title: title,
        content: sanitizeContent,
        authorId: userID,
        slug: slug,
        coverImage: coverImageUpload?.secure_url || null,
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        authorId: true,
        coverImage: true,
        postTags: true,
        commentCount: true,
        comments: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    if (tags && tags.length) {
      for (const tagName of tags) {
        const sanitizeTags = sanitizeInput(tagName);
        const createdTags = await prisma.tag.upsert({
          where: { name: sanitizeTags },
          update: {},
          create: { name: sanitizedTag },
        });

        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: createdTags.id,
          },
        });
      }
    }

    return res
      .status(201)
      .json(new ApiResponse(201, post, "✅ Post created Successfully"));
  } catch (error) {
    console.error("Error occurred while creating post:", error);
    throw new ApiError(500, "Something went wrong");
  }
});

export const deletePost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    if (!postId) throw new ApiError(400, "⚠️ Post ID is required");

    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      throw new ApiError(404, "❌ Post not found");
    }

    if (!post.authorId === userId) {
      throw new ApiError(403, "⛔ You are not allowed to delete this post");
    }

    const deletedPost = await prisma.post.delete({
      where: { id: post.id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "🗑️ Post deleted successfully"));
  } catch (error) {
    console.error("Error while deleting post:", error);
    throw new ApiError(500, "Something went wrong");
  }
});

export const updatePost = asyncHandler(async (req, res) => {
  try {
    const ALLOWED_UPDATES = ["title", "content", "coverImage"];
    const { Postid } = req.params;
    const userId = req.user.id;
    const updatesData = req.body;
    const filteredUpdates = {};

    for (const key of Object.keys(updatesData)) {
      if (ALLOWED_UPDATES.includes(key)) {
        if (key === "content" || key === "title") {
          filteredUpdates[key] = sanitizePosts(updatesData[key]);
        } else {
          filteredUpdates[key] = updatesData[key];
        }
      }
    }

    const coverImage = req?.file?.path;
    let coverImageUpload;

    if (coverImage) {
      coverImageUpload = await uploadToCloudinary(coverImage);
      if (!coverImageUpload) {
        return res
          .status(500)
          .json({ message: "Post CoverImage upload failed" });
      }
      filteredUpdates.coverImage = coverImageUpload.secure_url;
    }

    if (Object.keys(filteredUpdates).length === 0) {
      throw new ApiError(400, "⚠️ No valid fields to update");
    }

    if (
      (filteredUpdates.title && filteredUpdates.title.length < 3) ||
      filteredUpdates.title.length > 150
    ) {
      throw new ApiError(400, "Title must be between 3–150 characters");
    }

    if (filteredUpdates.content && filteredUpdates.content.length < 20) {
      throw new ApiError(400, "Content must be at least 20 characters");
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(Postid) },
    });

    if (!post) {
      throw new ApiError(404, "❌ Post not found");
    }

    if (post.authorId !== userId) {
      throw new ApiError(403, "🚫 Not authorized to update this post");
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(Postid) },
      data: {
        ...filteredUpdates,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        authorId: true,
        coverImage: true,
        commentCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedPost, "✅ Post updated successfully"));
  } catch (error) {
    console.error("Error while updating post:", error);
    throw new ApiError(500, "Something went wrong");
  }
});

export const getPostById = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        authorId: true,
        coverImage: true,
        commentCount: true,
        comments: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!post) {
      throw new ApiError(404, "❌ Post not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, post, "✅ Post fetched successfully"));
  } catch (error) {
    console.error("Error while fetching post:", error);
    throw new ApiError(500, "Something went wrong");
  }
});

export const getFeedPost = asyncHandler(async (req, res) => {
  try {
    let { limit = 10, cursor } = req.query;
    limit = parseInt(limit, 10);

    if (isNaN(limit) || limit < 1 || limit > 10) {
      limit = 10;
    }

    const queryOptions = {
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        authorId: true,
        coverImage: true,
        commentCount: true,
        createdAt: true,
        updatedAt: true,
      },
    };

    if (cursor) {
      queryOptions.skip = 1;
      queryOptions.cursor = { id: Number(cursor) };
    }

    const posts = await prisma.post.findMany(queryOptions);

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { posts, nextCursor },
          "✅ Feed posts fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error while fetching feed posts:", error);
    throw new ApiError(500, "Something went wrong");
  }
});
