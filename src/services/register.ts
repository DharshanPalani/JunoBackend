import { ParticipantsService } from "./participants.js";
import { RegistrationService } from "./registration.js";
import { EventParticipationService } from "./eventParticipation.js";
import { ParticipantsPaymentService } from "./participantsPayment.js";
import type { CreateEventDTO } from "../model/register.js";
import type { Participant } from "../model/participants.js";

type RegisterServiceReturn = {
  message: string;
  status: "error" | "success";
  participant?: Participant | null;
};

export class RegisterService {
  private participantService = new ParticipantsService();
  private registrationService = new RegistrationService();
  private eventParticipationService = new EventParticipationService();
  private participantsPaymentService = new ParticipantsPaymentService();

  async registerEvent(data: CreateEventDTO): Promise<RegisterServiceReturn> {
    const { participant } = await this.participantService.findParticipantWithID(
      {
        id: data.participant.participant_id,
      },
    );

    if (!participant) {
      return {
        message: "Participant could not be found",
        status: "error",
      };
    }

    const registrationResult =
      await this.registrationService.createOrFindRegistry(
        participant.id,
        data.registration.day_id,
      );

    const registeredData = registrationResult.registeredData;

    if (!registeredData) {
      return {
        message: "Failed to create or fetch registration",
        status: "error",
      };
    }

    const paymentResult =
      await this.participantsPaymentService.createOrFindPaymentEntry(
        registeredData.id,
      );

    if (paymentResult.status === "error") {
      return {
        message: "Failed to initialize payment",
        status: "error",
      };
    }

    for (const eventID of data.participationEvent.event_id) {
      const result = await this.eventParticipationService.register({
        registration_id: registeredData.id,
        event_id: eventID,
      });

      if (result.status === "error") {
        console.error(`Failed to register event ${eventID}:`, result.error);
      }
    }

    return {
      message: "Participant registered successfully",
      status: "success",
      participant,
    };
  }

  async findRegisteredEvents(participantID: number, dayID: number) {
    const { participant } = await this.participantService.findParticipantWithID(
      {
        id: participantID,
      },
    );

    if (!participant) {
      return {
        message: "Participant not found",
        status: "error",
      };
    }

    const registration = await this.registrationService.findRegistry(
      participant.id,
      dayID,
    );

    if (!registration) {
      return {
        message: "No registrations found",
        status: "success",
        event_ids: [],
      };
    }

    const eventsRegistered = await this.eventParticipationService.registration({
      registration_id: registration.id,
    });

    return {
      message: "Fetched participation event data",
      status: "success",
      event_ids: eventsRegistered.data ?? [],
    };
  }
}
