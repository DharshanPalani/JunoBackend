import { AuthRequest } from "../middlewares/auth.js";
import { ParticipantsService } from "../services/participants.js";

import type { Response } from "express";

export class ProfileController {
  private participantService = new ParticipantsService();

  async participantProfileUpdate(req: AuthRequest, res: Response) {
    const participant = req.user;
    if (!participant?.id)
      return res.status(401).json({ error: "Unauthorized" });

    const {
      participant_name,
      college_name,
      department,
      academic_year,
      contact_number,
    } = req.body;

    const result = await this.participantService.updateParticipant({
      id: participant.id,
      participant_name,
      college_name,
      department,
      academic_year,
      contact_number,
    });

    if (!result.participant) {
      return res.status(500).json({ error: result.error ?? "Update failed" });
    }

    const { id, google_id, created_at, ...publicParticipant } =
      result.participant;
    return res.status(200).json(publicParticipant);
  }

  async fetchParticipantProfile(request: AuthRequest, response: Response) {
    const participant = request.user;

    const result = await this.participantService.findParticipantWithID({
      id: participant.id,
    });

    const { id, google_id, created_at, ...publicParticipant } =
      result.participant;

    response
      .status(result.status == "found" ? 201 : 409)
      .json(publicParticipant);
  }
}
