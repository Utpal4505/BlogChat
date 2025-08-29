import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { MdBadge, MdEmail } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register({
        name: fullname,
        password,
        username,
        email,
      });
      navigate("/dashboard")
    } catch (err) {
      console.log("Registration error", err);
      alert(err.message || "Signup failed");
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
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 peer placeholder-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                  style={{
                    borderColor: fullname ? "#5C7B8A" : "#E5E7EB",
                    color: "#1A1F1D",
                    fontFamily: "Manrope, sans-serif",
                  }}
                  placeholder="FullName"
                />
                <label
                  htmlFor="fullname"
                  className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-xs font-semibold transition-all duration-300 pointer-events-none"
                  style={{
                    color: fullname ? "5C7B8A" : "#7B7F95",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  FullName
                </label>
                <div className="absolute inset-y-0 bottom-[5px] right-[10px] flex items-center pr-3 sm:pr-4">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300">
                    {fullname ? (
                      <MdBadge className="flex items-center text-[#5c7b8a] text-xl" />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Username Field */}
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 peer placeholder-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                  style={{
                    borderColor: username ? "#5C7B8A" : "#E5E7EB",
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
                <div className="absolute inset-y-0 right-2 flex items-center pr-3 sm:pr-4">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300">
                    {username ? (
                      <FaUserAlt className="flex items-center text-[#5c7b8a]" />
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 peer placeholder-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                  style={{
                    borderColor: email ? "#5C7B8A" : "#E5E7EB",
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
                <div className="absolute inset-y-0 bottom-[5px] right-[10px] flex items-center pr-3 sm:pr-4">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300">
                    {email ? (
                      <MdEmail className="flex items-center text-[#5c7b8a] text-xl" />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Password Field */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 pr-10 sm:pr-12 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 peer placeholder-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                  style={{
                    borderColor: password ? "#5C7B8A" : "#E5E7EB",
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </>
                    )}
                  </svg>
                </button>
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
