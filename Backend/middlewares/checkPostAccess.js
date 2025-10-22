import prisma from '../config/db.config.js'

export const checkPostAccess = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id || null;

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: { author: true },
    });

    if (!post) return res.status(404).json({ message: "❌ Post not found" });

    if (post.visibility === "PUBLIC") return next();

    // Private post
    if (!userId) {
      return res.status(403).json({ message: "🚫 This post is private. Login required." });
    }

    if (post.authorId === userId) return next();

    // ✅ Fix: followerId_followeeId (not followingId)
    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followeeId: {  // ✅ Changed
          followerId: userId,
          followeeId: post.authorId,  // ✅ Changed
        },
      },
    });

    if (!isFollowing) {
      return res.status(403).json({ message: "🚫 This is a private post." });
    }

    return next();
  } catch (err) {
    console.error("❌ Post access middleware failed", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
