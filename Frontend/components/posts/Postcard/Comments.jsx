// components/comments/CommentSection.jsx
import { useState } from 'react';
import { Send, Trash2, Heart, MessageCircle } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const CommentSection = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      content: 'Great post! Really helpful content.',
      user: {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
      createdAt: new Date('2025-10-20'),
      likes: 5,
      isLiked: false,
    },
    {
      id: 2,
      content: 'Thanks for sharing this!',
      user: {
        id: 2,
        name: 'Jane Smith',
        username: 'janesmith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
      createdAt: new Date('2025-10-21'),
      likes: 2,
      isLiked: true,
    },
  ]);

  const currentUser = {
    id: 1,
    name: 'Current User',
    username: 'currentuser',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Current',
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      content: commentText,
      user: currentUser,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((c) => c.id !== commentId));
  };

  const handleLikeComment = (commentId) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
              isLiked: !c.isLiked,
            }
          : c
      )
    );
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="pt-4 sm:pt-6 space-y-4 sm:space-y-6 px-3 sm:px-0"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 border-bordercolor dark:border-dbordercolor">
        <div className="flex items-center gap-2 sm:gap-3">
          <MessageCircle 
            size={20} 
            className="text-accent dark:text-daccent hidden sm:block" 
            strokeWidth={2.5}
          />
          <h3 className="text-base sm:text-lg font-bold text-text dark:text-dText">
            Comments
          </h3>
          {comments.length > 0 && (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-semibold bg-accent/10 dark:bg-daccent/10 text-accent dark:text-daccent rounded-full">
              {comments.length}
            </span>
          )}
        </div>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="flex gap-2 sm:gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 ring-2 ring-transparent hover:ring-accent dark:hover:ring-daccent transition-all duration-200"
        />
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a thoughtful comment..."
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-card dark:bg-dcard border-2 border-bordercolor dark:border-dbordercolor text-text dark:text-dText text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-daccent focus:border-transparent placeholder:text-muted-text dark:placeholder:text-dMuted-text transition-all shadow-sm hover:shadow-md"
            />
          </div>
          <Motion.button
            type="submit"
            disabled={!commentText.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 bg-accent dark:bg-daccent text-white rounded-lg sm:rounded-xl hover:bg-primary dark:hover:bg-dPrimary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:hover:scale-100 font-semibold text-sm flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Send size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" />
            <span className="sm:hidden">Post Comment</span>
          </Motion.button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => (
              <Motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, height: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                className="flex gap-2 sm:gap-3 group"
              >
                {/* User Avatar */}
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 cursor-pointer ring-2 ring-transparent hover:ring-accent dark:hover:ring-daccent transition-all duration-200"
                />

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-card dark:bg-dcard rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-bordercolor dark:border-dbordercolor shadow-sm hover:shadow-lg transition-all duration-200">
                    {/* User Info & Actions */}
                    <div className="flex items-start justify-between gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-text dark:text-dText hover:text-accent dark:hover:text-daccent cursor-pointer truncate transition-colors">
                            {comment.user.name}
                          </span>
                          <span className="text-xs text-muted-text dark:text-dMuted-text hidden sm:inline">
                            •
                          </span>
                          <span className="text-xs text-muted-text dark:text-dMuted-text whitespace-nowrap">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <span className="text-xs text-muted-text dark:text-dMuted-text truncate">
                          @{comment.user.username}
                        </span>
                      </div>

                      {/* Delete Button */}
                      {currentUser.id === comment.user.id && (
                        <Motion.button
                          onClick={() => handleDeleteComment(comment.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-muted-text hover:text-danger transition-all p-2 sm:p-1.5 hover:bg-danger/10 rounded-md flex-shrink-0 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                        >
                          <Trash2 size={14} strokeWidth={2.5} className="sm:w-[14px] sm:h-[14px]" />
                        </Motion.button>
                      )}
                    </div>

                    {/* Comment Text */}
                    <p className="text-sm sm:text-[15px] text-text dark:text-dText break-words leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Like Action */}
                    <div className="flex items-center gap-4 sm:gap-6 mt-2.5 sm:mt-3 pt-2 border-t border-bordercolor/50 dark:border-dbordercolor/50">
                      <Motion.button
                        onClick={() => handleLikeComment(comment.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 group/like transition-all min-h-[44px] sm:min-h-0 -ml-2 pl-2 pr-3 sm:ml-0 sm:pl-0 sm:pr-0 py-2 sm:py-0"
                      >
                        <Heart
                          size={18}
                          strokeWidth={2.5}
                          className={`transition-all duration-200 sm:w-4 sm:h-4 ${
                            comment.isLiked
                              ? 'fill-danger stroke-danger'
                              : 'stroke-muted-text dark:stroke-dMuted-text group-hover/like:stroke-danger group-hover/like:scale-110'
                          }`}
                        />
                        {comment.likes > 0 && (
                          <span className={`text-xs sm:text-[13px] font-bold tabular-nums transition-colors ${
                            comment.isLiked
                              ? 'text-danger'
                              : 'text-muted-text dark:text-dMuted-text group-hover/like:text-danger'
                          }`}>
                            {comment.likes}
                          </span>
                        )}
                        <span className={`text-xs sm:text-sm font-medium transition-colors sm:hidden ${
                          comment.isLiked
                            ? 'text-danger'
                            : 'text-muted-text dark:text-dMuted-text'
                        }`}>
                          {comment.isLiked ? 'Liked' : 'Like'}
                        </span>
                      </Motion.button>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10 sm:py-12 px-4 sm:px-6 bg-card dark:bg-dcard rounded-lg sm:rounded-xl border-2 border-dashed border-bordercolor dark:border-dbordercolor"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/10 dark:bg-daccent/10 flex items-center justify-center">
              <MessageCircle 
                size={24} 
                className="text-accent dark:text-daccent sm:w-7 sm:h-7" 
                strokeWidth={2.5}
              />
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-text dark:text-dText mb-1">
                No comments yet
              </p>
              <p className="text-xs sm:text-sm text-muted-text dark:text-dMuted-text">
                Be the first to share your thoughts!
              </p>
            </div>
          </div>
        </Motion.div>
      )}
    </Motion.div>
  );
};

export default CommentSection;
