import prisma from "../config/db.config.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const bookmarkToggle = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const postId = Number(req.params.postId);

  // Simulate bookmark toggle logic

  const existingBookmark = await prisma.bookmarkPost.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existingBookmark) {
    // If bookmark exists, remove it
    await prisma.bookmarkPost.delete({
      where: {
        id: existingBookmark.id,
      },
    });

    return res.status(200).json({
      bookmarked: false,
      message: "Bookmark removed successfully",
    });
  }

  // If bookmark does not exist, create it
  const newBookmark = await prisma.bookmarkPost.create({
    data: {
      userId: userId,
      postId: postId,
    },
  });

  return res.status(201).json({
    bookmarked: true,
    message: "Bookmark added successfully",
    bookmark: newBookmark,
  });
});

export const getBookmarkPosts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarkedPosts = await prisma.bookmarkPost.findMany({
      where: {
        userId: userId,
      },
      select: {
        post: {
          select: {
            id: true,
            title: true,
            content: true,
            coverImage: true,
            postTags: {
              select: {
                tag: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                postLikes: true,
                comments: true,
              },
            },
            postLikes: {
              where: {
                userId: userId,
              },
              select: {
                id: true,
                postId: true,
              },
            },
            createdAt: true,
            publishedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const posts = bookmarkedPosts.map((bookmark) => ({
      ...bookmark.post,
      isLiked: bookmark.post.postLikes?.length > 0,
      isBookmarked: true,
      postLikes: undefined,
    }));

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching bookmarked posts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
