import { Heart, MessageCircle, Bookmark } from "lucide-react";

const PostActions = ({ likes, comments, liked, bookmarked, onLike, onBookmark }) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-bordercolor/50 dark:border-dbordercolor/50">
      {/* Engagement Stats */}
      <div className="flex items-center gap-5">
        {/* Likes */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="flex items-center gap-2 group/like transition-all"
        >
          <Heart
            size={19}
            strokeWidth={2.2}
            className={`transition-all duration-200 ${
              liked
                ? "fill-danger stroke-danger scale-110"
                : "stroke-muted-text dark:stroke-dMuted-text group-hover/like:stroke-danger group-hover/like:scale-110"
            }`}
          />
          <span
            className={`text-[14px] font-bold tabular-nums transition-colors ${
              liked
                ? "text-danger"
                : "text-muted-text dark:text-dMuted-text group-hover/like:text-danger"
            }`}
          >
            {likes}
          </span>
        </button>

        {/* Comments */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 group/comment transition-all"
        >
          <MessageCircle
            size={19}
            strokeWidth={2.2}
            className="stroke-muted-text dark:stroke-dMuted-text group-hover/comment:stroke-accent dark:group-hover/comment:stroke-daccent group-hover/comment:scale-110 transition-all duration-200"
          />
          <span className="text-[14px] font-bold tabular-nums text-muted-text dark:text-dMuted-text group-hover/comment:text-accent dark:group-hover/comment:text-daccent transition-colors">
            {comments}
          </span>
        </button>
      </div>

      {/* Bookmark */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBookmark();
        }}
        className="p-2.5 rounded-xl hover:bg-accent/10 dark:hover:bg-daccent/10 transition-all duration-200"
      >
        <Bookmark
          size={19}
          strokeWidth={2.2}
          className={`transition-all duration-200 ${
            bookmarked
              ? "fill-accent dark:fill-daccent stroke-accent dark:stroke-daccent scale-110"
              : "stroke-muted-text dark:stroke-dMuted-text hover:stroke-accent dark:hover:stroke-daccent hover:scale-110"
          }`}
        />
      </button>
    </div>
  );
};

export default PostActions;
