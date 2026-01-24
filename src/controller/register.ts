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
      const day_id = Number(request.params.day_id);
      const participant = request.user!;

      if (Number.isNaN(day_id)) {
        return response.status(400).json({
          status: "error",
          message: "Invalid day_id",
        });
      }

      const result = await this.eventService.findRegisteredEvents(
        participant.id,
        day_id,
      );

      return response.status(200).json(result);
    } catch (error: any) {
      console.error("GET /event/registrations error:", error);

      return response.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}
