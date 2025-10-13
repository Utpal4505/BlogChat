import cookieParser from "cookie-parser";
import express from "express";
import { healthcheck } from "./controllers/healthCheck.controllers.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.google.routes.js";
import postRouter from "./routes/post.routes.js";
import reportBugRouter from './routes/reportBug.routes.js'
import cors from "cors";
import passport from "./config/passport.gauth.config.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import { globalLimiter } from "./middlewares/rateLimiters.middlewares.js";
import helmet from 'helmet'

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(globalLimiter)

//Importing and Using Routes
app.use("/api/v1/healthcheck", healthcheck);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/report-bug", reportBugRouter);

//api error
app.use(errorHandler);

export { app };
