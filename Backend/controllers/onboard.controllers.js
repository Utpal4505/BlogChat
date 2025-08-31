import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../config/db.config.js";

export const onBoardUser = asyncHandler(async (req, res) => {
  const { username, password, bio } = req.body;

  //checking required
  if (!username || !password || !bio) {
    throw new ApiError(400, "⚠️ All Fields are required");
  }

  let user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (user) {
    throw new ApiError(409, "User already exist please choose another username or login");
  }

  // get user from req.user
  const userId = req.user.id;

  const hashedPassword = await bcrypt.hash(password, 10);

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: username,
      password: hashedPassword,
      bio: bio,
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Onboarding complete 🎉", updateUser));
});
