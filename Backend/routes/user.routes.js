import { Router } from "express";
import { createUser, getMe, LoggedOutUser, LoginUser, refreshAccessToken, resetPasswordOTP, updatePassword, verifyOTP, verifyResetPassword } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { onBoardUser } from "../controllers/onboard.controllers.js";
import { checkUsernameAvailability } from "../controllers/usernameCheck.middlewares.js";
import { checkUsernameLimiter, loginLimiter, otpLimiter, refreshLimiter, registerLimiter } from "../middlewares/rateLimiters.middlewares.js";
import { verifyRefreshToken } from "../middlewares/VerifyRefreshToken.js";


const router = Router();

router.route("/register").post(registerLimiter, otpLimiter, createUser);
router.route("/login").post(loginLimiter, LoginUser);
router.route("/username-check").post(checkUsernameLimiter,checkUsernameAvailability);
router.route("/logout").post(verifyJWT, LoggedOutUser);
router.route("/refresh-token").post(refreshLimiter, verifyRefreshToken, refreshAccessToken);
router.route("/change-password").post(verifyJWT, updatePassword);
router.route("/onboarding").post(onBoardUser);
router.route("/me").get(verifyJWT, getMe);
router.route("/verifyOTP").post(registerLimiter,verifyOTP);
router.route("/reset-password").post(verifyResetPassword);
router.route("/resetOTPsent").post(otpLimiter, resetPasswordOTP);

export default router;