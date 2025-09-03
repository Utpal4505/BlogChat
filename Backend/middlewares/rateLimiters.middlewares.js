import rateLimit from "express-rate-limit";

// ✅ Custom handler for JSON response
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    error: "⚠️ Too many requests, please try again later.",
  });
};

// 🟢 Global limiter (for whole app)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// 🔐 Login limiter
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // only 5 login attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "⚠️ Too many login attempts, please try again after 5 minutes.",
    });
  },
  keyGenerator: (req) => req.body.username || req.ip, // username+ip protection
});

// 📝 Register limiter
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // only 5 accounts per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "⚠️ Too many accounts created from this IP, try again later.",
    });
  },
});

// 🔄 Refresh token limiter
export const refreshLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 refresh requests in 5 min
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "⚠️ Too many refresh attempts, slow down.",
    });
  },
});

// 🔍 Username check limiter
export const checkUsernameLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // 50 username checks allowed
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "⚠️ Too many username checks, please wait a while.",
    });
  },
});

// 📧 OTP request limiter (extra security)
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // only 3 OTPs in 10 min
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "⚠️ Too many OTP requests, try again after 10 minutes.",
    });
  },
});
