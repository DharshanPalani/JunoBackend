import express from "express";
import { GoogleOAuth } from "../googleOAuth/googleOAuthCallBack";
import type { Response } from "express";
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

authRouter.get("/user", (req: any, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    id: user.id,
    participant_name: user.participant_name,
    email: user.email,
    college_name: user.college_name,
    department: user.department,
    academic_year: user.academic_year,
    contact_number: user.contact_number,
  });
});

export default authRouter;
