import PostCard from "./Postcard/PostCard";

const PostList = ({
  posts,
  likedPosts,
  bookmarkedPosts,
  onLike,
  onBookmark,
}) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="py-16 text-center text-muted-text dark:text-dMuted-text">
        No posts yet
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
          liked={likedPosts[post.id]}
          bookmarked={bookmarkedPosts[post.id]}
          onLike={onLike}
          onBookmark={onBookmark}
        />
      ))}
    </div>
  );
};

export default PostList;
