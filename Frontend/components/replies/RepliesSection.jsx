import { MessageCircle } from "lucide-react";
import PostCard from "../posts/Postcard/PostCard";

const dummyReplies = [
  {
    id: 1,
    originalPost: {
      id: "post-1",
      author: {
        username: "TechGuru",
        avatar: "https://i.pravatar.cc/40?img=1",
      },
      title: "Building Modern React Applications with Performance in Mind",
      coverImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      content:
        "Just finished building a new React component library. The performance improvements are incredible! 🚀",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      readTime: "3 min read",
      likes: 245,
      replies: 12,
      tags: ["react", "performance", "webdev"],
    },
    yourReply: {
      content:
        "This looks amazing! Would love to see the documentation. How did you handle the bundle size optimization?",
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
  },
  {
    id: 2,
    originalPost: {
      id: "post-2",
      author: {
        username: "WebDevDaily",
        avatar: "https://i.pravatar.cc/40?img=2",
      },
      title: "CSS Modules vs Tailwind: The Great Debate",
      coverImage:
        "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop",
      content:
        "Hot take: Tailwind CSS is overrated. CSS Modules are still the best way to handle styling in React applications.",
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      readTime: "5 min read",
      likes: 89,
      replies: 45,
      tags: ["css", "tailwind", "webdev"],
    },
    yourReply: {
      content:
        "I respectfully disagree. Tailwind's utility-first approach has significantly improved my development speed.",
      createdAt: new Date(Date.now() - 300000).toISOString(),
    },
  },
];

const formatTimeAgo = (dateStr) => {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

const RepliesView = () => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-bg dark:bg-dbg min-h-screen p-4">
      {dummyReplies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-card dark:bg-dcard flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-muted-text dark:text-dMuted-text" />
          </div>
          <h3 className="text-lg font-semibold text-text dark:text-dText mb-2">
            No replies yet
          </h3>
          <p className="text-muted-text dark:text-dMuted-text max-w-sm">
            When you reply to posts, they'll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {dummyReplies.map((item) => (
            <div
              key={item.id}
              className="bg-card dark:bg-dcard rounded-2xl border border-bordercolor dark:border-dbordercolor overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Original Post */}
              <div className="p-5 border-b border-bordercolor dark:border-dbordercolor">
                <PostCard post={item.originalPost} />
              </div>

              {/* Reply Section with connecting line */}
              <div className="relative px-5 py-4 bg-bg/30 dark:bg-dbg/30">
                {/* Vertical connecting line - Twitter style */}
                <div className="absolute left-[46px] top-0 w-0.5 h-6 bg-bordercolor dark:bg-dbordercolor" />

                <div className="flex gap-4">
                  {/* Avatar with subtle border */}
                  <div className="relative flex-shrink-0 z-10">
                    <img
                      src="https://i.pravatar.cc/40?img=10"
                      alt="You"
                      className="w-11 h-11 rounded-full border-2 border-bordercolor dark:border-dbordercolor bg-card dark:bg-dcard"
                    />
                    {/* Reply indicator */}
                    <div className="absolute -bottom-1 -right-1 bg-card dark:bg-dcard rounded-full p-1 border border-bordercolor dark:border-dbordercolor shadow-sm">
                      <MessageCircle className="w-3 h-3 text-accent dark:text-daccent" />
                    </div>
                  </div>

                  {/* Reply Content with proper padding */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-text dark:text-dText">
                        You
                      </span>
                      <span className="text-xs text-muted-text dark:text-dMuted-text">
                        replied
                      </span>
                      <span className="text-xs text-muted-text dark:text-dMuted-text opacity-70">
                        · {formatTimeAgo(item.yourReply.createdAt)}
                      </span>
                    </div>

                    {/* Reply Text in a nice card */}
                    <div className="bg-card dark:bg-dcard rounded-xl border border-bordercolor/60 dark:border-dbordercolor/60 px-4 py-3.5 shadow-sm">
                      <p className="text-[15px] text-text dark:text-dText leading-relaxed">
                        {item.yourReply.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepliesView;
