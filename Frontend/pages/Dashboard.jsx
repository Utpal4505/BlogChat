import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion as Motion } from "framer-motion";
import PostList from "../components/posts/Postlist";
import LoadingScreen from "../components/LoadingScreen";
import EmptyState from "../components/profile/EmptyState";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { FileText, ChevronRight, Sparkles } from "lucide-react";

const FeedPage = () => {
  const navigate = useNavigate();
  const {
    user,
    getFeedPosts,
    likePost,
    toggleBookmark,
    getPostComments,
    createComment,
    deleteComment,
    updateComment,
  } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [postsCursor, setPostsCursor] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [postComments, setPostComments] = useState({});
  const [commentsLoading, setCommentsLoading] = useState({});
  const [commentsCursor, setCommentsCursor] = useState({});
  const [showingPostIdForScroll, setShowingPostIdForScroll] = useState(null);

  // Fetch feed posts with cursor
  const fetchFeedPosts = async (limit = 10, cursor = null) => {
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const feedData = await getFeedPosts(limit, cursor);
      const postsData = feedData.data.postsWithStatus || [];
      const nextCursor = feedData.data.nextCursor || null;

      setPosts((prev) => (cursor ? [...prev, ...postsData] : postsData));
      setPostsCursor(nextCursor);
      setHasMorePosts(!!nextCursor);

      const initialLikedPosts = {};
      const initialBookmarkedPosts = {};

      postsData.forEach((post) => {
        initialLikedPosts[post.id] = post.isLiked || false;
        initialBookmarkedPosts[post.id] = post.isBookmarked || false;
      });

      setLikedPosts((prev) => ({ ...prev, ...initialLikedPosts }));
      setBookmarkedPosts((prev) => ({ ...prev, ...initialBookmarkedPosts }));
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFeedPosts(10, null);
  }, []);

  // Load more posts when scrolling
  const loadMorePosts = useCallback(() => {
    if (postsCursor && hasMorePosts && !loadingMore) {
      fetchFeedPosts(10, postsCursor);
    }
  }, [postsCursor, hasMorePosts, loadingMore]);

  const lastPostRefCallback = useInfiniteScroll(loadMorePosts);

  // Handle like
  const handleLike = async (postId) => {
    if (!user) return (window.location.href = "/login");

    const wasLiked = likedPosts[postId] || false;

    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              _count: {
                ...post._count,
                postLikes: post._count.postLikes + (wasLiked ? -1 : 1),
              },
            }
          : post
      )
    );

    try {
      await likePost(postId);
    } catch (err) {
      console.error("Like failed, reverting", err);
      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  postLikes: post._count.postLikes + (wasLiked ? 1 : -1),
                },
              }
            : post
        )
      );
    }
  };

  // Handle bookmark
  const handleBookmark = async (postId) => {
    if (!user) return (window.location.href = "/login");

    const wasBookmarked = bookmarkedPosts[postId] || false;
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !wasBookmarked }));

    try {
      const result = await toggleBookmark(postId);
      setBookmarkedPosts((prev) => ({
        ...prev,
        [postId]: result.bookmarked,
      }));
    } catch (error) {
      console.error("Bookmark failed, reverting...", error);
      setBookmarkedPosts((prev) => ({ ...prev, [postId]: wasBookmarked }));
    }
  };

  // Fetch comments
  const fetchPostComments = async (postId, limit = 10, cursor = null) => {
    if (!user) return (window.location.href = "/login");

    try {
      setCommentsLoading((prev) => ({ ...prev, [postId]: true }));

      const response = await getPostComments(postId, limit, cursor);

      if (response && response.success) {
        const commentsArray = response.data.comments || [];
        const nextCursorValue = response.nextCursor || null;

        setPostComments((prev) => ({
          ...prev,
          [postId]: cursor
            ? [...(prev[postId] || []), ...commentsArray]
            : commentsArray,
        }));

        setCommentsCursor((prev) => ({
          ...prev,
          [postId]: nextCursorValue,
        }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const loadMoreComments = () => {
    if (
      showingPostIdForScroll &&
      commentsCursor[showingPostIdForScroll] &&
      !commentsLoading[showingPostIdForScroll]
    ) {
      fetchPostComments(
        showingPostIdForScroll,
        10,
        commentsCursor[showingPostIdForScroll]
      );
    }
  };

  const lastCommentRefCallback = useInfiniteScroll(loadMoreComments);

  const toggleComments = (postId) => {
    if (showingPostIdForScroll === postId) {
      setShowingPostIdForScroll(null);
    } else {
      setShowingPostIdForScroll(postId);
      if (!postComments[postId]) {
        fetchPostComments(postId, 10);
      }
    }
  };

  const handleAddComment = async (postId, content) => {
    if (!user) return (window.location.href = "/login");

    try {
      const { data } = await createComment(postId, content);
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data],
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(postId, commentId);
      setPostComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async (postId, commentId, content) => {
    if (!user) return (window.location.href = "/login");

    try {
      const { data } = await updateComment(postId, commentId, content);
      setPostComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).map((c) =>
          c.id === commentId ? { ...c, content: data.content } : c
        ),
      }));
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading feed..." />;
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-dbg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Motion.button
            onClick={() => navigate("/Write-Blog")}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="w-full mb-6 bg-card dark:bg-dcard rounded-2xl shadow-sm border border-bordercolor dark:border-dbordercolor overflow-hidden hover:shadow-md dark:hover:shadow-lg group"
          >
            <div className="px-4 sm:px-6 py-5">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0 relative">
                  <img
                    src={user?.avatar || "https://www.gravatar.com/avatar/?d=mp"}
                    alt={user?.username}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 dark:ring-dPrimary/30 shadow-sm"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/0 via-primary/0 to-primary/10 dark:to-dPrimary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-text dark:text-dText flex items-center gap-2">
                    Share your story
                    <Sparkles className="w-3.5 h-3.5 text-primary dark:text-dPrimary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </p>
                  <p className="text-xs text-muted-text dark:text-dMuted-text mt-0.5">
                    Write a blog that inspires the community
                  </p>
                </div>

                {/* Icon Badge */}
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 dark:bg-dPrimary/15 border border-primary/20 dark:border-dPrimary/30 group-hover:bg-primary/15 dark:group-hover:bg-dPrimary/25 transition-colors duration-300">
                  <FileText className="w-5 h-5 text-primary dark:text-dPrimary" />
                </div>

                {/* Chevron */}
                <Motion.div
                  animate={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <ChevronRight className="w-5 h-5 text-muted-text dark:text-dMuted-text" />
                </Motion.div>
              </div>
            </div>

            {/* Bottom Accent Line */}
            <Motion.div
              className="h-0.5 bg-gradient-to-r from-transparent via-primary/40 dark:via-dPrimary/50 to-transparent"
              style={{
                boxShadow: `0 0 12px rgba(122, 153, 158, 0.15)`,
              }}
            />
          </Motion.button>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-bordercolor dark:via-dbordercolor to-transparent mb-6" />

          {/* Feed Content */}
          {posts.length > 0 ? (
            <>
              <PostList
                posts={posts}
                likedPosts={likedPosts}
                bookmarkedPosts={bookmarkedPosts}
                onLike={handleLike}
                onBookmark={handleBookmark}
                postComments={postComments}
                commentsLoading={commentsLoading}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                onEditComment={handleEditComment}
                currentUser={user}
                showingPostIdForScroll={showingPostIdForScroll}
                toggleComments={toggleComments}
                lastCommentRef={lastCommentRefCallback}
                lastPostRef={lastPostRefCallback}
              />
              {loadingMore && (
                <div className="flex justify-center py-8">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{
                      borderColor: "transparent",
                      borderBottomColor: "rgb(122, 153, 158)",
                    }}
                  />
                </div>
              )}
              {!hasMorePosts && posts.length > 0 && (
                <div className="text-center py-8 text-sm text-muted-text dark:text-dMuted-text">
                  You've reached the end
                </div>
              )}
            </>
          ) : (
            <EmptyState title="No posts in your feed" subtitle="" />
          )}
        </Motion.div>
      </div>
    </div>
  );
};

export default FeedPage;
