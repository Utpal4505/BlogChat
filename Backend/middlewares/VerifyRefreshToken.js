import jwt from "jsonwebtoken";

export const verifyRefreshToken = (req, res, next) => {
  try {
    const token =
      req.cookies.refreshToken ||
      req.body.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    req.user = { id: decoded.id }; // bas user id chahiye
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};
