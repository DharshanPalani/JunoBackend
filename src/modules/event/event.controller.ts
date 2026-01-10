import { EventService } from "./event.service";
import { Request, Response } from "express";

export class EventController {
  private eventService = new EventService();

  async register(request: Request, response: Response) {
    try {
      const { event_name, event_day_id } = request.body;

      const result = await this.eventService.registerEvent(
        event_name,
        event_day_id,
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
      const { event_id } = request.params;

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
