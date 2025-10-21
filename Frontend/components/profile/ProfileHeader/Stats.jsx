const ProfileStats = ({ followers, followees }) => {
  return (
    <div className="flex items-center gap-5">
      <button className="group transition-all hover:scale-105">
        <div className="flex items-center gap-1.5">
          <span className="text-[16px] font-bold text-text dark:text-dText group-hover:text-accent dark:group-hover:text-daccent transition-colors">
            {followers || 0}
          </span>
          <span className="text-[14px] text-muted-text dark:text-dMuted-text">
            Followers
          </span>
        </div>
      </button>
      <button className="group transition-all hover:scale-105">
        <div className="flex items-center gap-1.5">
          <span className="text-[16px] font-bold text-text dark:text-dText group-hover:text-accent dark:group-hover:text-daccent transition-colors">
            {followees || 0}
          </span>
          <span className="text-[14px] text-muted-text dark:text-dMuted-text">
            Following
          </span>
        </div>
      </button>
    </div>
  );
};

export default ProfileStats;
