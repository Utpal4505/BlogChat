import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MessageCircle, Bookmark, FileText } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import ProfileHeader from "../components/profile/ProfileHeader/ProfileHeader";
import TabsNavigation from "../components/profile/ProfileTabs/TabButton";
import PostList from "../components/posts/Postlist";
import EmptyState from "../components/profile/EmptyState";
import LoadingScreen from "../components/LoadingScreen";
import ErrorScreen from "../components/ErrorScreen";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const ProfilePage = () => {
  const { username } = useParams();
  const {
    user,
    getUserProfile,
    toggleFollow,
    getUserPosts,
    likePost,
    toggleBookmark,
    getBookmarkPosts,
    getPostComments,
    createComment,
    deleteComment,
  } = useContext(AuthContext);

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});

  const [postComments, setPostComments] = useState({});
  const [commentsLoading, setCommentsLoading] = useState({});
  const [commentsCursor, setCommentsCursor] = useState({});

  const [showingPostIdForScroll, setShowingPostIdForScroll] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const usernameToFetch = username || user?.username;
        if (!usernameToFetch) {
          setError("No user specified");
          return;
        }

        const profileData = await getUserProfile(usernameToFetch);
        const userData = profileData.data;
        if (!userData._count) {
          userData._count = { followers: 0, followees: 0 };
        }

        setProfileUser(userData);
        setIsFollowing(profileData.data.isFollowing ?? false);

        // Fetch posts
        const postsData = await getUserPosts(usernameToFetch);

        setPosts(postsData.data || []);

        // Initialize liked status
        const initialLikedPosts = {};
        const initialBookmarkedPosts = {};

        postsData.data?.forEach((post) => {
          initialLikedPosts[post.id] = post.isLiked || false;
          initialBookmarkedPosts[post.id] = post.isBookmarked || false;
        });

        setLikedPosts(initialLikedPosts);
        setBookmarkedPosts(initialBookmarkedPosts);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, getUserProfile, getUserPosts]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (activeTab === "posts" && profileUser) {
        try {
          setLoading(true);
          const bookmarksData = await getBookmarkPosts();
          setSavedPosts(bookmarksData.data || []);

          // Initialize status for saved posts
          const initialLikedPosts = {};
          const initialBookmarkedPosts = {};

          bookmarksData.data?.forEach((post) => {
            initialLikedPosts[post.id] = post.isLiked || false;
            initialBookmarkedPosts[post.id] = true; // All saved posts are bookmarked
          });

          setLikedPosts((prev) => ({ ...prev, ...initialLikedPosts }));
          setBookmarkedPosts((prev) => ({
            ...prev,
            ...initialBookmarkedPosts,
          }));
        } catch (err) {
          console.error("Error fetching bookmarks:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSavedPosts();
  }, [activeTab, getBookmarkPosts, profileUser]);

  const handleFollowToggle = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (!profileUser) return;

    try {
      const result = await toggleFollow(profileUser.id);
      const newFollowingStatus = result.data.following;
      setIsFollowing(newFollowingStatus);
    } catch (err) {
      console.error("Error toggling follow:", err);
      alert(err.message || "Failed to follow/unfollow");
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const wasLiked = likedPosts[postId] || false;
    const currentPost = posts.find((p) => p.id === postId);
    const currentCount = currentPost?._count?.postLikes || 0;

    // Optimistic update
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              _count: {
                ...post._count,
                postLikes: wasLiked ? currentCount - 1 : currentCount + 1,
              },
            }
          : post
      )
    );

    try {
      await likePost(postId); // ✅ Just call, don't need response
    } catch (error) {
      console.error("❌ Like failed, reverting...", error);

      // Revert optimistic update
      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  postLikes: currentCount,
                },
              }
            : post
        )
      );

      alert("Failed to like post");
    }
  };

  const handleBookmark = async (postId) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const wasBookmarked = likedPosts[postId] || false;

    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !wasBookmarked }));

    // Call toggleBookmark API
    try {
      const result = await toggleBookmark(postId);
      console.log("Bookmark toggled:", result);

      setBookmarkedPosts((prev) => ({
        ...prev,
        [postId]: result.bookmarked,
      }));
    } catch (error) {
      console.error("❌ Bookmark failed, reverting...", error);

      // Revert on error
      setBookmarkedPosts((prev) => ({ ...prev, [postId]: wasBookmarked }));
      alert("Failed to bookmark post");
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  const fetchPostComments = async (postId, limit = 10, cursor = null) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      setCommentsLoading((prev) => ({ ...prev, [postId]: true }));

      console.log("Comments fetching start");

      // API call
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

        console.log("Backend fetched data for comments", commentsArray);
      } else {
        console.error("Failed to fetch comments or empty data", response);
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

  const lastCommentRef = useInfiniteScroll(loadMoreComments);

  const toggleComments = (postId) => {
    console.log(
      "Toggle comment work start in profile page for this postId....",
      postId
    );
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
    if (!user) {
      window.location.href = "/login";
      return;
    }

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
    console.log("PostId", postId, "CommentId", commentId);
    try {
      await deleteComment(postId, commentId);

      setPostComments((prev) => {
        console.log("Before delete, postComments[postId]:", prev[postId]);
        return {
          ...prev,
          [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading profile..." />;
  }

  if (error) {
    let errorType = "error";
    if (
      error.toLowerCase().includes("not found") ||
      error.toLowerCase().includes("user")
    ) {
      errorType = "404";
    } else if (
      error.toLowerCase().includes("network") ||
      error.toLowerCase().includes("connection")
    ) {
      errorType = "network";
    } else if (
      error.toLowerCase().includes("permission") ||
      error.toLowerCase().includes("access")
    ) {
      errorType = "403";
    }

    return (
      <ErrorScreen
        type={errorType}
        title={errorType === "404" ? "User Not Found" : undefined}
        message={error}
        showRefresh={true}
        showHome={true}
        showBack={true}
        onRetry={handleRetry}
      />
    );
  }

  if (!profileUser) {
    return (
      <ErrorScreen
        type="404"
        title="User Not Found"
        message="This profile doesn't exist or has been removed."
        showRefresh={false}
        showHome={true}
        showBack={true}
      />
    );
  }

  const isOwnProfile = user?.username === profileUser.username;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg/95 dark:from-dbg dark:to-dbg/95">
      <div className="max-w-[620px] mx-auto px-4 sm:px-6">
        <ProfileHeader
          user={profileUser}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
          isOwnProfile={isOwnProfile}
        />

        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode="wait">
          <Motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "posts" &&
              (posts.length > 0 ? (
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
                  currentUser={user}
                  showingPostIdForScroll={showingPostIdForScroll}
                  toggleComments={toggleComments}
                  lastCommentRef={lastCommentRef}
                />
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No posts yet"
                  subtitle={
                    isOwnProfile
                      ? "Start sharing your thoughts!"
                      : "This user hasn't posted anything yet."
                  }
                />
              ))}

            {activeTab === "replies" && (
              <EmptyState
                icon={MessageCircle}
                title="No replies yet"
                subtitle={
                  isOwnProfile
                    ? "When you reply to posts, they'll show up here."
                    : "No replies from this user yet."
                }
              />
            )}

            {activeTab === "saved" &&
              (isOwnProfile ? (
                savedPosts.length > 0 ? (
                  <PostList
                    posts={savedPosts}
                    likedPosts={likedPosts}
                    bookmarkedPosts={bookmarkedPosts}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                  />
                ) : (
                  <EmptyState
                    icon={Bookmark}
                    title="No saved posts yet"
                    subtitle="Save posts to easily find them later."
                  />
                )
              ) : (
                <EmptyState
                  icon={Bookmark}
                  title="Saved posts are private"
                  subtitle="Only you can see what you've saved."
                />
              ))}
          </Motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;
