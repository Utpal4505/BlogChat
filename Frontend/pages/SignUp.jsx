import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaUserAlt } from "react-icons/fa";
import { MdBadge, MdEmail } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { AlertCircle, Shield, ShieldAlert, ShieldCheck } from "lucide-react";


function SignUp() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); // { username: "...", password: "..." }
  const [generalError, setGeneralError] = useState(""); // top-level errors like "Invalid Credentials"

  const { register, loginWithGoogle } =
    useContext(AuthContext);
  const navigate = useNavigate();

  

  //Checking Fullname
  const fullnameRegex = /^[a-zA-Z\s]{3,20}$/;

  //For fullname
  const handleFullnamechange = (e) => {
    const value = e.target.value;
    setFullname(value);

    // Fullname validation moved here to avoid conditional hook call
    if (!fullnameRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        fullname: "Please fill correct fullname",
      }));
    } else {
      setErrors((prev) => ({ ...prev, fullname: null }));
    }
  };

  //Checking email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  //For Email
  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setEmail(value);

    // Email validation moved here to avoid conditional hook call
    if (!emailRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please fill correct email",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: null }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    //clear errors
    setErrors({});
    setGeneralError("");

    // Fullname validation moved here to avoid conditional hook call
    if (!fullnameRegex.test(fullname)) {
      setErrors((prev) => ({
        ...prev,
        fullname: "Please fill correct fullname",
      }));
      setIsLoading(false);
      return;
    }

    // Email validation moved here to avoid conditional hook call
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please fill correct email",
      }));
      setIsLoading(false);
      return;
    }

    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      document.getElementById(firstErrorField)?.focus();
    }

    try {
      const data = await register({
        name: fullname.trim(),
        email: email.trim(),
      });
      console.log(data);
      if (data.data.status == "PENDING") {
        navigate("/onboarding", { state: { email } });
        return;
      }
      navigate("/email-verification", { state: { verificationId: data.data.verificationId, email } });
    } catch (err) {
      console.log("Registration error", err);

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
        setGeneralError("Login failed. Please try again.");
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
                Welcome
              </h1>
              <p
                className="text-xs sm:text-sm lg:text-base opacity-70"
                style={{
                  color: "#7B7F95",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                Create your account to get started
              </p>
            </div>
            <button
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center cursor-pointer px-4 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 border-2 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 mb-3 sm:mb-4 group relative overflow-hidden"
              style={{
                borderColor: "#E5E7EB",
                fontFamily: "Manrope, sans-serif",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 relative z-10"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span
                className="font-medium sm:font-semibold text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors relative z-10"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Continue with Google
              </span>
            </button>
            <div className="relative mb-3 sm:mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span
                  className="px-3 sm:px-4 bg-white/90 font-medium backdrop-blur-sm rounded-full py-1"
                  style={{
                    color: "#7B7F95",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  or
                </span>
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-3 flex flex-col gap-[5px] sm:space-y-4"
            >
              {/* Fullname */}
              <div className="relative">
                <input
                  id="fullname"
                  type="text"
                  value={fullname}
                  onChange={handleFullnamechange}
                  required
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 peer placeholder-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base ${
                    errors.fullname ? "border-red-500" : "border-[#5C7B8A]"
                  }`}
                  style={{
                    color: "#1A1F1D",
                    fontFamily: "Manrope, sans-serif",
                  }}
                  placeholder="FullName"
                />
                <label
                  htmlFor="fullname"
                  className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-xs font-semibold transition-all duration-300 pointer-events-none"
                  style={{
                    color: fullname ? "#5C7B8A" : "#7B7F95",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  FullName
                </label>
                {errors.fullname && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullname}</p>
                )}
                <div
                  className={`absolute inset-y-0  right-[10px] flex items-center pr-3 sm:pr-4 ${
                    errors.fullname ? "bottom-8" : "bottom-[5px]"
                  }`}
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300">
                    {fullname ? (
                      <MdBadge className="flex items-center text-[#5c7b8a] text-xl" />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 peer placeholder-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base ${
                    errors.email ? "border-red-500" : "border-[#5C7B8A]"
                  }`}
                  style={{
                    color: "#1A1F1D",
                    fontFamily: "Manrope, sans-serif",
                  }}
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-xs font-semibold transition-all duration-300 pointer-events-none"
                  style={{
                    color: email ? "#5C7B8A" : "#7B7F95",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Email
                </label>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
                <div
                  className={`absolute inset-y-0 right-[10px] flex items-center pr-3 sm:pr-4 ${
                    errors.email ? "bottom-7" : "bottom-[5px]"
                  }`}
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300">
                    {email ? (
                      <MdEmail className="flex items-center text-[#5c7b8a] text-xl" />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
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
                    <span className="text-sm sm:text-base">
                      Creating account…
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-sm sm:text-base">Register</span>
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

export default SignUp;
