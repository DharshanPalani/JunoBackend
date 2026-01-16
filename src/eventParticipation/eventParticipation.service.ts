import type { EventParticipation } from "./eventParticipation.model.ts";
import { EventParticipationRepository } from "./eventParticipation.repository.ts";

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
        throw new Error("Result came out as null.");
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
}
