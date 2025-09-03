import { AlertCircle } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PasswordInput, {
  GetStrength,
} from "../components/PasswordStrengthCheck";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

function NewPassword() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); // { username: "...", password: "..." }
  const [generalError, setGeneralError] = useState(""); // top-level errors like "Invalid Credentials"
  const navigate = useNavigate();
  const location = useLocation();

  const { verifyResetPassword } = useContext(AuthContext);

  const otp = location.state?.otp;
  const verificationId = location.state?.verificationId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    //clear errors
    setErrors({});
    setGeneralError("");
    // --- PASSWORD VALIDATION ---
    const strength = GetStrength(password);
    const isStrong = strength.label === "Strong";
    if (!isStrong) {
      errors.password = "Please choose a stronger password!";
      setIsLoading(false);
      toast.error("Please choose a stronger password!");
    }

    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      document.getElementById(firstErrorField)?.focus();
    }

    try {
      await verifyResetPassword({ verificationId, otp, newPassword: password });
      window.alert("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.log("Reset Password error", err);

      // Normalize Error (be defensive)
      let Error = null;
      if (err?.response?.data) {
        Error = err.response.data;
      } else if (err?.data) {
        Error = err.data;
      } else {
        Error = err;
      }

      // If backend returns a string (HTML or plain message)
      if (typeof Error === "string") {
        // Try to extract short message if it's HTML (simple strip tags) — fallback to raw string
        const stripped = Error.replace(/<\/?[^>]+(>|$)/g, "").trim();
        setGeneralError(stripped || "Login failed");
      }
      // If backend returns structured object { message, errors }
      else if (Error && typeof Error === "object") {
        // Field-level errors array -> map to object
        if (Array.isArray(Error.errors) && Error.errors.length > 0) {
          const fieldErrors = {};
          Error.errors.forEach((e) => {
            // Expecting { field: 'username'|'password', message: '...' }
            if (e.field) fieldErrors[e.field] = e.message || e;
          });
          setErrors(fieldErrors);
        }

        // If there's a top-level message, show it
        if (Error.message) {
          setGeneralError(Error.message);
        } else if (Error.error) {
          setGeneralError(Error.error);
        } else if (err?.message) {
          setGeneralError(err.message);
        } else {
          setGeneralError("Login failed. Please try again.");
        }
      } else if (err?.message) {
        setGeneralError(err.message);
      } else {
        setGeneralError("Forgot Password failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex justify-center items-center p-4 bg-[#f5f5f3]">
        <div>
          <Link
            to="/login"
            className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl hover:bg-white/50 transition-all duration-300 "
            style={{ color: "#5C7B8A" }}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="hidden sm:inline">Go Back</span>
          </Link>
        </div>

        <div className="w-full max-w-sm sm:max-w-md relative z-10">
          <div className="bg-white/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
            {/* general error */}
            {generalError && (
              <div className="flex items-center gap-2 mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
                <AlertCircle size={18} />
                <span>{generalError}</span>
              </div>
            )}

            <div className="text-center mb-4 sm:mb-6">
              <h1
                className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, #1A1F1D 0%, #4A5A5D 100%)`,
                  fontFamily: "Merriweather Sans, sans-serif",
                }}
              >
                Reset Password
              </h1>
              <p
                className="text-xs sm:text-sm lg:text-base opacity-70"
                style={{
                  color: "#7B7F95",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative">
                <PasswordInput password={password} setPassword={setPassword} />
              </div>

              {/* register button  */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center cursor-pointer py-2.5 sm:py-3 lg:py-3.5 px-4 border border-transparent rounded-xl sm:rounded-2xl shadow-lg text-white font-semibold hover:shadow-xl focus:outline-none transition-all duration-300 relative overflow-hidden group disabled:opacity-70 mt-4 sm:mt-6"
                style={{
                  background:
                    "linear-gradient(135deg, #4A5A5D 0%, #5C7B8A 100%)",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-sm sm:text-base">Resetting...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm sm:text-base">Reset Password</span>
                    <svg
                      className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPassword;
