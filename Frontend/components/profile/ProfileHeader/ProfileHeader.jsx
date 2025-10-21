import { motion } from "framer-motion";
import Avatar from "./Avatar";
import ProfileStats from "./Stats";
import SettingsButton from "./SettingsButton";
import ProfileActions from "./Actions";

const ProfileHeader = ({ user, isFollowing, onFollowToggle, isOwnProfile }) => {
  return (
    <motion.div
      className="pt-10 pb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-4">
          <Avatar avatarUrl={user?.avatar} />
          
          <div className="pt-1">
            <h1 className="text-[26px] font-extrabold text-text dark:text-dText leading-tight mb-1 tracking-tight">
              {user.username}
            </h1>
            <p className="text-[14px] text-muted-text dark:text-dMuted-text mb-3.5">
              {user.name}
            </p>

            <ProfileStats
              followers={user._count.followers || 0}
              followees={user._count.followees || 0}
            />
          </div>
        </div>

        {/* Only show settings button for own profile */}
        {isOwnProfile && <SettingsButton />}
      </div>

      <p className="text-[15px] text-text dark:text-dText leading-relaxed mb-4">
        {user.bio}
      </p>

      {/* Pass username to ProfileActions */}
      <ProfileActions 
        isFollowing={isFollowing} 
        onFollowToggle={onFollowToggle}
        isOwnProfile={isOwnProfile}
        username={user.username} // ✅ Pass username
      />
    </motion.div>
  );
};

export default ProfileHeader;
