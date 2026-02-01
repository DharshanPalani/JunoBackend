import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import { signAccessToken, signRefreshToken } from "../utils/tokenHelper.js";

export class GoogleOAuth {
  googleCallback = (req: Request, res: Response, next: NextFunction) => {
    // const rawState = req.query.state as string;
    // This is the state data sent from frontend
    // Which then the google oauth receives and sends it back for the callback
    // const state = JSON.parse(decodeURIComponent(rawState));
    passport.authenticate(
      "google",
      { session: false },
      (err, participantId) => {
        if (err || !participantId) return res.redirect("/error?err=" + err);

        const accessToken = signAccessToken(participantId);
        const refreshToken = signRefreshToken(participantId);

        res.redirect(
          `${process.env.FRONTEND_URL}/auth/success?refresh=${encodeURIComponent(
            refreshToken,
          )}&access=${encodeURIComponent(accessToken)}`,
        );
      },
    )(req, res, next);
  };
}
