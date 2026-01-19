import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import { signAccessToken, signRefreshToken } from "../utils/tokenHelper.js";

export class GoogleOAuth {
  googleCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: false },
      (err, participantId) => {
        if (err || !participantId) return res.redirect("/error?err=" + err);

        const accessToken = signAccessToken(participantId);
        const refreshToken = signRefreshToken(participantId);

        res.redirect(
          `${process.env.FRONTEND_URL}/auth/success?access=${encodeURIComponent(
            accessToken,
          )}&refresh=${encodeURIComponent(refreshToken)}`,
        );
      },
    )(req, res, next);
  };
}
