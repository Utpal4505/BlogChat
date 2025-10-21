import { motion } from "framer-motion";

const Avatar = ({ avatarUrl }) => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="w-[110px] h-[110px] rounded-full bg-gradient-to-br from-accent via-primary to-accent dark:from-daccent dark:via-dPrimary dark:to-daccent p-[3px] shadow-2xl shadow-accent/20 dark:shadow-daccent/20">
        <div className="w-full h-full rounded-full bg-bg dark:bg-dbg flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-[48px]">👤</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Avatar;
