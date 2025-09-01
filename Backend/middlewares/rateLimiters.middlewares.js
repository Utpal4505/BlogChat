// middlewares/rateLimiters.middlewares.js
import rateLimit from "express-rate-limit";

// 🟢 Global limiter (for whole app)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  standardHeaders: true, // show rate limit info in headers
  legacyHeaders: false, // disable X-RateLimit headers
  message: "Too many requests from this IP, please try again later."
});

// 🔐 Login limiter
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // only 5 login attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts, please try again after 5 minutes."
});

// 📝 Register limiter
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // only 5 accounts per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many accounts created from this IP, please try again later."
});

// 🔄 Refresh token limiter
export const refreshLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 refresh requests in 5 min
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many refresh attempts, slow down."
});

// 🔍 Username check limiter
export const checkUsernameLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // 50 username checks allowed
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many username checks, please wait a while."
});
