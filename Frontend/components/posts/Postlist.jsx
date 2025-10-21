import PostCard from "./Postcard/PostCard";

const PostList = ({ posts, likedPosts, bookmarkedPosts, onLike, onBookmark }) => {

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
        />
      ))}
    </div>
  );
};

export default PostList;
