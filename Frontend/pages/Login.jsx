import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // NEW: error states
  const [errors, setErrors] = useState({}); // { username: "...", password: "..." }
  const [generalError, setGeneralError] = useState(""); // top-level errors like "Invalid Credentials"

  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      await login({ username, password }); // call backend login
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
        setGeneralError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  // helpers to clear relevant errors while typing
  const onUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.username;
      return copy;
    });
    setGeneralError("");
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.password;
      return copy;
    });
    setGeneralError("");
  };

  return (
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
              <div
                className="mx-auto w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg"
                style={{ backgroundColor: "#4A5A5D" }}
              >
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1
                className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, #1A1F1D 0%, #4A5A5D 100%)`,
                  fontFamily: "Merriweather Sans, sans-serif",
                }}
              >
                Welcome Back
              </h1>
              <p
                className="text-xs sm:text-sm lg:text-base opacity-70"
                style={{
                  color: "#7B7F95",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                Sign in to continue
              </p>
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 border-2 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 mb-3 sm:mb-4 group relative overflow-hidden"
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
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span
                className="font-medium sm:font-semibold text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors relative z-10"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Continue with Google
              </span>
            </button>

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
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={onUsernameChange}
                  required
                  aria-invalid={errors.username ? "true" : "false"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 peer placeholder-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                  style={{
                    borderColor: errors.username ? "#EF4444" : username ? "#5C7B8A" : "#E5E7EB",
                    color: "#1A1F1D",
                    fontFamily: "Manrope, sans-serif",
                  }}
                  placeholder="Username"
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4">
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: username ? "#5C7B8A" : "transparent",
                    }}
                  ></div>
                </div>

                {/* Inline field error */}
                {errors.username && (
                  <p className="text-gray-400 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={onPasswordChange}
                  required
                  aria-invalid={errors.password ? "true" : "false"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 pr-10 sm:pr-12 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 peer placeholder-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                  style={{
                    borderColor: errors.password ? "#EF4444" : password ? "#5C7B8A" : "#E5E7EB",
                    color: "#1A1F1D",
                    fontFamily: "Manrope, sans-serif",
                  }}
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-xs font-semibold transition-all duration-300 pointer-events-none"
                  style={{
                    color: password ? "#5C7B8A" : "#7B7F95",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 hover:scale-110 transition-transform duration-200"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415M14.12 14.12L18.364 18.364"
                      />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    )}
                  </svg>
                </button>

                {/* Inline field error */}
                {errors.password && (
                  <p className="text-gray-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer group">
                  <div
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                    style={{ borderColor: "#5C7B8A" }}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    <svg
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-white transition-opacity ${
                        rememberMe ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ color: "#5C7B8A" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span
                    className="ml-2 text-xs sm:text-sm font-medium"
                    style={{
                      color: "#7B7F95",
                      fontFamily: "Manrope, sans-serif",
                    }}
                  >
                    Remember me
                  </span>
                </label>

                <a
                  href="#"
                  className="text-xs sm:text-sm font-semibold hover:scale-105 transition-all duration-200"
                  style={{
                    color: "#5C7B8A",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Forgot?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center cursor-pointer py-2.5 sm:py-3 lg:py-3.5 px-4 border border-transparent rounded-xl sm:rounded-2xl shadow-lg text-white font-semibold hover:shadow-xl focus:outline-none transition-all duration-300 relative overflow-hidden group disabled:opacity-70 mt-4 sm:mt-6"
                style={{
                  background: "linear-gradient(135deg, #4A5A5D 0%, #5C7B8A 100%)",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm sm:text-base">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm sm:text-base">Sign In</span>
                    <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200/50">
              <p
                className="text-xs sm:text-sm"
                style={{
                  color: "#7B7F95",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                New here?{" "}
                <Link
                  to="/register"
                  className="font-semibold hover:scale-105 ml-0.5 transition-all duration-200 inline-block"
                  style={{
                    color: "#5C7B8A",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
