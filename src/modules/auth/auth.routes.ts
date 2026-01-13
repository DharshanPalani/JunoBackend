import express from "express";
import { GoogleOAuth } from "../googleOAuth/googleOAuthCallBack";
import passport from "passport";

const googleOAuth = new GoogleOAuth();

const authRouter = express.Router();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

authRouter.get(
  "/google/callback",
  googleOAuth.googleCallback.bind(googleOAuth),
);

export default authRouter;
