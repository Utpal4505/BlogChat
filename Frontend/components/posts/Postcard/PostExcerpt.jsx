const PostExcerpt = ({ excerpt }) => {
  if (!excerpt) return null;

  return (
    <p className="text-[15px] text-muted-text dark:text-dMuted-text leading-relaxed mb-4 line-clamp-3">
      {excerpt}
    </p>
  );
};

export default PostExcerpt;
