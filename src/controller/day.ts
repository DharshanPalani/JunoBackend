import { DayService } from "../services/day.js";

import type { Request, Response } from "express";

export class DayController {
  private eventdayService = new DayService();

  async registerDay(request: Request, response: Response) {
    try {
      const { day_name } = request.body;
      const result = await this.eventdayService.createDay(day_name);

      response
        .status(result.status == "success" ? 201 : 409)
        .json({ message: result.message, data: result.data });
    } catch (error: any) {
      response.status(500).json({ message: "Internal server error" });
    }
  }

  async findDay(request: Request, response: Response) {
    try {
      let { day_id } = request.params;

      if (day_id == undefined) {
        return response.status(400).send("Invalid day id input");
      }

      day_id = Array.isArray(day_id) ? day_id[0] : day_id;

      const result = await this.eventdayService.findDay(parseInt(day_id));

      return response
        .status(result.status == "success" ? 201 : 409)
        .json({ message: result.message, data: result.data });
    } catch (error: any) {
      response.status(500).json({ message: "Internal server error" });
    }
  }
}
