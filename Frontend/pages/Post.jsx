import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PostAuthor from "../components/posts/Postcard/PostAuthor";
import PostActions from "../components/posts/Postcard/PostActions";
import CommentSection from "../components/posts/Postcard/Comments";
import { toast } from "react-hot-toast";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const Post = () => {
  const { slug } = useParams();
  const {
    user,
    getPostById,
    getPostComments,
    likePost,
    createComment,
    deleteComment,
    updateComment,
    toggleBookmark,
    toggleFollow,
  } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const commentsRef = useRef(null);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = (content || "")
      .replace(/<[^>]+>/g, "")
      .trim()
      .split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes < 1 ? "1 min read" : `${minutes} min read`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPostById(slug);
        const fetchedPost = res?.data;
        setPost(fetchedPost);

        if (fetchedPost?.id) {
          await fetchComments(fetchedPost.id);
        }
      } catch (err) {
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      hljs.highlightAll();
    }
  }, [post]);

  const fetchComments = async (postId) => {
    setCommentsLoading(true);
    try {
      const res = await getPostComments(postId, 100);
      const commentsData = res.data?.data?.comments || [];
      setComments(commentsData);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    setIsLiking(true);
    try {
      setPost((p) => ({
        ...p,
        _count: { ...p._count, postLikes: (p._count?.postLikes || 0) + 1 },
      }));
      await likePost(post.id);
    } catch (err) {
      setPost((p) => ({
        ...p,
        _count: {
          ...p._count,
          postLikes: Math.max((p._count?.postLikes || 1) - 1, 0),
        },
      }));
      toast.error(err.message || "Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (!post) return;
    setIsBookmarking(true);
    try {
      await toggleBookmark(post.id);
      toast.success("Bookmark toggled");
    } catch (err) {
      toast.error(err.message || "Failed to toggle bookmark");
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleFollow = async () => {
    if (!post?.author) return;
    try {
      setIsFollowing((f) => !f);
      await toggleFollow(post.author.id);
    } catch (err) {
      setIsFollowing((f) => !f);
      toast.error(err.message || "Failed to follow user");
    }
  };

  const handleAddComment = async (postId, content) => {
    try {
      const res = await createComment(postId, content);
      const newComment = res.data?.data;
      setComments((prev) => [...prev, newComment]);
      setTimeout(() => {
        commentsRef.current?.scrollTo({
          top: commentsRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete comment");
    }
  };

  const handleEditComment = async (postId, commentId, content) => {
    try {
      const res = await updateComment(postId, commentId, content);
      const updated = res.data?.data;
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c))
      );
      toast.success("Comment updated");
    } catch (err) {
      toast.error(err.message || "Failed to update comment");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <div className="h-56 bg-bordercolor/20 dark:bg-dbordercolor/20 rounded-lg mb-6 animate-pulse" />
        <div className="h-8 bg-bordercolor/20 dark:bg-dbordercolor/20 rounded w-3/4 mb-4 animate-pulse" />
        <div className="h-6 bg-bordercolor/20 dark:bg-dbordercolor/20 rounded w-1/2 mb-2 animate-pulse" />
        <div className="h-3 bg-bordercolor/20 dark:bg-dbordercolor/20 rounded w-full mb-2 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <p className="text-muted-text">Post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {post.coverImage && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-extrabold mb-3 text-text dark:text-dText">
        {post.title}
      </h1>
      <div className="flex items-center justify-between mb-6">
        <PostAuthor
          author={post.author}
          publishedDate={post.createdAt}
          readTime={calculateReadTime(post.content)}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={handleFollow}
            className="px-3 py-1 rounded-md border border-bordercolor/40 dark:border-dbordercolor/40 text-sm"
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      <PostActions
        likes={post._count?.postLikes || 0}
        comments={comments.length || post._count?.comments || 0}
        liked={false}
        bookmarked={false}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onCommentClick={() => {
          setShowComments(true);
          setTimeout(() => commentsRef.current?.focus(), 100);
        }}
        showingComments={showComments}
      />

      <div
        className="prose dark:prose-invert blog-post-content mt-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.postTags?.length > 0 && (
        <div className="mt-6 flex gap-2 flex-wrap">
          {post.postTags.map((pt) => (
            <Link
              key={pt.tag.name}
              to={`/search?tag=${encodeURIComponent(pt.tag.name)}`}
              className="px-3 py-1 rounded-md bg-bordercolor/10 dark:bg-dbordercolor/10 text-sm hover:bg-accent/10"
            >
              {pt.tag.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8" ref={commentsRef}>
        <CommentSection
          postId={post.id}
          comments={comments}
          currentUser={user}
          isLoading={commentsLoading}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onEditComment={handleEditComment}
        />
      </div>
    </div>
  );
};

export default Post;
