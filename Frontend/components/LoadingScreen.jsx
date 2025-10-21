import { motion } from "framer-motion";

const LoadingScreen = ({ text = "Loading...", size = 60 }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bg to-bg/95 dark:from-dbg dark:to-dbg/95">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        {/* Dual Circle Spinner */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <div
            className="absolute w-full h-full border-4 border-accent/20 border-t-accent
            dark:border-daccent/20 dark:border-t-daccent rounded-full animate-spin"
          ></div>
          <div
            className="absolute w-3/4 h-3/4 border-4 border-accent/10 border-t-transparent
            dark:border-daccent/10 dark:border-t-transparent rounded-full animate-[spin_2s_linear_infinite]"
          ></div>
        </div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-6 text-[15px] font-medium text-muted-text dark:text-dMuted-text"
        >
          {text}
        </motion.p>

        {/* Progress pulse indicator */}
        <div className="mt-5 flex gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-2.5 h-2.5 rounded-full bg-accent dark:bg-daccent"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: dot * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
