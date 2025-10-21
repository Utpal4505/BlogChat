import { motion as Motion } from "framer-motion";
import PostCoverImage from "./PostCoverImage";
import PostAuthor from "./PostAuthor";
import PostTitle from "./PostTitle";
import PostExcerpt from "./PostExcerpt";
import PostTags from "./PostTags";
import PostActions from "./PostActions";

const PostCard = ({ post, index, liked, bookmarked, onLike, onBookmark }) => {
  return (
    <Motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group relative bg-card dark:bg-dcard rounded-[22px] overflow-hidden border border-bordercolor/60 dark:border-dbordercolor/60 hover:border-accent/40 dark:hover:border-daccent/40 hover:shadow-2xl hover:shadow-accent/5 dark:hover:shadow-daccent/5 transition-all duration-300 cursor-pointer"
    >
      {/* Cover Image */}
      <PostCoverImage coverImage={post.coverImage} title={post.title} />

      {/* Content Section */}
      <div className="p-6">
        {/* Author & Meta */}
        <PostAuthor
          author={post.author}
          publishedDate={post.publishedDate}
          readTime={post.readTime}
        />

        {/* Title */}
        <PostTitle title={post.title} />

        {/* Excerpt */}
        <PostExcerpt excerpt={post.excerpt} />

        {/* Tags */}
        <PostTags tags={post.tags} />

        {/* Stats & Actions */}
        <PostActions
          likes={post.likes}
          comments={post.comments}
          liked={liked}
          bookmarked={bookmarked}
          onLike={() => onLike(post.id)}
          onBookmark={() => onBookmark(post.id)}
        />
      </div>
    </Motion.article>
  );
};

export default PostCard;
