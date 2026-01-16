import type { Request, Response } from "express";
import { EventService } from "../services/event.js";

export class EventController {
  private eventService = new EventService();

  async register(request: Request, response: Response) {
    try {
      const { event_name, event_day_id } = request.body;

      const result = await this.eventService.registerEvent(
        event_name,
        event_day_id
      );

      response.status(result.status == "success" ? 201 : 409).json({
        message: result.message,
        data: result.data,
        error: result.error,
      });
    } catch (error: any) {
      response
        .status(500)
        .json({ message: "Internal server error", error: error });
    }
  }

  async find(request: Request, response: Response) {
    try {
      let { event_id } = request.params;

      if (event_id == undefined) {
        return response.status(400).send("Invalid event id input");
      }

      event_id = Array.isArray(event_id) ? event_id[0] : event_id;

      const result = await this.eventService.findEvent(parseInt(event_id));

      response.status(result.status == "success" ? 201 : 409).json({
        message: result.message,
        data: result.data,
        error: result.error,
      });
    } catch (error: any) {
      response
        .status(500)
        .json({ message: "Internal server error", error: error });
    }
  }
}
