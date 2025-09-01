import { Router } from "express";
import { createUser, getMe, LoggedOutUser, LoginUser, refreshAccessToken, updatePassword, verifyOTP } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { onBoardUser } from "../controllers/onboard.controllers.js";
import { checkUsernameAvailability } from "../controllers/usernameCheck.middlewares.js";
import { checkUsernameLimiter, loginLimiter, refreshLimiter, registerLimiter } from "../middlewares/rateLimiters.middlewares.js";


const router = Router();

router.route("/register").post(registerLimiter,createUser);
router.route("/login").post(loginLimiter ,LoginUser);
router.route("/username-check").post(checkUsernameLimiter,checkUsernameAvailability);
router.route("/logout").post(verifyJWT, LoggedOutUser);
router.route("/refresh-token").post(refreshLimiter,verifyJWT, refreshAccessToken);
router.route("/change-password").post(verifyJWT, updatePassword);
router.route("/onboarding").post(onBoardUser);
router.route("/me").get(verifyJWT, getMe);
router.route("/verifyOTP").post(verifyOTP);

export default router;