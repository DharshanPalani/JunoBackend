import { EventRepository } from "./event.repository";
import { Event } from "./event.model";

type EventServiceReturn = {
  message: string;
  data: Event | null;
  status: "success" | "error";
  error?: any | null;
};

export class EventService {
  private eventRepository = new EventRepository();

  async registerDay(
    event_name: string,
    event_day_id: number,
  ): Promise<EventServiceReturn> {
    try {
      let result = await this.eventRepository.create({
        event_name,
        event_day_id,
      });

      return {
        message: "Created event successfully!",
        data: result,
        status: "success",
      };
    } catch (error: any) {
      return {
        message: "Error in creating event!",
        data: null,
        status: "error",
        error: error,
      };
    }
  }
}
