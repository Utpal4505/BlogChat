// register user
// login user
// logout user

import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../config/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sanitizeInput } from "../utils/HtmlSanitize.js";
import { sendVerificationMail } from "../service/email.service.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

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
  try {
    let { email, name } = req.body;
    if (!email || !name) throw new ApiError(400, "All fields are required");

    email = sanitizeInput(email).trim();
    name = sanitizeInput(name).trim();

    const existingUser = await prisma.user.findUnique({ where: { email } });

    // User already registered and onboard completed
    if (existingUser && existingUser.registration_status === "COMPLETED") {
      return res
        .status(409)
        .json(
          new ApiResponse(409, null, "⚠️ User with this email already exists")
        );
    } else if (existingUser && existingUser.registration_status === "PENDING") {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { email: existingUser.email, status: "PENDING" },
            "✅ User already registered but onboard pending."
          )
        );
    }

    // OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // save to emailVerification table
    const newUser = await prisma.emailVerification.create({
      data: {
        email: email,
        otp: otp,
        otpExpiry: otpExpiry,
        name: name,
      },
    });

    await sendVerificationMail(email, otp);
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { verificationId: newUser.id },
          "✅ OTP sent to email"
        )
      );
  } catch (error) {
    console.error("Error occurred while creating user:", error);
    return res.status(500).json({
      message: "⚠️ Something went wrong",
    });
  }
});

const LoginUser = asyncHandler(async (req, res) => {
  // get user data from frontend
  let { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  username = sanitizeInput(username);
  password = password.trim();

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new ApiError(404, "Invalid username or password");
  }

  if (user.isDeleted) {
    throw new ApiError(403, "This account is no longer active");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid username or password");
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
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
      user
    );

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
      bio: true,
      avatar: true,
      posts: true,
      _count: {
        select: {
          followees: true,
          followers: true,
          posts: true,
        },
      },
      visibility: true,
      registration_status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "✅ User fetched successfully"));
});

const verifyOTP = asyncHandler(async (req, res) => {
  console.log(req.body);

  try {
    const { verificationId, otp } = req.body;

    if (!verificationId || !otp) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await prisma.emailVerification.findUnique({
      where: { id: Number(verificationId) },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.otp !== otp) {
      throw new ApiError(400, "⚠️ Invalid OTP");
    }

    if (user.otpExpiry < new Date()) {
      throw new ApiError(400, "⚠️ OTP Expired");
    }

    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        isVerified: true,
        registration_status: "PENDING",
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!newUser) {
      throw new ApiError(500, "⚠️ Something went wrong while creating user");
    }

    const deletedVerification = await prisma.emailVerification.delete({
      where: { id: Number(verificationId) },
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newUser,
          "✅ User verified & registered successfully now procced to onboarding"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "⚠️ Something went wrong while verifying OTP",
      error.message
    );
  }
});

const resetPasswordOTP = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // OTP generate
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  // save to emailVerification table
  const newUser = await prisma.emailVerification.create({
    data: {
      email: email,
      otp: otp,
      otpExpiry: otpExpiry,
      name: user.name,
    },
  });

      console.log(`New email sent to ${email} and otp is ${otp}`)

  await sendVerificationMail(email, otp);

  return res.status(200).json({
    message: "✅Password Reset OTP sent to email",
    verificationId: newUser.id,
  });
});

const verifyResetPassword = asyncHandler(async (req, res) => {
  const { verificationId, otp, newPassword } = req.body;

  if (!verificationId || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await prisma.emailVerification.findUnique({
    where: { id: Number(verificationId) },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: "⚠️ Invalid OTP" });
  }

  if (user.otpExpiry < new Date()) {
    return res.status(400).json({ message: "⚠️ OTP Expired" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: { email: user.email },
    data: { password: hashedPassword },
  });

  if (!updatedUser) {
    return res
      .status(500)
      .json({ message: "⚠️ Something went wrong while updating password" });
  }

  await prisma.emailVerification.delete({
    where: { id: Number(verificationId) },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "✅ Password reset successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user?.id; // ✅ This will be undefined if not logged in

    // Find the profile user
    const profileUser = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        _count: {
          select: {
            followers: true,
            followees: true,
          },
        },
      },
    });

    if (!profileUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Check if current user follows this profile (only if logged in)
    let isFollowing = false;
    if (currentUserId && currentUserId !== profileUser.id) {
      const followRecord = await prisma.follow.findUnique({
        where: {
          followerId_followeeId: {
            followerId: currentUserId,
            followeeId: profileUser.id,
          },
        },
      });

      isFollowing = !!followRecord;
    }

    res.status(200).json({
      success: true,
      data: {
        ...profileUser,
        isFollowing, // ✅ false if not logged in
        canFollow: !!currentUserId && currentUserId !== profileUser.id, // ✅ Can follow only if logged in
      },
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const getUserPosts = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user?.id;

    // Check if user exists first
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const posts = await prisma.post.findMany({
      where: {
        author: {
          username: username,
        },
      },
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
        authorId: true,
        createdAt: true,
        publishedAt: true,
        updatedAt: true,
        // ✅ Include author details in select
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        // ✅ Optional: Add like/comment counts
        _count: {
          select: {
            postLikes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const postsWithStatus = posts.map((post) => ({
      ...post,
      isLiked: post.postLikes?.length > 0,
      isBookmarked: post.bookmarks?.length > 0,
      postLikes: undefined, // Remove from response
    }));

    res.status(200).json({
      success: true,
      data: postsWithStatus,
    });
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const updateMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { username, name, bio, avatarUrl, Newpassword, visibility } = req.body;

  if (Newpassword) {
    if (Newpassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (bio !== undefined) updateData.bio = bio;
  if (username !== undefined) updateData.username = username;
  if (avatarUrl !== undefined) updateData.avatar = avatarUrl;
  if (Newpassword !== undefined)
    updateData.password = await bcrypt.hash(Newpassword, 10);
  if (visibility !== undefined) updateData.visibility = visibility;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      message: "At least one field (name, username, avatarUrl, bio, password) is required to update",
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      bio: true,
      avatar: true,
      createdAt: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "✅ Profile updated successfully"));
});


const deleteUser = asyncHandler(async (req, res) => {
  const userID = req.user.id;

  try {
    const deleteUser = await prisma.user.update({
      where: { id: userID },
      data: {
        isDeleted: true,
        name: "Deleted User",
        avatar: process.env.DELETED_USER_AVATAR,
        deletedAt: new Date(),
      },
      select: {
        username: true,
        avatar: true,
        name: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, deleteUser, "🗑️ Profile delete successfully"))
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options);
  } catch (error) {
    console.error("Error occurred while Deleting user:", error);
    return res.status(500).json({
      message: "⚠️ Something went wrong",
    });
  }
});

export {
  createUser,
  LoginUser,
  LoggedOutUser,
  refreshAccessToken,
  generateAccessandRefreshTokens,
  getMe,
  verifyOTP,
  resetPasswordOTP,
  verifyResetPassword,
  getUserProfile,
  updateMe,
  deleteUser,
  getUserPosts,
};
