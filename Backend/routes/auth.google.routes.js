import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../config/db.config.js";
import { generateAccessandRefreshTokens } from "../controllers/user.controllers.js";

const router = Router();
const options = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};

// Step 1: Redirect user to Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  asyncHandler(async (req, res) => {
    try {
      if (!req.user) throw new ApiError(401, "User not authenticated");

      // Sign JWT
      // ✅ Generate new tokens
      const { accessToken, refreshToken } =
        await generateAccessandRefreshTokens(req.user);

      // ❌ Old refresh token delete
      await prisma.token.deleteMany({ where: { userId: req.user.id } });

      // ✅ New refresh token save
      await prisma.token.create({
        data: { userId: req.user.id, token: refreshToken },
      });

      //send cookies
      res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options);

      // Redirect to frontend success page
      if (!req.user.username) {
        return res.redirect(`${process.env.CLIENT_URL}/onboarding`);
      } else {
        return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
      }
      
    } catch (error) {
      console.error("❌ Google Auth Error:", error);
      throw new ApiError(500, "Error processing Google login");
    }
  })
);

// Step 3: Protected route to get current user
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) throw new ApiError(401, "Not authenticated");

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });


      if (!user) throw new ApiError(404, "User not found");

      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      throw new ApiError(401, "Invalid token");
    }
  })
);

export default router;
