const PostTags = ({ tags = [], tagStatus }) => {

  console.log(tags, tagStatus)
  if (tagStatus === "PENDING") {
    return (
      <div className="mb-5">
        <span className="text-[11px] tracking-wide text-muted-text/70 dark:text-dMuted-text/70">
          Tags generating…
        </span>
      </div>
    );
  }

  if (tagStatus === "READY" && tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {tags.slice(0, 3).map((tag, idx) => (
        <span
          key={idx}
          onClick={(e) => e.stopPropagation()}
          className="px-3 py-1 text-[12px] font-semibold bg-accent/10 dark:bg-daccent/10 text-accent dark:text-daccent rounded-lg hover:bg-accent/20 dark:hover:bg-daccent/20 transition-colors cursor-pointer truncate max-w-[120px]"
        >
          {tag}
        </span>
      ))}
      {tags.length > 3 && (
        <span className="px-3 py-1 text-[12px] font-medium text-muted-text dark:text-dMuted-text">
          +{tags.length - 3}
        </span>
      )}
    </div>
  );
};

export default PostTags;
