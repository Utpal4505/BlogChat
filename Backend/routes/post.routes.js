import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  createPost,
  createPostComment,
  deletePost,
  deletePostComment,
  getComments,
  getFeedPost,
  getPostById,
  getPostsByTag,
  postFiltering,
  postLike,
  searchBasedDetail,
  updatePost,
  updatePostComment,
} from "../controllers/posts.controllers.js";
import { checkPostAccess } from "../middlewares/checkPostAccess.js";
import {
  bookmarkToggle,
  getBookmarkPosts,
} from "../controllers/bookmark.controllers.js";

const router = Router();

router
  .route("/create")
  .post(verifyJWT, upload.single("coverImage"), createPost);
router
  .route("/update/:postId")
  .patch(verifyJWT, upload.single("coverImage"), updatePost);
router.route("/delete/:postId").delete(verifyJWT, deletePost);
router.route("/post/:postId").get(checkPostAccess, getPostById);
router.route("/feed").get(getFeedPost);
router.route("/tags/:tagName/posts").get(getPostsByTag);
router.route("/search").get(searchBasedDetail);
router.route("/search/filter").get(postFiltering);
router.route("/post/:postId/like").post(verifyJWT, checkPostAccess, postLike);
router
  .route("/post/:postId/comment")
  .post(verifyJWT, checkPostAccess, createPostComment);
router
  .route("/post/:postId/comment/:commentId")
  .patch(verifyJWT, checkPostAccess, updatePostComment);
router
  .route("/post/:postId/comment/:commentId")
  .delete(verifyJWT, checkPostAccess, deletePostComment);
router.route("/post/:postId/comments").get(getComments);
router.route("/post/:postId/bookmarks").post(verifyJWT, bookmarkToggle);
router.route("/bookmarks").get(verifyJWT, getBookmarkPosts);

export default router;
