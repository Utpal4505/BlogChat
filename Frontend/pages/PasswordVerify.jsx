/* eslint-disable no-unused-vars */
import React, { useState, useRef,  } from "react";
import toast from "react-hot-toast";
import { MdEmail } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PasswordVerify = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

    // Get verificationId from location.state
  const email = location.state?.email;
  const verificationId = location.state?.verificationId;
  
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
    toast.error("Please enter all 6 digits of the OTP!");
    return;
  }
    setLoading(true);
    try {
      // verifyOTP ko email ke sath call karo
      navigate("/NewPassword", { state: { email, otp: enteredCode, verificationId } });
    } catch (err) {
      alert(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/register")
  };
  

  return (
    <div
      className="flex items-center bg-bg dark:bg-dbg justify-center min-h-screen"
      style={{ fontFamily: "Manrope" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-8 rounded-xl bg-card dark:bg-dcard shadow-md w-full max-w-sm text-center relative"
      >
        {/* Back Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-accent dark:text-daccent hover:scale-105 transition-all duration-100 justify-start mb-4 cursor-pointer absolute top-4 left-4"
          onClick={handleBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary dark:text-dPrimary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="ml-2 text-primary dark:text-dPrimary font-medium">
            Back
          </span>
        </motion.div>

        {/* Main Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6 mt-6"
        >
          <MdEmail className="mx-auto h-14 w-14 text-primary dark:text-dPrimary" />
        </motion.div>

        {/* Heading & Description */}
        <h1
          className="text-2xl text-text dark:text-dText font-semibold mb-2"
          style={{ fontFamily: "Merriweather Sans" }}
        >
          Enter OTP
        </h1>
        <p className="text-sm mb-6 text-muted-text dark:text-dMuted-text">
          We’ve sent a code to{" "}
          <span className="font-medium text-text dark:text-dText">
            {email || "your email please check your inbox"}
          </span>
        </p>

        {/* Verification Inputs */}
        <div className="flex justify-between gap-2 mb-6">
          {code.map((num, idx) => (
            <motion.input
              key={idx}
              type="text"
              maxLength="1"
              value={num}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-12/5 h-12 border rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-daccent text-text dark:text-dText border-primary dark:border-dPrimary transition-all"
              style={{
                fontFamily: "Manrope",
              }}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
            />
          ))}
        </div>

        {/* Verify Button */}
        <motion.button
          onClick={handleVerify}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="w-full py-3 rounded-lg font-semibold text-white bg-primary dark:bg-dPrimary hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
          style={{ fontFamily: "Merriweather Sans" }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Verify"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PasswordVerify;
