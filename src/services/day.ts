import type { Day } from "../model/day.js";
import { DayRepository } from "../repository/day.js";

type DayReturn = {
  message: string;
  status: "success" | "error";
  data: Day | null;
};

export class DayService {
  private eventDayRepo = new DayRepository();

  async createDay(day_name: string): Promise<DayReturn> {
    try {
      const result = await this.eventDayRepo.create(day_name);

      return {
        message: "Created successfully",
        status: "success",
        data: result,
      };
    } catch (error: any) {
      return { message: error, status: "error", data: null };
    }
  }

  async findDay(day_id: number): Promise<DayReturn> {
    try {
      const result = await this.eventDayRepo.find(day_id);

      if (result != null) {
        return {
          message: "Found day successfully",
          status: "success",
          data: result,
        };
      } else {
        return {
          message: "Day not found or some other error",
          status: "error",
          data: null,
        };
      }
    } catch (error: any) {
      return { message: error, status: "error", data: null };
    }
  }

  async findDayByName(day_name: string): Promise<DayReturn> {
    try {
      const result = await this.eventDayRepo.findByName(day_name);
      if (result != null) {
        return {
          message: "Found day successfully",
          status: "success",
          data: result,
        };
      } else {
        return {
          message: "Day not found or some other error",
          status: "error",
          data: null,
        };
      }
    } catch (error: any) {
      return { message: error.message, status: "error", data: null };
    }
  }
}
