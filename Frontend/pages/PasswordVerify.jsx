import React, { useState, useRef,  } from "react";
import toast from "react-hot-toast";
import { MdEmail } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

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
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "#F5F5F3", fontFamily: "Manrope" }}
    >
      <div
        className="p-8 rounded-xl shadow-md w-full max-w-sm text-center relative"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Back Button */}
        <div
          className="flex items-center justify-start mb-4 cursor-pointer absolute top-4 left-4"
          onClick={handleBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#4A5A5D]"
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
          <span className="ml-2 text-[#4A5A5D] font-medium">Back</span>
        </div>

        {/* Main Icon */}
        <div className="mb-6 mt-6">
          <MdEmail className="mx-auto h-14 w-14 text-[#4A5A5D]" />
        </div>

        {/* Heading & Description */}
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "Merriweather Sans", color: "#1A1F1D" }}
        >
          Enter OTP
        </h1>
        <p className="text-sm mb-6" style={{ color: "#7B7F95" }}>
          We’ve sent a code to{" "}
          <span className="font-medium" style={{ color: "#4A5A5D" }}>
            {email || "your email please check your inbox or spam folder"}
          </span>
        </p>

        {/* Verification Inputs */}
        <div className="flex justify-between gap-2 mb-6">
          {code.map((num, idx) => (
            <div key={idx} className="relative w-14 h-14">
              <input
                type="text"
                maxLength="1"
                value={num}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputsRef.current[idx] = el)}
                className="w-full h-full border rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#5C7B8A] transition-all"
                style={{
                  borderColor: "#4A5A5D",
                  color: "#1A1F1D",
                  fontFamily: "Manrope",
                }}
              />
            </div>
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
          style={{ backgroundColor: "#4A5A5D", fontFamily: "Merriweather Sans" }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Verify"
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordVerify;
