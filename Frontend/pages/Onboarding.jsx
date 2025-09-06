import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import PasswordInput, {
  GetStrength,
} from "../components/PasswordStrengthCheck";
import { debounce } from "lodash";
import { FaCheck, FaTimes, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

function Onboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const location = useLocation();
  const email = location.state?.email;

  // NEW: error states
  const [errors, setErrors] = useState({}); // { username: "...", password: "..." }
  const [generalError, setGeneralError] = useState(""); // top-level errors like "Invalid Credentials"

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

  //Bio check
  const handleBioChange = (e) => {
    const value = e.target.value;
    setBio(value);

    //bio checker
    if (value.length < 10) {
      return setErrors((prev) => ({
        ...prev,
        bio: "Bio must be at least 10 characters",
      }));
    } else if (value.length > 160) {
      return setErrors((prev) => ({
        ...prev,
        bio: "Bio must be 160 characters or less",
      }));
    } else {
      setErrors((prev) => ({ ...prev, bio: null }));
    }
  };

  //username checker
  // Call this on every input change
  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase().trim(); // lowercase enforcement
    setUsername(value);

    // Format validation first
    if (!usernameRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        username: "3-20 characters, lowercase, numbers, and underscores only",
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError(""); // clear top-level errors

    const newErrors = {};

    // --- USERNAME VALIDATION ---
    if (!usernameRegex.test(username)) {
      newErrors.username =
        "3-20 characters, lowercase, underscores, and numbers only";
    } else if (usernameAvailable === false) {
      newErrors.username = "This username is already taken";
    }

    // --- PASSWORD VALIDATION ---
    const strength = GetStrength(password);
    const isStrong = strength.label === "Strong";
    if (!isStrong) {
      newErrors.password = "Please choose a stronger password!";
      toast.error("Please choose a stronger password!");
    }

    // --- BIO VALIDATION ---
    if (bio.length < 10) {
      newErrors.bio = "Bio must be at least 10 characters";
    } else if (bio.length > 160) {
      newErrors.bio = "Bio must be 160 characters or less";
    }

    // --- IF ANY ERRORS, STOP SUBMIT ---
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // focus the first field with error
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();

      setIsLoading(false);
      return;
    }

    // --- NO ERRORS, SUBMIT FORM ---
    try {
      await onBoardUser({
        username: username.trim().toLowerCase(),
        password,
        bio: bio.trim(),
        email,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);

      let Error = err?.response?.data || err?.data || err;

      if (typeof Error === "string") {
        const stripped = Error.replace(/<\/?[^>]+(>|$)/g, "").trim();
        setGeneralError(stripped || "Onboarding failed");
      } else if (Error && typeof Error === "object") {
        if (Array.isArray(Error.errors) && Error.errors.length > 0) {
          const fieldErrors = {};
          Error.errors.forEach((e) => {
            if (e.field) fieldErrors[e.field] = e.message || e;
          });
          setErrors(fieldErrors);
        }
        setGeneralError(
          Error.message || Error.error || err.message || "Onboarding failed"
        );
      } else {
        setGeneralError(err?.message || "Onboarding failed");
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
      <div className="min-h-screen flex items-center bg-[#f5f5f3] justify-center p-2 sm:p-4 relative overflow-hidden">
        <Link
          to="/"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-300 hover:bg-[#5c7b8a1c] "
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

        <div className="w-full max-w-xl lg:max-w-2xl relative z-10">
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20 relative">
            <div className="text-center mb-6 sm:mb-8">
              <span className="text-3xl sm:text-4xl block mb-3">👋</span>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--text) 0%, var(--primary) 100%)`,
                  fontFamily: "Merriweather Sans, sans-serif",
                }}
              >
                Welcome to BlogChat!
              </h1>
              <p
                className="text-sm sm:text-base opacity-80"
                style={{
                  color: "var(--secondary)",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                Let’s set up your profile so others can find and connect with
                you
              </p>
            </div>
            {/* TOP-LEVEL GENERAL ERROR (inline near form) */}{" "}
            {generalError && (
              <div className="flex items-center gap-2 mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
                {" "}
                <AlertCircle size={18} /> <span>{generalError}</span>{" "}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="mb-5 relative">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold mb-1.5"
                  style={{
                    color: "var(--text)",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Choose your username
                </label>
                <p
                  className="mt-1 text-xs mb-1.5"
                  style={{
                    color: username ? "#5C7B8A" : "#7B7F95",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  This is how others will find you on BlogChat (like @username
                  on Twitter)
                </p>
                <input
                  type="text"
                  id="username"
                  placeholder="@username"
                  onChange={handleUsernameChange}
                  onFocus={() => setUsernameTouched(true)}
                  value={username}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 peer placeholder-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base ${usernameBorderClass}`}
                  style={{
                    color: "#1A1F1D",
                    fontFamily: "Manrope, sans-serif",
                  }}
                />
                {/* Icon & Loader */}{" "}
                <div className="absolute inset-y-0 top-7 right-3 flex items-center">
                  {" "}
                  {checking && (
                    <div className="absolute w-4 h-4 bottom-1 right-1 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  )}{" "}
                  {!checking &&
                    username &&
                    usernameTouched &&
                    usernameAvailable !== null &&
                    username.length > 0 && (
                      <>
                        {" "}
                        {usernameAvailable ? (
                          <FaCheck className="text-green-500 w-4 h-4" />
                        ) : (
                          <FaTimes className="text-red-500 w-5 h-5" />
                        )}{" "}
                      </>
                    )}{" "}
                </div>{" "}
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
                      {" "}
                      {usernameAvailable
                        ? "Great! This username is available 🎉"
                        : "Oops! Someone else has this username 😅"}{" "}
                    </p>
                  )}{" "}
                {/* Field errors */}{" "}
                {errors.username && (
                  <p id="username-error" className="text-xs mt-1 text-red-500">
                    {" "}
                    {errors.username}{" "}
                  </p>
                )}{" "}
              </div>

              {/* Bio Field */}
              <div className="mb-6">
                <label
                  htmlFor="bio"
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color: "var(--text)",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Write a short bio
                </label>
                <textarea
                  id="bio"
                  rows="4"
                  value={bio}
                  onChange={handleBioChange}
                  required
                  placeholder="Tell people a bit about yourself..."
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none bg-white/50 backdrop-blur-sm text-base resize-none"
                  style={{
                    color: "var(--text)",
                    fontFamily: "Manrope, sans-serif",
                    borderColor: errors.bio
                      ? "#EF4444"
                      : bio
                      ? "#5C7B8A"
                      : "#E5E7EB",
                  }}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span style={{ color: "var(--secondary)" }}>
                    {bio.length}/160 characters
                  </span>
                  <span style={{ color: "var(--secondary)" }}>
                    Optional, but recommended
                  </span>
                </div>
                {errors.bio && (
                  <p id="bio-error" className="text-xs mt-1 text-red-500">
                    {" "}
                    {errors.bio}{" "}
                  </p>
                )}{" "}
              </div>

              {/* password */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color: "var(--text)",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Set a password
                </label>
                <PasswordInput password={password} setPassword={setPassword} />
              </div>
              {/* Buttons */}
              <div className="flex justify-center items-center">
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
                  {" "}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>{" "}
                  {isLoading ? (
                    <>
                      {" "}
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>{" "}
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />{" "}
                      </svg>{" "}
                      <span className="text-sm sm:text-base">
                        {" "}
                        Setup profile....{" "}
                      </span>{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <span className="text-sm sm:text-base">
                        {" "}
                        Let’s Go 🚀{" "}
                      </span>{" "}
                      <svg
                        className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />{" "}
                      </svg>{" "}
                    </>
                  )}{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Onboarding;
