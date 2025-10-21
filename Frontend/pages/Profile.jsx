import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MessageCircle, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileHeader from "../components/profile/ProfileHeader/ProfileHeader";
import TabsNavigation from "../components/profile/ProfileTabs/TabButton";
import PostList from "../components/posts/Postlist";
import EmptyState from "../components/profile/EmptyState";
import LoadingScreen from "../components/LoadingScreen";

const ProfilePage = () => {
  const { username } = useParams(); // Get username from URL (/profile/utpal)
  const { user, getUserProfile, toggleFollow } = useContext(AuthContext);

  // Local state for this profile page
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});

  // Fetch profile data when component mounts or username changes
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // If no username in URL, show current user's profile
        const usernameToFetch = username || user?.username;

        if (!usernameToFetch) {
          setError("No user specified");
          return;
        }

        // Fetch user profile
        const profileData = await getUserProfile(usernameToFetch);

        console.log(profileData)

        // ✅ Add default _count if backend doesn't send it
        const userData = profileData.data;
        if (!userData._count) {
          userData._count = {
            followers: 0,
            followees: 0,
          };
        }

        setProfileUser(profileData.data);

        setPosts([
          {
            id: 1,
            title: "Building a Modern Blog Platform with React and Tailwind",
            excerpt:
              "Learn how to create a beautiful, responsive blog platform using React, Tailwind CSS, and Framer Motion with smooth animations and dark mode support.",
            coverImage:
              "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
            author: {
              name: profileData.data.name,
              avatar: profileData.data.avatar,
            },
            publishedDate: "2h ago",
            readTime: 8,
            likes: 234,
            comments: 45,
            tags: ["React", "Tailwind", "Web Dev"],
          },
          {
            id: 2,
            title: "The Art of Writing Clean and Maintainable Code",
            excerpt:
              "Discover essential principles and best practices for writing code that's easy to read, understand, and maintain for long-term project success.",
            coverImage:
              "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
            author: {
              name: profileData.data.name,
              avatar: profileData.data.avatar,
            },
            publishedDate: "1d ago",
            readTime: 6,
            likes: 567,
            comments: 89,
            tags: ["Clean Code", "Best Practices", "Programming"],
          },
        ]);

        // Set following status from backend response
        setIsFollowing(profileData.data.isFollowing || false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, user, getUserProfile]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!profileUser) return;

    try {
      const result = await toggleFollow(profileUser.id);

      // Update following status
      const newFollowingStatus = result.data.isFollowing;
      setIsFollowing(newFollowingStatus);

      // Update follower count optimistically
      setProfileUser((prev) => ({
        ...prev,
        _count: {
          ...prev._count,
          followers: newFollowingStatus
            ? prev._count.followers + 1
            : prev._count.followers - 1,
        },
      }));
    } catch (err) {
      console.error("Error toggling follow:", err);
      alert(err.message || "Failed to follow/unfollow");
    }
  };

  const handleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    // TODO: Call backend API to like post
  };

  const handleBookmark = (postId) => {
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    // TODO: Call backend API to bookmark post
  };

  // Loading state
  if (loading) {
    return <LoadingScreen text="Loading profile..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-dbg">
        <div className="text-center">
          <p className="text-xl text-danger mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-accent dark:bg-daccent text-bg dark:text-dText rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User not found
  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-dbg">
        <div className="text-center">
          <p className="text-xl text-muted-text dark:text-dMuted-text mb-4">
            User not found
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-accent dark:bg-daccent text-bg dark:text-dText rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if viewing own profile
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
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "posts" && (
              <PostList
                posts={posts}
                likedPosts={likedPosts}
                bookmarkedPosts={bookmarkedPosts}
                onLike={handleLike}
                onBookmark={handleBookmark}
              />
            )}

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

            {activeTab === "saved" && (
              <EmptyState
                icon={Bookmark}
                title="No saved posts yet"
                subtitle={
                  isOwnProfile
                    ? "Save posts to easily find them later."
                    : "Saved posts are private."
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;
