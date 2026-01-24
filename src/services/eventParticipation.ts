import type { EventParticipation } from "../model/eventParticipation.js";
import { EventParticipationRepository } from "../repository/eventParticipation.js";

type EventParticipationServiceReturn = {
  message: string;
  data: EventParticipation | null;
  status: "success" | "error";
  error?: any | null;
};

export class EventParticipationService {
  private eventParticipation = new EventParticipationRepository();
  async register(
    input: Omit<EventParticipation, "id">,
  ): Promise<EventParticipationServiceReturn> {
    try {
      const result = await this.eventParticipation.create(input);
      if (result == null) {
        throw new Error("Result came out as null for register");
      }
      return {
        message: "Registered for the event successfully",
        data: result,
        status: "success",
      };
    } catch (error: any) {
      return {
        message: "Error in registering in event",
        status: "error",
        data: null,
        error: error.message,
      };
    }
  }

  async registration(input: Pick<EventParticipation, "registration_id">) {
    try {
      const result = await this.eventParticipation.findAll(input);
      if (result == null) {
        throw new Error("Result came out as null for registration");
      }

      const eventIds = result.map((e) => e.event_id);
      return {
        message: "Registered for the event successfully",
        data: eventIds,
        status: "success",
      };
    } catch (error: any) {
      return {
        message: "Error in fetching registration for events",
        status: "error",
        data: null,
        error: error.message,
      };
    }
  }
}
