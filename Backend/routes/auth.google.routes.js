import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../config/db.config.js";
import { generateAccessandRefreshTokens } from "../controllers/user.controllers.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

      
      //Onbvboarding email security
      const onboardToken = jwt.sign(
        { email: req.user.email }, // payload
        process.env.ONBOARD_TOKEN_SECRET, // secret just for onboarding
        { expiresIn: "10m" } // 10 minutes
      );

      // Redirect to frontend success page
      if (!req.user.username) {
        res.cookie("onboardEmail", onboardToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 10 * 60 * 1000, // 10 minutes
        });
        return res.redirect(`${process.env.CLIENT_URL}/onboarding`);
      } else {
        return res.redirect(`${process.env.CLIENT_URL}/home`);
      }
    } catch (error) {
      console.error("❌ Google Auth Error:", error);
      throw new ApiError(500, "Error processing Google login");
    }
  })
);

export default router;
