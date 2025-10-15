// middlewares/verifyJWTSoft.js
import jwt from "jsonwebtoken";
import prisma from "../config/db.config.js";

export const verifyJWTSoft = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.body?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    req.user = null; // no user, treat as unverified
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        isDeleted: true,
        createdAt: true,
      },
    });

    if (!user || user.isDeleted) {
      req.user = null; // invalid or deleted user
    } else {
      req.user = user; // attach valid user
    }
  } catch {
    req.user = null; // invalid token
  }

  next();
};
