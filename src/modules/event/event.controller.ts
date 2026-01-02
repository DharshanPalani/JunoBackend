import { EventService } from "./event.service";

import { Request, Response } from "express";

export class EventController {
  private eventService = new EventService();

  async register(request: Request, response: Response) {
    try {
      const {
        participant_name,
        college_name,
        department,
        academic_year,
        contact_number,
        email,
        day_id,
      } = request.body;

      const result = await this.eventService.registerEvent({
        participant: {
          participant_name,
          college_name,
          department,
          academic_year,
          contact_number,
          email,
        },
        registration: {
          day_id,
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
}
