import { Router } from "express";
import { createUser, LoggedOutUser, LoginUser, refreshAccessToken, updatePassword } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { onBoardUser } from "../controllers/onboard.controllers.js";


const router = Router();

router.route("/register").post(createUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(verifyJWT, LoggedOutUser);
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);
router.route("/change-password").post(verifyJWT, updatePassword);
router.route("/onboarding").post(verifyJWT, onBoardUser);

export default router;