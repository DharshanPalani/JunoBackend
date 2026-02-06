import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import { signAccessToken, signRefreshToken } from "../utils/tokenHelper.js";

export class GoogleOAuth {
  googleCallback = (req: Request, res: Response, next: NextFunction) => {
    let dayId: number | undefined;

    if (typeof req.query.state === "string") {
      const parsed = parseInt(req.query.state, 10);
      if (!isNaN(parsed)) dayId = parsed;
    }

    passport.authenticate(
      "google",
      { session: false },
      (err, participantId) => {
        if (err || !participantId) return res.redirect("/error?err=" + err);

        const accessToken = signAccessToken(participantId);
        const refreshToken = signRefreshToken(participantId);

        const redirectPath = dayId ? `/register/${dayId}` : "/";
        res.redirect(
          `${process.env.FRONTEND_URL}${redirectPath}?access=${encodeURIComponent(
            accessToken,
          )}&refresh=${encodeURIComponent(refreshToken)}`,
        );
      },
    )(req, res, next);
  };
}
