import prisma from "../config/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const follow = asyncHandler(async (req, req) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    if (Number(userId) === followerId) {
      return res.status(400).json({ message: "❌ You can't follow yourself." });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "❌ User not found." });
    }

    const existingfollow = await prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId: Number(userId),
        },
      },
    });

    if (existingfollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId: Number(userId),
          },
        },
      });

      return res
        .status(200)
        .json(new ApiResponse(200, { following: false }, "👎 Unfollowed user"));
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId: Number(userId),
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { following: true }, "👍 Followed user"));
  } catch (error) {
    console.error("❌ Failed to toggle follow", error);
    throw new ApiError(500, "Something went wrong");
  }
});
