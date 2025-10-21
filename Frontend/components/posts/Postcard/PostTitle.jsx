const PostTitle = ({ title }) => {
  return (
    <h2 className="text-[21px] font-extrabold text-text dark:text-dText leading-[1.3] mb-3 line-clamp-2 group-hover:text-accent dark:group-hover:text-daccent transition-colors">
      {title}
    </h2>
  );
};

export default PostTitle;
