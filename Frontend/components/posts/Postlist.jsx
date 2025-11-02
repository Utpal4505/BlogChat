import EmptyState from "../profile/EmptyState";
import PostCard from "./Postcard/PostCard";

const PostList = ({
  posts,
  likedPosts,
  bookmarkedPosts,
  onLike,
  onBookmark,
  postComments = {},
  currentUser,
  onAddComment,
  onDeleteComment,
  onEditComment,
  commentsLoading = {},
  lastCommentRef,
  lastPostRef, // ✅ ADD THIS PROP
  showingPostIdForScroll,
  toggleComments,
}) => {
  if (!posts) {
    console.error("Posts is undefined!");
    return null;
  }

  if (posts.length === 0) {
    return <EmptyState title="No posts yet" />;
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => {
        const isLastPost = index === posts.length - 1; // ✅ Check if last post

        return (
          <div key={post.id} ref={isLastPost ? lastPostRef : null}> {/* ✅ Attach ref here */}
            <PostCard
              post={post}
              liked={likedPosts?.[post.id]}
              bookmarked={bookmarkedPosts?.[post.id]}
              onLike={() => onLike(post.id)}
              onBookmark={() => onBookmark(post.id)}
              comments={postComments[post.id] || []}
              currentUser={currentUser}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              onEditComment={onEditComment}
              commentsLoading={commentsLoading[post.id]}
              lastCommentRef={lastCommentRef}
              showingPostIdForScroll={showingPostIdForScroll}
              toggleComments={toggleComments}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
