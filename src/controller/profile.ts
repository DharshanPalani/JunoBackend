import { AuthRequest } from "../middlewares/auth.js";
import { ParticipantsService } from "../services/participants.js";
import { participantProfileSchema } from "../validation/participant.js";
import type { Response } from "express";

export class ProfileController {
  private participantService = new ParticipantsService();

  async participantProfileUpdate(req: AuthRequest, res: Response) {
    const participant = req.user;
    if (!participant?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const parsed = participantProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "INVALID_INPUT",
        issues: parsed.error.flatten(),
      });
    }

    const payload = {
      id: participant.id,
      ...parsed.data,
    };

    const result =
      await this.participantService.updateParticipantPartial(payload);

    if (!result.participant) {
      return res.status(500).json({ error: result.error ?? "Update failed" });
    }

    const { id, google_id, created_at, ...publicParticipant } =
      result.participant;

    return res.status(200).json(publicParticipant);
  }

  async fetchParticipantProfile(req: AuthRequest, res: Response) {
    const participant = req.user;
    if (!participant?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await this.participantService.findParticipantWithID({
      id: participant.id,
    });

    if (!result.participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    const { id, google_id, created_at, ...publicParticipant } =
      result.participant;

    return res.status(200).json(publicParticipant);
  }
}
