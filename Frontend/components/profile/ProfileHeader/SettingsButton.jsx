import { motion } from "framer-motion";
import { Settings } from "lucide-react";

const SettingsButton = () => {
  return (
    <motion.button
      className="p-2.5 rounded-xl hover:bg-card dark:hover:bg-dcard border border-transparent hover:border-bordercolor dark:hover:border-dbordercolor transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Settings size={20} className="text-muted-text dark:text-dMuted-text" />
    </motion.button>
  );
};

export default SettingsButton;
