import { EventDayRepository } from "./eventDay.repository";

type EventDayReturn = {
  message: string;
  status: "success" | "error";
};

export class EventDayService {
  private eventDayRepo = new EventDayRepository();

  async createDay(day_name: string): Promise<EventDayReturn> {
    try {
      const result = await this.eventDayRepo.create(day_name);

      return { message: "Created successfully", status: "success" };
    } catch (error: any) {
      throw new Error("Error at event day service: " + error);
    }
  }
}
