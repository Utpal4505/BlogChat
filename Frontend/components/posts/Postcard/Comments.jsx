import React, { useState } from "react";
import {
  Send,
  Trash2,
  MessageCircle,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const CommentSection = ({
  postId,
  comments = [],
  currentUser,
  isLoading = false,
  onAddComment,
  onDeleteComment,
  onEditComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(postId, commentText);
    setCommentText("");
  };

  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const handleEditSave = () => {
    if (!editingText.trim()) return;
    onEditComment(postId, editingCommentId, editingText.trim());
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditingText("");
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
    <Motion.div
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
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-4"
        disabled={!!editingCommentId}
      >
        <img
          src={
            currentUser?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
          }
          alt={currentUser?.name || "User"}
          className={`w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-transparent hover:ring-accent dark:hover:ring-daccent transition-all ${
            editingCommentId ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            disabled={!!editingCommentId}
            className={`flex-1 px-3 py-2 rounded-lg bg-bg dark:bg-dbg border-2 border-bordercolor dark:border-dbordercolor text-text dark:text-dText text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-daccent placeholder:text-muted-text dark:placeholder:text-dMuted-text transition-all ${
              editingCommentId ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          <Motion.button
            type="submit"
            disabled={!commentText.trim() || !!editingCommentId}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-accent dark:bg-daccent text-white rounded-lg hover:bg-primary dark:hover:bg-dPrimary disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold text-sm flex items-center gap-2"
          >
            <Send size={14} strokeWidth={2.5} />
          </Motion.button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => {
              const isEditing = editingCommentId === comment.id;
              const canEdit =
                String(currentUser?.id) === String(comment.author?.id);

              return (
                <Motion.div
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

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canEdit && !isEditing && (
                            <>
                              <Motion.button
                                onClick={() => handleEditStart(comment)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Edit comment"
                                className="text-muted-text hover:text-accent dark:hover:text-daccent p-1"
                              >
                                <Edit2 size={14} strokeWidth={2.5} />
                              </Motion.button>
                              <Motion.button
                                onClick={() =>
                                  onDeleteComment(postId, comment.id)
                                }
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Delete comment"
                                className="text-muted-text hover:text-danger p-1"
                              >
                                <Trash2 size={14} strokeWidth={2.5} />
                              </Motion.button>
                            </>
                          )}

                          {isEditing && (
                            <>
                              <Motion.button
                                onClick={handleEditSave}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Save edited comment"
                                className="text-green-600 hover:text-green-800 p-1"
                                disabled={!editingText.trim()}
                              >
                                <Check size={16} strokeWidth={2.5} />
                              </Motion.button>
                              <Motion.button
                                onClick={handleEditCancel}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Cancel edit"
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <X size={16} strokeWidth={2.5} />
                              </Motion.button>
                            </>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full px-2 py-1 rounded-md border border-bordercolor dark:border-dbordercolor text-text dark:text-dText text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-daccent"
                          autoFocus
                        />
                      ) : (
                        <p className="text-xs text-text dark:text-dText break-words leading-relaxed">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-6 text-muted-text dark:text-dMuted-text">
          <p className="text-xs">No comments yet. Be the first!</p>
        </div>
      )}
    </Motion.div>
  );
};

export default CommentSection;
