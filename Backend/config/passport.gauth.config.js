import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import prisma from "./db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails?.[0]?.value || profile.email,
              name: profile.displayName,
              username: null,
              isVerified: true,
            },
          });
        }

        // console.log("✅ USER FOUND/CREATED:", user);
        return done(null, user);
      } catch (err) {
        console.error("❌ ERROR in GoogleStrategy:", err);
        return done(err, null);
      }
    }
  )
);

export default passport;
