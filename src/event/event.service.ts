import { EventRepository } from "./event.repository.ts";
import type { Event } from "./event.model.ts";

type EventServiceReturn = {
  message: string;
  data: Event | null;
  status: "success" | "error";
  error?: any | null;
};

export class EventService {
  private eventRepository = new EventRepository();

  async registerEvent(
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

  async findEvent(event_id: number): Promise<EventServiceReturn> {
    try {
      let result = await this.eventRepository.find(event_id);
      if (result == null) {
        throw new Error("No event found with ID: " + event_id);
      }
      return {
        message: "Fetched event successfully!",
        data: result,
        status: "success",
      };
    } catch (error: any) {
      return {
        message: "Error in fetching event!",
        data: null,
        status: "error",
        error: error.message,
      };
    }
  }
}
