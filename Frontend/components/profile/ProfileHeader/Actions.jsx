import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfileActions = ({ isFollowing, onFollowToggle, isOwnProfile, username }) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2.5">
      {isOwnProfile ? (
        // Show "Edit Profile" button for own profile
        <motion.button
          onClick={() => navigate('/settings/profile')}
          className="flex-1 py-3 px-4 rounded-xl font-bold text-[14px] bg-card dark:bg-dcard text-text dark:text-dText border-2 border-bordercolor dark:border-dbordercolor hover:bg-bg dark:hover:bg-dbg hover:border-accent dark:hover:border-daccent transition-all"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          Edit Profile
        </motion.button>
      ) : (
        // Show "Follow" and "Message" buttons for other users
        <>
          <motion.button
            onClick={onFollowToggle}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-[14px] shadow-lg transition-all ${
              isFollowing
                ? "bg-card dark:bg-dcard text-text dark:text-dText border-2 border-bordercolor dark:border-dbordercolor hover:border-danger hover:bg-danger/5 hover:text-danger shadow-none"
                : "bg-gradient-to-r from-accent to-primary dark:from-daccent dark:to-dPrimary text-bg dark:text-dText hover:shadow-xl hover:shadow-accent/30"
            }`}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {isFollowing ? "Following" : "Follow"}
          </motion.button>

          <motion.button
            onClick={() => navigate(`/messages/${username}`)}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-[14px] bg-card dark:bg-dcard text-text dark:text-dText border-2 border-bordercolor dark:border-dbordercolor hover:bg-bg dark:hover:bg-dbg hover:border-accent dark:hover:border-daccent transition-all"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Message
          </motion.button>
        </>
      )}
    </div>
  );
};

export default ProfileActions;
