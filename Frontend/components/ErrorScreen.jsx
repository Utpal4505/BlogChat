// components/ErrorScreen.jsx
import { AlertCircle, RefreshCw, Home, ArrowLeft, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ErrorScreen = ({
  title,
  message,
  showRefresh = true,
  showHome = true,
  showBack = true,
  onRetry = null,
  icon: CustomIcon = null,
  type = "error",
}) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Enhanced error messages and colors
  const getErrorConfig = () => {
    switch (type) {
      case "404":
        return {
          icon: CustomIcon || AlertCircle,
          iconColor: "text-[#3B82F6] dark:text-[#60A5FA]",
          title: title || "Page Not Found",
          message: message || "The page you're looking for doesn't exist or has been moved.",
          dotColor: "bg-[#3B82F6] dark:bg-[#60A5FA]",
        };
      case "403":
        return {
          icon: CustomIcon || AlertCircle,
          iconColor: "text-[#F59E0B] dark:text-[#FBBF24]",
          title: title || "Access Denied",
          message: message || "You don't have permission to access this resource.",
          dotColor: "bg-[#F59E0B] dark:bg-[#FBBF24]",
        };
      case "500":
        return {
          icon: CustomIcon || AlertCircle,
          iconColor: "text-[#EF4444] dark:text-[#F87171]",
          title: title || "Server Error",
          message: message || "Something went wrong on our end. We're working to fix it.",
          dotColor: "bg-[#EF4444] dark:bg-[#F87171]",
        };
      case "network":
        return {
          icon: CustomIcon || WifiOff,
          iconColor: "text-[#8B5CF6] dark:text-[#A78BFA]",
          title: title || "Connection Lost",
          message: message || "Please check your internet connection and try again.",
          dotColor: "bg-[#8B5CF6] dark:bg-[#A78BFA]",
        };
      default:
        return {
          icon: CustomIcon || AlertCircle,
          iconColor: "text-accent dark:text-daccent",
          title: title || "Oops! Something went wrong",
          message: message || "An unexpected error occurred. Please try again.",
          dotColor: "bg-accent dark:bg-daccent",
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bg to-bg/95 dark:from-dbg dark:to-dbg/95 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-md w-full"
      >
        {/* Icon with background glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="relative mb-6"
        >
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* Glowing background */}
            <div className={`absolute inset-0 ${config.dotColor} opacity-20 blur-2xl rounded-full`} />
            
            {/* Icon */}
            <Icon size={80} strokeWidth={1.5} className={`${config.iconColor} relative z-10`} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[26px] font-bold text-text dark:text-dText tracking-tight"
        >
          {config.title}
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-[15px] text-muted-text dark:text-dMuted-text leading-relaxed px-4"
        >
          {config.message}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 w-full px-4"
        >
          {showRefresh && (
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2.5 px-6 py-3 bg-accent dark:bg-daccent text-white dark:text-dbg rounded-xl font-semibold shadow-lg shadow-accent/25 dark:shadow-daccent/25 hover:shadow-xl hover:shadow-accent/35 dark:hover:shadow-daccent/35 transition-all duration-300"
            >
              <RefreshCw size={19} strokeWidth={2.5} />
              Try Again
            </motion.button>
          )}

          <div className="flex gap-3">
            {showHome && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-card dark:bg-dcard text-text dark:text-dText rounded-xl font-medium border border-bordercolor dark:border-dbordercolor hover:bg-muted/50 dark:hover:bg-[#22252C] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Home size={18} strokeWidth={2.5} />
                Home
              </motion.button>
            )}

            {showBack && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGoBack}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-card dark:bg-dcard text-text dark:text-dText rounded-xl font-medium border border-bordercolor dark:border-dbordercolor hover:bg-muted/50 dark:hover:bg-[#22252C] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <ArrowLeft size={18} strokeWidth={2.5} />
                Back
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Animated dots indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex gap-2.5"
        >
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: dot * 0.25,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorScreen;
