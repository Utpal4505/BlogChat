import { Clock, Dot, MoreHorizontal } from "lucide-react";

const PostAuthor = ({ author, publishedDate, readTime }) => {

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    // 7 days ke baad full date
    return postDate.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short'
    });
  };

  const formatedDate = formatDate(publishedDate);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent via-primary to-accent dark:from-daccent dark:via-dPrimary dark:to-daccent p-[2px] shadow-lg">
            <div className="w-full h-full rounded-full bg-bg dark:bg-dbg flex items-center justify-center overflow-hidden">
              {author?.avatar ? (
                <img
                  src={author.avatar}
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
            {author?.username}
          </p>
          <div className="flex items-center text-[12px] text-muted-text dark:text-dMuted-text">
            <span className="truncate">{formatedDate}</span>
            <Dot size={16} className="flex-shrink-0" />
            <Clock size={11} className="mr-1 flex-shrink-0" />
            <span className="flex-shrink-0">{readTime}</span>
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
