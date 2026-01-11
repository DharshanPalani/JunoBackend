import { RegisterService } from "./register.service";

import { Request, Response } from "express";

export class RegisterController {
  private eventService = new RegisterService();

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
        event_Ids,
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
}
