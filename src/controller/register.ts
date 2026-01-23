import type { Request, Response } from "express";
import { RegisterService } from "../services/register.js";
import { AuthRequest } from "../middlewares/auth.js";

export class RegisterController {
  private eventService = new RegisterService();

  async register(request: AuthRequest, response: Response) {
    try {
      const { day_id, event_Ids } = request.body;

      const participant = request.user;

      const result = await this.eventService.registerEvent({
        participant: {
          participant_id: participant.id,
        },
        registration: {
          day_id,
        },
        participationEvent: {
          event_id: event_Ids,
        },
      });
      response
        .status(result.status == "success" ? 201 : 409)
        .send(result.message);
    } catch (error: any) {
      console.error(error);
      response.status(500).send("Internal server error");
    }
  }
  async registrations(request: AuthRequest, response: Response) {
    try {
      const participant = request.user!;
      const result = await this.eventService.findRegisteredEvents(
        participant.id,
      );

      response.status(result.status == "success" ? 201 : 404).json(result);
    } catch (error: any) {}
  }
}
