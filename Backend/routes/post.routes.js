import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { createPost, deletePost, getFeedPost, getPostById, updatePost } from "../controllers/posts.controllers.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.single("coverImage"), createPost);
router.route("/update/:postId").patch(verifyJWT, upload.single("coverImage"), updatePost);
router.route("/delete/:postId").delete(verifyJWT, deletePost);
router.route("/post/:postId").get(getPostById);
router.route("/feed").get(getFeedPost);

export default router;