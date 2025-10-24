import { MessageCircle } from "lucide-react";
import PostCard from "../posts/Postcard/PostCard";

const formatTimeAgo = (dateStr) => {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

const RepliesView = ({
  replies,
  onLike,
  onBookmark,
  onAddComment,
  onDeleteComment,
  onEditComment,
  toggleComments,
  currentUser,
  postComments,
  commentsLoading,
  showingPostIdForScroll,
  lastCommentRef,
  likedPosts,
  bookmarkedPosts,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-bg dark:bg-dbg min-h-screen p-4">
      {replies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-card dark:bg-dcard flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-muted-text dark:text-dMuted-text" />
          </div>
          <h3 className="text-lg font-semibold text-text dark:text-dText mb-2">
            No replies yet
          </h3>
          <p className="text-muted-text dark:text-dMuted-text max-w-sm">
            When you reply to posts, they'll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {replies.map((replies) => (
            <div
              key={replies.id}
              className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {console.log("The reply post is", replies)}
              {/* Original Post */}
              <div className="p-5 border-b border-bordercolor dark:border-dbordercolor">
                <PostCard
                  post={replies.post}
                  liked={likedPosts?.[replies.post.id]}
                  bookmarked={bookmarkedPosts?.[replies.post.id]}
                  onLike={() => onLike(replies.post.id)}
                  onBookmark={() => onBookmark(replies.post.id)}
                  onAddComment={onAddComment}
                  onDeleteComment={onDeleteComment}
                  onEditComment={onEditComment}
                  currentUser={currentUser}
                  comments={postComments?.[replies.post.id] || []}
                  commentsLoading={commentsLoading?.[replies.post.id]}
                  showingPostIdForScroll={showingPostIdForScroll}
                  toggleComments={toggleComments}
                  lastCommentRef={lastCommentRef}
                />
              </div>

              {/* Reply Section with connecting line */}
              <div className="relative px-5 py-4 bg-bg/30 dark:bg-dbg/30">
                {/* Vertical connecting line - Twitter style */}
                <div className="absolute left-[46px] top-0 w-0.5 h-6 bg-bordercolor dark:bg-dbordercolor" />

                <div className="flex gap-4">
                  {/* Avatar with subtle border */}
                  <div className="relative flex-shrink-0 z-10">
                    <img
                      src={replies.author?.avatar}
                      alt={replies.author?.username}
                      className="w-11 h-11 rounded-full border-2 border-bordercolor dark:border-dbordercolor bg-card dark:bg-dcard"
                    />
                    {/* Reply indicator */}
                    <div className="absolute -bottom-1 -right-1 bg-card dark:bg-dcard rounded-full p-1 border border-bordercolor dark:border-dbordercolor shadow-sm">
                      <MessageCircle className="w-3 h-3 text-accent dark:text-daccent" />
                    </div>
                  </div>

                  {/* Reply Content with proper padding */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-text dark:text-dText">
                        You
                      </span>
                      <span className="text-xs text-muted-text dark:text-dMuted-text">
                        replied
                      </span>
                      <span className="text-xs text-muted-text dark:text-dMuted-text opacity-70">
                        · {formatTimeAgo(replies.createdAt)}
                      </span>
                    </div>

                    {/* Reply Text in a nice card */}
                    <div className="bg-card dark:bg-dcard rounded-xl border border-bordercolor/60 dark:border-dbordercolor/60 px-4 py-3.5 shadow-sm">
                      <p className="text-[15px] text-text dark:text-dText leading-relaxed">
                        {replies.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepliesView;
