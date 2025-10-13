import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../config/db.config.js";
import { sanitizeInput, sanitizePosts } from "../utils/HtmlSanitize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";
import { uploadToCloudinary } from "../utils/Cloudinary.js";

export const createPost = asyncHandler(async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userID = req.user.id;

    if (!title || !content) {
      throw new ApiError(400, "⚠️ Title and content are required");
    }

    if (!title || title.length < 10 || title.length > 150) {
      throw new ApiError(400, "Title must be between 10–150 characters");
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
          create: { name: sanitizeTags },
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
        author: { select: {} },
        coverImage: true,
        commentCount: true,
        comments: true,
        createdAt: true,
        updatedAt: true,
      },
      include: {
        _count: {
          select: { postLikes: true, comments: true },
        },
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

    const userId = req.user?.id || null;

    let allowedAuthorIds = [];
    if (userId) {
      const followers = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      allowedAuthorIds = followers.map((f) => f.followingId);
      allowedAuthorIds.push(userId); // owner bhi allowed
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
      where: userId
        ? {
            OR: [
              { visibility: "PUBLIC" },
              { visibility: "PRIVATE", authorId: { in: allowedAuthorIds } },
            ],
          }
        : { visibility: "PUBLIC" },
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

export const getPostsByTag = asyncHandler(async (req, res) => {
  try {
    const { tagName } = req.params;
    const userId = req.user?.id || null;

    // followers fetch
    let allowedAuthorIds = [];
    if (userId) {
      const followers = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      allowedAuthorIds = followers.map((f) => f.followingId);
      allowedAuthorIds.push(userId);
    }

    const tag = await prisma.tag.findFirst({
      where: { name: { equals: tagName, mode: "insensitive" } },
      include: {
        postTags: {
          include: {
            post: {
              select: {
                id: true,
                title: true,
                slug: true,
                publishedAt: true,
                createdAt: true,
                visibility: true,
                authorId: true,
              },
            },
          },
        },
      },
    });

    if (!tag) throw new ApiError(404, "⚠️ Tag not found");

    // Filter posts based on visibility + allowed authors
    const posts = tag.postTags
      .map((pt) => pt.post)
      .filter(
        (post) =>
          post.visibility === "PUBLIC" ||
          (userId &&
            post.visibility === "PRIVATE" &&
            allowedAuthorIds.includes(post.authorId))
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          tag: { name: tag.name, postCount: posts.length },
          posts,
        },
        `✅ Found ${posts.length} post(s) for tag '${tag.name}'`
      )
    );
  } catch (error) {
    console.error("❌ Failed to fetch posts by tag", error);
    throw new ApiError(500, "Something went wrong while fetching tag posts");
  }
});

export const searchBasedDetail = asyncHandler(async (req, res) => {
  try {
    const { query, type, cursor } = req.query;
    const userId = req.user?.id || null;
    const limit = 10;

    // followers fetch
    let allowedAuthorIds = [];
    if (userId) {
      const followers = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      allowedAuthorIds = followers.map((f) => f.followingId);
      allowedAuthorIds.push(userId);
    }

    const whereCondtn = {
      title: { contains: query, mode: "insensitive" },
      OR: [
        { visibility: "PUBLIC" },
        ...(userId
          ? [{ visibility: "PRIVATE", authorId: { in: allowedAuthorIds } }]
          : []),
      ],
    };

    const results = await prisma.post.findMany({
      where: whereCondtn,
      take: limit,
      orderBy: { createdAt: "desc" },
      ...(cursor && { cursor: { id: Number(cursor) }, skip: 1 }),
    });

    const nextCursor =
      results.length === limit ? results[results.length - 1].id : null;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { results, nextCursor },
          "✅ Search query fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error while fetching search query:", error);
    throw new ApiError(500, "Something went wrong");
  }
});

