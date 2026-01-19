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
    const token = req.cookies.refresh_token;
    if (!token) return res.status(404).json({ message: "User not found" });

    const payload: any = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);

    const service = new ParticipantsService();
    const { participant } = await service.findParticipantWithID({
      id: payload.id,
    });

    if (!participant)
      return res.status(404).json({ message: "User not found" });

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
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

authRouter.post("/refresh", (req: Request, res: Response) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as any;

    const newAccessToken = signAccessToken(payload.sub);
    res.json({ accessToken: newAccessToken });
  } catch {
    res.sendStatus(403);
  }
});

export default authRouter;
