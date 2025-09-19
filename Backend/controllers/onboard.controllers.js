import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../config/db.config.js";
import { sanitizeInput } from "../utils/HtmlSanitize.js";
import { generateAccessandRefreshTokens } from "./user.controllers.js";
import jwt from 'jsonwebtoken'

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const onBoardUser = asyncHandler(async (req, res) => {
  let { username, password, bio, email } = req.body;

  //logic for getting email by cokkies
  const token = req?.cookies?.onboardEmail;
  if (!token) throw new ApiError(401, "Onboarding session expired");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ONBOARD_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired onboarding token");
  }

  const gEmail = decoded.email; 

  //checking required
  if (!username || !password || !bio) {
    throw new ApiError(400, "⚠️ All Fields are required");
  }

  if (password.length < 8) {
    throw new ApiError(400, "⚠️ Password must be at least 8 characters long");
  }

  username = sanitizeInput(username).toLowerCase();
  bio = sanitizeInput(bio);
  password = password.trim();

  let user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (user) {
    throw new ApiError(
      409,
      "User already exist please choose another username or login"
    );
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    username
  )}&background=random&color=fff&size=128`;

  const hashedPassword = await bcrypt.hash(password, 10);

  const updateUser = await prisma.user.update({
    where: {
      email: email || gEmail,
    },
    data: {
      username: username,
      password: hashedPassword,
      bio: bio,
      avatar: avatarUrl,
      registration_status: "COMPLETED",
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    updateUser
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, updateUser, "Onboarding complete 🎉"));
});
