import { motion as Motion, AnimatePresence } from "framer-motion";
import PostCoverImage from "./PostCoverImage";
import PostAuthor from "./PostAuthor";
import PostTitle from "./PostTitle";
import PostExcerpt from "./PostExcerpt";
import PostTags from "./PostTags";
import PostActions from "./PostActions";
import { useState } from "react";
import CommentSection from "./Comments";

const PostCard = ({
  post,
  liked,
  bookmarked,
  onLike,
  onBookmark,
  comments = {},
  commentsLoading = false,
  onAddComment,
  onDeleteComment,
  onEditComment,
  currentUser,
  lastCommentRef,
  showingPostIdForScroll,
  toggleComments,
}) => {
  const [showComments, setShowComments] = useState(false);

  if (!comments) {
    console.error("Comments is undefined!");
    return null;
  }

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes < 1 ? "1 min read" : `${minutes} min read`;
  };

  const tags = post.postTags?.map((tagObj) => tagObj.tag.name) || [];

  // Toggle comments and optionally set post id to trigger scrolling fetch
  const toggleCommentsHandler = () => {
    setShowComments((prev) => !prev);
    toggleComments(post.id);
  };

  const commentsData = Array.isArray(comments)
    ? comments
    : comments.comments || [];

  return (
    <Motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-card dark:bg-dcard rounded-[22px] overflow-hidden border border-bordercolor/60 dark:border-dbordercolor/60 hover:border-accent/40 dark:hover:border-daccent/40 hover:shadow-2xl hover:shadow-accent/5 dark:hover:shadow-daccent/5 transition-all duration-300 mb-2 cursor-pointer"
    >
      <PostCoverImage coverImage={post.coverImage} title={post.title} />
      <div className="p-6">
        <PostAuthor
          author={post.author}
          publishedDate={post.publishedAt}
          readTime={calculateReadTime(post.content)}
        />
        <PostTitle title={post.title} />
        <PostExcerpt excerpt={post.excerpt} />
        <PostTags tags={tags} />
        <PostActions
          likes={post._count?.postLikes || 0}
          comments={commentsData?.length || post._count?.comments || 0}
          liked={liked}
          bookmarked={bookmarked}
          onLike={onLike}
          onBookmark={onBookmark}
          onCommentClick={toggleCommentsHandler}
          showingComments={showComments}
        />

        <AnimatePresence>
          {showComments && (
            <div>
              <CommentSection
                postId={post.id}
                comments={commentsData || []}
                currentUser={currentUser}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
                onEditComment={onEditComment}
                isLoading={commentsLoading}
              />
              {/* Attach lastCommentRef to the last comment element for infinite scroll */}
              {comments.length > 0 && post.id === showingPostIdForScroll && (
                <div ref={lastCommentRef} />
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </Motion.article>
  );
};

export default PostCard;
