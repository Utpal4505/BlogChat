import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../config/db.config.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.body?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "⚠️ Your session has expired. Please login again.");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        isDeleted: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isDeleted) {
      throw new ApiError(403, "User account has been deleted");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error || "⚠️ Invalid Access Token ");
  }
});
