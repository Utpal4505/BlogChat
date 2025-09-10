// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export const GetStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1)
    return {
      score,
      label: "Weak",
      light: "text-red-500",
      dark: "text-red-400",
    };
  if (score === 2 || score === 3)
    return {
      score,
      label: "Medium",
      light: "text-yellow-500",
      dark: "text-yellow-300",
    };
  if (score === 4)
  return {
    score,
    label: "Strong",
    light: "text-green-600",
    dark: "text-green-400",
  };
};


export default function PasswordInput({ password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const strength = GetStrength(password);

  const Requirement = ({ condition, text }) => (
    <li className="flex items-center gap-2 text-sm">
      <AnimatePresence mode="wait" initial={false}>
        {condition ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }} // Reduced from 0.3 to 0.15
          >
            <CheckCircle className="text-green-500 w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="cross"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <XCircle className="text-red-400 w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className={condition ? "text-green-600" : "text-gray-500"}>
        {text}
      </span>
    </li>
  );

  return (
    <div className="w-full space-y-3">
      {/* Input */}
      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 pt-5 sm:pt-6 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 text-text dark:text-dText peer placeholder-transparent bg-card dark:bg-dcard backdrop-blur-sm text-sm sm:text-base ${password ? "border-accent dark:border-daccent" : "border-bordercolor dark:border-dbordercolor"}`}
          style={{
            fontFamily: "Manrope, sans-serif",
          }}
          placeholder="Password"
        />
        <label
          htmlFor="password"
          className={`absolute left-3 sm:left-4 top-1.5 sm:top-2 text-xs font-semibold transition-all duration-300 pointer-events-none ${password ? "text-accent dark:text-daccent" : "text-muted-text dark:text-dMuted-text"}`}
          style={{
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

      <AnimatePresence mode="wait" initial={false}>
        {isFocused && (
          <motion.div
            key="password-strength"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-3"
          >
            {/* Strength bar */}
            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
              <motion.div
                className="h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${(strength.score / 4) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>

            {/* Strength label */}
            <motion.p
              key={strength.label}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`text-sm font-medium ${strength.light} dark:${strength.dark}`}
            >
              {strength.label}
            </motion.p>

            {/* Checklist */}
            <motion.ul
              className="grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50 dark:bg-gray-700/20 p-3 rounded-lg"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Requirement condition={password.length >= 8} text="8+ characters" />
              <Requirement condition={/[A-Z]/.test(password)} text="Uppercase letter" />
              <Requirement condition={/[0-9]/.test(password)} text="Number" />
              <Requirement condition={/[^A-Za-z0-9]/.test(password)} text="Special char" />
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
