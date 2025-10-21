import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// Helper to create a limiter
const createLimiter = ({ windowMs, max, message, keyGenerator }) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) =>
      res.status(429).json({ success: false, error: message }),
    keyGenerator: keyGenerator || ((req) => ipKeyGenerator(req) || req.ip),
  });
};

// 🟢 Global limiter (for whole app)
export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "⚠️ Too many requests, please try again later.",
});

// 🔐 Login limiter
export const loginLimiter = createLimiter({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "⚠️ Too many login attempts, please try again after 5 minutes.",
  keyGenerator: (req) => `${req.body.username || ""}_${req.ip}`, // username+IP
});

// 📝 Register limiter
export const registerLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "⚠️ Too many accounts created from this IP, try again later.",
});

// 🔄 Refresh token limiter
export const refreshLimiter = createLimiter({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: "⚠️ Too many refresh attempts, slow down.",
  // Optional per-user key:
  // keyGenerator: (req) => req.user?.id || req.ip,
});

// 🔍 Username check limiter
export const checkUsernameLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: "⚠️ Too many username checks, please wait a while.",
});

// 📧 OTP request limiter
export const otpLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: "⚠️ Too many OTP requests, try again after 10 minutes.",
});

// 🐞 Bug report limiter
export const bugReportLimiter = createLimiter({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: "🐞 Too many bug reports! Please slow down a bit.",
});
