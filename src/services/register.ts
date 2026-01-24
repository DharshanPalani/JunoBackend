import { ParticipantsService } from "./participants.js";
import { RegistrationService } from "./registration.js";
import { EventParticipationService } from "./eventParticipation.js";
import type { CreateEventDTO } from "../model/register.js";
import { Participant } from "../model/participants.js";
import { EventParticipation } from "../model/eventParticipation.js";

type RegisterServiceReturn = {
  message: string;
  status: "error" | "success";
  participant?: Participant | null;
};

export class RegisterService {
  private participantService = new ParticipantsService();
  private registrationService = new RegistrationService();
  private eventParticipationService = new EventParticipationService();

  async registerEvent(data: CreateEventDTO): Promise<RegisterServiceReturn> {
    const participation = await this.participantService.findParticipantWithID({
      id: data.participant.participant_id,
    });

    if (!participation.participant) {
      return { message: "Participant could not be found", status: "error" };
    }

    const registration = await this.registrationService.createOrFindRegistry(
      participation.participant.id,
      data.registration.day_id,
    );

    if (!registration.registeredData) {
      if (registration.status !== "already_registered") {
        return {
          message: "Error in participant registry",
          status: "error",
        };
      }
    }

    let eventFailedToRegisterID: number[] = [];

    for (const eventID of data.participationEvent.event_id) {
      const result = await this.eventParticipationService.register({
        registration_id: registration.registeredData.id,
        event_id: eventID,
      });

      if (result.status == "error") {
        console.log(result.error);
        eventFailedToRegisterID.push(eventID);
      }
    }

    return {
      message: "Participant registered successfully including events",
      status: "success",
    };
  }

  async findRegisteredEvents(participantID: number, dayID: number) {
    const { participant } = await this.participantService.findParticipantWithID(
      { id: participantID },
    );

    if (!participant) {
      return { message: "Participant not found", status: "error" };
    }

    const registration = await this.registrationService.findRegistry(
      participant.id,
      dayID,
    );

    if (!registration) {
      return {
        message: "No registrations found",
        status: "success",
        participant: null,
      };
    }

    const eventsRegistered = await this.eventParticipationService.registration({
      registration_id: registration.id,
    });

    return {
      message: "Fetched participation event data",
      status: "success",
      event_ids: eventsRegistered.data,
    };
  }
}
