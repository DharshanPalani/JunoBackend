import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import { signAccessToken, signRefreshToken } from "../utils/tokenHelper.js";

export class GoogleOAuth {
  googleCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: false },
      (err, participantId) => {
        if (err || !participantId) {
          return res.redirect("/error");
        }

        const accessToken = signAccessToken(participantId);
        const refreshToken = signRefreshToken(participantId);

        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/auth/refresh",
        });

        // send access token once
        res.redirect(
          `${process.env.FRONTEND_URL}/auth/success?token=${accessToken}`,
        );
      },
    )(req, res, next);
  };
}
