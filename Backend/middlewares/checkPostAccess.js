import prisma from "../config/prisma.js";

export const checkPostAccess = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id || null; // login user, optional

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: { author: true }, // authorId mil jayega
    });

    if (!post) return res.status(404).json({ message: "❌ Post not found" });

    if (post.visibility === "PUBLIC") return next(); // public → sab allow

    // private post
    if (!userId) {
      return res.status(403).json({ message: "🚫 This post is private. Login required." });
    }

    if (post.authorId === userId) return next(); // owner → allow

    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: post.authorId,
        },
      },
    });

    if (!isFollowing) {
      return res.status(403).json({ message: "🚫 This is Private post." });
    }

    return next(); // follower → allow
  } catch (err) {
    console.error("❌ Post access middleware failed", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
