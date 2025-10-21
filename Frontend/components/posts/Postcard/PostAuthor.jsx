import { Clock, Dot, MoreHorizontal } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const PostAuthor = ({ author, publishedDate, readTime }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent via-primary to-accent dark:from-daccent dark:via-dPrimary dark:to-daccent p-[2px] shadow-lg">
            <div className="w-full h-full rounded-full bg-bg dark:bg-dbg flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={author?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[18px]">👤</span>
              )}
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex flex-col min-w-0">
          <p className="text-[14px] font-bold text-text dark:text-dText hover:text-accent dark:hover:text-daccent transition-colors cursor-pointer truncate">
            {author?.name}
          </p>
          <div className="flex items-center text-[12px] text-muted-text dark:text-dMuted-text">
            <span className="truncate">{publishedDate}</span>
            <Dot size={16} className="flex-shrink-0" />
            <Clock size={11} className="mr-1 flex-shrink-0" />
            <span className="flex-shrink-0">{readTime} min</span>
          </div>
        </div>
      </div>

      {/* More Menu */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="p-2 rounded-xl hover:bg-bg dark:hover:bg-dbg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
      >
        <MoreHorizontal size={18} className="text-muted-text dark:text-dMuted-text" />
      </button>
    </div>
  );
};

export default PostAuthor;
