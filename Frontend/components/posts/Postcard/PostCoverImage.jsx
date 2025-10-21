const PostCoverImage = ({ coverImage, title }) => {
  if (!coverImage) return null;

  return (
    <div className="relative w-full h-52 overflow-hidden bg-bg dark:bg-dbg">
      <img
        src={coverImage}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-card/20 dark:from-dcard/80 dark:via-dcard/20 to-transparent"></div>
    </div>
  );
};

export default PostCoverImage;
