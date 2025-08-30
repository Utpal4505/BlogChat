import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import PasswordInput, {
  GetStrength,
} from "../components/PasswordStrengthCheck";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaUser } from "react-icons/fa";

function Onboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);

  const { onBoardUser, checkUsernameAvailability } = useContext(AuthContext);

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const usernameRegex = /^[a-z0-9_]{3,20}$/;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkAvailabilityDebounced = useCallback(
    debounce(async (name) => {
      if (!name || !usernameRegex.test(name)) {
        setUsernameAvailable(null);
        return;
      }

      setChecking(true);
      try {
        const data = await checkUsernameAvailability(name);
        if (data.message === "Username is already taken") {
          if (usernameRegex.test(name)) {
            setUsernameAvailable(false);
          }
        } else {
          if (usernameRegex.test(name)) {
            setUsernameAvailable(true);
          }
        }
      } catch (err) {
        console.error("Error checking username:", err);
        setUsernameAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 500),
    []
  );

  //username checker
  // Call this on every input change
  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase().trim(); // lowercase enforcement
    setUsername(value);

    // Format validation first
    if (!usernameRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        username: "3-20 characters, _ & numbers only",
      }));
      setUsernameAvailable(null);
      return;
    } else {
      setErrors((prev) => ({ ...prev, username: null }));
    }

    // Debounced availability check
    checkAvailabilityDebounced(value);
  };

  useEffect(() => {
    return () => checkAvailabilityDebounced.cancel();
  }, [checkAvailabilityDebounced]);

  //password strength
  const strength = GetStrength(password);
  const isStrong = strength.label === "Strong";

  // NEW: error states
  const [errors, setErrors] = useState({}); // { username: "...", password: "..." }
  const [generalError, setGeneralError] = useState(""); // top-level errors like "Invalid Credentials"

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});
    setGeneralError("");

    // Format validation first
    if (!usernameRegex.test(username)) {
      setErrors((prev) => ({
        ...prev,
        username: "3-20 characters, _ & numbers only",
      }));
      setIsLoading(false);
      return;
    }

    if (!isStrong) {
      toast.error("Please choose a stronger password!");
      setIsLoading(false);
      return;
    }

    if (usernameAvailable === false) {
      setErrors((prev) => ({
        ...prev,
        username: "This username is already taken",
      }));
      setIsLoading(false);
      return;
    }

    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      document.getElementById(firstErrorField)?.focus();
    }

    try {
      await onBoardUser({ username, password }); // call backend login
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error raw:", err);
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
        setGeneralError("Onboarding failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  //username UI
  let usernameBorderClass = "border-gray-300";
  if (errors.username) usernameBorderClass = "border-red-500";
  else if (usernameTouched && usernameAvailable === true)
    usernameBorderClass = "border-green-400";
  else if (usernameTouched && usernameAvailable === false)
    usernameBorderClass = "border-red-400";
  return (
    <>
      <div
        className="h-screen flex items-center justify-center p-2 sm:p-4 relative overflow-hidden"
        style={{ backgroundColor: "#F5F5F3" }}
      >
        <Link
          to="/"
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

        <div className="w-full max-w-sm sm:max-w-md relative z-10">
          <div className="bg-white/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 relative">
            <div className="relative z-10">
              <div className="text-center mb-4 sm:mb-6">
                <h1
                  className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #1A1F1D 0%, #4A5A5D 100%)`,
                    fontFamily: "Merriweather Sans, sans-serif",
                  }}
                >
                  Complete your profile
                </h1>
                <p
                  className="text-xs sm:text-sm lg:text-base opacity-70"
                  style={{
                    color: "#7B7F95",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Just a few more details to get started
                </p>
              </div>

              {/* Divider */}
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

              {/* TOP-LEVEL GENERAL ERROR (inline near form) */}
              {generalError && (
                <div className="flex items-center gap-2 mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
                  <AlertCircle size={18} />
                  <span>{generalError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Username Field */}
                {/* Compact Username Field */}
                <div className="relative">
                  {/* User icon */}
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FaUser className="w-4 h-4" />
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    onFocus={() => setUsernameTouched(true)}
                    required
                    className={`w-full pl-9 px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 peer placeholder-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base ${usernameBorderClass}`}
                    style={{
                      color: "#1A1F1D",
                      fontFamily: "Manrope, sans-serif",
                    }}
                    placeholder="Username"
                    aria-invalid={!!errors.username}
                    aria-describedby={
                      errors.username ? "username-error" : undefined
                    }
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-xs font-semibold transition-all duration-300 pointer-events-none"
                    style={{
                      color: username ? "#5C7B8A" : "#7B7F95",
                      fontFamily: "Manrope, sans-serif",
                    }}
                  >
                    Username
                  </label>

                  {/* Icon & Loader */}
                  <div className="absolute inset-y-0 bottom-[14px] right-3 flex items-center">
                    {checking && (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {!checking &&
                      username &&
                      usernameTouched &&
                      usernameAvailable !== null &&
                      username.length > 0 && (
                        <>
                          {usernameAvailable ? (
                            <FaCheck className="text-green-500 w-4 h-4" />
                          ) : (
                            <FaTimes className="text-red-500 w-5 h-5" />
                          )}
                        </>
                      )}
                  </div>

                  {username &&
                    !errors.username &&
                    usernameTouched &&
                    usernameAvailable !== null &&
                    !checking && (
                      <p
                        className={`text-xs mt-1 transition-opacity ${
                          usernameAvailable ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {usernameAvailable
                          ? "Great! This username is available 🎉"
                          : "Oops! Someone else has this username 😅"}
                      </p>
                    )}

                  {/* Field errors */}
                  {errors.username && (
                    <p
                      id="username-error"
                      className="text-xs mt-1 text-red-500"
                    >
                      {errors.username}
                    </p>
                  )}
                  {(!username ||
                    (username && !usernameRegex.test(username))) && (
                    <p className="text-xs mt-1 text-gray-500">
                      3-20 characters, lowercase, numbers, and underscores only
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative">
                  <PasswordInput
                    password={password}
                    setPassword={setPassword}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center cursor-pointer py-2.5 sm:py-3 lg:py-3.5 px-4 border border-transparent rounded-xl sm:rounded-2xl shadow-lg text-white font-semibold hover:shadow-xl focus:outline-none transition-all duration-300 relative overflow-hidden group disabled:opacity-70 mt-4 sm:mt-6 hover:scale-[1.03]"
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
                        />
                      </svg>
                      <span className="text-sm sm:text-base">
                        Signing in...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm sm:text-base">
                        Create account complete.
                      </span>
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
      </div>
    </>
  );
}

export default Onboarding;
