import express from "express";
import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { GoogleOAuth } from "../auth/googleOAuthCallBack.js";
import { signAccessToken } from "../utils/tokenHelper.js";
import jwt from "jsonwebtoken";
// TEMP
import { ParticipantsService } from "../services/participants.js";
import { authMiddleware, AuthRequest } from "../middlewares/auth.js";

import { ParsedQs } from "qs";
import { AuthController } from "../controller/auth.js";

const googleOAuth = new GoogleOAuth();

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/register", authController.register.bind(authController));

authRouter.post("/login", authController.login.bind(authController));

authRouter.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const stateParam =
    typeof req.query.state === "string" ? req.query.state : undefined;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: stateParam,
    session: false,
  })(req, res, next);
});

authRouter.get(
  "/google/callback",
  googleOAuth.googleCallback.bind(googleOAuth),
);

authRouter.get(
  "/user",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const participantID = req.user.id;

      const service = new ParticipantsService();
      const { participant } = await service.findParticipantWithID({
        id: participantID,
      });

      if (!participant) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Participant found!",
        participant_name: participant.participant_name,
      });
    } catch (err) {
      console.error("AUTH USER ERROR:", err);
      res.status(401).json({ message: "Invalid or expired access token" });
    }
  },
);

authRouter.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as any;

    if (payload.type !== "refresh")
      return res.status(401).json({ message: "Invalid token type" });

    let accessToken;

    try {
      accessToken = signAccessToken(payload.sub);
    } catch (error) {
      return res.status(401).json({ message: "Error in making access token" });
    }

    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

export default authRouter;
