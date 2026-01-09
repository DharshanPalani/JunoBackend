import { ParticipantsService } from "./participants/participants.service";
import { RegistrationService } from "./registrations/registration.service";
import { CreateEventDTO } from "./register.module";

type RegisterServiceReturn = {
  message: string;
  status: "error" | "success";
};

export class RegisterService {
  private participantService = new ParticipantsService();
  private registrationService = new RegistrationService();

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

    return {
      message: "Participant registered successfully",
      status: "success",
    };
  }
}
