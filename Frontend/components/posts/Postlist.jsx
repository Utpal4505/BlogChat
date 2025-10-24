import PostCard from "./Postcard/PostCard";

const PostList = ({
  posts,
  likedPosts,
  bookmarkedPosts,
  onLike,
  onBookmark,
  // ✅ New props for comments
  postComments = {},
  currentUser,
  onAddComment,
  onDeleteComment,
  onEditComment,
  commentsLoading = {},
  lastCommentRef,
  showingPostIdForScroll,
  toggleComments,
}) => {

  console.log("Post List comments reached", posts)

  // ✅ Add guard
  if (!posts) {
    console.error("Posts is undefined!");
    return null;
  }

  if (posts.length === 0) {
    return <EmptyState title="No posts yet" />;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          liked={likedPosts?.[post.id]}
          bookmarked={bookmarkedPosts?.[post.id]}
          onLike={() => onLike(post.id)}
          onBookmark={() => onBookmark(post.id)}
          // ✅ Pass comments and handlers
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
      ))}
    </div>
  );
};

export default PostList;
