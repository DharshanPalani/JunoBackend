import express from "express";
import type { Request, Response } from "express";
import passport from "passport";
import { GoogleOAuth } from "../auth/googleOAuthCallBack.js";
import { signAccessToken } from "../utils/tokenHelper.js";
import jwt from "jsonwebtoken";
// TEMP
import { ParticipantsService } from "../services/participants.js";

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

authRouter.get("/user", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No access token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Malformed auth header" });
    }

    // const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    let payload;

    try {
      payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    } catch (error: any) {
      return res
        .status(401)
        .json({ message: "Access token expired or invalid" });
    }

    if (payload.type !== "access") {
      return res.status(401).json({ message: "Invalid token type" });
    }

    const service = new ParticipantsService();
    const { participant } = await service.findParticipantWithID({
      id: payload.sub,
    });

    if (!participant) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: participant.id,
      participant_name: participant.participant_name,
      email: participant.email,
      college_name: participant.college_name,
      department: participant.department,
      academic_year: participant.academic_year,
      contact_number: participant.contact_number,
    });
  } catch (err) {
    console.error("AUTH USER ERROR:", err);
    res.status(401).json({ message: "Invalid or expired access token" });
  }
});

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

    // const accessToken = jwt.sign(
    //   { sub: payload.sub, type: "access" },
    //   process.env.ACCESS_TOKEN_SECRET!,
    //   { expiresIn: "10m" },
    // );
    //
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
