import { Router } from "express";
import { ProfileController } from "../controller/profile.js";
import { authMiddleware } from "../middlewares/auth.js";

const profileController = new ProfileController();
const profileRouter = Router();

profileRouter.post(
  "/participant/update",
  authMiddleware,
  profileController.participantProfileUpdate.bind(profileController),
);

profileRouter.get(
  "/participant",
  authMiddleware,
  profileController.fetchParticipantProfile.bind(profileController),
);

export default profileRouter;
