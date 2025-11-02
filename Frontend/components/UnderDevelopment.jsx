import React from "react";
import { motion as Motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnderDevelopment = () => {

 const navigate = useNavigate()
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg dark:bg-dbg">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Icon */}
        <Motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6 flex justify-center"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary dark:bg-dPrimary">
            <Zap className="w-8 h-8 text-bg dark:text-dbg" />
          </div>
        </Motion.div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-3 text-text dark:text-dText">
          Under Development
        </h1>

        {/* Description */}
        <p className="mb-6 text-muted-text dark:text-dMuted-text">
          We're working on something cool. Check back soon!
        </p>

        {/* Button */}
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/home")}
          className="px-6 py-2.5 rounded-lg bg-primary dark:bg-dPrimary text-bg dark:text-dbg font-medium transition-all"
        >
          Go Back
        </Motion.button>
      </Motion.div>
    </div>
  );
};

export default UnderDevelopment;