export const postFiltering = asyncHandler(async (req, res) => {
  try {
    const {
      query,
      type = "post",
      sort = "newest",
      time = "all",
      cursor,
    } = req.query;
    const userId = req.user?.id || null;
    const limit = 10;

    if (type !== "post") {
      return res.status(400).json({ message: "Invalid type" });
    }

    // followers fetch
    let allowedAuthorIds = [];
    if (userId) {
      const followers = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      allowedAuthorIds = followers.map((f) => f.followingId);
      allowedAuthorIds.push(userId);
    }

    // ----------Sorting------------
    let orderBy = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "trending") orderBy = { commentCount: "desc" };
    if (sort === "popular") orderBy = { createdAt: "desc" }; // Will sort manually later

    // ----------Time filter------------
    let dateFilter = {};
    const now = new Date();
    if (time === "day")
      dateFilter = {
        publishedAt: { gte: new Date(now - 1 * 24 * 60 * 60 * 1000) },
      };
    if (time === "week")
      dateFilter = {
        publishedAt: { gte: new Date(now - 7 * 24 * 60 * 60 * 1000) },
      };
    if (time === "month")
      dateFilter = {
        publishedAt: { gte: new Date(now - 30 * 24 * 60 * 60 * 1000) },
      };

    const posts = await prisma.post.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
        status: "PUBLISHED",
        OR: [
          { visibility: "PUBLIC" },
          ...(userId
            ? [{ visibility: "PRIVATE", authorId: { in: allowedAuthorIds } }]
            : []),
        ],
        ...dateFilter,
      },
      include: {
        _count: { select: { postLikes: true, comments: true } },
      },
      take: limit,
      ...(cursor && { cursor: { id: Number(cursor) }, skip: 1 }),
      orderBy,
    });

    let sortedPosts = posts;

    // Manual sorting for popular
    if (sort === "popular") {
      sortedPosts = posts.sort(
        (a, b) =>
          b._count.postLikes +
          b._count.comments -
          (a._count.postLikes + a._count.comments)
      );
    }

    const nextCursor =
      sortedPosts.length > 0 ? sortedPosts[sortedPosts.length - 1].id : null;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { posts: sortedPosts, nextCursor },
          "✅ Posts filtered successfully"
        )
      );
  } catch (error) {
    console.error("Error while filtering posts:", error);
    throw new ApiError(500, "Something went wrong");
  }
});

export const postLike = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userID = req.user.id;

    postId = Number(postId);

    const isPostExist = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!isPostExist) {
      return res.status(404).json({ message: "❌ Post not found." });
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          postId: postId,
          userId: userID,
        },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      return res
        .status(200)
        .json(new ApiResponse(200, { liked: false }, "👎 Post unliked"));
    }

    const newLike = await prisma.postLike.create({
      data: {
        postId: postId,
        userId: userID,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { Liked: true }, "👍 Post liked"));
  } catch (error) {
    console.error("❌ Failed to toggle like", error);
    throw new ApiError(500, "Something went wrong");
  }
});

export const createPostComment = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const userId = req.user.id;

    const sanitizeContent = sanitizeInput(content);

    postId = Number(postId);

    const isPostExist = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!isPostExist) {
      return res.status(404).json({ message: "❌ Post not found." });
    }

    const newPostCommentCreate = await prisma.comment.create({
      data: {
        content: sanitizeContent,
        postId: postId,
        authorId: userId,
      },
      select: {
        id: true,
        content: true,
        postId: true,
        createdAt: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          newPostCommentCreate,
          "✅ Comment added successfully"
        )
      );
  } catch (error) {
    console.error("❌ Failed to adding comment", error);
    throw new ApiError(500, "Something went wrong");
  }
});

export const deletePostComment = asyncHandler(async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment || comment.postId !== Number(postId)) {
      return res.status(404).json({ message: "❌ Comment not found." });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ message: "❌ Forbidden: Not the author" });
    }

    await prisma.comment.delete({ where: { id: comment.id } });

    // Optional: decrement post.commentCount
    await prisma.post.update({
      where: { id: Number(postId) },
      data: { commentCount: { decrement: 1 } },
    });

    return res.status(200).json({ message: "✅ Comment deleted successfully" });
  } catch (error) {
    console.error("❌ Failed to delete comment", error);
    throw new ApiError(500, "Something went wrong");
  }
});

export const updatePostComment = asyncHandler(async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    commentId = Number(commentId);

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment || comment.postId !== Number(postId)) {
      return res.status(404).json({ message: "❌ Comment not found." });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ message: "❌ Forbidden: Not the author" });
    }

    const sanitizeContent = sanitizeInput(content);

    const updateComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: sanitizeContent,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        content: true,
        postId: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { username: true } },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updateComment, "✅ Comment updated successfully")
      );
  } catch (error) {
    console.error("❌ Failed to update comment", error);
    throw new ApiError(500, "Something went wrong");
  }
});

export const getComments = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const { limit = 10, cursor } = req.query; // optional query params
    const postIdNum = Number(postId);
    const take = Number(limit);

    // Ensure post exists
    const post = await prisma.post.findUnique({ where: { id: postIdNum } });
    if (!post) return res.status(404).json({ message: "❌ Post not found." });

    // Build query
    const comments = await prisma.comment.findMany({
      where: { postId: postIdNum },
      orderBy: { createdAt: "desc" }, // newest first
      take: take + 1, // fetch one extra to check if more exist
      ...(cursor && {
        skip: 1, // skip cursor itself
        cursor: { id: Number(cursor) },
      }),
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { username: true } },
      },
    });

    let nextCursor = null;
    if (comments.length > take) {
      const nextItem = comments.pop(); // last item is cursor for next batch
      nextCursor = nextItem.id;
    }

    return res.status(200).json({
      comments,
      nextCursor,
    });
  } catch (error) {
    console.error("❌ Failed to fetch comments", error);
    throw new ApiError(500, "Something went wrong");
  }
});
