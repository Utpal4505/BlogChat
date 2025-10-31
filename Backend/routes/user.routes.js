import { Router } from "express";
import {
  createUser,
  deleteUser,
  getMe,
  getUserPosts,
  getUserProfile,
  LoggedOutUser,
  LoginUser,
  refreshAccessToken,
  resetPasswordOTP,
  updateMe,
  verifyOTP,
  verifyResetPassword,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { onBoardUser } from "../controllers/onboard.controllers.js";
import { checkUsernameAvailability } from "../controllers/usernameCheck.middlewares.js";
import {
  checkUsernameLimiter,
  loginLimiter,
  otpLimiter,
  refreshLimiter,
  registerLimiter,
} from "../middlewares/rateLimiters.middlewares.js";
import { verifyRefreshToken } from "../middlewares/VerifyRefreshToken.js";
import { follow } from "../controllers/follow.controllers.js";
import { verifyJWTSoft } from "../middlewares/verifyJWTSoft.middlewares.js";

const router = Router();

router.route("/register").post(registerLimiter, otpLimiter, createUser);
router.route("/login").post(loginLimiter, LoginUser);
router
  .route("/username-check")
  .get(checkUsernameLimiter, checkUsernameAvailability);
router.route("/logout").post(verifyJWT, LoggedOutUser);
router
  .route("/refresh-token")
  .post(refreshLimiter, verifyRefreshToken, refreshAccessToken);
router.route("/onboarding").patch(onBoardUser);
router.route("/me").get(verifyJWT, getMe);
router.route("/verifyOTP").post(registerLimiter, verifyOTP);
router.route("/reset-password").post(verifyResetPassword);
router.route("/resetOTPsent").post(otpLimiter, resetPasswordOTP);
router.route("/profile/:username").get(verifyJWTSoft, getUserProfile);
router.route("/me/update").patch(verifyJWT, updateMe);
router.route("/delete").delete(verifyJWT, deleteUser);
router.route("/:userId/follow").post(verifyJWT, follow);
router.route("/profile/:username/posts").get(verifyJWTSoft, getUserPosts);

export default router;
