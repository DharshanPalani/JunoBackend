import { ParticipantsService } from "../participants/participants.service";
import { RegistrationService } from "../registrations/registration.service";
import { EventParticipationService } from "../eventParticipation/eventParticipation.service";
import { CreateEventDTO } from "./register.module";

type RegisterServiceReturn = {
  message: string;
  status: "error" | "success";
};

export class RegisterService {
  private participantService = new ParticipantsService();
  private registrationService = new RegistrationService();
  private eventParticipationService = new EventParticipationService();

  async registerEvent(data: CreateEventDTO): Promise<RegisterServiceReturn> {
    const participation = await this.participantService.findOrCreateParticipant(
      data.participant,
    );

    if (!participation.participant) {
      return { message: "Participant could not be created", status: "error" };
    }

    const registration = await this.registrationService.createRegistry(
      participation.participant.id,
      data.registration.day_id,
    );

    if (!registration.registeredData) {
      return {
        message: "Participant already registered for this day",
        status: "error",
      };
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

    console.log(eventFailedToRegisterID);

    return {
      message: "Participant registered successfully including events",
      status: "success",
    };
  }
}
