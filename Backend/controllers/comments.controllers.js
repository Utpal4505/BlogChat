import prisma from "../config/db.config.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUserReplies = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const currentUserId = req.user?.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const replies = await prisma.comment.findMany({
      where: {
        authorId: user.id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        post: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            content: true,
            createdAt: true,
            _count: {
              select: {
                postLikes: true,
                comments: true,
              },
            },
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            postLikes: currentUserId
              ? {
                  where: {
                    userId: currentUserId,
                  },
                  select: {
                    id: true,
                    postId: true,
                  },
                }
              : false,
            bookmarks: currentUserId
              ? {
                  where: {
                    userId: currentUserId,
                  },
                  select: {
                    id: true,
                    postId: true,
                  },
                }
              : false,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (replies.length === 0) {
      return res
        .status(200)
        .json({ message: "No replies found for this user", replies: [] });
    }

    const RepliesWithStatus = replies.map((post) => ({
      ...post,
      isLiked: post.postLikes?.length > 0,
      isBookmarked: post.bookmarks?.length > 0,
      postLikes: undefined, // Remove from response
    }));

    return res.status(200).json({ replies: RepliesWithStatus });
  } catch (error) {
    console.error("Error fetching user replies:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
