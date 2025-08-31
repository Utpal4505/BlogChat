// register user
// login user
// logout user

import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../config/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateAccessandRefreshTokens = async (user) => {
  try {
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const createUser = asyncHandler(async (req, res) => {
  //Logic for creating user
  // for normal signup
  console.log("Creating user:", req.body);

  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const newUser = await prisma.user.create({
    data: { email, name },
  });

  const CreatedUser = await prisma.user.findUnique({
    where: {
      id: newUser.id,
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      createdAt: true,
    },
  });

  if (!CreatedUser) {
    throw new ApiError(500, "Something went wrong while registering the user please try again");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, CreatedUser, "✅ User Created Successfully"));
});

const updatePassword = asyncHandler(async (req, res) => {
  //Logic for updating password
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must be different from old password");
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      password: hashedNewPassword,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "✅ Password Updated Successfully"));
});

const LoginUser = asyncHandler(async (req, res) => {
  // get user data from frontend
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found please register");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "⚠️ Incorrect Password");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user
  );

  const loginnedUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  const savedRefreshToken = await prisma.token.create({
    data: {
      userId: user.id,
      token: refreshToken,
    },
  });

  if (!savedRefreshToken) {
    throw new ApiError(
      500,
      "⚠️ Something went wrong while saving refresh token please try again"
    );
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loginnedUser, accessToken, refreshToken },
        "✅ Login Successful"
      )
    );
});

const LoggedOutUser = asyncHandler(async (req, res) => {
  //Logic for logging out user
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await prisma.token.deleteMany({
      where: {
        token: refreshToken,
      },
    });
  }

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "✅ Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "⚠️ Refresh Token is required");
  }

  try {
    // Check in DB
    const existingToken = await prisma.token.findUnique({
      where: { token: incomingRefreshToken },
    });

    if (!existingToken) {
      throw new ApiError(401, "⚠️ Refresh Token expired or invalid");
    }

    // Verify JWT
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decoded) {
      throw new ApiError(401, "⚠️ Invalid Refresh Token");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // ✅ Generate new tokens
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user);

    // ❌ Old refresh token delete
    await prisma.token.deleteMany({ where: { userId: user.id } });

    // ✅ New refresh token save
    await prisma.token.create({
      data: { userId: user.id, token: refreshToken },
    });

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "✅ Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "⚠️ Something went wrong while refreshing access token",
      error.message
    );
  }
});

const getMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "✅ User fetched successfully"));
});

export {
  createUser,
  updatePassword,
  LoginUser,
  LoggedOutUser,
  refreshAccessToken,
  generateAccessandRefreshTokens,
  getMe
};
