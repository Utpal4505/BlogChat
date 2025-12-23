import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion as Motion } from "framer-motion";
import { Search, Filter, Users, Tag, Flame, ArrowRight, TrendingUp, Zap } from "lucide-react";
import EmptyState from "../components/profile/EmptyState";
import PostCard from "../components/posts/Postcard/PostCard";
import LoadingScreen from "../components/LoadingScreen";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const { user, searchDetail, likePost, toggleBookmark } = useContext(AuthContext);

  const [allResults, setAllResults] = useState({ posts: [], authors: [], tags: [] });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [sort, setSort] = useState("newest");
  const [timeFilter, setTimeFilter] = useState("all");
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const fetchSearchResults = async (searchCursor = null) => {
    try {
      setLoading(true);
      const response = await searchDetail(query);

      const { posts = [], authors = [], tags = [] } = response.data;

      if (searchCursor) {
        setAllResults((prev) => ({
          ...prev,
          posts: [...prev.posts, ...posts],
        }));
      } else {
        setAllResults({ posts, authors, tags });
        setResults(posts);
      }

      setCursor(response.data.nextCursor || null);
      setHasMore(!!response.data.nextCursor);

      // Initialize liked & bookmarked status
      const initialLikedPosts = {};
      const initialBookmarkedPosts = {};

      posts.forEach((post) => {
        initialLikedPosts[post.id] = post.isLiked || false;
        initialBookmarkedPosts[post.id] = post.isBookmarked || false;
      });

      setLikedPosts((prev) => ({ ...prev, ...initialLikedPosts }));
      setBookmarkedPosts((prev) => ({ ...prev, ...initialBookmarkedPosts }));
    } catch (err) {
      console.error("Error fetching search results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setAllResults({ posts: [], authors: [], tags: [] });
      setResults([]);
      setCursor(null);
      setActiveTab("posts");
      fetchSearchResults();
    }
  }, [query]);

  useEffect(() => {
    if (activeTab === "posts") {
      setResults(allResults.posts);
    } else if (activeTab === "authors") {
      setResults(allResults.authors);
    } else if (activeTab === "tags") {
      setResults(allResults.tags);
    }
  }, [activeTab, allResults]);

  const handleLoadMore = () => {
    if (cursor && hasMore && activeTab === "posts") {
      fetchSearchResults(cursor);
    }
  };

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

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg/95 dark:from-dbg dark:to-dbg/95">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <EmptyState 
            title="No search query" 
            subtitle="Enter a search term to begin"
          />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "posts", label: "Posts", count: allResults.posts.length, icon: Flame, color: "from-primary to-accent" },
    { id: "authors", label: "Authors", count: allResults.authors.length, icon: Users, color: "from-blue-500 to-cyan-500" },
    { id: "tags", label: "Tags", count: allResults.tags.length, icon: Tag, color: "from-purple-500 to-pink-500" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg via-bg/98 to-bg/95 dark:from-dbg dark:via-dbg/98 dark:to-dbg/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <Motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 relative"
        >
          <div className="absolute inset-0 -top-20 -left-10 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/5 dark:from-dprimary/5 dark:to-daccent/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-dprimary/20 dark:to-daccent/20 rounded-2xl backdrop-blur-md border border-primary/30 dark:border-dprimary/30">
                <Search className="w-7 h-7 text-primary dark:text-dprimary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary dark:from-dprimary dark:via-daccent dark:to-dprimary bg-clip-text text-transparent">
                  Search Results
                </h1>
                <p className="text-sm text-muted-text dark:text-dMuted-text mt-1">
                  Discover what you're looking for
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-card/50 dark:bg-dcard/50 backdrop-blur-sm rounded-2xl border border-bordercolor/30 dark:border-dbordercolor/30">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-text dark:text-dMuted-text">Found</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 dark:bg-dprimary/10 text-primary dark:text-dprimary rounded-full font-bold">
                  <Zap className="w-4 h-4" />
                  {allResults.posts.length + allResults.authors.length + allResults.tags.length}
                </span>
                <span className="text-muted-text dark:text-dMuted-text">results for</span>
                <span className="px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-dprimary/10 dark:to-daccent/10 text-primary dark:text-dprimary font-bold rounded-full truncate">
                  "{query}"
                </span>
              </div>
            </div>
          </div>
        </Motion.div>

        {/* Enhanced Tabs */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-3 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-primary/40 dark:shadow-dprimary/40`
                      : "bg-card dark:bg-dcard text-text dark:text-dText border-2 border-bordercolor dark:border-dbordercolor hover:border-primary/50 dark:hover:border-dprimary/50"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                    isActive
                      ? "bg-white/30 text-white"
                      : "bg-bordercolor dark:bg-dbordercolor text-text dark:text-dText group-hover:bg-primary/20 dark:group-hover:bg-dprimary/20"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </Motion.div>

        {/* Filter & Sort Bar */}
        {activeTab === "posts" && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
          >
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-card dark:bg-dcard border-2 border-bordercolor dark:border-dbordercolor text-text dark:text-dText font-medium hover:border-primary/50 dark:hover:border-dprimary/50 hover:bg-primary/5 dark:hover:bg-dprimary/5 transition-all transform hover:scale-105 active:scale-95"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-5 py-3 rounded-xl bg-card dark:bg-dcard border-2 border-bordercolor dark:border-dbordercolor text-text dark:text-dText font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-dprimary/40 transition-all"
            >
              <option value="newest">🆕 Newest</option>
              <option value="oldest">📅 Oldest</option>
              <option value="trending">🔥 Trending</option>
              <option value="popular">⭐ Popular</option>
            </select>
          </Motion.div>
        )}

        {/* Expanded Filters */}
        {showFilters && activeTab === "posts" && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-6 rounded-2xl bg-card dark:bg-dcard border-2 border-bordercolor dark:border-dbordercolor"
          >
            <h3 className="font-bold text-text dark:text-dText mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary dark:text-dprimary" />
              Time Filter
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "All Time", value: "all", emoji: "♾️" },
                { label: "Last 24 Hours", value: "day", emoji: "📅" },
                { label: "Last Week", value: "week", emoji: "📆" },
                { label: "Last Month", value: "month", emoji: "📊" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeFilter(option.value)}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
                    timeFilter === option.value
                      ? "bg-gradient-to-r from-primary to-accent dark:from-dprimary dark:to-daccent text-white shadow-lg"
                      : "bg-bordercolor dark:bg-dbordercolor text-text dark:text-dText hover:bg-primary/20 dark:hover:bg-dprimary/20"
                  }`}
                >
                  <span>{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </Motion.div>
        )}

        {/* Results */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {loading && results.length === 0 ? (
            <LoadingScreen text="Searching..." />
          ) : results.length > 0 ? (
            <Motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Posts Results */}
              {activeTab === "posts" &&
                results.map((post) => (
                  <Motion.div key={post.id} variants={itemVariants}>
                    <PostCard
                      post={post}
                      liked={likedPosts[post.id]}
                      bookmarked={bookmarkedPosts[post.id]}
                      onLike={() => handleLike(post.id)}
                      onBookmark={() => handleBookmark(post.id)}
                      currentUser={user}
                    />
                  </Motion.div>
                ))}

              {/* Authors Results */}
              {activeTab === "authors" &&
                results.map((author) => (
                  <Motion.div
                    key={author.id}
                    variants={itemVariants}
                    onClick={() => navigate(`/profile/${author.username}`)}
                    className="group p-5 bg-card dark:bg-dcard border-2 border-bordercolor dark:border-dbordercolor rounded-2xl hover:border-primary/50 dark:hover:border-dprimary/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 cursor-pointer overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 dark:group-hover:from-dprimary/5 dark:group-hover:to-daccent/5 transition-all duration-300"></div>
                    
                    <div className="relative z-10 flex items-center gap-5">
                      <div className="relative">
                        <img
                          src={author.avatar}
                          alt={author.username}
                          className="w-20 h-20 rounded-2xl object-cover ring-3 ring-bordercolor dark:ring-dbordercolor group-hover:ring-primary dark:group-hover:ring-dprimary transition-all shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary to-accent dark:from-dprimary dark:to-daccent rounded-full flex items-center justify-center text-white text-xs font-bold">
                          ✓
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-text dark:text-dText group-hover:text-primary dark:group-hover:text-dprimary transition-colors truncate">
                          @{author.username}
                        </h3>
                        <p className="text-sm text-muted-text dark:text-dMuted-text truncate mb-3">
                          {author.name}
                        </p>
                        <div className="flex gap-4 text-xs font-semibold">
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                            👥 {author._count?.followers || 0}
                          </span>
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                            📝 {author._count?.posts || 0}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="px-5 py-3 bg-gradient-to-r from-primary to-accent dark:from-dprimary dark:to-daccent text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl whitespace-nowrap transform hover:scale-105 active:scale-95"
                      >
                        Follow
                      </button>
                    </div>
                  </Motion.div>
                ))}

              {/* Tags Results */}
              {activeTab === "tags" &&
                results.map((tag) => (
                  <Motion.div
                    key={tag.id}
                    variants={itemVariants}
                    onClick={() => navigate(`/tags/${tag.name}`)}
                    className="group p-5 bg-card dark:bg-dcard border-2 border-bordercolor dark:border-dbordercolor rounded-2xl hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 cursor-pointer overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-2xl group-hover:from-purple-500/30 group-hover:to-pink-500/30 dark:group-hover:from-purple-500/20 dark:group-hover:to-pink-500/20 transition-all">
                          <Tag className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-text dark:text-dText group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            #{tag.name}
                          </h3>
                          <p className="text-sm text-muted-text dark:text-dMuted-text">
                            {tag._count?.postTags || 0} posts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-bold">
                          {tag._count?.postTags || 0}
                        </span>
                        <ArrowRight className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Motion.div>
                ))}

              {/* Load More Button */}
              {activeTab === "posts" && hasMore && (
                <Motion.div
                  variants={itemVariants}
                  className="flex justify-center pt-4"
                >
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent dark:from-dprimary dark:to-daccent text-white font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <span>{loading ? "Loading..." : "Load More Results"}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Motion.div>
              )}

              {!hasMore && activeTab === "posts" && results.length > 0 && (
                <Motion.div
                  variants={itemVariants}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-lg font-semibold text-text dark:text-dText mb-2">
                    You've reached the end!
                  </p>
                  <p className="text-muted-text dark:text-dMuted-text">
                    No more results to show
                  </p>
                </Motion.div>
              )}
            </Motion.div>
          ) : (
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <EmptyState
                title="No results found"
                subtitle={`We couldn't find any ${activeTab} for "${query}". Try different keywords.`}
              />
            </Motion.div>
          )}
        </Motion.div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
