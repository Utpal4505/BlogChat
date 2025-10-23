// components/posts/Postcard/Comments.jsx
import React, { useState } from "react";
import { Send, Trash2, Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CommentSection = ({
  postId,
  comments = [],
  currentUser,
  isLoading = false,
  onAddComment,
  onDeleteComment,
  onLikeComment,
}) => {
  const [commentText, setCommentText] = useState("");

  console.log("🗣️ Comment component Comments", comments);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(postId, commentText);
    setCommentText("");
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent dark:border-daccent mx-auto" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="mt-4 pt-4 border-t-2 border-bordercolor/50 dark:border-dbordercolor/50"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle
          size={18}
          className="text-accent dark:text-daccent"
          strokeWidth={2.5}
        />
        <h4 className="text-sm font-bold text-text dark:text-dText">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h4>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <img
          src={
            currentUser?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
          }
          alt={currentUser?.name || "User"}
          className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-transparent hover:ring-accent dark:hover:ring-daccent transition-all"
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 rounded-lg bg-bg dark:bg-dbg border-2 border-bordercolor dark:border-dbordercolor text-text dark:text-dText text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-daccent placeholder:text-muted-text dark:placeholder:text-dMuted-text transition-all"
          />
          <motion.button
            type="submit"
            disabled={!commentText.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-accent dark:bg-daccent text-white rounded-lg hover:bg-primary dark:hover:bg-dPrimary disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold text-sm flex items-center gap-2"
          >
            <Send size={14} strokeWidth={2.5} />
          </motion.button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="flex gap-2 group"
              >
                <img
                  src={comment?.author?.avatar}
                  alt={comment?.author?.username}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="bg-bg dark:bg-dbg rounded-lg px-3 py-2 border border-bordercolor/50 dark:border-dbordercolor/50">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-text dark:text-dText">
                          {comment?.author?.username}
                        </span>
                        <span className="text-xs text-muted-text dark:text-dMuted-text">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>

                      {currentUser?.id === comment.author?.id && (
                        <motion.button
                          onClick={() => onDeleteComment(postId, comment.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="opacity-0 group-hover:opacity-100 text-muted-text hover:text-danger transition-all p-1"
                        >
                          <Trash2 size={12} strokeWidth={2.5} />
                        </motion.button>
                      )}
                    </div>

                    <p className="text-xs text-text dark:text-dText break-words leading-relaxed">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-3 mt-2 pt-1.5 border-t border-bordercolor/30 dark:border-dbordercolor/30">
                      <motion.button
                        onClick={() => onLikeComment(postId, comment.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 group/like"
                      >
                        <Heart
                          size={14}
                          strokeWidth={2.5}
                          className={`transition-all ${
                            comment.isLiked
                              ? "fill-danger stroke-danger"
                              : "stroke-muted-text dark:stroke-dMuted-text group-hover/like:stroke-danger"
                          }`}
                        />
                        {comment.likes > 0 && (
                          <span
                            className={`text-xs font-bold ${
                              comment.isLiked
                                ? "text-danger"
                                : "text-muted-text dark:text-dMuted-text"
                            }`}
                          >
                            {comment.likes}
                          </span>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-6 text-muted-text dark:text-dMuted-text">
          <p className="text-xs">No comments yet. Be the first!</p>
        </div>
      )}
    </motion.div>
  );
};

export default CommentSection;
