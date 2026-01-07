import { EventDay } from "./eventDay.model";
import { EventDayRepository } from "./eventDay.repository";

type EventDayReturn = {
  message: string;
  status: "success" | "error";
  data: EventDay | null;
};

export class EventDayService {
  private eventDayRepo = new EventDayRepository();

  async createDay(day_name: string): Promise<EventDayReturn> {
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

  async findDay(day_id: number): Promise<EventDayReturn> {
    try {
      const result = await this.eventDayRepo.find(day_id);

      return {
        message: "Found day successfully",
        status: "success",
        data: result,
      };
    } catch (error: any) {
      return { message: error, status: "error", data: null };
    }
  }
}
